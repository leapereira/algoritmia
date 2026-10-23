import { algorithms, makeTrace, type AlgorithmId, type Step } from './algorithms.js';

const examples: Record<AlgorithmId, { values: number[]; target: number }> = {
  max: { values: [12, 5, 28, 9, 35, 17, 23], target: 17 },
  reverse: { values: [12, 5, 28, 9, 35, 17, 23], target: 17 },
  duplicates: { values: [12, 5, 28, 9, 5, 17, 23], target: 17 },
  linear: { values: [12, 5, 28, 9, 35, 17, 23], target: 17 },
  binary: { values: [3, 7, 12, 17, 23, 28, 35], target: 23 },
  bubble: { values: [12, 5, 28, 9, 35, 17, 23], target: 17 },
  selection: { values: [12, 5, 28, 9, 35, 17, 23], target: 17 },
  insertion: { values: [12, 5, 28, 9, 35, 17, 23], target: 17 },
  merge: { values: [12, 5, 28, 9, 35, 17, 23], target: 17 },
  quick: { values: [12, 5, 28, 9, 35, 17, 23], target: 17 },
  heap: { values: [12, 5, 28, 9, 35, 17, 23], target: 17 },
  counting: { values: [4, -2, 1, 4, -2, 0, 3], target: 17 },
  radix: { values: [12, -5, 28, -19, 35, 17, 23], target: 17 },
};

const cases: Record<AlgorithmId, string> = {
  max: 'Mejor, promedio y peor caso: O(n). Siempre se comparan n − 1 valores con el máximo provisional.',
  reverse: 'En todos los casos: O(n), con ⌊n/2⌋ intercambios. Los valores se mueven dentro del mismo arreglo.',
  duplicates: 'Mejor caso: O(1), si el primer par coincide. Peor caso: O(n²), al revisar hasta n(n − 1)/2 pares.',
  linear: 'Mejor caso: O(1), si el objetivo está al principio. Peor caso: O(n), si está al final o no aparece.',
  binary: 'Mejor caso: O(1), si el objetivo está en el centro. Peor caso: O(log n). Requiere orden ascendente; ordenar tiene un costo adicional.',
  bubble: 'Mejor caso: O(n), si ya está ordenado y una pasada no produce cambios. Promedio y peor caso: O(n²).',
  selection: 'Mejor y peor caso: Θ(n²), porque siempre compara todos los candidatos del sufijo. Hace como máximo n − 1 intercambios. Auxiliar Θ(1); no es estable.',
  insertion: 'Mejor caso: Θ(n), si el arreglo ya está ordenado. Peor caso: Θ(n²). Guarda x y desplaza valores; no hace intercambios. Auxiliar Θ(1); es estable.',
  merge: 'Tiempo Θ(n log n), independiente del orden inicial para n ≥ 2. Usa un búfer Θ(n) y pila O(log n). Elige izquierda al empatar: es estable. Las copias al búfer y al arreglo son asignaciones, no intercambios.',
  quick: 'Pivote final y partición de Lomuto: particiones equilibradas Θ(n log n), pero ordenados y muchos iguales pueden costar Θ(n²) y pila Θ(n). Esta versión no usa pivote aleatorio ni promete costo esperado logarítmico. No es estable.',
  heap: 'Construir el Max-Heap desde abajo cuesta Θ(n). Ordenar tiene peor caso O(n log n) y usa Θ(1) auxiliar con hundimiento iterativo. No es estable.',
  counting: 'Tiempo y auxiliar Θ(n + k), con k = máximo − mínimo + 1. Acepta negativos usando la clave x − mínimo. Es estable. Solo la búsqueda de mínimo/máximo compara valores; las frecuencias y copias no son intercambios.',
  radix: 'Tiempo O(n + d(n + 10)) y auxiliar Θ(n + 10), con d pasadas decimales para máximo − mínimo. Si todas las claves son iguales, bastan el recorrido inicial Θ(n) y cero pasadas. Cada pasada decimal es estable. La clave x − mínimo admite negativos sin alterar su orden. Las copias no son intercambios.',
};

