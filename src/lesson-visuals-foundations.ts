type LessonVisual = { title: string; description: string; svg: string };

const ink = '#244c43';
const green = '#397a60';
const mint = '#d9ebc8';
const cream = '#f6f4e9';
const accent = '#d99b61';
const esc = (value: string | number): string => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = (x: number, y: number, value: string | number, size = 18, color = ink, anchor = 'middle', weight = 500): string => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-size="${size}" font-weight="${weight}" font-family="Inter,system-ui,sans-serif">${esc(value)}</text>`;
const rect = (x: number, y: number, width: number, height: number, fill = cream, stroke = ink, radius = 10): string => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const line = (x1: number, y1: number, x2: number, y2: number, color = green, width = 2): string => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
const arrow = (x1: number, y1: number, x2: number, y2: number, color = green): string => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const side = (offset: number): string => `${x2 - 10 * Math.cos(angle + offset)},${y2 - 10 * Math.sin(angle + offset)}`;
  return line(x1, y1, x2, y2, color) + `<polygon points="${x2},${y2} ${side(0.45)} ${side(-0.45)}" fill="${color}"/>`;
};
const box = (x: number, y: number, width: number, value: string | number, fill = cream, size = 18): string => rect(x, y, width, 42, fill) + text(x + width / 2, y + 27, value, size);
const node = (x: number, y: number, value: string | number, fill = mint, radius = 22): string => `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" stroke="${ink}" stroke-width="2"/>` + text(x, y + 6, value, 18);
const row = (x: number, y: number, values: (string | number)[], width = 52, fills: Record<number, string> = {}, indices = false): string => values.map((value, i) => box(x + i * width, y, width - 4, value, fills[i] ?? cream) + (indices ? text(x + i * width + (width - 4) / 2, y + 65, i, 16) : '')).join('');
const tree = (points: [number, number, string | number][], edges: [number, number][], fills: Record<number, string> = {}, radius = 22): string => edges.map(([a, b]) => line(points[a][0], points[a][1], points[b][0], points[b][1])).join('') + points.map(([x, y, value], i) => node(x, y, value, fills[i] ?? mint, radius)).join('');
const path = (d: string, color = green, width = 3): string => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const visual = (title: string, description: string, body: string): LessonVisual => ({ title, description, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 280" role="img" aria-label="${esc(description)}"><title>${esc(title)}</title>${body}</svg>` });

export const foundationVisuals: Record<string, LessonVisual> = {
  algoritmos: visual('Un máximo se construye paso a paso', 'Al recorrer 4, 9, 2 y 7, el máximo del prefijo toma los valores 4, 9, 9 y 9. La salida es 9, en el índice 1.',
    text(32, 35, 'Entrada', 18, ink, 'start') + row(170, 13, [4, 9, 2, 7], 100, { 1: mint }, true) +
    [4, 9, 9, 9].map((v, i) => arrow(218 + i * 100, 87, 218 + i * 100, 125) + box(178 + i * 100, 137, 80, v, i === 1 ? accent : mint)).join('') +
    text(32, 166, 'Máximo', 18, ink, 'start') + text(32, 192, 'del prefijo', 18, ink, 'start') +
    rect(170, 221, 396, 40, cream) + text(368, 248, 'Salida: valor 9 · primera posición 1', 18)),

  pseudocodigo: visual('La decisión controla la inversión', 'Con el arreglo 2, 5, 1, 8, si izquierda es menor que derecha se intercambian los extremos y se acercan los índices; al cruzarse, termina el ciclo.',
    text(180, 30, 'Estado inicial', 18) + row(58, 49, [2, 5, 1, 8], 63, { 0: accent, 3: accent }, true) +
    arrow(85, 131, 268, 131) + text(180, 160, 'intercambiar extremos', 16) + row(58, 184, [8, 5, 1, 2], 63, { 0: mint, 3: mint }) +
    box(418, 20, 220, 'izquierda < derecha') + arrow(528, 62, 528, 103) + text(553, 87, 'sí', 16) +
    box(418, 111, 220, 'intercambiar; i++; j−−', mint, 17) + path('M 638 132 L 677 132 L 677 40 L 648 40') + arrow(664, 40, 646, 40) +
    path('M 418 41 L 370 41 L 370 73') + arrow(370, 62, 370, 81) + text(394, 69, 'no', 16) + box(342, 83, 58, 'fin', cream, 16) +
    text(528, 212, 'El rango pendiente se reduce.', 17) + text(528, 241, 'Al salir, todo está invertido.', 17)),

  control: visual('Dos índices evitan comparar un par dos veces', 'En 4, 7, 4 los pares posibles de índices son 0 y 1, 0 y 2, y 1 y 2. El par 0 y 2 contiene dos valores 4; una búsqueda con corte temprano puede detenerse allí porque ya encontró un duplicado.',
    row(62, 28, [4, 7, 4], 80, { 0: mint, 2: mint }, true) + text(180, 148, 'i < j', 24, green) + text(180, 180, 'Cada par aparece una vez.', 17) +
    box(365, 24, 290, '(0, 1) → 4 ≠ 7') + box(365, 91, 290, '(0, 2) → 4 = 4', mint) + box(365, 158, 290, '(1, 2) → 7 ≠ 4') +
    text(510, 245, 'Respuesta: hay duplicados.', 19, ink, 'middle', 700)),

  recursion: visual('La inversión delega el intervalo interior', 'Invertir los índices 0 a 3 de 2, 5, 1, 8 intercambia 2 y 8; la llamada 1 a 2 intercambia 5 y 1; la llamada 2 a 1 es el caso base. El resultado es 8, 1, 5, 2.',
    box(38, 29, 185, 'invertir(0, 3)', mint) + arrow(226, 50, 264, 50) + box(269, 29, 185, 'invertir(1, 2)', mint) + arrow(457, 50, 495, 50) + box(500, 29, 185, 'invertir(2, 1)', accent) +
    text(130, 111, 'Intercambia 2 ↔ 8', 17) + text(361, 111, 'Intercambia 5 ↔ 1', 17) + text(592, 111, 'Base: 2 ≥ 1', 17) +
    row(51, 162, [2, 5, 1, 8], 62) + arrow(311, 183, 390, 183) + row(412, 162, [8, 1, 5, 2], 62, { 0: mint, 1: mint, 2: mint, 3: mint }) +
    text(360, 253, 'Cada llamada conserva sus propios límites.', 18)),

  correctitud: visual('La invariante habla del prefijo ya recorrido', 'Después de procesar los tres primeros elementos de 4, 9, 2, 7, max vale 9, el máximo de ese prefijo. Procesar el siguiente 7 conserva max igual a 9.',
    rect(66, 23, 330, 101, mint) + text(230, 47, 'Prefijo procesado', 17) + row(88, 61, [4, 9, 2], 98, { 1: accent }) + row(440, 61, [7], 98) +
    text(488, 47, 'Pendiente', 17) + box(66, 159, 225, 'max = 9', mint) + arrow(302, 180, 382, 180) + box(395, 159, 257, 'max(9, 7) = 9', mint) +
    text(360, 247, 'Antes y después: max = máximo del prefijo.', 19)),

  eficiencia: visual('Mismo objetivo, distinta cantidad de consultas', 'Al buscar 13 en 1, 3, 5, 7, 9, 11, 13, la búsqueda lineal lee siete valores. La binaria lee 7, luego 11 y luego 13: tres consultas, porque el arreglo está ordenado.',
    text(37, 34, 'Buscar 13 en un arreglo ordenado', 20, ink, 'start', 700) + row(71, 63, [1, 3, 5, 7, 9, 11, 13], 83, { 6: mint }) +
    text(85, 150, 'Lineal', 18, ink, 'start') + arrow(170, 145, 638, 145) + text(407, 175, '1 → 3 → 5 → 7 → 9 → 11 → 13', 18) +
    text(85, 218, 'Binaria', 18, ink, 'start') + box(207, 195, 80, '7') + arrow(292, 216, 332, 216) + box(340, 195, 80, '11') + arrow(426, 216, 466, 216) + box(475, 195, 80, '13', mint) +
    text(619, 222, '3 lecturas', 17)),

  'm02-modelo': visual('Contar trabajo exige fijar entrada y operación', 'Buscar 2 en 2, 4, 6, 8, 10, 12 necesita una comparación. Buscar 12 necesita seis. Ambos casos usan una cantidad constante de variables auxiliares.',
    row(72, 32, [2, 4, 6, 8, 10, 12], 96, { 0: mint, 5: accent }, true) +
    box(47, 139, 290, 'Buscar 2: 1 comparación', mint) + box(382, 139, 290, 'Buscar 12: 6 comparaciones', accent, 17) +
    text(192, 212, 'Mejor caso: Θ(1)', 19) + text(527, 212, 'Peor caso: Θ(n)', 19) + text(360, 259, 'Memoria auxiliar: índice + objetivo → Θ(1)', 18)),

  'm02-cotas': visual('Las familias se separan al crecer n', 'Gráfico de n, n log base 2 de n y n al cuadrado para n entre 1 y 8, usando una escala común. En n igual a 8, los valores son 8, 24 y 64.',
    arrow(76, 230, 569, 230) + arrow(76, 230, 76, 39) + text(51, 45, 'costo', 16) + text(580, 253, 'n', 18) +
    [1, 4, 8].map(n => text(76 + n * 58, 254, n, 16)).join('') + [0, 32, 64].map(n => text(56, 230 - n * 2.6 + 5, n, 16)).join('') +
    path('M 134 227.4 L 192 224.8 L 250 222.2 L 308 219.6 L 366 217 L 424 214.4 L 482 211.8 L 540 209.2', green) +
    path('M 134 230 L 192 224.8 L 250 217.64 L 308 209.2 L 366 199.81 L 424 189.67 L 482 178.89 L 540 167.6', ink) +
    path('M 134 227.4 L 192 219.6 L 250 206.6 L 308 188.4 L 366 165 L 424 136.4 L 482 102.6 L 540 63.6', accent) +
    text(610, 70, 'n² = 64', 18, ink) + text(614, 171, 'n log₂n = 24', 17, ink) + text(609, 214, 'n = 8', 18, green)),

  'm02-ciclos': visual('El triángulo de pares tiene seis casillas', 'Para n igual a 4, los pares i menor que j son 01, 02, 03, 12, 13 y 23. Las filas tienen 3, 2 y 1 pares: seis en total, igual a n por n menos 1 dividido entre 2.',
    text(141, 29, 'Pares con i < j', 20) +
    row(53, 52, ['0,1', '0,2', '0,3'], 95, { 0: mint, 1: mint, 2: mint }) + row(148, 113, ['1,2', '1,3'], 95, { 0: mint, 1: mint }) + row(243, 174, ['2,3'], 95, { 0: mint }) +
    text(358, 80, '3', 20) + text(358, 141, '2', 20) + text(358, 202, '1', 20) +
    box(425, 65, 240, '3 + 2 + 1 = 6', mint) + text(545, 160, 'n(n − 1) / 2', 23) + text(545, 206, 'Crecimiento Θ(n²)', 19) +
    text(195, 256, 'No se comparan (i, i) ni (j, i).', 17)),

  'm02-recurrencias': visual('Cada nivel reúne trabajo proporcional a n', 'Para T(n) igual a 2T(n/2) más n, el árbol con n igual a 8 tiene niveles de 1 por 8, 2 por 4, 4 por 2 y 8 por 1. Cada nivel suma 8; hay log base 2 de n más 1 niveles.',
    tree([[280, 34, 8], [160, 94, 4], [400, 94, 4], [100, 154, 2], [220, 154, 2], [340, 154, 2], [460, 154, 2]], [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]], {}, 19) +
    [70, 130, 190, 250, 310, 370, 430, 490].map((x, i) => line(100 + Math.floor(i / 2) * 120, 171, x, 212) + node(x, 224, 1, cream, 17)).join('') +
    text(602, 40, '1 × 8 = 8', 18) + text(602, 100, '2 × 4 = 8', 18) + text(602, 160, '4 × 2 = 8', 18) + text(602, 230, '8 × 1 = 8', 18) +
    text(300, 271, 'Θ(n) por nivel × Θ(log n) niveles = Θ(n log n)', 17)),

  'm02-amortizado': visual('Una expansión costosa se reparte en la secuencia', 'Al insertar ocho elementos y duplicar capacidad desde uno, los costos de escritura más copia son 1, 2, 3, 1, 5, 1, 1 y 1. En total hay ocho escrituras y siete copias: quince unidades.',
    text(360, 28, 'Costo de cada inserción: escritura + copias', 20) + line(61, 205, 657, 205) +
    [1, 2, 3, 1, 5, 1, 1, 1].map((v, i) => rect(77 + i * 72, 205 - v * 27, 45, v * 27, v > 1 ? accent : mint, ink, 4) + text(99 + i * 72, 194 - v * 27, v, 17) + text(99 + i * 72, 229, i + 1, 16)).join('') +
    text(360, 269, '8 escrituras + (1 + 2 + 4) copias = 15 → Θ(1) amortizado', 17)),

  'm03-contratos': visual('Bajar conserva la multiplicación pendiente', 'Factorial de 4 llama a factorial de 3, 2, 1 y 0. El caso base devuelve 1; al regresar se obtienen 1, 2, 6 y 24. Cinco marcos están activos en la profundidad máxima.',
    text(48, 30, 'Llamadas', 18, ink, 'start') + [4, 3, 2, 1, 0].map((v, i) => box(52 + i * 132, 51, 104, `fact(${v})`, i === 4 ? accent : cream) + (i < 4 ? arrow(160 + i * 132, 72, 179 + i * 132, 72) : '')).join('') +
    text(48, 133, 'Retornos', 18, ink, 'start') + [24, 6, 2, 1, 1].map((v, i) => box(52 + i * 132, 154, 104, v, mint) + (i < 4 ? arrow(179 + i * 132, 175, 160 + i * 132, 175) : '')).join('') +
    text(360, 253, 'Cada marco espera para multiplicar por su propio n.', 19)),

  'm03-formas': visual('Fibonacci repite subproblemas', 'El árbol parcial de Fibonacci de 5 contiene dos llamadas a Fibonacci de 3: una desde 4 y otra directamente desde 5. Una versión iterativa conserva solo dos términos consecutivos.',
    tree([[200, 48, 'F5'], [116, 118, 'F4'], [284, 118, 'F3'], [67, 200, 'F3'], [166, 200, 'F2'], [250, 200, 'F2'], [334, 200, 'F1']], [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]], { 2: accent, 3: accent }, 25) +
    text(200, 259, 'Árbol parcial: F3 se calcula dos veces.', 17) +
    rect(415, 23, 261, 235, cream) + text(545, 54, 'Dos acumuladores', 20) + text(545, 92, '(a, b)', 18) + text(545, 124, '(0, 1) → (1, 1)', 18) + text(545, 159, '(1, 2) → (2, 3)', 18) + text(545, 194, '(3, 5)', 18) + text(545, 235, 'Θ(n) tiempo · Θ(1) espacio', 17)),

  'm03-binaria': visual('El contrato conserva un intervalo de candidatos', 'Buscar 11 en 1, 3, 5, 7, 9, 11, 13 comienza en el intervalo semiabierto 0 a 7. El centro 3 contiene 7 y se descarta hasta él. En el intervalo 4 a 7, el centro 5 contiene 11.',
    row(54, 38, [1, 3, 5, 7, 9, 11, 13], 89, { 3: accent, 5: mint }, true) +
    text(360, 145, '[0, 7): centro = 3 · 7 < 11', 20) + arrow(360, 158, 360, 183) +
    box(132, 194, 456, '[4, 7): centro = 5 · encontrado', mint, 20) + text(360, 269, 'El centro descartado no vuelve a formar parte del rango.', 17)),

  'm03-merge': visual('Dividir, ordenar mitades y mezclar', 'Merge Sort divide 8, 3, 6, 1 en 8, 3 y 6, 1. Tras ordenar esas mitades obtiene 3, 8 y 1, 6. La mezcla final produce 1, 3, 6, 8 conservando todos los elementos.',
    box(250, 11, 220, '[8, 3, 6, 1]') + arrow(286, 56, 187, 84) + arrow(434, 56, 533, 84) +
    box(94, 88, 185, '[8, 3]') + box(441, 88, 185, '[6, 1]') + arrow(186, 132, 186, 151) + arrow(533, 132, 533, 151) +
    box(94, 155, 185, '[3, 8]', mint) + box(441, 155, 185, '[1, 6]', mint) +
    arrow(279, 183, 305, 220) + arrow(441, 183, 415, 220) + box(250, 226, 220, '[1, 3, 6, 8]', mint) + text(360, 174, 'mezclar', 17)),

  'm03-quick': visual('La partición coloca el pivote en su lugar', 'Con pivote final 5, particionar 6, 2, 8, 3, 5 produce 2, 3, 5, 6, 8. Los dos valores de la izquierda son menores que 5 y los dos de la derecha mayores; los lados todavía se ordenan por separado.',
    text(77, 30, 'Pivote final: 5', 20, ink, 'start') + row(77, 49, [6, 2, 8, 3, 5], 113, { 4: accent }) +
    arrow(360, 104, 360, 139) + row(77, 153, [2, 3, 5, 6, 8], 113, { 0: mint, 1: mint, 2: accent }) +
    text(184, 228, '< 5', 21) + text(357, 228, 'pivote', 20) + text(530, 228, '> 5', 21) + text(360, 269, 'Solo el pivote queda garantizado en su posición final.', 17)),

  'm04-arreglos': visual('Insertar en el medio requiere abrir un hueco', 'Para insertar 25 en el índice 2 de 10, 20, 30, 40, se desplaza primero 40 a la posición 4 y luego 30 a la 3. Finalmente se escribe 25 en la posición 2.',
    row(81, 33, [10, 20, 30, 40, '·'], 111, { 2: accent, 3: accent }, true) + arrow(463, 126, 574, 126) + text(518, 151, '1.º mover 40', 16) + arrow(351, 156, 462, 156) + text(406, 180, '2.º mover 30', 16) +
    row(81, 204, [10, 20, 25, 30, 40], 111, { 2: mint }) + text(360, 273, 'Mover de derecha a izquierda evita sobrescribir datos.', 17)),

  'm04-dinamicos': visual('Capacidad y cantidad son magnitudes distintas', 'Un arreglo dinámico con cuatro elementos en capacidad cuatro se expande a capacidad ocho. Copia 10, 20, 30 y 40; agrega 50 y conserva tres casillas libres. La cantidad es cinco y la capacidad ocho.',
    text(57, 28, 'Antes: cantidad 4 · capacidad 4', 19, ink, 'start') + row(57, 47, [10, 20, 30, 40], 76, { 0: mint, 1: mint, 2: mint, 3: mint }) +
    arrow(208, 103, 208, 146) + text(352, 127, 'copiar 4 elementos', 18) +
    text(57, 181, 'Después de agregar 50: cantidad 5 · capacidad 8', 19, ink, 'start') + row(57, 202, [10, 20, 30, 40, 50, '·', '·', '·'], 76, { 0: mint, 1: mint, 2: mint, 3: mint, 4: accent }) +
    text(555, 274, 'Tres lugares disponibles', 16)),

  'm04-simple': visual('Insertar exige conservar el enlace siguiente', 'Para insertar 15 entre 10 y 20, primero se asigna nuevo.siguiente a 20 y después 10.siguiente a nuevo. El resto de la lista 20, 30 permanece alcanzable.',
    text(43, 29, 'Antes', 18, ink, 'start') + box(132, 9, 86, '10', mint) + arrow(224, 30, 278, 30) + box(287, 9, 86, '20') + arrow(379, 30, 433, 30) + box(442, 9, 86, '30') + arrow(535, 30, 575, 30) + text(611, 36, 'null', 17) +
    box(287, 103, 86, '15', accent) + arrow(331, 101, 331, 60) + text(490, 115, '1. nuevo.sig = anterior.sig', 17) +
    path('M 177 55 L 177 126 L 276 126') + arrow(251, 126, 276, 126) + text(480, 151, '2. anterior.sig = nuevo', 17) +
    text(43, 227, 'Después', 18, ink, 'start') + [10, 15, 20, 30].map((v, i) => box(141 + i * 130, 202, 86, v, i === 1 ? accent : cream) + (i < 3 ? arrow(232 + i * 130, 223, 263 + i * 130, 223) : '')).join('') +
    text(360, 272, 'El resto de la cadena sigue siendo alcanzable.', 17)),

  'm04-dobles-circulares': visual('Los enlaces cambian el contrato de navegación', 'Una lista doble permite avanzar y retroceder entre A, B y C, con null en ambos extremos. En una lista circular simple, C.siguiente vuelve a A; no existe un enlace final a null.',
    text(36, 32, 'Doble', 19, ink, 'start') + [0, 1, 2].map(i => box(190 + i * 150, 15, 82, ['A', 'B', 'C'][i], mint)).join('') +
    [0, 1].map(i => arrow(279 + i * 150, 29, 332 + i * 150, 29) + arrow(332 + i * 150, 48, 279 + i * 150, 48)).join('') + arrow(184, 36, 155, 36) + text(129, 42, 'null', 17) + arrow(580, 36, 610, 36) + text(641, 42, 'null', 17) +
    text(36, 151, 'Circular', 19, ink, 'start') + box(190, 128, 82, 'A', mint) + arrow(280, 149, 332, 149) + box(340, 128, 82, 'B', mint) + arrow(430, 149, 482, 149) + box(490, 128, 82, 'C', mint) +
    path('M 531 174 L 531 225 L 230 225 L 230 178') + arrow(230, 200, 230, 178) + text(383, 257, 'C.siguiente = A', 18)),

  'm04-eleccion-memoria': visual('La posición física explica el acceso por índice', 'Esquema conceptual: un arreglo de enteros usa posiciones contiguas y puede calcular la casilla i. Los nodos de una lista pueden estar separados y localizar el tercero exige seguir dos enlaces desde la cabeza.',
    text(29, 27, 'Arreglo: calcular la casilla', 19, ink, 'start') + row(60, 45, [10, 20, 30], 133, { 2: mint }) +
    text(124, 111, 'base', 16) + text(257, 111, 'base + 1·s', 16) + text(390, 111, 'base + 2·s', 16) + text(566, 74, 'a[2] → Θ(1)', 20) +
    text(29, 157, 'Lista: seguir referencias', 19, ink, 'start') + box(60, 176, 100, '10') + arrow(166, 197, 257, 197) + box(265, 176, 100, '20') + arrow(373, 197, 464, 197) + box(473, 176, 100, '30', mint) +
    text(110, 243, 'cabeza', 16) + text(316, 243, '1 enlace', 16) + text(522, 243, '2 enlaces', 16) + text(360, 276, 'Esquema conceptual; s representa el tamaño de una casilla.', 16)),

  'm05-pilas': visual('La cima sale antes que los elementos anteriores', 'Tras push de 4 y push de 9, la cima es 9. pop devuelve 9 y deja 4. Un nuevo push de 2 coloca 2 sobre 4: la pila aplica el orden LIFO.',
    text(146, 29, 'push(4); push(9)', 18) + box(97, 91, 98, 9, accent) + box(97, 137, 98, 4, mint) + text(146, 75, 'cima', 17) +
    arrow(211, 114, 290, 114) + text(251, 91, 'pop → 9', 17) + text(360, 29, 'Queda 4', 18) + box(311, 137, 98, 4, mint) +
    arrow(425, 114, 504, 114) + text(465, 91, 'push(2)', 17) + box(525, 91, 98, 2, accent) + box(525, 137, 98, 4, mint) + text(574, 75, 'cima', 17) +
    text(360, 242, 'Último en entrar, primero en salir.', 22)),

  'm05-colas': visual('El orden lógico puede cruzar el final del arreglo', 'En una cola circular de capacidad cinco, frente vale 3 y el próximo índice de inserción vale 1. Los elementos se leen desde los índices 3, 4 y 0: 40, 50 y 60, en ese orden FIFO.',
    row(85, 60, [60, '·', '·', 40, 50], 111, { 0: mint, 3: accent, 4: mint }, true) +
    text(140, 33, 'último', 17) + text(251, 33, 'próximo = 1', 17) + text(473, 33, 'frente = 3', 17) +
    path('M 584 141 L 584 171 L 140 171 L 140 139') + arrow(140, 156, 140, 139) + text(361, 199, 'Después del índice 4 vuelve el 0.', 18) +
    box(183, 222, 355, 'Orden de salida: 40 → 50 → 60', mint, 20)),

  'm05-deques': visual('Una deque permite operar en ambos extremos', 'Partiendo de A, B, C, agregar X al frente y retirar C del final produce X, A, B. Las inserciones y extracciones están disponibles tanto al frente como al final.',
    text(360, 31, 'Estado inicial', 20) + row(206, 54, ['A', 'B', 'C'], 104, { 0: mint, 1: mint, 2: mint }) +
    arrow(60, 75, 196, 75) + text(117, 117, 'agregarFrente(X)', 17) + arrow(527, 75, 660, 75) + text(605, 117, 'retirarFinal() → C', 17) +
    row(206, 169, ['X', 'A', 'B'], 104, { 0: accent, 1: mint, 2: mint }) + text(360, 250, 'También: retirarFrente y agregarFinal.', 19)),

  'm05-notaciones': visual('Las notaciones son recorridos del mismo árbol', 'El árbol tiene resta en la raíz, 8 a la izquierda y multiplicación de 3 por 2 a la derecha. Infija: 8 menos 3 por 2. Prefija: menos 8 por 3 2. Postfija: 8 3 2 por menos. El valor es 2.',
    tree([[165, 50, '−'], [88, 126, 8], [242, 126, '×'], [198, 214, 3], [286, 214, 2]], [[0, 1], [0, 2], [2, 3], [2, 4]]) +
    text(396, 56, 'Infija', 18, ink, 'start') + text(640, 56, '8 − 3 × 2', 21, ink, 'end') +
    text(396, 118, 'Prefija', 18, ink, 'start') + text(640, 118, '− 8 × 3 2', 21, ink, 'end') +
    text(396, 180, 'Postfija', 18, ink, 'start') + text(640, 180, '8 3 2 × −', 21, ink, 'end') + box(398, 216, 242, 'Resultado: 2', mint)),

  'm05-expresiones': visual('La pila conserva el orden de los operandos', 'Al evaluar la postfija 8, 3, menos, 2, por, se extrae primero 3 como operando derecho y luego 8 como izquierdo. La resta deja 5, después se apila 2 y el producto devuelve 10.',
    text(360, 29, '8  3  −  2  ×', 25, ink, 'middle', 700) +
    box(76, 91, 104, 3, accent) + box(76, 137, 104, 8, mint) + text(128, 208, '8 − 3', 20) +
    arrow(196, 137, 254, 137) + box(271, 137, 104, 5, mint) + text(323, 208, 'resultado parcial', 17) +
    arrow(388, 137, 446, 137) + box(463, 91, 104, 2, accent) + box(463, 137, 104, 5, mint) + text(515, 208, '5 × 2', 20) +
    arrow(581, 137, 617, 137) + box(628, 115, 70, 10, mint) + text(360, 262, 'Primero sale el derecho; la operación sigue siendo izquierdo − derecho.', 17)),

  'm06-modelo': visual('La profundidad cuenta aristas desde la raíz', 'A es la raíz y tiene tres hijos: B, C y D. B tiene hijos E y F. Las profundidades son 0, 1 y 2; la altura del árbol, medida en aristas, es 2. B, C y D son hermanos.',
    tree([[280, 40, 'A'], [150, 125, 'B'], [280, 125, 'C'], [410, 125, 'D'], [95, 210, 'E'], [205, 210, 'F']], [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5]], { 0: accent }) +
    text(579, 46, 'Profundidad 0', 18) + text(579, 131, 'Profundidad 1', 18) + text(579, 216, 'Profundidad 2', 18) +
    text(273, 269, 'Árbol general: A tiene tres hijos · altura = 2', 18)),

  'm06-dfs': visual('Una forma, tres momentos para visitar', 'Árbol con raíz 8, hijo izquierdo 3 con hijos 1 y 6, e hijo derecho 10. Preorden: 8, 3, 1, 6, 10. Inorden: 1, 3, 6, 8, 10. Postorden: 1, 6, 3, 10, 8.',
    tree([[167, 51, 8], [90, 128, 3], [244, 128, 10], [46, 216, 1], [134, 216, 6]], [[0, 1], [0, 2], [1, 3], [1, 4]], { 0: accent }) +
    text(356, 37, 'PRE · raíz → izquierda → derecha', 17, ink, 'start') + text(356, 70, '8, 3, 1, 6, 10', 24, green, 'start', 700) +
    text(356, 120, 'IN · izquierda → raíz → derecha', 17, ink, 'start') + text(356, 153, '1, 3, 6, 8, 10', 24, green, 'start', 700) +
    text(356, 203, 'POST · izquierda → derecha → raíz', 17, ink, 'start') + text(356, 236, '1, 6, 3, 10, 8', 24, green, 'start', 700)),

  'm06-bfs': visual('La cola conserva los nodos del próximo nivel', 'En el árbol de raíz 8 con hijos 3 y 10, y con 1 y 6 bajo 3, BFS visita 8, 3, 10, 1 y 6. Después de extraer 8 la cola contiene 3, 10; después de extraer 3 contiene 10, 1, 6.',
    tree([[167, 51, 8], [90, 128, 3], [244, 128, 10], [46, 216, 1], [134, 216, 6]], [[0, 1], [0, 2], [1, 3], [1, 4]]) +
    text(356, 33, 'Cola · frente a la izquierda', 19, ink, 'start') + text(356, 75, 'Inicial', 17, ink, 'start') + row(505, 51, [8], 53, { 0: accent }) +
    text(356, 132, 'Sale 8', 17, ink, 'start') + row(505, 108, [3, 10], 53, { 0: accent }) +
    text(356, 189, 'Sale 3', 17, ink, 'start') + row(505, 165, [10, 1, 6], 53, { 0: accent }) +
    text(356, 251, 'Salida: 8 → 3 → 10 → 1 → 6', 19, ink, 'start')),

  'm06-bst': visual('Cada comparación elimina un subárbol', 'Buscar 9 en el ABB con raíz 8 sigue 8, luego 10 y después 9. Al ser mayor que 8 se descarta todo el subárbol izquierdo; al ser menor que 10 se sigue a su izquierda. La política de conjunto ignora insertar otra vez 8.',
    tree([[230, 44, 8], [120, 125, 3], [340, 125, 10], [65, 214, 1], [175, 214, 6], [285, 214, 9], [395, 214, 14]], [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]], { 0: accent, 2: accent, 5: accent }) +
    text(574, 48, 'Buscar 9', 22, ink, 'middle', 700) + text(574, 101, '9 > 8 → derecha', 18) + text(574, 147, '9 < 10 → izquierda', 18) + text(574, 193, '9 = 9 → encontrado', 18) +
    text(360, 272, 'Semántica de conjunto: insertar otra vez 8 no crea otro nodo.', 17)),

  'm06-borrar': visual('El sucesor reemplaza una clave con dos hijos', 'Para borrar 8 de un ABB con izquierda 3 y derecha 10 que tiene hijos 9 y 14, se toma el mínimo derecho, 9. Se copia 9 a la raíz y se elimina su aparición antigua, conservando las otras claves.',
    text(175, 26, 'Borrar 8', 20) + tree([[175, 65, 8], [87, 143, 3], [263, 143, 10], [220, 224, 9], [307, 224, 14]], [[0, 1], [0, 2], [2, 3], [2, 4]], { 0: accent, 3: accent }) +
    arrow(345, 133, 397, 133) + text(370, 105, '9', 20) +
    text(548, 26, 'Quitar la copia antigua', 20) + tree([[548, 65, 9], [460, 143, 3], [636, 143, 10], [678, 224, 14]], [[0, 1], [0, 2], [2, 3]], { 0: accent }) +
    text(360, 273, 'Sucesor = mínimo del subárbol derecho.', 18)),

  'm07-avl': visual('La misma colección puede tener distinta altura', 'Insertar 10, 20 y 30 en un ABB forma una cadena de altura 2 y balance de raíz menos 2. Un AVL rota para quedar con raíz 20 e hijos 10 y 30, altura 1 y balance cero.',
    text(157, 28, 'ABB: altura 2', 20) + tree([[83, 71, 10], [157, 141, 20], [231, 211, 30]], [[0, 1], [1, 2]], { 0: accent }) +
    arrow(305, 138, 396, 138) + text(350, 109, 'rotar', 18) +
    text(555, 28, 'AVL: altura 1', 20) + tree([[555, 95, 20], [479, 183, 10], [631, 183, 30]], [[0, 1], [0, 2]], { 0: mint }) +
    text(157, 267, 'balance(10) = −2', 18) + text(555, 267, 'balance(20) = 0', 18)),

  'm07-rotaciones': visual('Cuatro desequilibrios, una misma forma equilibrada', 'Para claves 10, 20 y 30, los casos LL y RR necesitan una rotación derecha o izquierda. Los casos LR y RL necesitan dos rotaciones, izquierda y derecha, o derecha e izquierda. Todos terminan con raíz 20 e hijos 10 y 30.',
    [
      { x: 90, name: 'LL', points: [[119, 58, 30], [90, 99, 20], [61, 140, 10]] as [number, number, number][], step: 'derecha' },
      { x: 270, name: 'RR', points: [[241, 58, 10], [270, 99, 20], [299, 140, 30]] as [number, number, number][], step: 'izquierda' },
      { x: 450, name: 'LR', points: [[479, 58, 30], [421, 99, 10], [450, 140, 20]] as [number, number, number][], step: 'izq → der' },
      { x: 630, name: 'RL', points: [[601, 58, 10], [659, 99, 30], [630, 140, 20]] as [number, number, number][], step: 'der → izq' },
    ].map(c => text(c.x, 23, c.name, 20, green, 'middle', 700) + tree(c.points, [[0, 1], [1, 2]], { 0: accent }, 18) + text(c.x, 182, c.step, 17) + tree([[c.x, 213, 20], [c.x - 37, 257, 10], [c.x + 37, 257, 30]], [[0, 1], [0, 2]], {}, 17)).join('')),

  'm07-eliminacion-rojo-negro': visual('Borrar también puede exigir una rotación', 'En el AVL con raíz 4, izquierda 2 con hijos 1 y 3, y derecha 5, borrar 5 deja balance 2 en la raíz. Una rotación derecha produce raíz 2, hijo izquierdo 1 e hijo derecho 4 con hijo izquierdo 3.',
    text(183, 27, 'Después de quitar 5', 20) + tree([[183, 68, 4], [100, 147, 2], [58, 227, 1], [142, 227, 3]], [[0, 1], [1, 2], [1, 3]], { 0: accent }) +
    path('M 204 83 L 253 132', accent, 2) + text(276, 153, '5 fuera', 17) +
    arrow(328, 142, 393, 142) + text(360, 109, 'der.', 17) +
    tree([[551, 68, 2], [468, 147, 1], [634, 147, 4], [592, 227, 3]], [[0, 1], [0, 2], [2, 3]]) +
    text(360, 273, 'Al volver del borrado se revisa el balance de cada ancestro.', 17)),

  'm07-heaps': visual('El heap une orden parcial y forma completa', 'Un min-heap con arreglo 2, 5, 4, 9, 7, 8 tiene raíz 2. Cada padre es menor o igual que sus hijos, pero los hermanos no necesitan ordenarse entre sí. El hijo izquierdo del índice i está en 2i más 1.',
    tree([[205, 42, 2], [112, 114, 5], [298, 114, 4], [65, 185, 9], [159, 185, 7], [251, 185, 8]], [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]], { 0: accent }, 20) +
    text(535, 54, 'Mínimo en la raíz', 21) + text(535, 105, 'izq(i) = 2i + 1', 20) + text(535, 149, 'der(i) = 2i + 2', 20) + text(535, 193, '5 y 4 no están ordenados.', 17) +
    row(133, 221, [2, 5, 4, 9, 7, 8], 76, { 0: accent }) + text(360, 276, 'Arreglo por niveles: posiciones consecutivas, sin huecos.', 16)),

  'm07-heapsort': visual('Cada extracción fija un máximo al final', 'Con max-heap 9, 7, 8, 2, 5, 4, intercambiar la raíz con el último y hundir produce 8, 7, 4, 2, 5 seguido del 9 ya ordenado. La extracción siguiente produce 7, 5, 4, 2 seguido de 8 y 9.',
    text(38, 29, 'Max-heap', 18, ink, 'start') + row(187, 7, [9, 7, 8, 2, 5, 4], 78, { 0: accent }) +
    text(38, 116, 'Extraer 9', 18, ink, 'start') + row(187, 94, [8, 7, 4, 2, 5, 9], 78, { 0: accent, 5: mint }) +
    text(38, 203, 'Extraer 8', 18, ink, 'start') + row(187, 181, [7, 5, 4, 2, 8, 9], 78, { 0: accent, 4: mint, 5: mint }) +
    text(360, 266, 'Zona crema: heap pendiente · zona verde: sufijo ordenado', 18)),

  'm08-hash': visual('Distintas claves pueden llegar a la misma casilla', 'Las cadenas Aa y BB tienen ambas hashCode de Java igual a 2112. Al comprimir con floorMod de capacidad 7, ambas llegan al índice 5. Son claves diferentes y la tabla debe resolver esa colisión.',
    box(57, 27, 140, '"Aa"', mint) + box(57, 104, 140, '"BB"', accent) + arrow(205, 48, 295, 87) + arrow(205, 125, 295, 87) +
    box(305, 66, 150, 'hash = 2112') + arrow(463, 87, 526, 87) + box(537, 66, 128, 'índice 5', mint) +
    text(482, 150, 'floorMod(2112, 7) = 5', 19) + row(81, 185, ['·', '·', '·', '·', '·', 'Aa/BB', '·'], 80, { 5: accent }, true) +
    text(360, 275, 'Mismo hash no implica claves iguales.', 18)),

  'm08-encadenamiento': visual('La casilla guarda una cadena de asociaciones', 'Con capacidad cinco y hash de enteros por módulo, las claves 7, 12 y 17 comparten índice 2. El encadenamiento mantiene las tres; buscar 12 compara primero 7 y luego 12.',
    [0, 1, 2, 3, 4].map((v, i) => box(68, 17 + i * 47, 75, v, v === 2 ? accent : cream)).join('') +
    arrow(151, 132, 223, 132) + box(233, 111, 97, '7 → A', mint) + arrow(337, 132, 378, 132) + box(388, 111, 97, '12 → B', accent) + arrow(492, 132, 533, 132) + box(543, 111, 97, '17 → C', mint) +
    text(433, 49, '7 % 5 = 12 % 5 = 17 % 5 = 2', 19) + text(433, 204, 'Buscar 12: dos claves comparadas.', 19) + text(433, 246, 'Actualizar 12 cambia B; no agrega otro nodo.', 17)),

  'm08-sondeos': visual('La marca de borrado conserva el camino de búsqueda', 'Con capacidad siete, las claves 0, 7 y 14 se ubican por sondeo lineal en 0, 1 y 2. Borrar 7 deja una marca en el índice 1. Buscar 14 debe atravesar esa marca y continuar hasta el índice 2.',
    text(360, 28, 'Insertar 0, 7, 14 · después borrar 7', 20) + row(70, 52, [0, '†', 14, '·', '·', '·', '·'], 83, { 1: accent, 2: mint }, true) +
    arrow(110, 159, 192, 159) + arrow(193, 159, 275, 159) + text(193, 193, 'buscar 14: 0 → 1 → 2', 19) +
    box(373, 151, 281, '† = borrada; seguir sondeando', accent, 17) + text(360, 251, 'Solo una casilla nunca usada permite detener esta búsqueda.', 18)),

  'm08-rehash': visual('Rehashing recalcula cada posición', 'Al cambiar capacidad de cuatro a ocho, la clave 2 sigue en la casilla 2, pero 6 cambia de 2 a 6. Copiar las casillas sin volver a calcular el índice conservaría una ubicación incorrecta.',
    text(37, 26, 'Capacidad 4 · h(k) = floorMod(k, 4)', 19, ink, 'start') + row(72, 44, ['·', '·', '2, 6', '·'], 101, { 2: accent }, true) +
    arrow(320, 121, 258, 181) + arrow(330, 121, 568, 181) + text(447, 141, 'recalcular índices', 17) +
    row(72, 191, ['·', '·', 2, '·', '·', '·', 6, '·'], 75, { 2: mint, 6: mint }, true) +
    text(360, 277, 'Capacidad 8: h(2) = 2 · h(6) = 6 · cantidad = 2', 17)),

  'm08-map-set': visual('Set guarda pertenencia; Map conserva asociaciones', 'Para la entrada 4, 2, 4, 3, 2, 4, un Set contiene tres claves: 2, 3 y 4. Un Map de frecuencias asocia 4 con 3, 2 con 2 y 3 con 1. El orden mostrado es ilustrativo.',
    row(112, 18, [4, 2, 4, 3, 2, 4], 83) + arrow(242, 75, 204, 115) + arrow(476, 75, 514, 115) +
    rect(52, 130, 295, 112, mint) + text(199, 161, 'Set · pertenencia', 21) + text(199, 211, '{ 2, 3, 4 }', 25) +
    rect(375, 130, 295, 112, cream) + text(522, 161, 'Map · frecuencias', 21) + text(522, 207, '4 → 3    2 → 2    3 → 1', 20) +
    text(360, 273, 'El orden de las claves depende de la implementación.', 17)),
};
