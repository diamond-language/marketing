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

  // Repaints the layer behind the input; the input scrolls itself when a line outgrows it.
  const paint = () => {
    if (!repl || !highlightEl) return;
    highlightEl.replaceChildren(colored(repl, input.value));
    highlightEl.style.transform = `translateX(${-input.scrollLeft}px)`;
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
    statusEl.textContent = 'Loading the interpreter (about 1 MB)…';
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
    paint();
    if (line.trim()) { history.push(line); cursor = history.length; }
    busy = true;
    await submit(line);
    busy = false;
    input.focus();
  });

  for (const type of ['input', 'scroll', 'keyup', 'click']) input.addEventListener(type, paint);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && cursor > 0) {
      cursor--; input.value = history[cursor]; paint(); event.preventDefault();
    } else if (event.key === 'ArrowDown' && cursor < history.length) {
      cursor++; input.value = history[cursor] ?? ''; paint(); event.preventDefault();
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
