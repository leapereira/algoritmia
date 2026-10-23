export type AlgorithmId = 'max' | 'reverse' | 'duplicates' | 'linear' | 'binary' | 'bubble'
  | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap' | 'counting' | 'radix';

export interface Step {
  values: number[];
  active: number[];
  sorted?: number[];
  /** One-based line in the displayed pseudocode. */
  line: number;
  message: string;
  /** Comparisons between data values, excluding loop/index checks. */
  comparisons: number;
  swaps: number;
  result?: string;
  /** A real temporary value/output buffer; null means not yet assigned. */
  auxiliary?: { label: string; values: (number | null)[] };
}

export const algorithms: Record<AlgorithmId, {
  title: string;
  description: string;
  complexity: string;
  pseudocode: string[];
}> = {
  max: {
    title: 'Encontrar el máximo',
    description: 'Recorré el arreglo y conservá el mayor valor visto hasta el momento.',
    complexity: 'Tiempo O(n) · Espacio O(1)',
    pseudocode: [
      'mayor ← datos[0]',
      'para i ← 1 hasta n − 1',
      '  si datos[i] > mayor',
      '    mayor ← datos[i]',
      'devolver mayor',
    ],
  },
  reverse: {
    title: 'Invertir un arreglo',
    description: 'Intercambiá los extremos y acercá ambos índices hacia el centro.',
    complexity: 'Tiempo O(n) · Espacio O(1)',
    pseudocode: [
      'izquierda ← 0; derecha ← n − 1',
      'mientras izquierda < derecha',
      '  intercambiar datos[izquierda], datos[derecha]',
      '  izquierda ← izquierda + 1',
      '  derecha ← derecha − 1',
      'devolver datos',
    ],
  },
  duplicates: {
    title: 'Detectar duplicados',
    description: 'Compará pares y detenete cuando encuentres dos valores iguales.',
    complexity: 'Tiempo O(n²) · Espacio O(1)',
    pseudocode: [
      'para i ← 0 hasta n − 2',
      '  para j ← i + 1 hasta n − 1',
      '    si datos[i] = datos[j]',
      '      devolver (i, j)',
      'devolver «sin duplicados»',
    ],
  },
  linear: {
    title: 'Búsqueda lineal',
    description: 'Revisá los valores de izquierda a derecha hasta encontrar el objetivo.',
    complexity: 'Tiempo O(n) · Espacio O(1)',
    pseudocode: [
      'para i ← 0 hasta n − 1',
      '  si datos[i] = objetivo',
      '    devolver i',
      'devolver «no encontrado»',
    ],
  },
  binary: {
    title: 'Búsqueda binaria',
    description: 'En un arreglo ordenado, descartá la mitad del intervalo en cada vuelta.',
    complexity: 'Tiempo O(log n) · Espacio O(1)',
    pseudocode: [
      'izquierda ← 0; derecha ← n − 1',
      'mientras izquierda ≤ derecha',
      '  medio ← ⌊(izquierda + derecha) / 2⌋',
      '  si datos[medio] = objetivo: devolver medio',
      '  si datos[medio] < objetivo',
      '    izquierda ← medio + 1',
      '  si no: derecha ← medio − 1',
      'devolver «no encontrado»',
    ],
  },
  bubble: {
    title: 'Ordenamiento burbuja',
    description: 'Compará vecinos: el mayor avanza hacia el final en cada pasada.',
    complexity: 'Tiempo O(n²) · Espacio O(1)',
    pseudocode: [
      'para fin ← n − 1 hasta 1',
      '  huboCambio ← falso',
      '  para i ← 0 hasta fin − 1',
      '    si datos[i] > datos[i + 1]',
      '      intercambiar datos[i], datos[i + 1]',
      '      huboCambio ← verdadero',
      '  si no huboCambio: terminar',
      'devolver datos',
    ],
  },
  selection: {
    title: 'Selection Sort',
    description: 'Buscá el mínimo del segmento pendiente y ubicalo al principio.',
    complexity: 'Tiempo Θ(n²) · Espacio Θ(1)',
    pseudocode: [
      'para inicio ← 0 hasta n − 2',
      '  mínimo ← inicio',
      '  para j ← inicio + 1 hasta n − 1',
      '    si datos[j] < datos[mínimo]',
      '      mínimo ← j',
      '  si mínimo ≠ inicio: intercambiar ambos',
      'devolver datos',
    ],
  },
  insertion: {
    title: 'Insertion Sort',
    description: 'Guardá un valor y desplazá los mayores hasta abrirle un lugar en el prefijo.',
    complexity: 'Tiempo O(n²) · Espacio Θ(1)',
    pseudocode: [
      'para i ← 1 hasta n − 1',
      '  x ← datos[i]; j ← i − 1',
      '  mientras j ≥ 0 y datos[j] > x',
      '    datos[j + 1] ← datos[j]; j ← j − 1',
      '  datos[j + 1] ← x',
      'devolver datos',
    ],
  },
  merge: {
    title: 'Merge Sort',
    description: 'Dividí en mitades y mezclá los segmentos ordenados mediante un búfer.',
    complexity: 'Tiempo Θ(n log n) · Espacio Θ(n)',
    pseudocode: [
      'merge(lo, hi): si hi − lo ≤ 1: volver',
      'medio ← ⌊(lo + hi) / 2⌋',
      'merge(lo, medio); merge(medio, hi)',
      'comparar los primeros pendientes de ambas mitades',
      'copiar el menor al búfer (izquierda si empatan)',
      'copiar al búfer los restantes de la mitad no agotada',
      'copiar el búfer al intervalo datos[lo..hi)',
      'devolver datos',
    ],
  },
  quick: {
    title: 'Quick Sort',
    description: 'Particioná con el último valor como pivote y ordená ambos lados.',
    complexity: 'Tiempo O(n²) peor · Pila O(n) peor',
    pseudocode: [
      'quick(lo, hi): si lo ≥ hi: volver',
      'pivote ← datos[hi]; frontera ← lo',
      'para j ← lo hasta hi − 1: si datos[j] ≤ pivote',
      '  si j ≠ frontera: intercambiar datos[j], datos[frontera]',
      '  frontera ← frontera + 1',
      'si frontera ≠ hi: intercambiar datos[frontera], datos[hi]',
      'quick(lo, frontera − 1); quick(frontera + 1, hi)',
      'devolver datos',
    ],
  },
  heap: {
    title: 'Heap Sort',
    description: 'Construí un Max-Heap y llevá cada máximo al final del prefijo activo.',
    complexity: 'Tiempo O(n log n) · Espacio Θ(1)',
    pseudocode: [
      'construir Max-Heap hundiendo desde el último padre',
      'hundir: elegir el mayor de los hijos disponibles',
      'si datos[padre] ≥ datos[hijo]: terminar hundimiento',
      'intercambiar padre e hijo; continuar desde hijo',
      'para fin ← n − 1 hasta 1',
      '  intercambiar raíz y datos[fin]; reducir heap',
      '  hundir raíz en el prefijo restante',
      'devolver datos',
    ],
  },
  counting: {
    title: 'Counting Sort',
    description: 'Contá claves desplazadas por el mínimo y construí una salida estable.',
    complexity: 'Tiempo Θ(n + k) · Espacio Θ(n + k)',
    pseudocode: [
      'si n = 0: devolver datos',
      'obtener mínimo y máximo recorriendo los datos',
      'cuentas ← ceros(max − min + 1)',
      'para cada x: cuentas[x − min] ← cuentas[x − min] + 1',
      'acumular cuentas para obtener posiciones finales',
      'desde derecha: salida[--cuentas[x − min]] ← x',
      'copiar salida a datos',
      'devolver datos',
    ],
  },
  radix: {
    title: 'Radix Sort LSD',
    description: 'Ordená estable por dígitos de las claves no negativas x − mínimo.',
    complexity: 'Tiempo O(n + d(n + 10)) · Espacio Θ(n + 10)',
    pseudocode: [
      'si n = 0: devolver datos',
      'obtener mínimo y máximo recorriendo los datos',
      'para exp ← 1, 10, 100… mientras (max − min) / exp ≥ 1',
      'contar dígito ⌊(x − min) / exp⌋ módulo 10',
      'acumular las 10 cuentas',
      'colocar estable en salida recorriendo de derecha a izquierda',
      'copiar salida a datos',
      'devolver datos',
    ],
  },
};

