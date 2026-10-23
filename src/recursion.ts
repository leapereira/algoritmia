export type RecursionPhase = 'ready' | 'call' | 'check' | 'descend' | 'base' | 'resume' | 'return' | 'complete';

export interface RecursionFrame {
  index: number;
  status: 'active' | 'waiting' | 'returning';
  value?: number;
  partial?: number;
  result?: number;
}

export interface RecursionStep {
  values: number[];
  /** Bottom frame first; the last item is the current top of the stack. */
  stack: RecursionFrame[];
  phase: RecursionPhase;
  line: number;
  message: string;
  operation: string;
  callCount: number;
  maxDepth: number;
  activeIndex?: number;
  returnValue?: number;
  result?: number;
}

export const recursionPseudocode = [
  'función sumar(datos, i):',
  '  si i = longitud(datos):',
  '    devolver 0',
  '  parcial ← sumar(datos, i + 1)',
  '  devolver datos[i] + parcial',
];

/**
 * Execute an actual recursive depth-first sum and record independent snapshots.
 * The engine accepts an empty array so the base case can also be tested alone;
 * the interactive exercise requires 1–8 values.
 */
export function makeRecursionTrace(input: number[]): RecursionStep[] {
  if (input.length > 8 || input.some(value => !Number.isInteger(value) || value < -99 || value > 99)) {
    throw new Error('Usá hasta 8 enteros entre −99 y 99.');
  }
  const values = [...input];
  const stack: RecursionFrame[] = [];
  const trace: RecursionStep[] = [];
  let callCount = 0;
  let maxDepth = 0;

  function record(phase: RecursionPhase, line: number, message: string, operation: string, extra: Partial<RecursionStep> = {}) {
    trace.push({
      values: [...values],
      stack: stack.map(frame => ({ ...frame })),
      phase, line, message, operation, callCount, maxDepth,
      ...(stack.length && stack.at(-1)!.index < values.length ? { activeIndex: stack.at(-1)!.index } : {}),
      ...extra,
    });
  }

  function sum(index: number): number {
    const frame: RecursionFrame = { index, status: 'active', ...(index < values.length ? { value: values[index] } : {}) };
    stack.push(frame);
    callCount++;
    maxDepth = Math.max(maxDepth, stack.length);
    record('call', 1, `Entramos en sumar(datos, ${index}). Se agrega un marco a la pila.`, `sumar(datos, ${index})`);
    record('check', 2, `¿${index} = ${values.length}? ${index === values.length ? 'Sí: llegamos al caso base.' : 'No: todavía queda un valor por sumar.'}`, `${index} = ${values.length} → ${index === values.length ? 'verdadero' : 'falso'}`);
    if (index === values.length) {
      frame.status = 'returning';
      frame.result = 0;
      record('base', 3, 'El caso base devuelve 0. No se hace otra llamada recursiva.', 'devolver 0', { returnValue: 0 });
      stack.pop();
      return 0;
    }

    frame.status = 'waiting';
    record('descend', 4, `El marco i = ${index} espera la suma desde i = ${index + 1}. Su valor ${values[index]} queda pendiente.`, `parcial ← sumar(datos, ${index + 1})`);
    const partial = sum(index + 1);
    frame.status = 'active';
    frame.partial = partial;
    record('resume', 5, `Volvemos al marco i = ${index}. La llamada más profunda devolvió ${partial}.`, `${values[index]} + ${partial}` , { returnValue: partial });
    const result = values[index]! + partial;
    frame.status = 'returning';
    frame.result = result;
    record('return', 5, `Sumamos ${values[index]} + ${partial} y devolvemos ${result}. Este marco ya puede salir de la pila.`, `${values[index]} + ${partial} = ${result}`, { returnValue: result });
    stack.pop();
    return result;
  }

  record('ready', 1, 'La pila empieza vacía. Llamaremos a sumar(datos, 0).', 'sumar(datos, 0)');
  const result = sum(0);
  record('complete', values.length ? 5 : 3, `Todos los marcos retornaron. La pila volvió a quedar vacía y la suma es ${result}.`, `resultado = ${result}`, { result, returnValue: result });
  return trace;
}