function parseValues(raw: string): number[] {
  const text = raw.trim();
  if (!text) throw new Error('Ingresá al menos un número para comenzar.');
  if (!/^-?\d+(?:\s*[,;]\s*-?\d+|\s+-?\d+)*$/.test(text)) {
    throw new Error('Usá números enteros separados por comas o espacios. Ejemplo: 12, 5, 28, 9.');
  }
  const values = text.split(/[\s,;]+/).map(Number);
  if (values.length > 24) throw new Error('El laboratorio admite hasta 24 números por ejecución.');
  if (values.some(value => !Number.isInteger(value) || value < -999 || value > 999)) {
    throw new Error('Cada número debe ser un entero entre −999 y 999.');
  }
  return values;
}

let labInstance = 0;

/** Mount a self-contained algorithm player; cleanup cancels timers and listeners. */
export function mountLab(root: HTMLElement, initial: AlgorithmId = 'max'): () => void {
  const uid = `lab-${++labInstance}`;
  const controller = new AbortController();
  const { signal } = controller;
  let id: AlgorithmId = initial in algorithms ? initial : 'max';
  let values = [...examples[id].values];
  let target = examples[id].target;
  let trace: Step[] = makeTrace(id, values, target);
  let index = 0;
  let playing = false;
  let speed = 650;
  let timer: ReturnType<typeof setTimeout> | undefined;

  root.innerHTML = `
    <section class="lab-widget" aria-label="Laboratorio interactivo de algoritmos">
      <div class="lab-heading"><div><span class="lab-eyebrow">APRENDÉ HACIENDO</span><h2>Una idea. Un paso a la vez.</h2><p>Elegí tus datos y seguí lo que hace cada algoritmo.</p></div><span class="chip lab-live-chip"><span></span>Motor interactivo</span></div>
      <form class="lab-form" novalidate>
        <div class="lab-field lab-select-field"><label for="${uid}-algorithm">Algoritmo</label><select id="${uid}-algorithm">${Object.entries(algorithms).map(([key, algorithm]) => `<option value="${key}">${algorithm.title}</option>`).join('')}</select></div>
        <div class="lab-field lab-values-field"><label for="${uid}-values">Tus datos</label><input id="${uid}-values" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-describedby="${uid}-hint ${uid}-error" placeholder="12, 5, 28, 9, 35, 17, 23" maxlength="180"><span id="${uid}-hint" class="lab-field-hint">1 a 24 enteros, entre −999 y 999.</span></div>
        <div class="lab-field lab-target-field"><label for="${uid}-target">Objetivo</label><input id="${uid}-target" type="number" min="-999" max="999" step="1" aria-describedby="${uid}-error"></div>
        <button class="btn btn-secondary lab-apply" type="submit">Aplicar datos <span aria-hidden="true">↵</span></button>
        <button class="btn btn-secondary lab-sort" type="button" data-action="sort" hidden>Ordenar entrada</button>
        <p class="lab-error" id="${uid}-error" role="status" aria-live="polite"></p>
      </form>
      <div class="lab-main-grid">
        <div class="lab-stage">
          <div class="lab-stage-heading"><div><h3 class="lab-algorithm-title"></h3><p class="lab-algorithm-description"></p></div><span class="chip lab-complexity"></span></div>
          <div class="lab-legend"><span><i class="lab-key lab-key-pending"></i>Pendiente</span><span><i class="lab-key lab-key-active"></i>En este paso</span><span><i class="lab-key lab-key-done"></i>Confirmado</span></div>
          <div class="lab-visual" tabindex="0" role="group" aria-label="Visualización del arreglo. Espacio: reproducir o pausar. Flechas: paso anterior o siguiente." aria-keyshortcuts="Space ArrowLeft ArrowRight Home End"></div>
          <p class="lab-magnitude-note">Altura según magnitud · índices desde 0</p>
          <div class="lab-step-message lab-auxiliary" hidden><span class="lab-step-kicker"></span><p></p></div>
          <div class="lab-step-message" aria-live="polite" aria-atomic="true"><span class="lab-step-kicker"></span><p></p></div>
          <div class="lab-result" hidden></div>
          <div class="lab-transport">
            <div class="lab-playback"><button class="icon-btn" type="button" data-action="reset" aria-label="Reiniciar ejecución" title="Reiniciar">↺</button><button class="icon-btn" type="button" data-action="back" aria-label="Paso anterior" title="Paso anterior">‹</button><button class="btn btn-primary lab-play" type="button" data-action="play"><span aria-hidden="true">▶</span> <span class="lab-play-label">Reproducir</span></button><button class="icon-btn" type="button" data-action="next" aria-label="Paso siguiente" title="Paso siguiente">›</button></div>
            <label class="lab-speed" for="${uid}-speed"><span>Ritmo <output></output></span><input id="${uid}-speed" type="range" min="150" max="1600" step="50" value="650" aria-label="Milisegundos entre pasos"></label>
          </div>
          <div class="lab-progress-row"><progress class="lab-progress" max="1" value="0" aria-label="Progreso de la ejecución"></progress><span class="lab-progress-text"></span></div>
        </div>
        <aside class="lab-code-panel" aria-label="Pseudocódigo y métricas"><div class="lab-code-heading"><span class="lab-eyebrow">ASÍ PIENSA EL ALGORITMO</span><h3>Pseudocódigo</h3></div><ol class="lab-pseudocode"></ol><div class="lab-counters"><div><strong class="lab-comparisons">0</strong><span>Comparaciones</span></div><div><strong class="lab-swaps">0</strong><span>Intercambios</span></div></div><p class="lab-counter-note">Contamos comparaciones entre valores. Las condiciones de los índices no se cuentan.</p></aside>
      </div>
      <div class="lab-insight"><span class="lab-insight-icon" aria-hidden="true">↗</span><div><h3>¿Qué pasa cuando crece la entrada?</h3><p class="lab-cases"></p><small>La complejidad describe el algoritmo. La visualización guarda una copia de cada paso para permitir avanzar y retroceder.</small></div></div>
    </section>`;

  const get = <T extends Element = HTMLElement>(selector: string): T => root.querySelector<T>(selector)!;
  const select = get<HTMLSelectElement>('select');
  const input = get<HTMLInputElement>(`#${uid}-values`);
  const targetInput = get<HTMLInputElement>(`#${uid}-target`);
  const targetField = get<HTMLElement>('.lab-target-field');
  const sort = get<HTMLButtonElement>('.lab-sort');
  const error = get('.lab-error');
  const visual = get<HTMLElement>('.lab-visual');
  const pseudo = get<HTMLOListElement>('.lab-pseudocode');
  const play = get<HTMLButtonElement>('[data-action="play"]');
  const back = get<HTMLButtonElement>('[data-action="back"]');
  const next = get<HTMLButtonElement>('[data-action="next"]');
  const result = get<HTMLElement>('.lab-result');
  const progress = get<HTMLProgressElement>('.lab-progress');
  const speedInput = get<HTMLInputElement>(`#${uid}-speed`);
  const message = get<HTMLElement>('.lab-step-message:not(.lab-auxiliary)');

  function clearTimer() {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  }

  function pause() {
    playing = false;
    clearTimer();
    renderTransport();
  }

  function renderTransport() {
    get<HTMLElement>('.lab-play-label').textContent = playing ? 'Pausar' : index === trace.length - 1 ? 'Repetir' : 'Reproducir';
    play.querySelector('span')!.textContent = playing ? 'Ⅱ' : index === trace.length - 1 ? '↺' : '▶';
    play.setAttribute('aria-label', playing ? 'Pausar ejecución' : index === trace.length - 1 ? 'Repetir ejecución' : 'Reproducir ejecución');
    back.disabled = index === 0;
    next.disabled = index === trace.length - 1;
    get<HTMLOutputElement>('.lab-speed output').textContent = `${speed} ms`;
  }

  function render() {
    const step = trace[index]!;
    const maxMagnitude = Math.max(1, ...step.values.map(Math.abs));
    visual.replaceChildren(...step.values.map((value, position) => {
      const column = document.createElement('div');
      column.className = `lab-column${step.active.includes(position) ? ' is-active' : ''}${step.sorted?.includes(position) ? ' is-sorted' : ''}`;
      column.style.setProperty('--bar-height', `${38 + Math.round(Math.abs(value) / maxMagnitude * 120)}px`);
      column.setAttribute('aria-label', `Índice ${position}: ${value}${step.active.includes(position) ? ', en este paso' : step.sorted?.includes(position) ? ', confirmado' : ''}`);
      const bar = document.createElement('div');
      bar.className = 'lab-bar';
      const number = document.createElement('strong');
      number.textContent = String(value);
      bar.append(number);
      const label = document.createElement('span');
      label.className = 'lab-index';
      label.textContent = String(position);
      column.append(bar, label);
      return column;
    }));
    pseudo.querySelectorAll('li').forEach((line, lineIndex) => {
      const active = lineIndex + 1 === step.line;
      line.classList.toggle('is-active', active);
      if (active) line.setAttribute('aria-current', 'step');
      else line.removeAttribute('aria-current');
    });
    get<HTMLElement>('.lab-step-message:not(.lab-auxiliary) .lab-step-kicker').textContent = index === 0 ? 'ESTADO INICIAL' : index === trace.length - 1 ? 'EJECUCIÓN COMPLETA' : `PASO ${index}`;
    get<HTMLElement>('.lab-step-message:not(.lab-auxiliary) p').textContent = step.message;
    const aux = get<HTMLElement>('.lab-auxiliary');
    aux.hidden = !step.auxiliary;
    aux.querySelector('span')!.textContent = step.auxiliary?.label ?? '';
    aux.querySelector('p')!.textContent = step.auxiliary ? `[ ${step.auxiliary.values.map(value => value === null ? '·' : String(value)).join(', ')} ]` : '';
    // Playback avoids flooding a screen reader; manual stepping announces each state.
    message.setAttribute('aria-live', playing ? 'off' : 'polite');
    get<HTMLElement>('.lab-comparisons').textContent = String(step.comparisons);
    get<HTMLElement>('.lab-swaps').textContent = String(step.swaps);
    result.hidden = !step.result;
    result.textContent = step.result ?? '';
    progress.max = Math.max(1, trace.length - 1);
    progress.value = index;
    get<HTMLElement>('.lab-progress-text').textContent = `${index} / ${trace.length - 1} pasos`;
    renderTransport();
  }

  function renderAlgorithm() {
    const meta = algorithms[id];
    select.value = id;
    get<HTMLElement>('.lab-algorithm-title').textContent = meta.title;
    get<HTMLElement>('.lab-algorithm-description').textContent = meta.description;
    get<HTMLElement>('.lab-complexity').textContent = meta.complexity.split(' · ')[0]!;
    get<HTMLElement>('.lab-cases').textContent = cases[id];
    get<HTMLElement>('.lab-counter-note').textContent = ['merge', 'insertion'].includes(id)
      ? 'Las comparaciones entre valores sí se cuentan. Guardar, desplazar o copiar valores son asignaciones: esta implementación no realiza intercambios.'
      : ['counting', 'radix'].includes(id)
      ? 'Solo la búsqueda de mínimo y máximo compara valores. Contar claves, acumular frecuencias y copiar a salida son operaciones reales que no se cuentan como intercambios.'
      : id === 'binary'
      ? 'Cada igualdad y cada comparación de orden entre valores cuenta por separado. Las condiciones de los índices no se cuentan.'
      : id === 'reverse' ? 'Invertir usa índices e intercambios: no necesita comparar valores entre sí.'
      : 'Contamos comparaciones entre valores. Las condiciones de los índices no se cuentan.';
    targetField.hidden = id !== 'linear' && id !== 'binary';
    targetInput.disabled = targetField.hidden;
    sort.hidden = id !== 'binary';
    pseudo.replaceChildren(...meta.pseudocode.map(line => {
      const item = document.createElement('li');
      const code = document.createElement('code');
      code.textContent = line;
      item.append(code);
      return item;
    }));
  }

  function schedule() {
    clearTimer();
    if (!playing) return;
    timer = setTimeout(() => {
      if (!playing || signal.aborted) return;
      index = Math.min(index + 1, trace.length - 1);
      if (index === trace.length - 1) playing = false;
      render();
      schedule();
    }, speed);
  }

  function togglePlay() {
    if (playing) {
      pause();
      return;
    }
    if (index === trace.length - 1) index = 0;
    playing = true;
    render();
    schedule();
  }

  function applyData(ordered = false): boolean {
    pause();
    try {
      const updatedValues = parseValues(input.value);
      let updatedTarget = target;
      if (id === 'linear' || id === 'binary') {
        if (!/^-?\d+$/.test(targetInput.value.trim())) throw new Error('Ingresá un objetivo entero entre −999 y 999.');
        updatedTarget = Number(targetInput.value);
        if (!Number.isInteger(updatedTarget) || updatedTarget < -999 || updatedTarget > 999) throw new Error('El objetivo debe estar entre −999 y 999.');
      }
      if (ordered) updatedValues.sort((a, b) => a - b);
      const updatedTrace = makeTrace(id, updatedValues, updatedTarget);
      values = updatedValues;
      target = updatedTarget;
      trace = updatedTrace;
      index = 0;
      input.value = values.join(', ');
      input.removeAttribute('aria-invalid');
      targetInput.removeAttribute('aria-invalid');
      error.textContent = ordered ? 'Entrada ordenada de menor a mayor. El costo de ordenar no forma parte de esta búsqueda.' : '';
      error.classList.toggle('is-notice', ordered);
      render();
      return true;
    } catch (cause) {
      error.classList.remove('is-notice');
      error.textContent = cause instanceof Error ? cause.message : 'Revisá los datos de entrada.';
      if (error.textContent.toLowerCase().includes('objetivo')) targetInput.setAttribute('aria-invalid', 'true');
      else input.setAttribute('aria-invalid', 'true');
      return false;
    }
  }

  get<HTMLFormElement>('form').addEventListener('submit', event => {
    event.preventDefault();
    applyData();
  }, { signal });
  select.addEventListener('change', () => {
    pause();
    id = select.value as AlgorithmId;
    values = [...examples[id].values];
    target = examples[id].target;
    input.value = values.join(', ');
    targetInput.value = String(target);
    input.removeAttribute('aria-invalid');
    targetInput.removeAttribute('aria-invalid');
    error.textContent = '';
    error.classList.remove('is-notice');
    trace = makeTrace(id, values, target);
    index = 0;
    renderAlgorithm();
    render();
  }, { signal });
  root.addEventListener('click', event => {
    const action = (event.target as Element).closest<HTMLButtonElement>('[data-action]')?.dataset.action;
    if (!action) return;
    if (action === 'play') togglePlay();
    else if (action === 'sort') applyData(true);
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
    renderTransport();
    schedule();
  }, { signal });
  visual.addEventListener('keydown', event => {
    if (![' ', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === ' ') togglePlay();
    else {
      pause();
      if (event.key === 'ArrowLeft') index = Math.max(0, index - 1);
      if (event.key === 'ArrowRight') index = Math.min(trace.length - 1, index + 1);
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = trace.length - 1;
      render();
    }
  }, { signal });
  input.value = values.join(', ');
  targetInput.value = String(target);
  renderAlgorithm();
  render();

  return () => {
    playing = false;
    clearTimer();
    controller.abort();
    root.replaceChildren();
  };
}
