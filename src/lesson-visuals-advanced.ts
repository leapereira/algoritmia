/** Concept diagrams for the second half of the course. All examples are self contained. */
type Visual = { title: string; description: string; svg: string };
const ink = '#244c43', green = '#397a60', mint = '#d9ebc8', cream = '#f6f4e9', accent = '#d99b61';
const esc = (value: string | number) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const text = (x: number, y: number, value: string | number, size = 18, color = ink, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="${color}">${esc(value)}</text>`;
const line = (x1: number, y1: number, x2: number, y2: number, color = green, dash = false, width = 3) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash ? ' stroke-dasharray="7 6"' : ''}/>`;
function arrow(x1: number, y1: number, x2: number, y2: number, color = green, dash = false): string {
  const angle = Math.atan2(y2 - y1, x2 - x1), length = 9, spread = .55;
  return line(x1, y1, x2, y2, color, dash) + `<polygon points="${x2},${y2} ${x2 - length * Math.cos(angle - spread)},${y2 - length * Math.sin(angle - spread)} ${x2 - length * Math.cos(angle + spread)},${y2 - length * Math.sin(angle + spread)}" fill="${color}"/>`;
}
const box = (x: number, y: number, w: number, h: number, label: string | number, fill = cream, color = ink, size = 18) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${green}" stroke-width="2"/>${text(x + w / 2, y + h / 2 + size / 3, label, size, color)}`;
const node = (x: number, y: number, label: string | number, fill = cream, terminal = false) => `<circle cx="${x}" cy="${y}" r="23" fill="${fill}" stroke="${green}" stroke-width="2"/>${terminal ? `<circle cx="${x}" cy="${y}" r="18" fill="none" stroke="${green}" stroke-width="2"/>` : ''}${text(x, y + 6, label)}`;
const note = (value: string, y = 252) => text(360, y, value, 17);
function cells(values: (string | number)[], x: number, y: number, width = 58, selected: number[] = [], labels = false): string {
  return values.map((value, i) => box(x + i * width, y, width - 4, 42, value, selected.includes(i) ? mint : cream) + (labels ? text(x + i * width + (width - 4) / 2, y + 64, i, 16) : '')).join('');
}
function figure(title: string, description: string, body: string): Visual {
  return { title, description, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 280" role="img" aria-label="${esc(description)}"><g font-family="system-ui, sans-serif" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>` };
}
const edge = (x1: number, y1: number, x2: number, y2: number, label: string | number = '', chosen = false) => line(x1, y1, x2, y2, chosen ? green : accent, false, chosen ? 5 : 2) + (label === '' ? '' : text((x1 + x2) / 2, (y1 + y2) / 2 - 9, label, 17));
const interval = (name: string, start: number, end: number, y: number, chosen = true) => text(36, y + 7, name, 17) + `<rect x="${100 + start * 46}" y="${y - 12}" width="${(end - start) * 46}" height="27" rx="6" fill="${chosen ? mint : cream}" stroke="${chosen ? green : accent}" stroke-width="2"/>` + text(100 + start * 46, y - 20, start, 16) + text(100 + end * 46, y - 20, end, 16);
function table(values: (string | number)[][], x: number, y: number, cw = 52, ch = 36, highlights: string[] = []): string {
  return values.map((row, r) => row.map((v, c) => `<rect x="${x + c * cw}" y="${y + r * ch}" width="${cw}" height="${ch}" fill="${highlights.includes(`${r},${c}`) ? mint : cream}" stroke="${green}"/>${text(x + c * cw + cw / 2, y + r * ch + ch / 2 + 6, v, 17)}`).join('')).join('');
}

export const advancedVisuals: Record<string, Visual> = {
  'm09-nodos': figure('Un prefijo compartido, dos palabras', 'Trie con camino común c, a, s y bifurcación hacia a y o. Los nodos finales de casa y caso son terminales; cas es solo un prefijo.',
    text(360, 32, 'casa y caso comparten el camino «cas»', 20) +
    arrow(83, 140, 147, 140) + arrow(193, 140, 257, 140) + arrow(303, 140, 367, 140) + arrow(413, 129, 487, 86) + arrow(413, 151, 487, 194) +
    node(60, 140, '∅') + node(170, 140, 'c', mint) + node(280, 140, 'a', mint) + node(390, 140, 's', mint) + node(510, 75, 'a', mint, true) + node(510, 205, 'o', mint, true) + text(604, 81, 'casa') + text(604, 211, 'caso') + note('Doble círculo = palabra completa; un camino también puede ser solo prefijo.')),

  'm09-operaciones': figure('Insertar una palabra sin crear nodos', 'Tras insertar ante, insertar an solo marca como terminal el nodo n. La búsqueda exacta de an pasa a true y ante sigue presente.',
    text(360, 32, 'Ya existe «ante»; ahora insertamos «an»', 20) + arrow(118, 115, 202, 115) + arrow(248, 115, 332, 115) + arrow(378, 115, 462, 115) + arrow(508, 115, 592, 115) +
    node(95, 115, '∅') + node(225, 115, 'a') + node(355, 115, 'n', mint, true) + node(485, 115, 't') + node(615, 115, 'e', mint, true) + arrow(355, 192, 355, 144, accent) + text(355, 215, 'Nueva marca terminal', 18) + note('Dos palabras, el mismo conjunto de nodos.')),

  'm09-borrado': figure('Podar solo la rama que quedó vacía', 'Al borrar antes se elimina el nodo s final, pero se conserva ante y también an porque sus nodos siguen siendo terminales.',
    text(360, 32, 'Borrar «antes» conserva «an» y «ante»', 20) +
    arrow(106, 125, 174, 125) + arrow(220, 125, 288, 125) + arrow(334, 125, 402, 125) + arrow(448, 125, 516, 125) + arrow(562, 125, 630, 125, accent, true) +
    node(83, 125, '∅') + node(197, 125, 'a') + node(311, 125, 'n', mint, true) + node(425, 125, 't') + node(539, 125, 'e', mint, true) + node(653, 125, 's', cream) + line(633, 105, 673, 145, accent) + line(673, 105, 633, 145, accent) + text(539, 189, 'Conservar', 17) + text(653, 189, 'Podar', 17) + note('Solo se desconecta un nodo sin hijos y sin marca terminal.')),

  'm09-radix': figure('Comprimir y dividir por el prefijo común', 'Una arista casa se divide al insertar caso: la raíz enlaza mediante cas a una bifurcación con etiquetas a y o, ambas terminales.',
    text(360, 32, 'Insertar «caso» divide la etiqueta «casa»', 20) + arrow(103, 140, 326, 140) + text(215, 126, 'cas') + arrow(373, 127, 556, 82) + arrow(373, 153, 556, 198) + text(468, 87, 'a') + text(468, 198, 'o') +
    node(80, 140, '∅') + node(350, 140, '•', mint) + node(580, 75, '✓', mint, true) + node(580, 205, '✓', mint, true) + note('El prefijo «ca» termina dentro de una arista y sigue siendo consultable.')),

  'm09-autocompletar': figure('Limitar el recorrido a las sugerencias necesarias', 'El prefijo an lleva a las palabras an, ante y antes. Con límite dos, un DFS lexicográfico devuelve an y ante sin necesitar emitir antes.',
    text(360, 32, 'sugerir("an", 2)', 20) + box(40, 95, 105, 48, 'an', mint) + arrow(145, 119, 206, 119) + node(230, 119, 't') + arrow(253, 119, 316, 119) + node(340, 119, 'e', mint, true) + arrow(363, 119, 426, 119, accent, true) + node(450, 119, 's', cream, true) +
    box(532, 78, 145, 42, '1. an', mint) + box(532, 135, 145, 42, '2. ante', mint) + text(450, 178, 'antes: no se emite', 16) + note('Se visita el terminal antes de explorar sus extensiones.')),

  'm10-busquedas': figure('Búsqueda binaria: descartar un intervalo', 'En el arreglo ordenado 2,5,8,12,19 se busca 12. El primer medio es índice 2, valor 8; se descarta hasta él y el siguiente medio es índice 3, valor 12.',
    text(360, 32, 'Objetivo: 12 en un arreglo ordenado', 20) + cells([2, 5, 8, 12, 19], 205, 74, 62, [3], true) + arrow(360, 174, 360, 121, accent) + text(213, 200, '1. medio = 2 → 8 < 12', 18) + text(503, 200, '2. medio = 3 → 12', 18) + note('El orden justifica conservar únicamente los índices 3…4.')),

  'm10-simples': figure('Insertion Sort mantiene un prefijo ordenado', 'Insertion Sort transforma 3,1,2 en 1,3,2 al insertar 1, y luego en 1,2,3 al insertar 2. El prefijo verde ya está ordenado.',
    text(360, 30, 'Insertar el siguiente valor en el prefijo', 20) + cells([3, 1, 2], 49, 104, 58, [0]) + arrow(232, 125, 274, 125) + cells([1, 3, 2], 283, 104, 58, [0, 1]) + arrow(466, 125, 508, 125) + cells([1, 2, 3], 517, 104, 58, [0, 1, 2]) + text(133, 189, 'Inicio') + text(367, 189, 'Insertar 1') + text(601, 189, 'Insertar 2') + note('Se desplazan los mayores; los valores del arreglo se conservan.')),

  'm10-nlogn': figure('Merge Sort divide y luego mezcla', 'Merge Sort divide 4,1,3,2 en 4,1 y 3,2. Después de ordenarlas, mezcla 1,4 con 2,3 para obtener 1,2,3,4.',
    cells([4, 1, 3, 2], 250, 28, 56) + arrow(293, 74, 211, 104) + arrow(429, 74, 511, 104) + cells([1, 4], 145, 108, 56, [0, 1]) + cells([2, 3], 465, 108, 56, [0, 1]) + arrow(211, 153, 293, 189) + arrow(511, 153, 429, 189) + cells([1, 2, 3, 4], 250, 193, 56, [0, 1, 2, 3]) + text(360, 156, 'Mezclar mínimos', 17) + note('Cada nivel mezcla Θ(n) elementos; hay Θ(log n) niveles.', 265)),

  'm10-counting-radix': figure('Counting Sort cuenta por valor desplazado', 'Para menos 2,1,menos 2,0 el mínimo es menos 2. Los índices valor menos mínimo son 0,3,0,2 y las frecuencias de menos 2,menos 1,0,1 son 2,0,1,1.',
    text(360, 28, 'Entrada: [−2, 1, −2, 0] · mínimo = −2', 20) + text(109, 92, 'Valor', 17) + cells(['−2', '−1', '0', '1'], 245, 62, 64) + text(109, 150, 'Frecuencia', 17) + cells([2, 0, 1, 1], 245, 120, 64, [0, 2, 3]) + arrow(532, 113, 620, 113) + text(625, 145, 'Contar', 17) + text(360, 218, 'Salida: [−2, −2, 0, 1]', 20) + note('Índice del contador = valor − mínimo; el rango tiene cuatro posiciones.')),

  'm10-seleccion-medicion': figure('La estabilidad conserva el orden de los empates', 'Los registros 2A,1B,2C se ordenan como 1B,2A,2C. A y C tienen la misma clave 2 y conservan su orden de entrada.',
    text(360, 31, 'Ordenar por clave numérica', 20) + cells(['2 · A', '1 · B', '2 · C'], 65, 102, 87, [0, 2]) + arrow(336, 123, 381, 123) + cells(['1 · B', '2 · A', '2 · C'], 395, 102, 87, [1, 2]) + line(207, 180, 292, 180) + text(250, 211, 'A antes de C', 17) + line(527, 180, 612, 180) + text(570, 211, 'A antes de C', 17) + note('La identidad del registro permite comprobar la estabilidad de los empates.')),

  'm11-representacion': figure('Un grafo, distintas representaciones', 'Un grafo no dirigido tiene aristas A-B de peso 4, A-C de peso 2 y B-C de peso 1. Su lista de adyacencia guarda ambas direcciones.',
    edge(100, 65, 220, 65, 4) + edge(100, 65, 160, 193, 2) + edge(220, 65, 160, 193, 1) + node(100, 65, 'A') + node(220, 65, 'B') + node(160, 193, 'C') + arrow(270, 130, 330, 130) + box(362, 48, 309, 44, 'A → (B, 4), (C, 2)', mint) + box(362, 107, 309, 44, 'B → (A, 4), (C, 1)') + box(362, 166, 309, 44, 'C → (A, 2), (B, 1)') + note('En un grafo no dirigido, cada arista aparece desde sus dos extremos.')),

  'm11-recorridos': figure('BFS descubre por capas de distancia', 'BFS desde A descubre B y C a distancia uno, y D a distancia dos. Un vértice E aislado requiere otro inicio para recorrer todo el grafo.',
    text(360, 29, 'Distancia en cantidad de aristas', 20) + edge(100, 130, 270, 75) + edge(100, 130, 270, 190) + edge(270, 75, 450, 130) + edge(270, 190, 450, 130) + node(100, 130, 'A', mint) + node(270, 75, 'B', mint) + node(270, 190, 'C', mint) + node(450, 130, 'D', mint) + node(625, 130, 'E') + text(100, 213, 'Capa 0', 17) + text(270, 243, 'Capa 1', 17) + text(450, 213, 'Capa 2', 17) + text(625, 213, 'Aislado', 17)),

  'm11-topologico': figure('Las dependencias definen un orden parcial', 'El DAG tiene A hacia B y C, y B y C hacia D. Kahn puede emitir A,B,C,D o A,C,B,D; D solo se emite después de B y C.',
    text(360, 30, 'A debe preceder a B y C; ambos preceden a D', 20) + arrow(123, 126, 267, 76) + arrow(123, 144, 267, 194) + arrow(313, 76, 457, 126) + arrow(313, 194, 457, 144) + node(100, 135, 'A', mint) + node(290, 70, 'B') + node(290, 200, 'C') + node(480, 135, 'D') + box(552, 73, 120, 42, 'A B C D', mint) + box(552, 160, 120, 42, 'A C B D', mint) + note('Ambos órdenes son válidos: B y C no dependen entre sí.')),

  'm11-dijkstra': figure('Relajar una ruta puede mejorar una distancia', 'En un grafo de pesos no negativos, A-C cuesta 1, C-B cuesta 2, A-B cuesta 5 y B-D cuesta 1. La ruta A-C-B-D cuesta 4, mejor que A-B-D que cuesta 6.',
    text(360, 29, 'Desde A: distancias 0 → 1 → 3 → 4', 20) + edge(80, 135, 245, 75, 1, true) + edge(245, 75, 420, 135, 2, true) + edge(80, 135, 420, 135, 5) + edge(420, 135, 620, 135, 1, true) + node(80, 135, 'A', mint) + node(245, 75, 'C', mint) + node(420, 135, 'B', mint) + node(620, 135, 'D', mint) + text(420, 193, 'B: 5 → 3', 18) + text(620, 193, 'D: 4', 18) + note('A → C → B → D cuesta 1 + 2 + 1 = 4.')),

  'm11-bellman': figure('Una arista negativa puede mejorar una ruta', 'Las aristas dirigidas A-B de peso 4, A-C de peso 5 y B-C de peso menos 3 dan distancia mínima A-C igual a 1 mediante B. No hay ciclos en este ejemplo.',
    text(360, 30, 'Bellman–Ford admite pesos negativos', 20) + arrow(123, 115, 317, 115) + text(220, 97, '4') + arrow(363, 115, 557, 115) + text(460, 97, '−3') + `<path d="M 100 140 Q 330 265 580 140" fill="none" stroke="${accent}" stroke-width="2"/>` + arrow(565, 148, 580, 140, accent) + text(340, 205, 'Arista directa: 5', 17) + node(100, 115, 'A', mint) + node(340, 115, 'B', mint) + node(580, 115, 'C', mint) + note('La relajación B → C cambia dist[C] de 5 a 4 − 3 = 1.')),

  'm11-kruskal': figure('Kruskal acepta aristas que unen componentes', 'Un triángulo tiene aristas A-B peso 1, B-C peso 2 y A-C peso 3. Kruskal acepta 1 y 2, y rechaza 3 porque uniría vértices ya conectados.',
    text(360, 28, 'Orden de pesos: 1, 2, 3', 20) + edge(100, 80, 310, 80, 1, true) + edge(310, 80, 205, 205, 2, true) + edge(100, 80, 205, 205, 3) + node(100, 80, 'A', mint) + node(310, 80, 'B', mint) + node(205, 205, 'C', mint) + box(422, 68, 242, 43, 'Aceptar A—B: costo 1', mint) + box(422, 126, 242, 43, 'Aceptar B—C: costo 3', mint) + box(422, 184, 242, 43, 'Rechazar A—C: ciclo') + note('Union–Find comprueba si los extremos ya pertenecen a la misma componente.', 266)),

  'm11-prim-rutas': figure('Prim elige la arista que cruza el corte', 'Con A ya en el árbol, las candidatas son A-B de peso 4 y A-C de peso 2. Prim agrega C, luego B por C-B de peso 1. El árbol cuesta 3.',
    text(360, 30, 'Árbol actual: {A} · candidatas que salen de él', 20) + edge(100, 75, 360, 75, 4) + edge(100, 75, 230, 205, 2, true) + edge(360, 75, 230, 205, 1) + node(100, 75, 'A', mint) + node(360, 75, 'B') + node(230, 205, 'C', mint) + box(470, 68, 210, 43, '1. Elegir A—C: 2', mint) + box(470, 134, 210, 43, '2. Elegir C—B: 1', mint) + text(570, 213, 'Árbol mínimo: 3', 18) + note('Minimizar el árbol completo es un objetivo distinto de hallar rutas mínimas.')),

  'm12-estrategia': figure('Una elección local requiere una prueba global', 'Con monedas 1,3,4 y monto 6, la regla de tomar la mayor produce 4+1+1, tres monedas. La alternativa 3+3 usa dos y refuta su optimalidad.',
    text(360, 30, 'Monedas {1, 3, 4} · objetivo 6', 20) + text(150, 83, 'Mayor primero', 18) + cells([4, 1, 1], 65, 107, 61) + text(150, 186, '3 monedas', 19) + text(530, 83, 'Óptimo', 18) + cells([3, 3], 471, 107, 61, [0, 1]) + text(530, 186, '2 monedas', 19) + note('Una solución factible puede ser peor que otra: la intuición voraz no basta.')),

  'm12-actividades': figure('Terminar antes deja más espacio para continuar', 'Los intervalos A de 0 a 3, B de 1 a 5, C de 3 a 6 y D de 6 a 8 permiten elegir A,C,D. B termina más tarde y no mejora la cantidad.',
    text(360, 26, 'Máxima cantidad de actividades compatibles', 20) + interval('A', 0, 3, 75) + interval('B', 1, 5, 120, false) + interval('C', 3, 6, 165) + interval('D', 6, 8, 210) + text(615, 127, 'A → C → D', 19) + text(615, 159, '3 actividades', 17) + note('Se permite comenzar exactamente cuando termina la actividad anterior.', 269)),

  'm12-intervalos': figure('El solapamiento determina cuántas salas hacen falta', 'Los intervalos A de 0 a 4, B de 1 a 3 y C de 2 a 5 se solapan entre 2 y 3. Hacen falta tres salas; D de 4 a 6 puede reutilizar la sala de A.',
    text(360, 27, 'Conservar todas las actividades; minimizar salas', 20) + interval('A', 0, 4, 77) + interval('B', 1, 3, 125) + interval('C', 2, 5, 173) + interval('D', 4, 6, 221) + `<rect x="192" y="48" width="46" height="152" fill="${accent}" opacity=".18"/>` + text(582, 106, 'Entre 2 y 3:', 18) + text(582, 140, '3 simultáneas', 20) + text(582, 181, 'Mínimo = 3 salas', 18) + note('D puede usar la sala de A al instante 4; los intervalos son [inicio, fin).', 270)),

  'm12-huffman': figure('Huffman combina las dos frecuencias menores', 'Con frecuencias A=5, B=2 y C=1, primero se unen B y C con peso 3, y después A y ese subárbol con peso 8. A recibe longitud 1; B y C longitud 2.',
    edge(360, 55, 185, 160, '0') + edge(360, 55, 530, 135, '1') + edge(530, 135, 455, 220, '0') + edge(530, 135, 625, 220, '1') + node(360, 55, '8', mint) + node(185, 160, 'A:5', mint, true) + node(530, 135, '3') + node(455, 220, 'B:2', mint, true) + node(625, 220, 'C:1', mint, true) + text(170, 213, 'A = 0', 18) + text(250, 254, 'Costo: 5·1 + 2·2 + 1·2 = 11 bits', 18)),

  'm12-monedas': figure('Quedarse sin cambio no demuestra imposibilidad', 'Con monedas 3 y 4 y monto 6, el voraz toma 4 y deja resto 2 que no puede completar. La representación 3+3 sí es exacta.',
    text(360, 30, 'Monedas {3, 4} · monto 6', 20) + box(62, 81, 217, 46, 'Voraz: tomar 4') + arrow(170, 130, 170, 162, accent) + box(62, 170, 217, 46, 'Resto 2: se bloquea') + box(413, 81, 245, 46, 'Alternativa: tomar 3', mint) + arrow(535, 130, 535, 162) + box(413, 170, 245, 46, 'Tomar 3: resto 0', mint) + note('El fracaso de una regla no implica que el problema carezca de solución.')),

  'm13-estado-fibonacci': figure('Un estado se calcula una sola vez', 'La tabulación de Fibonacci guarda F0=0, F1=1, F2=1, F3=2, F4=3 y F5=5. Cada nuevo estado depende de los dos anteriores.',
    text(360, 32, 'F(i) = F(i − 1) + F(i − 2)', 20) + cells([0, 1, 1, 2, 3, 5], 148, 103, 71, [3, 4, 5], true) + `<path d="M 397 99 Q 458 24 539 99" fill="none" stroke="${green}" stroke-width="3"/>` + arrow(492, 92, 529, 99) + text(360, 215, 'F(5) = 3 + 2 = 5', 20) + note('Se reutilizan resultados de la tabla en lugar de repetir llamadas recursivas.')),

  'm13-mochila': figure('La mochila 0/1 recorre capacidades hacia atrás', 'Con un único objeto de peso 2 y valor 3 y capacidad 4, recorrer 4,3,2 usa la fila anterior y da 3 como máximo, sin reutilizar el objeto.',
    text(360, 31, 'Un objeto: peso 2, valor 3 · capacidad 4', 20) + text(86, 92, 'Antes', 17) + cells([0, 0, 0, 0, 0], 205, 63, 61, [], true) + text(86, 186, 'Después', 17) + cells([0, 0, 3, 3, 3], 205, 158, 61, [2, 3, 4]) + arrow(490, 137, 355, 137) + text(596, 142, '4 → 3 → 2', 17) + note('Si se recorriera hacia adelante, el mismo objeto podría contarse dos veces.')),

  'm13-lcs': figure('LCS compara pares de prefijos', 'La tabla LCS de ABC y AC termina en 2. Las coincidencias A y C amplían la diagonal; B puede descartarse. AC no necesita ser contigua en ABC.',
    table([['', '∅', 'A', 'C'], ['∅', 0, 0, 0], ['A', 0, 1, 1], ['B', 0, 1, 1], ['C', 0, 1, 2]], 64, 43, 52, 36, ['2,2', '4,3']) + text(504, 90, 'ABC', 26) + text(504, 133, 'AC', 26) + line(482, 96, 482, 111) + line(524, 96, 524, 111) + box(399, 170, 217, 43, 'LCS = AC · longitud 2', mint) + note('Coincidir suma 1 a la diagonal; diferir toma el mejor prefijo vecino.')),

  'm13-edicion': figure('Editar es elegir la operación de menor costo', 'Transformar gato en pato cuesta una sustitución de g por p. Las letras a,t,o se conservan. Insertar y eliminar también se consideran en la recurrencia general.',
    text(360, 31, 'Distancia de Levenshtein con costo unitario', 20) + cells(['g', 'a', 't', 'o'], 96, 78, 58, [0]) + cells(['p', 'a', 't', 'o'], 396, 78, 58, [0]) + arrow(338, 100, 384, 100) + text(360, 173, 'Sustituir g → p: costo 1', 20) + box(78, 211, 170, 39, 'Eliminar + 1') + box(275, 211, 170, 39, 'Insertar + 1') + box(472, 211, 170, 39, 'Sustituir + 1', mint)),

  'm13-matrices-eleccion': figure('Contar caminos siguiendo las dependencias', 'En una grilla libre de dos filas y tres columnas, solo se avanza a derecha o abajo. Los conteos son 1,1,1 en la primera fila y 1,2,3 en la segunda: tres rutas.',
    text(360, 30, 'Cada celda suma los caminos desde arriba y desde la izquierda', 19) + table([[1, 1, 1], [1, 2, 3]], 107, 82, 70, 60, ['0,0', '1,2']) + arrow(352, 112, 428, 112) + arrow(352, 174, 428, 174) + text(554, 110, 'dp[f][c] =', 19) + text(554, 150, 'dp[f−1][c]', 19) + text(554, 189, '+ dp[f][c−1]', 19) + note('El orden por filas respeta las dependencias; la respuesta es 3.')),

  'm14-espacio': figure('Combinaciones: el orden no crea una respuesta nueva', 'Al elegir dos posiciones entre 0,1,2 se usan índices crecientes. Las hojas son 0,1; 0,2; y 1,2. No se genera 1,0 como otra combinación.',
    arrow(360, 60, 170, 111) + arrow(360, 60, 530, 111) + arrow(170, 145, 95, 194) + arrow(170, 145, 265, 194) + arrow(530, 145, 530, 194) + box(309, 19, 102, 42, '[]') + box(119, 108, 102, 42, '[0]', mint) + box(479, 108, 102, 42, '[1]', mint) + box(44, 193, 102, 42, '[0,1]', mint) + box(214, 193, 102, 42, '[0,2]', mint) + box(479, 193, 102, 42, '[1,2]', mint) + note('El siguiente índice siempre supera al último elegido: exactamente 3 equipos.', 270)),

  'm14-permutaciones': figure('Evitar elecciones hermanas equivalentes', 'Para permutar 1,1,2 solo se elige una copia del 1 en el primer nivel. Las secuencias únicas son 112,121,211, tres en total.',
    text(360, 27, 'Permutaciones únicas de [1, 1, 2]', 20) + arrow(360, 67, 160, 119) + arrow(360, 67, 360, 119, accent, true) + arrow(360, 67, 560, 119) + box(309, 37, 102, 39, 'Inicio') + box(109, 120, 102, 40, 'Elegir 1', mint) + box(309, 120, 102, 40, 'Otro 1') + box(509, 120, 102, 40, 'Elegir 2', mint) + line(320, 130, 400, 150, accent) + text(360, 190, 'Rama equivalente', 16) + text(160, 216, '112 · 121', 20) + text(560, 216, '211', 20) + note('Se omite una elección duplicada en el mismo nivel, no el valor 1 en toda la rama.')),

  'm14-reinas': figure('Cuatro reinas sin compartir columnas ni diagonales', 'Una solución de cuatro reinas usa columnas 1,3,0,2 en las filas 0,1,2,3. Ningún par coincide en columna ni tiene igual diferencia absoluta entre fila y columna.',
    text(360, 27, 'columnaPorFila = [1, 3, 0, 2]', 20) +
    Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => `<rect x="${58 + c * 46}" y="${55 + r * 46}" width="46" height="46" fill="${(r + c) % 2 ? cream : mint}" stroke="${green}"/>${[1, 3, 0, 2][r] === c ? text(81 + c * 46, 86 + r * 46, '♛', 30) : ''}`).join('')).join('') + text(473, 96, 'Una reina por fila', 19) + text(473, 140, 'Columnas distintas', 19) + text(473, 184, 'Diagonales distintas', 19) + note('Al retroceder se restauran las tres marcas de la reina retirada.', 269)),

  'm14-laberintos': figure('Un camino simple no repite casillas', 'En una grilla tres por tres con centro bloqueado existen dos caminos simples entre esquinas opuestas: derecha,derecha,abajo,abajo y abajo,abajo,derecha,derecha.',
    text(360, 27, 'Del inicio a la salida, sin repetir una casilla', 20) +
    Array.from({ length: 3 }, (_, r) => Array.from({ length: 3 }, (_, c) => `<rect x="${65 + c * 57}" y="${57 + r * 57}" width="57" height="57" fill="${r === 1 && c === 1 ? ink : cream}" stroke="${green}"/>`).join('')).join('') +
    `<path d="M 94 85 H 208 V 199" fill="none" stroke="${green}" stroke-width="6"/><path d="M 94 85 V 199 H 208" fill="none" stroke="${accent}" stroke-width="5" stroke-dasharray="8 6"/>` + text(94, 91, 'I', 19) + text(208, 205, 'S', 19) + box(355, 75, 282, 42, 'Derecha, derecha, abajo, abajo', mint, ink, 17) + box(355, 150, 282, 42, 'Abajo, abajo, derecha, derecha', cream, ink, 17) + note('Visitado describe el camino actual: se desmarca al volver de una rama.', 269)),

  'm14-cotas': figure('Podar una rama que no puede mejorar la mejor solución', 'Con un costo factible conocido de 10, una rama con costo acumulado 6 y cota residual 5 tiene cota inferior 11 y se poda. Otra rama con acumulado 4 y cota residual 3 aún puede mejorar.',
    text(360, 30, 'Mejor solución factible conocida: 10', 20) + arrow(360, 75, 180, 119) + arrow(360, 75, 540, 119) + box(284, 47, 152, 38, 'Buscar mínimo') + box(65, 124, 232, 46, '6 + cota 5 = 11') + box(423, 124, 232, 46, '4 + cota 3 = 7', mint) + text(180, 215, '11 ≥ 10 → podar', 20) + text(540, 215, '7 < 10 → explorar', 20) + note('La cota residual debe ser optimista: nunca mayor que el mínimo posible.')),

  'm14-sudoku': figure('MRV elige la casilla con menos candidatos', 'En un Sudoku parcial, una casilla vacía con candidatos 2,7 tiene dos opciones y otra con candidatos 4 tiene una. MRV elige la segunda; una casilla con cero candidatos rechaza la rama.',
    text(360, 30, 'Candidatos ya filtrados por fila, columna y bloque', 20) + box(63, 77, 168, 49, '{2, 7}') + box(277, 77, 168, 49, '{4}', mint) + box(491, 77, 168, 49, '∅') + text(147, 166, '2 opciones', 19) + text(361, 166, '1 opción: elegir', 19) + text(575, 166, '0: contradicción', 19) + arrow(361, 218, 361, 181) + note('MRV cambia el orden de exploración; cada candidato válido aún debe probarse.')),

  'm15-indices': figure('Un índice B+ guía la búsqueda hacia una hoja', 'Un índice B+ usa separadores 20 y 40. La clave 27 baja al hijo central con rango desde 20 incluido a 40 excluido. Las hojas están enlazadas para consultas de rango.',
    box(268, 25, 184, 45, '20   |   40', mint) + arrow(292, 72, 135, 132) + arrow(360, 72, 360, 132) + arrow(428, 72, 585, 132) + box(54, 135, 161, 46, '5 · 12 · 18') + box(279, 135, 161, 46, '20 · 27 · 35', mint) + box(504, 135, 161, 46, '40 · 51 · 63') + arrow(218, 158, 274, 158) + arrow(443, 158, 499, 158) + text(360, 223, 'Buscar 27: 20 ≤ 27 < 40', 20) + note('Las claves iguales al separador descienden por el hijo de la derecha.')),

  'm15-segment': figure('Segment Tree combina resúmenes de intervalos', 'Para el arreglo 2,1,3,4, la raíz resume suma 10. La consulta semiabierta de 0 a 3 combina el nodo 0 a 2 con suma 3 y la hoja 2 a 3 con suma 3: resultado 6.',
    edge(360, 55, 190, 126) + edge(360, 55, 530, 126) + edge(190, 126, 105, 210) + edge(190, 126, 275, 210) + edge(530, 126, 445, 210) + edge(530, 126, 615, 210) + box(298, 27, 124, 44, '[0,4): 10') + box(128, 105, 124, 44, '[0,2): 3', mint) + box(468, 105, 124, 44, '[2,4): 7') + box(62, 191, 86, 42, '2') + box(232, 191, 86, 42, '1') + box(402, 191, 86, 42, '3', mint) + box(572, 191, 86, 42, '4') + note('Consulta [0,3): sumar los dos bloques verdes → 3 + 3 = 6.', 268)),

  'm15-fenwick': figure('Fenwick descompone un prefijo por bits', 'Con índices internos desde uno, consultar el prefijo de longitud 7 visita índices 7,6,4,0. Sus bloques son 7 a 7, 5 a 6 y 1 a 4, que cubren 1 a 7 sin repetirse.',
    text(360, 28, 'Consultar los primeros 7 valores', 20) + cells([1, 2, 3, 4, 5, 6, 7], 142, 69, 58) + `<rect x="142" y="127" width="228" height="35" rx="7" fill="${mint}" stroke="${green}" stroke-width="2"/><rect x="374" y="127" width="112" height="35" rx="7" fill="${cream}" stroke="${green}" stroke-width="2"/><rect x="490" y="127" width="54" height="35" rx="7" fill="${mint}" stroke="${green}" stroke-width="2"/>` + text(256, 151, 'bit[4]', 17) + text(430, 151, 'bit[6]', 17) + text(517, 151, 'bit[7]', 16) + text(360, 211, '7 − lowbit(7) = 6 → 4 → 0', 20) + note('Cada paso quita el bit menos significativo activo y agrega un bloque disjunto.')),

  'm15-probabilisticas': figure('Bloom Filter distingue seguro que no de tal vez sí', 'Un filtro Bloom tiene bits 0,1,0,1,1,0,0,0. Una consulta que inspecciona posiciones 1 y3 puede estar presente; otra que inspecciona 1 y6 está definitivamente ausente por el cero en 6.',
    text(360, 29, 'Un cero basta para descartar una clave', 20) + cells([0, 1, 0, 1, 1, 0, 0, 0], 129, 68, 58, [1, 3, 4], true) + box(63, 178, 275, 44, 'Posiciones {1,3}: quizá sí', mint, ink, 18) + box(383, 178, 275, 44, 'Posiciones {1,6}: seguro no', cream, ink, 18) + note('Todos los bits en 1 admiten falsos positivos; un bit 0 prueba ausencia.')),

  'm15-cache': figure('Un acceso cambia la recencia de una caché LRU', 'Una caché de capacidad tres tiene A,B,C de más a menos reciente. Acceder a B produce B,A,C; insertar D produce D,B,A y expulsa C.',
    text(360, 29, 'Capacidad 3 · izquierda = más reciente', 20) + text(81, 91, 'Inicio', 17) + cells(['A', 'B', 'C'], 200, 63, 70) + text(81, 155, 'get(B)', 17) + cells(['B', 'A', 'C'], 200, 127, 70, [0]) + text(81, 219, 'put(D)', 17) + cells(['D', 'B', 'A'], 200, 191, 70, [0]) + arrow(429, 212, 508, 212, accent) + box(531, 191, 126, 42, 'Sale C') + note('El mapa localiza el nodo; la lista doble lo mueve en tiempo constante.', 269)),

  'm16-correctitud': figure('El invariante explica cada estado del ciclo', 'Al sumar 4,menos 2,7, los estados índice y suma son 0 y0;1 y4;2 y2;3 y9. La suma coincide siempre con el prefijo procesado y n menos i disminuye hasta cero.',
    text(360, 29, 'Invariante: suma = suma del prefijo a[0…i)', 20) + table([['i', 0, 1, 2, 3], ['suma', 0, 4, 2, 9], ['n − i', 3, 2, 1, 0]], 128, 72, 92, 44, ['1,4', '2,4']) + note('Entrada [4, −2, 7] · al terminar i = n y suma = 9.')),

  'm16-amortizado': figure('Una transferencia cara usa trabajo ahorrado antes', 'Una cola con dos pilas ha encolado 1,2,3. El potencial dos veces el tamaño de entrada es 6. Transferir tres elementos cuesta seis primitivas y extraer uno cuesta una: costo real 7, cambio de potencial menos 6, amortizado 1.',
    text(360, 27, 'Cola con dos pilas · Φ = 2 × tamaño de entrada', 20) + box(65, 64, 216, 45, 'Entrada: [1, 2, 3]') + text(173, 146, 'Φ antes = 6', 20) + arrow(292, 87, 407, 87) + box(421, 64, 234, 45, 'Salida: [3, 2] · sale 1', mint) + text(538, 146, 'Φ después = 0', 20) + box(135, 184, 450, 44, 'Amortizado = 7 + (0 − 6) = 1', mint, ink, 20) + note('Cada elemento se transfiere una sola vez: el costo total de la secuencia es lineal.')),

  'm16-limites-np': figure('La dirección de una reducción importa', 'Se transforma un grafo de ciclo hamiltoniano en TSP completo: las aristas originales tienen costo1, las ausentes costo2, y se pregunta por un tour de costo máximo n. Un tour de costo n existe si y solo si hay ciclo hamiltoniano.',
    text(360, 29, 'Ciclo hamiltoniano ≤p TSP de decisión', 20) + box(47, 78, 213, 60, 'Grafo con n vértices') + arrow(272, 108, 437, 108) + text(354, 83, 'Transformación', 17) + text(354, 146, 'polinómica', 17) + box(450, 78, 223, 60, '¿Tour de costo ≤ n?', mint) + text(183, 208, 'Arista original → costo 1', 18) + text(532, 208, 'Arista ausente → costo 2', 18) + note('Un algoritmo para el problema de llegada resolvería también el problema de origen.')),

  'm16-aproximacion': figure('Una cobertura con garantía de factor dos', 'Para una sola arista A-B, el algoritmo aproximado de Vertex Cover elige ambos extremos, tamaño2. El óptimo elige uno, tamaño1. Se alcanza exactamente el factor2.',
    text(360, 29, 'Cobertura de vértices: tocar cada arista', 20) + edge(110, 112, 250, 112, '', true) + node(110, 112, 'A', mint) + node(250, 112, 'B', mint) + text(180, 175, 'Algoritmo: {A, B}', 19) + edge(460, 112, 600, 112) + node(460, 112, 'A', mint) + node(600, 112, 'B') + text(530, 175, 'Óptimo: {A}', 19) + box(250, 213, 220, 40, '2 = 2 × OPT', mint, ink, 20)),

  'm16-sistemas-medicion': figure('Optimizar exige conservar el contrato exacto', 'En a,b,c,b,a, el primer índice que repite un identificador es3, el segundo b. Tanto el algoritmo cuadrático como el de conjunto deben devolver3; devolver4 por la segunda a incumple el contrato.',
    text(360, 30, 'Contrato: primer índice que repite un valor anterior', 19) + cells(['a', 'b', 'c', 'b', 'a'], 205, 69, 62, [1, 3], true) + `<path d="M 298 64 Q 360 9 422 64" fill="none" stroke="${green}" stroke-width="3"/>` + text(360, 199, 'Respuesta correcta: índice 3', 21) + note('Después de verificar la misma respuesta, se comparan tiempo y memoria.')),
};