let recursionInstance = 0;

export function mountRecursion(root: HTMLElement): () => void {
  const uid = `recursion-${++recursionInstance}`;
  const controller = new AbortController();
  const { signal } = controller;
  let values = [4, 2, 7, 3];
  let trace = makeRecursionTrace(values);
  let index = 0;
  let playing = false;
  let speed = 850;
  let timer: ReturnType<typeof setTimeout> | undefined;

  root.innerHTML = `
    <section class="recursion-widget" aria-label="Visualizador de pila recursiva">
      <div class="recursion-heading"><span class="recursion-eyebrow">VISUALIZADOR DE RECURSIÓN</span><h2>Una llamada espera a la siguiente.</h2><p>Seguí una suma recursiva: primero crece la pila; después regresan los resultados.</p></div>
      <form class="recursion-form" novalidate><div><label for="${uid}-input">Valores del arreglo</label><input id="${uid}-input" type="text" autocomplete="off" spellcheck="false" maxlength="45" aria-describedby="${uid}-hint ${uid}-error"><span id="${uid}-hint">De 1 a 8 enteros entre −99 y 99, separados por comas o espacios.</span></div><button class="btn btn-secondary" type="submit">Aplicar datos <span aria-hidden="true">↵</span></button><p id="${uid}-error" class="recursion-error" role="status" aria-live="polite"></p></form>
      <div class="recursion-layout">
        <div class="recursion-stage"><div class="recursion-array-heading"><h3>Arreglo de entrada</h3><span class="chip">Índices desde 0</span></div><div class="recursion-array" role="group" aria-label="Valores del arreglo"></div><div class="recursion-stack-heading"><h3>Pila de llamadas</h3><span class="recursion-direction"></span></div><div class="recursion-stack" role="group" aria-label="Marcos activos de la pila" tabindex="0" aria-keyshortcuts="Space ArrowLeft ArrowRight Home End"></div><div class="recursion-operation"><span>OPERACIÓN ACTUAL</span><code></code></div><div class="recursion-message" aria-live="polite" aria-atomic="true"></div><div class="recursion-transport"><div><button class="icon-btn" type="button" data-recursion-action="reset" aria-label="Reiniciar suma recursiva" title="Reiniciar">↺</button><button class="icon-btn" type="button" data-recursion-action="back" aria-label="Paso anterior" title="Paso anterior">‹</button><button class="btn btn-primary recursion-play" type="button" data-recursion-action="play">▶ Reproducir</button><button class="icon-btn" type="button" data-recursion-action="next" aria-label="Paso siguiente" title="Paso siguiente">›</button></div><label for="${uid}-speed">Ritmo <output></output><input id="${uid}-speed" type="range" min="200" max="1800" step="50" value="850" aria-label="Milisegundos entre pasos recursivos"></label></div><div class="recursion-progress"><progress max="1" value="0" aria-label="Progreso de la suma recursiva"></progress><span></span></div></div>
        <aside class="recursion-code-panel"><span class="recursion-eyebrow">DEL CÓDIGO A LA PILA</span><h3>Pseudocódigo</h3><ol class="recursion-pseudocode"></ol><div class="recursion-metrics"><div><strong class="recursion-active-count">0</strong><span>Llamadas activas</span></div><div><strong class="recursion-depth">0</strong><span>Profundidad máxima</span></div><div><strong class="recursion-call-count">0</strong><span>Llamadas realizadas</span></div></div><p class="recursion-base-note">El caso base también crea un marco: para n valores se hacen n + 1 llamadas.</p></aside>
      </div>
      <div class="recursion-insight"><strong>Tiempo Θ(n) · Pila Θ(n)</strong><p>Cada llamada procesa un valor y conserva su marco hasta recibir la suma restante. Esta función necesita sumar después de la llamada recursiva, por lo que no es una recursión de cola.</p><p>Sin optimización de llamadas de cola, una entrada muy grande puede agotar la pila y provocar <code>StackOverflowError</code> en Java. Aquí limitamos la entrada a 8 valores para que puedas seguir cada marco.</p><small>Esta simulación ejecuta una suma recursiva en TypeScript y registra sus estados; no ejecuta código Java.</small></div>
    </section>`;

  const get = <T extends Element = HTMLElement>(selector: string): T => root.querySelector<T>(selector)!;
  const input = get<HTMLInputElement>(`#${uid}-input`);
  const error = get<HTMLElement>('.recursion-error');
  const stackElement = get<HTMLElement>('.recursion-stack');
  const message = get<HTMLElement>('.recursion-message');
  const play = get<HTMLButtonElement>('[data-recursion-action="play"]');
  const back = get<HTMLButtonElement>('[data-recursion-action="back"]');
  const next = get<HTMLButtonElement>('[data-recursion-action="next"]');
  const progress = get<HTMLProgressElement>('progress');
  const speedInput = get<HTMLInputElement>(`#${uid}-speed`);

  get<HTMLOListElement>('.recursion-pseudocode').replaceChildren(...recursionPseudocode.map(line => {
    const item = document.createElement('li');
    const code = document.createElement('code');
    code.textContent = line;
    item.append(code);
    return item;
  }));

  function clearTimer() {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  }

  function transport() {
    play.textContent = playing ? 'Ⅱ Pausar' : index === trace.length - 1 ? '↺ Repetir' : '▶ Reproducir';
    play.setAttribute('aria-label', playing ? 'Pausar suma recursiva' : index === trace.length - 1 ? 'Repetir suma recursiva' : 'Reproducir suma recursiva');
    back.disabled = index === 0;
    next.disabled = index === trace.length - 1;
    get<HTMLOutputElement>('output').textContent = `${speed} ms`;
  }

  function render() {
    const step = trace[index]!;
    const array = get<HTMLElement>('.recursion-array');
    array.replaceChildren(...values.map((value, position) => {
      const item = document.createElement('div');
      item.className = `recursion-value${step.activeIndex === position ? ' is-active' : ''}`;
      const number = document.createElement('strong');
      number.textContent = String(value);
      const label = document.createElement('span');
      label.textContent = String(position);
      item.append(number, label);
      item.setAttribute('aria-label', `Índice ${position}: ${value}${step.activeIndex === position ? ', marco actual' : ''}`);
      return item;
    }));
    stackElement.replaceChildren(...[...step.stack].reverse().map((frame, position) => {
      const element = document.createElement('div');
      element.className = `recursion-frame is-${frame.status}${position === 0 ? ' is-top' : ''}`;
      const title = document.createElement('div');
      const name = document.createElement('code');
      name.textContent = `sumar(datos, ${frame.index})`;
      const badge = document.createElement('span');
      badge.textContent = frame.status === 'waiting' ? 'En espera' : frame.status === 'returning' ? 'Retorna' : 'En ejecución';
      title.append(name, badge);
      const detail = document.createElement('p');
      detail.textContent = frame.status === 'returning' ? `devuelve ${frame.result}`
        : frame.status === 'waiting' ? `${frame.value} + sumar(datos, ${frame.index + 1})`
        : frame.partial !== undefined ? `${frame.value} + parcial (${frame.partial})`
        : frame.index === values.length ? `i = ${values.length} · caso base`
        : `i = ${frame.index} · datos[i] = ${frame.value}`;
      element.append(title, detail);
      return element;
    }));
    if (!step.stack.length) {
      const empty = document.createElement('div');
      empty.className = `recursion-empty${step.result !== undefined ? ' is-complete' : ''}`;
      const icon = document.createElement('span');
      icon.textContent = step.result !== undefined ? '✓' : '↓';
      const text = document.createElement('strong');
      text.textContent = step.result !== undefined ? `Resultado: ${step.result}` : 'La pila está vacía';
      const caption = document.createElement('p');
      caption.textContent = step.result !== undefined ? 'Todas las llamadas retornaron.' : 'El primer paso agrega sumar(datos, 0).';
      empty.append(icon, text, caption);
      stackElement.append(empty);
    }
    get<HTMLElement>('.recursion-direction').textContent = ['return', 'resume', 'base'].includes(step.phase) ? '↑ Regresan los resultados' : step.phase === 'complete' ? '✓ Recorrido completo' : '↓ Crece la pila';
    get<HTMLElement>('.recursion-operation code').textContent = step.operation;
    message.setAttribute('aria-live', playing ? 'off' : 'polite');
    message.textContent = step.message;
    get<HTMLElement>('.recursion-active-count').textContent = String(step.stack.length);
    get<HTMLElement>('.recursion-depth').textContent = String(step.maxDepth);
    get<HTMLElement>('.recursion-call-count').textContent = String(step.callCount);
    root.querySelectorAll('.recursion-pseudocode li').forEach((line, lineIndex) => {
      const active = lineIndex + 1 === step.line;
      line.classList.toggle('is-active', active);
      if (active) line.setAttribute('aria-current', 'step');
      else line.removeAttribute('aria-current');
    });
    progress.max = trace.length - 1;
    progress.value = index;
    get<HTMLElement>('.recursion-progress span').textContent = `${index} / ${trace.length - 1} pasos`;
    transport();
  }

  function pause() {
    playing = false;
    clearTimer();
    transport();
  }

  function schedule() {
    clearTimer();
    if (!playing) return;
    timer = setTimeout(() => {
      if (!playing || signal.aborted) return;
      index = Math.min(trace.length - 1, index + 1);
      if (index === trace.length - 1) playing = false;
      render();
      schedule();
    }, speed);
  }

  function toggle() {
    if (playing) return pause();
    if (index === trace.length - 1) index = 0;
    playing = true;
    render();
    schedule();
  }

  get<HTMLFormElement>('form').addEventListener('submit', event => {
    event.preventDefault();
    pause();
    try {
      const raw = input.value.trim();
      if (!/^-?\d+(?:\s*[,;]\s*-?\d+|\s+-?\d+)*$/.test(raw)) {
        throw new Error('Ingresá de 1 a 8 enteros separados por comas o espacios.');
      }
      const updated = raw.split(/[\s,;]+/).map(Number);
      const updatedTrace = makeRecursionTrace(updated);
      values = updated;
      trace = updatedTrace;
      index = 0;
      input.value = values.join(', ');
      input.removeAttribute('aria-invalid');
      error.textContent = '';
      render();
    } catch (cause) {
      input.setAttribute('aria-invalid', 'true');
      error.textContent = cause instanceof Error ? cause.message : 'Revisá los valores de entrada.';
    }
  }, { signal });
  root.addEventListener('click', event => {
    const action = (event.target as Element).closest<HTMLButtonElement>('[data-recursion-action]')?.dataset.recursionAction;
    if (!action) return;
    if (action === 'play') toggle();
    else {
      pause();
      if (action === 'reset') index = 0;
      if (action === 'back') index = Math.max(0, index - 1);
      if (action === 'next') index = Math.min(trace.length - 1, index + 1);
      render();
    }
  }, { signal });
  speedInput.addEventListener('input', () => {
    speed = Number(speedInput.value);
    transport();
    schedule();
  }, { signal });
  stackElement.addEventListener('keydown', event => {
    if (![' ', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === ' ') return toggle();
    pause();
    if (event.key === 'ArrowLeft') index = Math.max(0, index - 1);
    if (event.key === 'ArrowRight') index = Math.min(trace.length - 1, index + 1);
    if (event.key === 'Home') index = 0;
    if (event.key === 'End') index = trace.length - 1;
    render();
  }, { signal });
  input.value = values.join(', ');
  render();

  return () => {
    playing = false;
    clearTimer();
    controller.abort();
    root.replaceChildren();
  };
}
