/** Self-contained teaching diagrams; no assets, IDs or external SVG references. */
const ink = '#244c43';
const green = '#397a60';
const mint = '#d9ebc8';
const cream = '#f6f4e9';
const clay = '#d99b61';
const paper = '#fffdf5';

function path(d: string, color = ink, width = 2, extra = ''): string {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
}
function line(x1: number, y1: number, x2: number, y2: number, color = ink, width = 2): string {
  return path(`M${x1} ${y1}L${x2} ${y2}`, color, width);
}
function arrow(x1: number, y1: number, x2: number, y2: number, color = green, width = 2): string {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 7;
  return `${line(x1, y1, x2, y2, color, width)}${path(`M${x2 - size * Math.cos(angle - .55)} ${y2 - size * Math.sin(angle - .55)}L${x2} ${y2}L${x2 - size * Math.cos(angle + .55)} ${y2 - size * Math.sin(angle + .55)}`, color, width)}`;
}
function box(x: number, y: number, w: number, h: number, fill = paper, radius = 8, stroke = '#b6c5b3'): string {
  return `<rect x="${x}" y="${y + 3}" width="${w}" height="${h}" rx="${radius}" fill="${ink}" opacity=".06"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
}
function text(x: number, y: number, value: string, color = ink, size = 15, weight = 500, anchor = 'middle'): string {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle" fill="${color}" font-family="ui-sans-serif,system-ui,sans-serif" font-size="${size}" font-weight="${weight}">${escapeAttribute(value)}</text>`;
}
function node(x: number, y: number, value: string, fill = paper, radius = 23, color = ink): string {
  return `<circle cx="${x}" cy="${y + 3}" r="${radius}" fill="${ink}" opacity=".08"/><circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" stroke="${color}" stroke-width="2"/>${text(x, y + .5, value, color, 17, 650)}`;
}
function check(x: number, y: number, color = green, scale = 1): string {
  return path(`M${x - 6 * scale} ${y}l${5 * scale} ${5 * scale} ${10 * scale} ${-12 * scale}`, color, 2.5 * scale);
}
function escapeAttribute(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
function diagram(title: string, description: string, contents: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 280" fill="none" role="img" aria-label="${escapeAttribute(`${title}. ${description}`)}"><rect width="720" height="280" rx="14" fill="${cream}"/>${contents}</svg>`;
}

export interface ModuleVisual {
  title: string;
  description: string;
  svg: string;
}
function visual(title: string, description: string, contents: string): ModuleVisual {
  return { title, description, svg: diagram(title, description, contents) };
}

export const moduleVisuals: Record<number, ModuleVisual> = {
  1: visual('El máximo se construye paso a paso', 'Al recorrer −3, 8, 2 y 5, el máximo del prefijo toma los valores −3, 8, 8 y 8. Inicializar con el primer elemento también funciona cuando todos los valores son negativos.', `
    ${text(59, 80, 'a[i]', green, 15, 650)}${text(59, 171, 'máximo', green, 15, 650)}
    ${[-3, 8, 2, 5].map((value, i) => `${text(166 + i * 146, 34, `i = ${i}`, green, 13)}${box(113 + i * 146, 55, 106, 49, i === 1 ? clay : paper)}${text(166 + i * 146, 80, String(value).replace('-', '−'), ink, 23, 650)}${arrow(166 + i * 146, 111, 166 + i * 146, 139, green, 1.8)}${box(113 + i * 146, 147, 106, 49, i === 0 ? paper : mint)}${text(166 + i * 146, 172, i === 0 ? '−3' : '8', ink, 23, 650)}${i < 3 ? arrow(225 + i * 146, 172, 253 + i * 146, 172, green, 1.7) : ''}`).join('')}
    ${text(166, 220, 'primer valor', green, 13)}${text(312, 220, '8 > −3', ink, 14, 650)}${text(458, 220, '2 ≤ 8', green, 14)}${text(604, 220, '5 ≤ 8', green, 14)}
    ${text(360, 257, 'Tras cada paso, máximo representa el mayor valor del prefijo recorrido.', ink, 14)}
  `),
  2: visual('Comparar búsquedas con la misma entrada', 'En el peor caso, la búsqueda lineal compara n elementos. La búsqueda binaria sobre un arreglo ordenado hace como máximo piso de log₂(n) más una comparación: 4, 5, 6 y 7 para tamaños 8, 16, 32 y 64.', `
    ${text(244, 25, 'Comparaciones en el peor caso', ink, 16, 650)}
    ${path('M65 52H430M65 128H430M65 204H430', ink, 1, 'opacity=".12"')}
    ${arrow(65, 204, 445, 204, ink, 1.5)}${arrow(65, 204, 65, 42, ink, 1.5)}
    ${text(45, 204, '0', green, 11)}${text(45, 128, '32', green, 11)}${text(45, 52, '64', green, 11)}
    ${path('M98 185L195 166 292 128 415 52', clay, 3)}${path('M98 194.5L195 192.125 292 189.75 415 187.375', green, 3)}
    ${[98, 195, 292, 415].map((x, i) => `<circle cx="${x}" cy="${[185, 166, 128, 52][i]}" r="4" fill="${clay}"/><circle cx="${x}" cy="${[194.5, 192.125, 189.75, 187.375][i]}" r="4" fill="${green}"/>${text(x, 230, String([8, 16, 32, 64][i]), green, 12)}`).join('')}
    ${text(456, 230, 'n', green, 12)}
    ${box(484, 44, 203, 169, paper)}${line(499, 72, 520, 72, clay, 3)}${text(532, 72, 'Lineal · O(n)', ink, 14, 650, 'start')}${line(499, 103, 520, 103, green, 3)}${text(532, 103, 'Binaria · O(log n)', ink, 14, 650, 'start')}${text(585, 146, 'Con n = 64', green, 14)}${text(585, 178, '64 frente a 7', ink, 20, 650)}
    ${text(360, 260, 'La búsqueda binaria requiere datos ordenados; el gráfico cuenta comparaciones, no segundos.', ink, 13)}
  `),
  3: visual('Las llamadas bajan; los resultados vuelven', 'Para sumar [4, 2, 3], suma(3) calcula 3 + suma(2), suma(2) calcula 2 + suma(1), suma(1) calcula 4 + suma(0) y el caso base devuelve cero. Al retornar se obtienen 4, 6 y 9.', `
    ${text(360, 25, 'suma(a, n) = a[n − 1] + suma(a, n − 1) · a = [4, 2, 3]', ink, 16, 650)}
    ${['suma(3)', 'suma(2)', 'suma(1)', 'suma(0)'].map((name, i) => `${box(35 + i * 175, 70, 125, 77, i === 3 ? mint : paper)}${text(97.5 + i * 175, 93, name, ink, 18, 650)}${text(97.5 + i * 175, 124, ['3 + …', '2 + …', '4 + …', 'caso base'][i], green, 15)}${i < 3 ? arrow(166 + i * 175, 109, 204 + i * 175, 109, green) : ''}`).join('')}
    ${arrow(622, 177, 97, 177, clay, 2.5)}${text(360, 196, 'retorno de los resultados', green, 13)}
    ${text(97, 226, '3 + 6 = 9', ink, 18, 650)}${text(272, 226, '2 + 4 = 6', ink, 18, 650)}${text(447, 226, '4 + 0 = 4', ink, 18, 650)}${text(622, 226, '0', ink, 18, 650)}
    ${text(360, 261, 'Cada llamada espera el resultado de una instancia más pequeña.', ink, 14)}
  `),
  4: visual('Los enlaces definen el recorrido', 'La referencia cabeza apunta al nodo 7. Su siguiente apunta a 12, el siguiente a 24 y el último a null. Los nodos no necesitan ocupar posiciones contiguas de memoria.', `
    ${text(71, 48, 'cabeza', green, 14, 650)}${arrow(71, 64, 109, 104, green)}
    ${[7, 12, 24].map((value, i) => `${box(112 + i * 185, 74, 127, 68, i === 1 ? mint : paper)}${line(189 + i * 185, 75, 189 + i * 185, 141, ink, 1.4)}${text(151 + i * 185, 108, String(value), ink, 23, 650)}<circle cx="${213 + i * 185}" cy="108" r="5" fill="${green}"/>${text(151 + i * 185, 165, 'valor', green, 12)}${text(213 + i * 185, 165, 'sig.', green, 12)}${i < 2 ? arrow(218 + i * 185, 108, 291 + i * 185, 108, green, 2.2) : ''}`).join('')}
    ${arrow(588, 108, 641, 108, green, 2.2)}${text(668, 108, 'null', ink, 17, 650)}
    ${box(121, 199, 478, 37, cream, 6)}${text(360, 218, 'Recorrer: nodo = cabeza → nodo = nodo.sig → … → null', ink, 14)}
    ${text(360, 261, 'Una lista enlazada sigue referencias; un arreglo accede por índice.', ink, 14)}
  `),
  5: visual('La misma entrada, distinto orden de salida', 'Al insertar 1, 2 y 3, una pila LIFO extrae primero 3; una cola FIFO extrae primero 1. En la cola se inserta por el fondo y se extrae por el frente.', `
    ${text(179, 29, 'Pila · LIFO', ink, 17, 650)}${text(531, 29, 'Cola · FIFO', ink, 17, 650)}
    ${path('M69 66v149h98V66', ink, 2)}
    ${[3, 2, 1].map((value, i) => `${box(78, 73 + i * 43, 80, 34, i === 0 ? clay : mint, 5)}${text(118, 90 + i * 43, String(value), ink, 18, 650)}`).join('')}
    ${text(118, 56, 'tope', green, 12)}${arrow(164, 90, 232, 90, green, 2)}${node(265, 90, '3', clay, 23)}${text(265, 130, 'sale primero', green, 13)}
    ${line(360, 47, 360, 222, green, 1)}
    ${[1, 2, 3].map((value, i) => `${box(438 + i * 72, 103, 61, 52, i === 0 ? clay : mint, 6)}${text(468.5 + i * 72, 129, String(value), ink, 21, 650)}`).join('')}
    ${text(468, 83, 'frente', green, 12)}${text(612, 83, 'fondo', green, 12)}${arrow(430, 129, 390, 129, green, 2)}${arrow(686, 129, 651, 129, green, 2)}
    ${text(412, 184, 'sale 1', green, 14)}${text(665, 184, 'entra', green, 14)}
    ${text(360, 258, 'Insertamos 1 → 2 → 3. La política de extracción determina qué elemento sale primero.', ink, 14)}
  `),
  6: visual('Buscar 6 en un árbol binario de búsqueda', 'Se compara 6 con 8 y se baja a la izquierda; se compara con 3 y se baja a la derecha; al llegar a 6 se encuentra la clave. Las claves del subárbol izquierdo son menores y las del derecho mayores.', `
    ${line(265, 44, 151, 112, clay, 4)}${line(265, 44, 383, 112)}${line(151, 112, 89, 190)}${line(151, 112, 223, 190, clay, 4)}${line(383, 112, 444, 190)}
    ${node(265, 44, '8', ink, 23, cream)}${node(151, 112, '3', clay)}${node(383, 112, '10', paper)}${node(89, 190, '1', paper)}${node(223, 190, '6', mint)}${node(444, 190, '14', paper)}
    ${box(510, 53, 177, 165, paper)}${text(598, 78, 'Buscar 6', ink, 18, 650)}${text(598, 113, '6 < 8 → izquierda', green, 14)}${text(598, 146, '6 > 3 → derecha', green, 14)}${text(598, 181, '6 = 6 → encontrado', ink, 14, 650)}
    ${text(360, 258, 'La búsqueda descarta un subárbol en cada comparación; su costo depende de la altura.', ink, 14)}
  `),
  7: visual('Una rotación conserva el orden del árbol', 'Después de insertar 30, 20 y 10, el nodo 30 tiene factor de balance +2. Una rotación a la derecha deja 20 como raíz, 10 a su izquierda y 30 a su derecha. El recorrido inorden sigue siendo 10, 20, 30.', `
    ${text(154, 25, 'Antes: inserciones 30, 20, 10', ink, 15, 650)}${text(540, 25, 'Después de rotar a la derecha', ink, 15, 650)}
    ${line(225, 67, 145, 128, clay, 3)}${line(145, 128, 65, 189, clay, 3)}${node(225, 67, '30', clay)}${node(145, 128, '20', paper)}${node(65, 189, '10', mint)}
    ${text(292, 68, 'balance +2', green, 12)}${arrow(316, 127, 393, 127, green, 2.5)}
    ${line(533, 69, 459, 158)}${line(533, 69, 607, 158)}${node(533, 69, '20', ink, 23, cream)}${node(459, 158, '10', mint)}${node(607, 158, '30', mint)}
    ${text(533, 205, 'balance 0', green, 14)}
    ${text(360, 258, 'Cambian los enlaces y la altura; el orden de búsqueda 10 < 20 < 30 se conserva.', ink, 14)}
  `),
  8: visual('Una colisión no significa perder una clave', 'Con cinco buckets y h(k) = k módulo 5, tanto 12 como 22 llegan al bucket 2. El encadenamiento guarda ambos en una lista asociada a esa posición; buscar 22 requiere comprobar las claves del bucket.', `
    ${text(163, 27, 'h(k) = k mod 5', ink, 17, 650)}
    ${box(33, 65, 83, 42, paper)}${text(74, 86, '12', ink, 20, 650)}${box(33, 139, 83, 42, paper)}${text(74, 160, '22', ink, 20, 650)}
    ${arrow(122, 86, 188, 117, green)}${arrow(122, 160, 188, 129, green)}
    ${box(196, 91, 128, 64, ink, 10, ink)}${text(260, 123, 'resto = 2', cream, 19, 650)}${arrow(330, 123, 367, 123, clay, 3)}
    ${Array.from({ length: 5 }, (_, i) => `<rect x="375" y="${48 + i * 30}" width="63" height="30" fill="${i === 2 ? clay : paper}" stroke="${ink}" stroke-opacity=".4"/>${text(406.5, 63 + i * 30, String(i), ink, 15, 650)}`).join('')}
    ${arrow(444, 123, 485, 123, green)}${box(492, 102, 66, 42, mint)}${text(525, 123, '12', ink, 19, 650)}${arrow(563, 123, 589, 123, green)}${box(596, 102, 66, 42, mint)}${text(629, 123, '22', ink, 19, 650)}
    ${text(573, 178, 'mismo bucket, claves distintas', green, 13)}
    ${text(360, 258, 'Encadenamiento: se compara la clave completa dentro del bucket correspondiente.', ink, 14)}
  `),
  9: visual('Compartir prefijos sin repetirlos', 'Las palabras casa y caso comparten el camino c, a, s y se separan en la última letra. cuna comparte solo c. Los nodos con doble círculo marcan finales de palabra.', `
    ${text(360, 24, 'casa · caso · cuna', ink, 17, 650)}
    ${line(46, 136, 151, 136, clay, 3)}${line(151, 136, 279, 79, clay, 3)}${line(151, 136, 279, 200)}${line(279, 79, 411, 79, clay, 3)}${line(279, 200, 411, 200)}${line(411, 79, 560, 52)}${line(411, 79, 560, 123)}${line(411, 200, 560, 200)}
    ${node(46, 136, '·', ink, 20, cream)}${node(151, 136, 'c', clay)}${node(279, 79, 'a', clay)}${node(279, 200, 'u', paper)}${node(411, 79, 's', clay)}${node(411, 200, 'n', paper)}
    ${node(560, 52, 'a', mint)}${node(560, 123, 'o', mint)}${node(560, 200, 'a', mint)}
    ${[52, 123, 200].map(y => `<circle cx="560" cy="${y}" r="18" stroke="${green}" stroke-width="1.2"/>`).join('')}
    ${text(46, 174, 'raíz', green, 12)}${text(621, 52, 'casa', green, 13)}${text(621, 123, 'caso', green, 13)}${text(621, 200, 'cuna', green, 13)}
    ${text(360, 258, 'Un prefijo puede existir sin ser una palabra: hace falta una marca de final.', ink, 14)}
  `),
  10: visual('Insertion Sort: insertar 3 en el prefijo ordenado', 'El prefijo [2, 5] ya está ordenado. Se toma 3 como clave, se desplaza 5 una posición a la derecha y se inserta 3 entre 2 y 5. El resultado del paso es [2, 3, 5, 8].', `
    ${text(260, 28, 'prefijo ordenado', green, 14, 650)}${text(410, 28, 'clave', ink, 14, 650)}${text(92, 79, 'Antes', ink, 16, 650)}${text(92, 199, 'Después', ink, 16, 650)}
    ${[2, 5, 3, 8].map((value, i) => `${box(170 + i * 100, 55, 80, 48, i < 2 ? mint : i === 2 ? clay : paper)}${text(210 + i * 100, 79, String(value), ink, 23, 650)}`).join('')}
    ${path('M310 108q0 38 75 55', green, 2.5)}${path('M378 158l7 5-9 2', green, 2.5)}
    ${path('M410 108q0 33-83 56', clay, 3)}${path('M332 157l-7 7 10 1', clay, 3)}
    ${text(561, 139, '5 > 3: desplazar 5', green, 13)}
    ${[2, 3, 5, 8].map((value, i) => `${box(170 + i * 100, 175, 80, 48, i < 3 ? mint : paper)}${text(210 + i * 100, 199, String(value), ink, 23, 650)}`).join('')}
    ${text(360, 258, 'El prefijo crece una posición por paso; la clave se guarda mientras se desplazan valores.', ink, 14)}
  `),
  11: visual('BFS organiza un grafo por distancia', 'Partiendo de A, B y C tienen distancia 1, D distancia 2 y E distancia 3. El camino A, B, D, E usa tres aristas y es uno de los caminos mínimos en este grafo sin pesos.', `
    ${[100, 250, 430, 606].map((x, i) => `${text(x, 25, `distancia ${i}`, green, 13)}${path(`M${x} 44V227`, ink, 1, 'opacity=".08" stroke-dasharray="4 5"')}`).join('')}
    ${line(100, 139, 250, 76, clay, 4)}${line(100, 139, 250, 204)}${line(250, 76, 430, 139, clay, 4)}${line(250, 204, 430, 139)}${line(430, 139, 606, 139, clay, 4)}
    ${node(100, 139, 'A', ink, 25, cream)}${node(250, 76, 'B', clay, 25)}${node(250, 204, 'C', paper, 25)}${node(430, 139, 'D', clay, 25)}${node(606, 139, 'E', mint, 25)}
    ${text(606, 187, '3 aristas', green, 14, 650)}
    ${text(360, 258, 'BFS usa una cola: visita primero todos los vértices a distancia d y luego los de d + 1.', ink, 14)}
  `),
  12: visual('Elegir el intervalo que termina antes', 'Los intervalos A [0,3), C [3,5) y E [5,8) son compatibles. La estrategia voraz de terminar antes permite elegir los tres. B [1,5) y D [4,7) se solapan con la selección.', `
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(t => `${path(`M${102 + t * 64} 24V222`, ink, 1, 'opacity=".08"')}${text(102 + t * 64, 238, String(t), green, 12)}`).join('')}
    ${[['A', 0, 3, true], ['B', 1, 5, false], ['C', 3, 5, true], ['D', 4, 7, false], ['E', 5, 8, true]].map(([name, start, end, selected], i) => `${text(69, 43 + i * 38, String(name), ink, 14, 650)}<rect x="${102 + Number(start) * 64}" y="${30 + i * 38}" width="${(Number(end) - Number(start)) * 64 - 3}" height="26" rx="5" fill="${selected ? mint : clay}" opacity="${selected ? 1 : .45}" stroke="${selected ? green : clay}"/>${text(102 + (Number(start) + Number(end)) * 32, 43 + i * 38, `[${start}, ${end})`, ink, 13)}${selected ? check(652, 43 + i * 38, green, .8) : text(652, 43 + i * 38, '×', green, 18)}`).join('')}
    ${text(360, 265, 'Los intervalos son semiabiertos: terminar en 3 permite comenzar otro exactamente en 3.', ink, 13)}
  `),
  13: visual('LCS: reutilizar resultados de prefijos', 'La tabla compara prefijos de AB y ACB. Como las últimas letras B coinciden, L[2,3] es 1 más L[1,2]: 1 + 1 = 2. Una subsecuencia común más larga es AB.', `
    ${text(229, 19, 'Prefijos de «ACB»', ink, 15, 650)}
    ${['∅', 'A', 'C', 'B'].map((letter, c) => text(123 + c * 66, 43, letter, green, 14, 650)).join('')}
    ${[[0, 0, 0, 0], [0, 1, 1, 1], [0, 1, 1, 2]].map((row, r) => `${text(65, 83 + r * 50, ['∅', 'A', 'B'][r], green, 14, 650)}${row.map((value, c) => `<rect x="${90 + c * 66}" y="${58 + r * 50}" width="66" height="50" fill="${r === 2 && c === 3 ? clay : r === 1 && c === 2 ? mint : paper}" stroke="${ink}" stroke-opacity=".25"/>${text(123 + c * 66, 83 + r * 50, String(value), ink, 19, 650)}`).join('')}`).join('')}
    ${arrow(270, 145, 305, 171, green, 2.5)}
    ${box(433, 60, 249, 150, paper)}${text(557, 85, 'Las letras coinciden: B = B', green, 14, 650)}${text(557, 120, 'L[2,3] = 1 + L[1,2]', ink, 18, 650)}${text(557, 152, '1 + 1 = 2', ink, 21, 650)}${text(557, 186, 'Subsecuencia: AB', green, 15)}
    ${text(360, 258, 'Cada celda resuelve un par de prefijos; los subproblemas anteriores se guardan en la tabla.', ink, 14)}
  `),
  14: (() => {
    const board = Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => `<rect x="${31 + c * 48}" y="${30 + r * 48}" width="48" height="48" fill="${(r + c) % 2 ? mint : paper}" stroke="${ink}" stroke-opacity=".15"/>`).join('')).join('');
    const queens = [1, 3, 0, 2].map((c, r) => `<g transform="translate(${55 + c * 48} ${54 + r * 48})"><path d="M-13-7l6 7 7-10 7 10 6-7-4 18H-9z" fill="${ink}"/>${line(-10, 15, 10, 15, green, 3)}<circle cx="-13" cy="-10" r="2.5" fill="${green}"/><circle cy="-14" r="2.5" fill="${green}"/><circle cx="13" cy="-10" r="2.5" fill="${green}"/></g>`).join('');
    return visual('Descartar una rama antes de seguir', 'Una solución para cuatro reinas usa las columnas [1,3,0,2] en las filas 0,1,2,3. Durante la búsqueda, después de colocar la primera reina en la columna 1, otra reina en esa columna se descarta; colocar la siguiente en la columna 3 permite continuar.', `
      ${board}${queens}${text(127, 238, 'Solución: [1, 3, 0, 2]', green, 13, 650)}
      ${text(493, 26, 'Durante la búsqueda', ink, 16, 650)}${box(404, 51, 179, 43, mint)}${text(493, 72, 'fila 0 → columna 1', ink, 15, 650)}
      ${line(493, 97, 385, 146)}${line(493, 97, 599, 146)}${box(313, 147, 145, 41, paper)}${text(385, 168, 'fila 1 → col. 1', ink, 14)}${box(526, 147, 145, 41, mint)}${text(598, 168, 'fila 1 → col. 3', ink, 14)}
      ${text(385, 214, '× misma columna', ink, 14, 650)}${check(550, 214, green, .8)}${text(610, 214, 'continuar', green, 14, 650)}
      ${text(360, 266, 'Cada reina nueva debe evitar columnas y diagonales ya ocupadas.', ink, 14)}
    `);
  })(),
  15: visual('Un árbol de segmentos resume rangos', 'El arreglo [1,3,2,4] tiene suma total 10. Los hijos resumen [0,2) con suma 4 y [2,4) con suma 6. Consultar [1,3) combina los valores a[1]=3 y a[2]=2, dando 5.', `
    ${line(360, 41, 200, 112)}${line(360, 41, 520, 112)}${line(200, 112, 120, 192)}${line(200, 112, 280, 192, clay, 3)}${line(520, 112, 440, 192, clay, 3)}${line(520, 112, 600, 192)}
    ${node(360, 41, '10', ink, 22, cream)}${node(200, 112, '4', paper, 22)}${node(520, 112, '6', paper, 22)}
    ${text(416, 40, '[0,4)', green, 12)}${text(140, 111, '[0,2)', green, 12)}${text(582, 111, '[2,4)', green, 12)}
    ${[1, 3, 2, 4].map((value, i) => `${node(120 + i * 160, 192, String(value), i === 1 || i === 2 ? mint : paper, 22)}${text(120 + i * 160, 227, `a[${i}]`, green, 12)}`).join('')}
    ${text(360, 261, 'sumar(1, 3) = a[1] + a[2] = 3 + 2 = 5 · Intervalos [inicio, fin)', ink, 15, 650)}
  `),
  16: visual('Un invariante relaciona el estado con el objetivo', 'Al sumar [4,−2,7], antes de la iteración i=2 el prefijo procesado es [4,−2] y suma=2. El invariante afirma que suma coincide con la suma de a[0..i). Queda n−i=1 elemento y la siguiente iteración obtiene 9.', `
    ${text(247, 31, 'Antes de la iteración i = 2', ink, 17, 650)}
    ${[4, '−2', 7].map((value, i) => `${box(83 + i * 110, 82, 95, 58, i < 2 ? mint : paper)}${text(130.5 + i * 110, 111, String(value), ink, 24, 650)}${text(130.5 + i * 110, 162, `a[${i}]`, green, 12)}`).join('')}
    ${path('M82 183v9h205v-9', green, 2)}${text(185, 215, 'prefijo procesado · suma = 2', green, 14, 650)}${text(350, 215, 'pendiente', green, 13)}
    ${arrow(294, 55, 294, 151, clay, 2.5)}${text(312, 60, 'i', ink, 14, 650)}
    ${box(466, 48, 220, 177, paper)}${text(576, 74, 'Invariante del ciclo', ink, 16, 650)}${text(576, 111, 'suma = Σ a[0..i)', ink, 19, 650)}${text(576, 144, '4 + (−2) = 2', green, 17)}${text(576, 183, 'Queda n − i = 1 elemento', green, 13)}
    ${text(360, 260, 'El siguiente paso suma 7, avanza i a 3 y conserva el invariante: suma = 9.', ink, 14)}
  `),
};

export function moduleArt(moduleId: number): string {
  return (moduleVisuals[moduleId] ?? moduleVisuals[1]).svg;
}
export function moduleArtDescription(moduleId: number): string {
  return (moduleVisuals[moduleId] ?? moduleVisuals[1]).description;
}
