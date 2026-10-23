export const algorithms = {
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
};
/** Produce a deterministic trace without modifying the caller's array. */
export function makeTrace(id, input, target = 7) {
    if (!(id in algorithms))
        throw new Error('Algoritmo desconocido.');
    if (!input.every(Number.isFinite) || !Number.isFinite(target)) {
        throw new Error('Los datos y el objetivo deben ser números finitos.');
    }
    if (id === 'binary' && input.some((value, index) => index > 0 && value < input[index - 1])) {
        throw new Error('La búsqueda binaria requiere datos ordenados de menor a mayor. Usá «Ordenar entrada».');
    }
    const values = [...input];
    const trace = [];
    let comparisons = 0;
    let swaps = 0;
    const add = (line, message, active = [], sorted = [], result) => {
        trace.push({ values: [...values], active: [...active], sorted: [...sorted], line, message, comparisons, swaps, ...(result === undefined ? {} : { result }) });
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
            const greater = values[i] > values[best];
            add(3, `¿${values[i]} > ${values[best]}? ${greater ? 'Sí.' : 'No. Conservamos el candidato.'}`, [best, i]);
            if (greater) {
                best = i;
                add(4, `El nuevo máximo provisional es ${values[best]}.`, [best]);
            }
        }
        add(5, `Revisamos todo el arreglo. El máximo es ${values[best]}.`, [], [best], `Máximo: ${values[best]} · índice ${best}`);
    }
    else if (id === 'reverse') {
        let left = 0;
        let right = values.length - 1;
        const finished = [];
        add(1, 'Situamos los índices en ambos extremos.', values.length ? [...new Set([left, right])] : []);
        while (left < right) {
            add(2, `Los índices ${left} y ${right} todavía no se cruzaron.`, [left, right], finished);
            [values[left], values[right]] = [values[right], values[left]];
            swaps++;
            finished.push(left, right);
            add(3, `Intercambiamos las posiciones ${left} y ${right}. Ya quedaron en su lugar.`, [left, right], finished);
            left++;
            right--;
            add(5, 'Acercamos ambos índices hacia el centro.', left <= right ? [...new Set([left, right])] : [], finished);
        }
        add(6, 'Los índices se encontraron o se cruzaron: la inversión está completa.', [], indices(), `Arreglo invertido: [${values.join(', ')}]`);
    }
    else if (id === 'duplicates') {
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
    }
    else if (id === 'linear') {
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
    }
    else if (id === 'binary') {
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
            const lower = values[middle] < target;
            add(5, `¿${values[middle]} < ${target}? ${lower ? 'Sí: conservamos la mitad derecha.' : 'No: conservamos la mitad izquierda.'}`, [middle]);
            if (lower) {
                left = middle + 1;
                add(6, `El nuevo intervalo es [${left}, ${right}].`, left <= right ? [left, right] : []);
            }
            else {
                right = middle - 1;
                add(7, `El nuevo intervalo es [${left}, ${right}].`, left <= right ? [...new Set([left, right])] : []);
            }
        }
        add(8, `El intervalo quedó vacío: ${target} no está en el arreglo.`, [], [], 'No encontrado');
    }
    else if (id === 'bubble') {
        add(1, 'Empezamos con todos los valores pendientes de ordenar.');
        const finished = [];
        for (let end = values.length - 1; end > 0; end--) {
            let changed = false;
            add(2, `Nueva pasada: revisamos hasta el índice ${end}.`, [], finished);
            for (let i = 0; i < end; i++) {
                comparisons++;
                const greater = values[i] > values[i + 1];
                add(4, `¿${values[i]} > ${values[i + 1]}? ${greater ? 'Sí: hay que intercambiarlos.' : 'No. Están en el orden correcto.'}`, [i, i + 1], finished);
                if (greater) {
                    [values[i], values[i + 1]] = [values[i + 1], values[i]];
                    swaps++;
                    changed = true;
                    add(5, `Intercambiamos los índices ${i} y ${i + 1}.`, [i, i + 1], finished);
                }
            }
            finished.push(end);
            add(7, changed ? `El índice ${end} ya tiene su valor definitivo. Seguimos con el resto.` : 'No hubo intercambios en esta pasada: todo el arreglo está ordenado.', [], finished);
            if (!changed)
                break;
        }
        add(8, 'El arreglo quedó ordenado de menor a mayor.', [], indices(), `Ordenado: [${values.join(', ')}]`);
    }
    return trace;
}
