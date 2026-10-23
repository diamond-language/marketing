// The homepage REPL: a terminal-style window over js/diamond-wasm.js. The WebAssembly module is
// fetched when the page is idle (or on first interaction), never blocking first paint.
import { DiamondRepl } from './diamond-wasm.js';

const root = document.querySelector('[data-repl]');
if (root) {
  const scrollback = root.querySelector('[data-repl-scrollback]');
  const form = root.querySelector('[data-repl-form]');
  const input = root.querySelector('[data-repl-input]');
  const promptEl = root.querySelector('[data-repl-prompt]');
  const statusEl = root.querySelector('[data-repl-status]');
  const highlightEl = root.querySelector('[data-repl-highlight]');
  const listEl = root.querySelector('[data-repl-completions]');
  const history = [];
  let cursor = 0;
  let repl = null;
  let loading = null;
  let busy = false;

  // Coloured text for a line of source, from the lexer inside the module.
  const colored = (instance, text) => {
    const fragment = document.createDocumentFragment();
    for (const segment of instance.highlight(text)) {
      if (!segment.cls) { fragment.append(segment.text); continue; }
      const span = document.createElement('span');
      span.className = segment.cls;
      span.textContent = segment.text;
      fragment.append(span);
    }
    return fragment;
  };

  // Completion: candidates for the word before the caret, from the same engine as the terminal
  // REPL's Tab key. The best match shows as faint text after the caret and a short list opens
  // when there are several. Tab (or the right arrow at the end of the line) takes the selected
  // one, the up and down arrows move through the list, Escape closes it.
  const MAX_LISTED = 6;
  let completion = null;          // { value, prefix, labels, selected } for the text it was computed from
  let completionTimer = 0;

  const ghostText = () => {
    if (!completion || input.value !== completion.value) return '';
    return completion.labels[completion.selected].slice(completion.prefix.length);
  };

  // Repaints the layer behind the input; the input scrolls itself when a line outgrows it.
  const paint = () => {
    if (!repl || !highlightEl) return;
    const content = colored(repl, input.value);
    const ghost = ghostText();
    if (ghost) {
      const span = document.createElement('span');
      span.className = 'repl-ghost';
      span.textContent = ghost;
      content.append(span);
    }
    highlightEl.replaceChildren(content);
    highlightEl.style.transform = `translateX(${-input.scrollLeft}px)`;
  };

  const renderList = () => {
    if (!listEl) return;
    const open = completion && input.value === completion.value && completion.labels.length > 1;
    listEl.hidden = !open;
    input.setAttribute('aria-expanded', String(Boolean(open)));
    if (!open) { input.removeAttribute('aria-activedescendant'); return; }
    const { labels, selected, prefix } = completion;
    input.setAttribute('aria-activedescendant', `repl-option-${selected}`);
    // A window of the list that always contains the selection.
    const from = Math.min(Math.max(0, selected - MAX_LISTED + 1), Math.max(0, labels.length - MAX_LISTED));
    listEl.replaceChildren(...labels.slice(from, from + MAX_LISTED).map((label, offset) => {
      const item = document.createElement('li');
      item.className = 'repl-completion' + (from + offset === selected ? ' is-selected' : '');
      item.setAttribute('role', 'option');
      item.id = `repl-option-${from + offset}`;
      item.setAttribute('aria-selected', String(from + offset === selected));
      const typed = document.createElement('b');
      typed.textContent = prefix;
      item.append(typed, label.slice(prefix.length));
      item.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        completion.selected = from + offset;
        accept();
      });
      return item;
    }));
    // Lines the list up under the word being completed (the input is monospace).
    listEl.style.left = `${input.value.length - prefix.length}ch`;
  };

  const clearCompletion = () => {
    clearTimeout(completionTimer);
    completion = null;
    renderList();
    paint();
  };

  const accept = () => {
    const ghost = ghostText();
    if (!ghost) return false;
    input.value += ghost;
    clearCompletion();
    input.focus();
    return true;
  };

  const requestCompletion = () => {
    clearTimeout(completionTimer);
    const value = input.value;
    const typed = /[A-Za-z0-9_]*$/.exec(value)[0];
    if (!repl || input.selectionStart !== value.length || input.selectionEnd !== value.length
        || !(typed || value.endsWith('.'))) {
      if (completion && completion.value !== value) clearCompletion();
      return;
    }
    // Compiling the session takes a few tens of milliseconds, so wait for a pause in typing.
    completionTimer = setTimeout(() => {
      if (input.value !== value || busy) return;
      let result;
      try { result = repl.complete(value); } catch { return; }
      // Shortest first, so the faint text is the least surprising; nothing to add is no candidate.
      const labels = [...new Set(result.labels)].filter((label) => label.length > result.prefix.length)
        .sort((a, b) => a.length - b.length || (a < b ? -1 : 1));
      completion = labels.length ? { value, prefix: result.prefix, labels, selected: 0 } : null;
      renderList();
      paint();
    }, 90);
  };

  const print = (text, className = '') => {
    const line = document.createElement('div');
    line.className = 'repl-line ' + className;
    line.textContent = text;
    scrollback.append(line);
    scrollback.scrollTop = scrollback.scrollHeight;
  };

  const load = () => {
    if (loading) return loading;
    statusEl.textContent = 'Loading the interpreter…';
    loading = DiamondRepl.load(new URL('../wasm/diamond.wasm', import.meta.url))
      .then((instance) => {
        repl = instance;
        statusEl.textContent = 'Nothing you type leaves this page.';
        input.disabled = false;
        return instance;
      })
      .catch((error) => {
        statusEl.textContent = 'The in-browser REPL could not start (' + (error.message || error) + ').';
        input.disabled = true;
        throw error;
      });
    return loading;
  };

  const submit = async (line) => {
    const instance = repl || await load().catch(() => null);
    if (!instance) return;
    const echo = document.createElement('div');
    echo.className = 'repl-line repl-echo';
    const prompt = document.createElement('span');
    prompt.className = 'repl-prompt';
    prompt.textContent = promptEl.textContent;
    echo.append(prompt, colored(instance, line));
    scrollback.append(echo);
    try {
      const result = instance.submit(line);
      if (result.kind === 'ok' && result.text) print(result.text);
      else if (result.kind === 'error') print(result.text, 'repl-error');
    } catch (error) {
      print(String(error.message || error), 'repl-error');
    }
    promptEl.textContent = instance.prompt;
    scrollback.scrollTop = scrollback.scrollHeight;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    const line = input.value;
    input.value = '';
    clearCompletion();
    if (line.trim()) { history.push(line); cursor = history.length; }
    busy = true;
    await submit(line);
    busy = false;
    input.focus();
  });

  for (const type of ['scroll', 'keyup', 'click']) input.addEventListener(type, paint);
  input.addEventListener('input', () => {
    if (completion && input.value !== completion.value) completion = null;
    renderList();
    paint();
    requestCompletion();
  });
  input.addEventListener('blur', () => { if (completion) clearCompletion(); });

  input.addEventListener('keydown', (event) => {
    if (completion && input.value === completion.value) {
      const count = completion.labels.length;
      if (event.key === 'Tab' || (event.key === 'ArrowRight' && input.selectionStart === input.value.length)) {
        if (accept()) event.preventDefault();
        return;
      }
      if (event.key === 'Escape') { clearCompletion(); event.preventDefault(); return; }
      if (count > 1 && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        completion.selected = (completion.selected + (event.key === 'ArrowDown' ? 1 : count - 1)) % count;
        renderList();
        paint();
        event.preventDefault();
        return;
      }
    }
    if (event.key === 'ArrowUp' && cursor > 0) {
      cursor--; input.value = history[cursor]; clearCompletion(); event.preventDefault();
    } else if (event.key === 'ArrowDown' && cursor < history.length) {
      cursor++; input.value = history[cursor] ?? ''; clearCompletion(); event.preventDefault();
    }
  });

  // Example chips feed a short script, one line at a time, as if typed.
  root.querySelectorAll('[data-repl-example]').forEach((button) => {
    button.addEventListener('click', async () => {
      if (busy) return;
      busy = true;
      const instance = repl || await load().catch(() => null);
      if (instance) {
        instance.reset();
        promptEl.textContent = instance.prompt;
        scrollback.textContent = '';
        for (const line of button.dataset.replExample.split('\n')) await submit(line);
      }
      busy = false;
      input.focus();
    });
  });

  root.addEventListener('pointerdown', () => load().catch(() => {}), { once: true });
  input.addEventListener('focus', () => load().catch(() => {}), { once: true });
  const idle = window.requestIdleCallback || ((callback) => setTimeout(callback, 1500));
  idle(() => load().catch(() => {}));
}