/** Produce a deterministic trace without modifying the caller's array. */
export function makeTrace(id: AlgorithmId, input: number[], target = 7): Step[] {
  if (!(id in algorithms)) throw new Error('Algoritmo desconocido.');
  if (!input.every(Number.isFinite) || !Number.isFinite(target)) {
    throw new Error('Los datos y el objetivo deben ser números finitos.');
  }
  if ((id === 'counting' || id === 'radix') && input.some(value => !Number.isInteger(value) || value < -999 || value > 999)) {
    throw new Error('Counting y Radix requieren enteros entre −999 y 999 en este laboratorio.');
  }
  if (id === 'binary' && input.some((value, index) => index > 0 && value < input[index - 1]!)) {
    throw new Error('La búsqueda binaria requiere datos ordenados de menor a mayor. Usá «Ordenar entrada».');
  }

  const values = [...input];
  const trace: Step[] = [];
  let comparisons = 0;
  let swaps = 0;
  let auxiliary: Step['auxiliary'];
  const add = (line: number, message: string, active: number[] = [], sorted: number[] = [], result?: string) => {
    trace.push({ values: [...values], active: [...active], sorted: [...sorted], line, message, comparisons, swaps,
      ...(auxiliary ? { auxiliary: { label: auxiliary.label, values: [...auxiliary.values] } } : {}),
      ...(result === undefined ? {} : { result }) });
  };
  const indices = () => values.map((_, index) => index);

  if (id === 'max') {
    if (!values.length) {
      add(5, 'El arreglo está vacío: no existe un máximo.', [], [], 'Sin máximo');
      return trace;
    }
    let best = 0;
    add(1, `El primer candidato es ${values[0]}, en el índice 0.`, [0]);
    for (let i = 1; i < values.length; i++) {
      comparisons++;
      const greater = values[i]! > values[best]!;
      add(3, `¿${values[i]} > ${values[best]}? ${greater ? 'Sí.' : 'No. Conservamos el candidato.'}`, [best, i]);
      if (greater) {
        best = i;
        add(4, `El nuevo máximo provisional es ${values[best]}.`, [best]);
      }
    }
    add(5, `Revisamos todo el arreglo. El máximo es ${values[best]}.`, [], [best], `Máximo: ${values[best]} · índice ${best}`);
  } else if (id === 'reverse') {
    let left = 0;
    let right = values.length - 1;
    const finished: number[] = [];
    add(1, 'Situamos los índices en ambos extremos.', values.length ? [...new Set([left, right])] : []);
    while (left < right) {
      add(2, `Los índices ${left} y ${right} todavía no se cruzaron.`, [left, right], finished);
      [values[left], values[right]] = [values[right]!, values[left]!];
      swaps++;
      finished.push(left, right);
      add(3, `Intercambiamos las posiciones ${left} y ${right}. Ya quedaron en su lugar.`, [left, right], finished);
      left++;
      right--;
      add(5, 'Acercamos ambos índices hacia el centro.', left <= right ? [...new Set([left, right])] : [], finished);
    }
    add(6, 'Los índices se encontraron o se cruzaron: la inversión está completa.', [], indices(), `Arreglo invertido: [${values.join(', ')}]`);
  } else if (id === 'duplicates') {
    add(1, 'Buscamos dos posiciones distintas con el mismo valor.');
    for (let i = 0; i < values.length - 1; i++) {
      for (let j = i + 1; j < values.length; j++) {
        comparisons++;
        const equal = values[i] === values[j];
        add(3, `¿${values[i]} = ${values[j]}? ${equal ? 'Sí: encontramos un duplicado.' : 'No. Probamos el siguiente par.'}`, [i, j]);
        if (equal) {
          add(4, `El valor ${values[i]} aparece en los índices ${i} y ${j}. La búsqueda termina aquí.`, [], [i, j], `Duplicado: ${values[i]} · índices ${i} y ${j}`);
          return trace;
        }
      }
    }
    add(5, 'Comparamos todos los pares posibles: cada valor es distinto.', [], [], 'Sin duplicados');
  } else if (id === 'linear') {
    add(1, `Buscamos el valor ${target} desde el índice 0.`);
    for (let i = 0; i < values.length; i++) {
      comparisons++;
      const equal = values[i] === target;
      add(2, `¿${values[i]} = ${target}? ${equal ? 'Sí.' : 'No. Avanzamos una posición.'}`, [i]);
      if (equal) {
        add(3, `Encontramos ${target} en el índice ${i}. No es necesario seguir recorriendo.`, [], [i], `Encontrado en el índice ${i}`);
        return trace;
      }
    }
    add(4, `Llegamos al final y ${target} no aparece en el arreglo.`, [], [], 'No encontrado');
  } else if (id === 'binary') {
    let left = 0;
    let right = values.length - 1;
    add(1, `El arreglo está ordenado. El intervalo inicial va de 0 a ${right}.`);
    while (left <= right) {
      const middle = Math.floor((left + right) / 2);
      add(3, `Intervalo [${left}, ${right}]. Su índice central es ${middle}.`, [middle]);
      comparisons++;
      const equal = values[middle] === target;
      add(4, `¿${values[middle]} = ${target}? ${equal ? 'Sí: encontramos el objetivo.' : 'No. Decidimos qué mitad conservar.'}`, [middle]);
      if (equal) {
        add(4, `Encontramos ${target} en el índice ${middle}.`, [], [middle], `Encontrado en el índice ${middle}`);
        return trace;
      }
      comparisons++;
      const lower = values[middle]! < target;
      add(5, `¿${values[middle]} < ${target}? ${lower ? 'Sí: conservamos la mitad derecha.' : 'No: conservamos la mitad izquierda.'}`, [middle]);
      if (lower) {
        left = middle + 1;
        add(6, `El nuevo intervalo es [${left}, ${right}].`, left <= right ? [left, right] : []);
      } else {
        right = middle - 1;
        add(7, `El nuevo intervalo es [${left}, ${right}].`, left <= right ? [...new Set([left, right])] : []);
      }
    }
    add(8, `El intervalo quedó vacío: ${target} no está en el arreglo.`, [], [], 'No encontrado');
  } else if (id === 'bubble') {
    add(1, 'Empezamos con todos los valores pendientes de ordenar.');
    const finished: number[] = [];
    for (let end = values.length - 1; end > 0; end--) {
      let changed = false;
      add(2, `Nueva pasada: revisamos hasta el índice ${end}.`, [], finished);
      for (let i = 0; i < end; i++) {
        comparisons++;
        const greater = values[i]! > values[i + 1]!;
        add(4, `¿${values[i]} > ${values[i + 1]}? ${greater ? 'Sí: hay que intercambiarlos.' : 'No. Están en el orden correcto.'}`, [i, i + 1], finished);
        if (greater) {
          [values[i], values[i + 1]] = [values[i + 1]!, values[i]!];
          swaps++;
          changed = true;
          add(5, `Intercambiamos los índices ${i} y ${i + 1}.`, [i, i + 1], finished);
        }
      }
      finished.push(end);
      add(7, changed ? `El índice ${end} ya tiene su valor definitivo. Seguimos con el resto.` : 'No hubo intercambios en esta pasada: todo el arreglo está ordenado.', [], finished);
      if (!changed) break;
    }
    add(8, 'El arreglo quedó ordenado de menor a mayor.', [], indices(), `Ordenado: [${values.join(', ')}]`);
  } else if (id === 'selection') {
    const finished: number[] = [];
    add(1, 'Buscamos el mínimo de cada sufijo para fijar una posición por pasada.');
    for (let start = 0; start < values.length - 1; start++) {
      let minimum = start;
      add(2, `El candidato mínimo del sufijo empieza en el índice ${start}.`, [start], finished);
      for (let j = start + 1; j < values.length; j++) {
        comparisons++;
        const smaller = values[j]! < values[minimum]!;
        add(4, `¿${values[j]} < ${values[minimum]}? ${smaller ? 'Sí: encontramos un mínimo menor.' : 'No. Conservamos el candidato.'}`, [minimum, j], finished);
        if (smaller) {
          minimum = j;
          add(5, `El candidato mínimo está ahora en el índice ${minimum}.`, [minimum], finished);
        }
      }
      if (minimum !== start) {
        [values[start], values[minimum]] = [values[minimum]!, values[start]!];
        swaps++;
      }
      finished.push(start);
      add(6, minimum !== start ? `Intercambiamos los índices ${start} y ${minimum}. El índice ${start} es definitivo.` : `El mínimo ya estaba en ${start}: no hacemos un intercambio.`, [start], finished);
    }
    add(7, 'Cada mínimo quedó en su posición. El arreglo está ordenado.', [], indices(), `Ordenado: [${values.join(', ')}]`);
  } else if (id === 'insertion') {
    add(1, 'El primer elemento forma un prefijo ordenado. Insertaremos los siguientes.');
    for (let i = 1; i < values.length; i++) {
      const held = values[i]!;
      auxiliary = { label: 'Valor temporal x (se conserva mientras desplazamos)', values: [held] };
      let j = i - 1;
      add(2, `Guardamos x = ${held}. Buscamos su lugar en el prefijo [0, ${i}).`, [i]);
      while (j >= 0) {
        comparisons++;
        const greater = values[j]! > held;
        add(3, `¿${values[j]} > ${held}? ${greater ? 'Sí: desplazamos ese valor a la derecha.' : 'No: encontramos el lugar de x.'}`, [j]);
        if (!greater) break;
        values[j + 1] = values[j]!;
        add(4, `Copiamos ${values[j]} del índice ${j} al ${j + 1}. x sigue guardado: esto no es un intercambio.`, [j, j + 1]);
        j--;
      }
      values[j + 1] = held;
      auxiliary = undefined;
      add(5, `Escribimos x = ${held} en el índice ${j + 1}. El prefijo [0, ${i + 1}) está ordenado.`, [j + 1]);
    }
    add(6, 'El prefijo ordenado ya incluye todos los elementos.', [], indices(), `Ordenado: [${values.join(', ')}]`);
  } else if (id === 'merge') {
    const buffer: (number | null)[] = Array(values.length).fill(null);
    auxiliary = { label: 'Búfer de mezcla · punto = celda aún no escrita', values: buffer };
    add(1, 'Dividimos hasta intervalos de cero o un elemento y mezclamos al regresar.');
    function mergeSort(lo: number, hi: number): void {
      if (hi - lo <= 1) return;
      const middle = lo + Math.floor((hi - lo) / 2);
      add(3, `Dividimos [${lo}, ${hi}) en [${lo}, ${middle}) y [${middle}, ${hi}).`, Array.from({ length: hi - lo }, (_, i) => lo + i));
      mergeSort(lo, middle);
      mergeSort(middle, hi);
      for (let k = lo; k < hi; k++) buffer[k] = null;
      let left = lo;
      let right = middle;
      let output = lo;
      while (left < middle && right < hi) {
        comparisons++;
        const takeLeft = values[left]! <= values[right]!;
        add(4, `¿${values[left]} ≤ ${values[right]}? ${takeLeft ? 'Sí: tomamos de la mitad izquierda.' : 'No: tomamos de la mitad derecha.'}`, [left, right]);
        const source = takeLeft ? left++ : right++;
        buffer[output] = values[source]!;
        add(5, `Copiamos ${values[source]} al búfer en ${output}. El arreglo original todavía no se sobrescribe.`, [source]);
        output++;
      }
      while (left < middle || right < hi) {
        const source = left < middle ? left++ : right++;
        buffer[output] = values[source]!;
        add(6, `Una mitad se agotó. Copiamos ${values[source]} al búfer en ${output}, sin comparar valores.`, [source]);
        output++;
      }
      for (let k = lo; k < hi; k++) {
        values[k] = buffer[k]!;
        add(7, `Copiamos el valor ${values[k]} del búfer al índice ${k} del arreglo.`, [k]);
      }
    }
    mergeSort(0, values.length);
    auxiliary = undefined;
    add(8, 'La última mezcla completa el orden. Se usaron asignaciones a un búfer, no intercambios.', [], indices(), `Ordenado: [${values.join(', ')}]`);
  } else if (id === 'quick') {
    const finished = new Set<number>();
    add(1, 'Usamos partición de Lomuto y el último valor de cada intervalo como pivote.');
    function quickSort(lo: number, hi: number): void {
      if (lo > hi) return;
      if (lo === hi) {
        finished.add(lo);
        add(1, `El intervalo [${lo}, ${hi}] tiene un solo elemento: ya quedó en su posición.`, [], [...finished]);
        return;
      }
      const pivot = values[hi]!;
      let boundary = lo;
      auxiliary = { label: 'Pivote guardado del intervalo actual', values: [pivot] };
      add(2, `Particionamos [${lo}, ${hi}] con pivote ${pivot}, inicialmente en ${hi}.`, [hi], [...finished]);
      for (let j = lo; j < hi; j++) {
        comparisons++;
        const belongsLeft = values[j]! <= pivot;
        add(3, `¿${values[j]} ≤ ${pivot}? ${belongsLeft ? 'Sí: pertenece al grupo izquierdo.' : 'No: queda en el grupo mayor.'}`, [j, hi], [...finished]);
        if (belongsLeft) {
          if (j !== boundary) {
            [values[j], values[boundary]] = [values[boundary]!, values[j]!];
            swaps++;
            add(4, `Intercambiamos los índices ${j} y ${boundary} para extender el grupo izquierdo.`, [j, boundary], [...finished]);
          }
          boundary++;
          add(5, `La frontera avanza a ${boundary}. El prefijo clasificado contiene valores ≤ ${pivot}.`, [j], [...finished]);
        }
      }
      if (boundary !== hi) {
        [values[boundary], values[hi]] = [values[hi]!, values[boundary]!];
        swaps++;
      }
      finished.add(boundary);
      add(6, boundary !== hi ? `Movemos el pivote ${pivot} al índice definitivo ${boundary}.` : `El pivote ${pivot} ya está en su índice definitivo ${boundary}; no lo intercambiamos consigo mismo.`, [boundary], [...finished]);
      auxiliary = undefined;
      add(7, `Ordenamos los intervalos [${lo}, ${boundary - 1}] y [${boundary + 1}, ${hi}], excluyendo el pivote.`, [], [...finished]);
      quickSort(lo, boundary - 1);
      quickSort(boundary + 1, hi);
    }
    quickSort(0, values.length - 1);
    auxiliary = undefined;
    add(8, 'Todas las particiones terminaron. El arreglo está ordenado.', [], indices(), `Ordenado: [${values.join(', ')}]`);
  } else if (id === 'heap') {
    const finished: number[] = [];
    function sink(initial: number, size: number): void {
      let parent = initial;
      while (2 * parent + 1 < size) {
        let child = 2 * parent + 1;
        if (child + 1 < size) {
          comparisons++;
          const rightGreater = values[child + 1]! > values[child]!;
          add(2, `¿Hijo derecho ${values[child + 1]} > hijo izquierdo ${values[child]}? ${rightGreater ? 'Sí: elegimos el derecho.' : 'No: elegimos el izquierdo.'}`, [child, child + 1], finished);
          if (rightGreater) child++;
        }
        comparisons++;
        const alreadyOrdered = values[parent]! >= values[child]!;
        add(3, `¿Padre ${values[parent]} ≥ hijo ${values[child]}? ${alreadyOrdered ? 'Sí: termina este hundimiento.' : 'No: intercambiamos padre e hijo.'}`, [parent, child], finished);
        if (alreadyOrdered) break;
        [values[parent], values[child]] = [values[child]!, values[parent]!];
        swaps++;
        add(4, `Intercambiamos los índices ${parent} y ${child}. Seguimos hundiendo desde ${child}.`, [parent, child], finished);
        parent = child;
      }
    }
    add(1, 'Construimos un Max-Heap desde el último padre hacia la raíz.');
    for (let parent = Math.floor(values.length / 2) - 1; parent >= 0; parent--) {
      add(1, `Hundimos el nodo ${parent}; sus subárboles hijos ya son heaps.`, [parent]);
      sink(parent, values.length);
    }
    for (let end = values.length - 1; end > 0; end--) {
      [values[0], values[end]] = [values[end]!, values[0]!];
      swaps++;
      finished.push(end);
      add(6, `El máximo ${values[end]} queda definitivo en ${end}. Reducimos el heap a [0, ${end}).`, [0, end], finished);
      add(7, 'Reparamos la raíz dentro del prefijo activo; el sufijo no vuelve al heap.', [0], finished);
      sink(0, end);
    }
    add(8, 'El prefijo se agotó y todo el arreglo está ordenado.', [], indices(), `Ordenado: [${values.join(', ')}]`);
  } else if (id === 'counting' || id === 'radix') {
    add(1, id === 'counting' ? 'Contaremos frecuencias de claves x − mínimo para admitir negativos.' : 'Procesaremos dígitos de x − mínimo con pasadas estables.');
    if (!values.length) {
      add(8, 'El arreglo vacío ya está ordenado.', [], [], 'Ordenado: []');
      return trace;
    }
    let minimum = values[0]!;
    let maximum = values[0]!;
    for (let i = 1; i < values.length; i++) {
      comparisons++;
      const lower = values[i]! < minimum;
      add(2, `¿${values[i]} < mínimo ${minimum}? ${lower ? 'Sí: actualizamos mínimo.' : 'No.'}`, [i]);
      if (lower) minimum = values[i]!;
      comparisons++;
      const higher = values[i]! > maximum;
      add(2, `¿${values[i]} > máximo ${maximum}? ${higher ? 'Sí: actualizamos máximo.' : 'No.'}`, [i]);
      if (higher) maximum = values[i]!;
    }
    add(2, `Mínimo ${minimum}, máximo ${maximum}. Restar (${minimum}) convierte todas las claves en no negativas.`);
    if (id === 'counting') {
      const counts = Array<number>(maximum - minimum + 1).fill(0);
      const output: (number | null)[] = Array(values.length).fill(null);
      auxiliary = { label: 'Salida estable · punto = celda aún no escrita', values: output };
      add(3, `Reservamos ${counts.length} frecuencias: k = máximo − mínimo + 1.`);
      for (let i = 0; i < values.length; i++) {
        const key = values[i]! - minimum;
        counts[key] = counts[key]! + 1;
        add(4, `Contamos ${values[i]}: su frecuencia ahora es ${counts[key]}.`, [i]);
      }
      for (let i = 1; i < counts.length; i++) counts[i] = counts[i]! + counts[i - 1]!;
      add(5, 'Acumulamos frecuencias: cada cuenta indica el límite exclusivo de su clave en la salida.');
      for (let i = values.length - 1; i >= 0; i--) {
        const key = values[i]! - minimum;
        counts[key] = counts[key]! - 1;
        const destination = counts[key]!;
        output[destination] = values[i]!;
        add(6, `Colocamos ${values[i]} en salida[${destination}]. Recorrer desde la derecha conserva estabilidad.`, [i]);
      }
      for (let i = 0; i < values.length; i++) {
        values[i] = output[i]!;
        add(7, `Copiamos salida[${i}] = ${values[i]} al arreglo. Es una asignación, no un intercambio.`, [i]);
      }
    } else {
      const maxKey = maximum - minimum;
      for (let exponent = 1; Math.floor(maxKey / exponent) > 0; exponent *= 10) {
        const counts = Array<number>(10).fill(0);
        const output: (number | null)[] = Array(values.length).fill(null);
        auxiliary = { label: `Salida de la pasada exp = ${exponent} · punto = celda aún no escrita`, values: output };
        add(3, `Nueva pasada por el dígito de posición ${exponent} en claves x − (${minimum}).`);
        for (let i = 0; i < values.length; i++) {
          const digit = Math.floor((values[i]! - minimum) / exponent) % 10;
          counts[digit] = counts[digit]! + 1;
          add(4, `${values[i]} tiene clave ${values[i]! - minimum} y dígito ${digit}. Su frecuencia ahora es ${counts[digit]}.`, [i]);
        }
        for (let digit = 1; digit < 10; digit++) counts[digit] = counts[digit]! + counts[digit - 1]!;
        add(5, 'Acumulamos las diez cuentas para calcular las posiciones de esta pasada.');
        for (let i = values.length - 1; i >= 0; i--) {
          const digit = Math.floor((values[i]! - minimum) / exponent) % 10;
          counts[digit] = counts[digit]! - 1;
          const destination = counts[digit]!;
          output[destination] = values[i]!;
          add(6, `Colocamos ${values[i]} en salida[${destination}] de forma estable para conservar los dígitos anteriores.`, [i]);
        }
        for (let i = 0; i < values.length; i++) {
          values[i] = output[i]!;
          add(7, `Copiamos ${values[i]} al índice ${i}. Al completar la pasada queda ordenado por los dígitos ya procesados.`, [i]);
        }
      }
    }
    auxiliary = undefined;
    add(8, 'El arreglo quedó ordenado, incluyendo los negativos. El desplazamiento de claves conserva el orden original.', [], indices(), `Ordenado: [${values.join(', ')}]`);
  }

  return trace;
}
