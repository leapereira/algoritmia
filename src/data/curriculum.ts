export interface Block {
  id: number;
  title: string;
  description: string;
  color: string;
}

export interface Module {
  id: number;
  blockId: number;
  title: string;
  topics: string[];
  practice: string;
  description: string;
  available: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  kind: 'prediction' | 'complexity' | 'debug' | 'implementation';
  difficulty: 'Inicial' | 'Intermedio';
  prompt: string;
  input: string;
  expected: string;
  constraints: string[];
  starter: string;
  answer: string;
  accepted: string[];
  hints: string[];
  solution: string;
  explanation: string;
  lessonId: string;
}

export interface Question {
  id: string;
  type: 'choice' | 'truefalse' | 'prediction' | 'complexity' | 'order';
  prompt: string;
  options: string[];
  /** Índice de la opción correcta, comenzando en cero. */
  answer: number;
  explanation: string;
  lessonId: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  lessonId?: string;
}

export const blocks: Block[] = [
  {
    id: 1,
    title: 'Fundamentos de algoritmos',
    description: 'Aprende a expresar soluciones, demostrar que funcionan y analizar su costo.',
    color: '#c8ef71',
  },
  {
    id: 2,
    title: 'Estructuras de datos fundamentales',
    description: 'Organiza la información y comprende el costo de acceder, insertar y eliminar.',
    color: '#8cbffa',
  },
  {
    id: 3,
    title: 'Algoritmos fundamentales y técnicas de resolución',
    description: 'Explora búsquedas, ordenamientos, grafos y estrategias para resolver problemas.',
    color: '#c3a4f5',
  },
  {
    id: 4,
    title: 'Temas avanzados y aplicaciones',
    description: 'Relaciona el diseño y la optimización con las necesidades de sistemas reales.',
    color: '#f4b98c',
  },
];

export const modules: Module[] = [
  {
    id: 1,
    blockId: 1,
    title: 'Introducción a los algoritmos',
    description: 'Tu primer recorrido: de una idea a un algoritmo correcto, con visualizaciones y práctica guiada.',
    topics: [
      'Concepto de algoritmo y estructura de datos.',
      'Pseudocódigo y diagramas de flujo.',
      'Variables, condicionales, ciclos y funciones.',
      'Algoritmos iterativos y recursivos.',
      'Correctitud y terminación.',
      'Introducción a la eficiencia algorítmica.',
    ],
    practice: 'búsqueda del máximo, inversión de arreglos y detección de duplicados.',
    available: true,
  },
  {
    id: 2,
    blockId: 1,
    title: 'Análisis de complejidad algorítmica',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Tiempo y espacio de ejecución.',
      'Análisis de mejor, promedio y peor caso.',
      'Notación Big O, Omega (Ω) y Theta (Θ).',
      'Complejidades O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ) y O(n!).',
      'Análisis de ciclos anidados.',
      'Relaciones de recurrencia.',
      'Teorema maestro (Master Theorem).',
      'Análisis amortizado introductorio.',
    ],
    practice: 'determinar y comparar la complejidad de distintos algoritmos.',
    available: false,
  },
  {
    id: 3,
    blockId: 1,
    title: 'Recursividad y divide y vencerás',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Casos base y casos recursivos.',
      'Pila de llamadas.',
      'Recursión directa, indirecta y múltiple.',
      'Recursión de cola.',
      'Factorial y Fibonacci.',
      'Búsqueda binaria recursiva.',
      'Divide y vencerás.',
      'Merge Sort y Quick Sort.',
      'Recursión frente a iteración.',
    ],
    practice: 'resolver problemas recursivos y analizar su consumo de memoria.',
    available: false,
  },
  {
    id: 4,
    blockId: 2,
    title: 'Arreglos y listas enlazadas',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Arreglos estáticos y dinámicos.',
      'Acceso por índice y recorrido.',
      'Inserción y eliminación.',
      'Listas simplemente enlazadas.',
      'Listas doblemente enlazadas.',
      'Listas circulares.',
      'Gestión de referencias y memoria.',
      'Comparación Array vs LinkedList.',
    ],
    practice: 'implementar una lista enlazada desde cero.',
    available: false,
  },
  {
    id: 5,
    blockId: 2,
    title: 'Pilas, colas y deques',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Tipo abstracto de dato (TAD).',
      'Pilas (LIFO).',
      'Colas (FIFO).',
      'Colas circulares.',
      'Colas de doble extremo (Deque).',
      'Implementación con arreglos y nodos.',
      'Evaluación de expresiones.',
      'Notación infija, prefija y postfija.',
    ],
    practice: 'validador de paréntesis y evaluador de expresiones.',
    available: false,
  },
  {
    id: 6,
    blockId: 2,
    title: 'Árboles y árboles binarios',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Conceptos de raíz, nodo, hoja, altura y profundidad.',
      'Árboles generales y binarios.',
      'Representación primer hijo–hermano derecho.',
      'Recorridos preorden, inorden y postorden.',
      'Recorrido por niveles (BFS).',
      'Árboles binarios de búsqueda (ABB/BST).',
      'Inserción, búsqueda y eliminación.',
      'Sucesor y predecesor inorden.',
    ],
    practice: 'implementar un ABB con sus operaciones y recorridos.',
    available: false,
  },
  {
    id: 7,
    blockId: 2,
    title: 'Árboles balanceados y heaps',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Problemas de los ABB desbalanceados.',
      'Árboles AVL.',
      'Factor de balance.',
      'Rotaciones LL, RR, LR y RL.',
      'Inserción y eliminación en AVL.',
      'Introducción a árboles rojo-negro.',
      'Heaps binarios: Min-Heap y Max-Heap.',
      'Colas de prioridad.',
      'Heap Sort.',
    ],
    practice: 'implementar un AVL y visualizar las rotaciones.',
    available: false,
  },
  {
    id: 8,
    blockId: 2,
    title: 'Hashing, mapas y conjuntos',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Funciones hash.',
      'Tablas hash.',
      'Colisiones.',
      'Encadenamiento separado.',
      'Direccionamiento abierto.',
      'Sondeo lineal, cuadrático y doble hashing.',
      'Factor de carga y rehashing.',
      'HashMap, HashSet, Map y Set.',
      'Complejidad promedio y peor caso.',
    ],
    practice: 'construir una tabla hash sin utilizar colecciones predefinidas.',
    available: false,
  },
  {
    id: 9,
    blockId: 2,
    title: 'Tries y estructuras para cadenas',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Árboles de prefijos (Trie).',
      'Inserción, búsqueda y eliminación.',
      'Búsqueda por prefijos.',
      'Árboles Patricia (Radix Tree).',
      'Compresión de caminos.',
      'Comparación Trie vs HashMap.',
      'Autocompletado y diccionarios.',
    ],
    practice: 'desarrollar un autocompletador de palabras.',
    available: false,
  },
  {
    id: 10,
    blockId: 3,
    title: 'Algoritmos de búsqueda y ordenamiento',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Búsqueda lineal y binaria.',
      'Bubble Sort, Selection Sort e Insertion Sort.',
      'Merge Sort, Quick Sort y Heap Sort.',
      'Counting Sort y Radix Sort.',
      'Estabilidad de ordenamiento.',
      'Ordenamiento in-place.',
      'Comparación de complejidades.',
      'Selección del algoritmo adecuado.',
    ],
    practice: 'implementar y medir el rendimiento de diferentes ordenamientos.',
    available: false,
  },
  {
    id: 11,
    blockId: 3,
    title: 'Grafos',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Grafos dirigidos y no dirigidos.',
      'Grafos ponderados y no ponderados.',
      'Matriz y lista de adyacencia.',
      'Recorridos DFS y BFS.',
      'Detección de ciclos.',
      'Componentes conexas.',
      'Ordenamiento topológico.',
      'Caminos mínimos: Dijkstra y Bellman-Ford.',
      'Árbol de expansión mínima: Prim y Kruskal.',
      'Union-Find (conjuntos disjuntos).',
    ],
    practice: 'calcular rutas óptimas entre ciudades.',
    available: false,
  },
  {
    id: 12,
    blockId: 3,
    title: 'Algoritmos voraces (Greedy)',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Estrategia voraz.',
      'Elección óptima local.',
      'Propiedad de subestructura óptima.',
      'Selección de actividades.',
      'Problemas de intervalos.',
      'Codificación de Huffman.',
      'Cambio de monedas.',
      'Casos donde Greedy no funciona.',
      'Demostración de correctitud.',
    ],
    practice: 'resolver problemas de optimización con estrategias voraces.',
    available: false,
  },
  {
    id: 13,
    blockId: 3,
    title: 'Programación dinámica',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Problemas con subproblemas superpuestos.',
      'Memoización (Top-Down).',
      'Tabulación (Bottom-Up).',
      'Fibonacci optimizado.',
      'Problema de la mochila (Knapsack).',
      'Subsecuencia común más larga (LCS).',
      'Distancia de edición.',
      'Caminos en matrices.',
      'Comparación con divide y vencerás y Greedy.',
    ],
    practice: 'resolver problemas de optimización evitando cálculos repetidos.',
    available: false,
  },
  {
    id: 14,
    blockId: 3,
    title: 'Backtracking y búsqueda exhaustiva',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Exploración de espacios de soluciones.',
      'Árboles de decisiones.',
      'Poda de ramas.',
      'Permutaciones y combinaciones.',
      'Problema de las N reinas.',
      'Sudoku.',
      'Laberintos.',
      'Branch and Bound (introducción).',
      'Complejidad exponencial.',
    ],
    practice: 'implementar un solucionador de Sudoku.',
    available: false,
  },
  {
    id: 15,
    blockId: 4,
    title: 'Estructuras de datos avanzadas',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Árboles B y B+.',
      'Índices utilizados en bases de datos.',
      'Segment Tree.',
      'Fenwick Tree (Binary Indexed Tree).',
      'Bloom Filters.',
      'Skip Lists.',
      'LRU Cache.',
      'Estructuras persistentes (introducción).',
    ],
    practice: 'implementar una caché LRU y un índice simplificado.',
    available: false,
  },
  {
    id: 16,
    blockId: 4,
    title: 'Diseño y optimización de algoritmos',
    description: 'Programa preparado. Las lecciones y actividades de este módulo están pendientes de desarrollo.',
    topics: [
      'Demostración formal de correctitud.',
      'Invariantes de ciclo.',
      'Análisis amortizado.',
      'Límites inferiores de problemas.',
      'Clases P, NP y NP-completo.',
      'Reducciones entre problemas.',
      'Algoritmos aproximados.',
      'Optimización temporal y espacial.',
      'Benchmarking y profiling.',
      'Selección de estructuras para sistemas reales.',
    ],
    practice: 'analizar, optimizar y justificar el diseño de una solución.',
    available: false,
  },
];

export const exercises: Exercise[] = [
  {
    id: 'maximo-negativos',
    title: 'El máximo también puede ser negativo',
    kind: 'prediction',
    difficulty: 'Inicial',
    prompt: 'Recorre el arreglo de izquierda a derecha. Inicializa max con su primer elemento y actualízalo solo cuando encuentres uno mayor. ¿Qué número devuelve?',
    input: '[-8, -3, -11, -2, -7]',
    expected: 'Un único número entero.',
    constraints: [
      'El arreglo contiene al menos un elemento.',
      'Todos sus elementos son enteros; pueden ser negativos.',
      'El algoritmo debe devolver un elemento del arreglo.',
    ],
    starter: `int max = a[0];
for (int i = 1; i < a.length; i++) {
    if (a[i] > max) max = a[i];
}
return max;`,
    answer: '-2',
    accepted: ['-2', '−2'],
    hints: [
      'El primer candidato es -8, no 0.',
      'Entre dos negativos, es mayor el más cercano a cero.',
      'Los candidatos sucesivos son -8, -3 y -2.',
    ],
    solution: 'El resultado es -2. La variable max toma los valores -8 → -3 → -2.',
    explanation: 'Inicializar con a[0] permite trabajar con todos los enteros. Si el arreglo estuviera vacío, habría que rechazar la entrada o definir otro resultado: no existe un máximo del conjunto vacío.',
    lessonId: 'algoritmos',
  },
  {
    id: 'invertir-pseudocodigo',
    title: 'Dos extremos, un intercambio',
    kind: 'prediction',
    difficulty: 'Inicial',
    prompt: 'Ejecuta mentalmente este pseudocódigo. ¿Cómo queda el arreglo cuando termina? Escribe sus elementos entre corchetes.',
    input: '[2, 5, 9, 12]',
    expected: 'Un arreglo de cuatro enteros, por ejemplo [1, 2, 3, 4].',
    constraints: [
      'Los índices comienzan en 0.',
      'Intercambiar guarda ambos valores; no sobrescribe uno antes de conservarlo.',
      'El mismo procedimiento deja un arreglo vacío o de un elemento sin cambios.',
    ],
    starter: `izquierda ← 0
derecha ← longitud(a) - 1
mientras izquierda < derecha:
    intercambiar a[izquierda] y a[derecha]
    izquierda ← izquierda + 1
    derecha ← derecha - 1`,
    answer: '[12, 9, 5, 2]',
    accepted: ['[12, 9, 5, 2]', '[12,9,5,2]', '12, 9, 5, 2', '12,9,5,2', '12 9 5 2'],
    hints: [
      'Primero se intercambian las posiciones 0 y 3.',
      'Después se intercambian las posiciones 1 y 2.',
      'Cada valor termina en la posición simétrica respecto al centro.',
    ],
    solution: 'Inicio: [2, 5, 9, 12]\nPrimer intercambio: [12, 5, 9, 2]\nSegundo intercambio: [12, 9, 5, 2]',
    explanation: 'Los dos índices se acercan al centro. El ciclo termina cuando se cruzan o coinciden. Usa una cantidad constante de variables auxiliares y realiza ⌊n/2⌋ intercambios.',
    lessonId: 'pseudocodigo',
  },
  {
    id: 'reparar-maximo',
    title: 'Un cero que cambia la respuesta',
    kind: 'debug',
    difficulty: 'Inicial',
    prompt: 'El método ya rechaza arreglos vacíos. Sin embargo, devuelve 0 para [-5, -2, -9]. ¿Qué expresión debe reemplazar al 0 de la inicialización de max? Escribe solo la expresión.',
    input: '[-5, -2, -9]',
    expected: 'Una expresión Java que inicialice max con un elemento válido.',
    constraints: [
      'No cambies el resto del método.',
      'El parámetro a no es null.',
      'Debe funcionar con arreglos negativos, positivos o mixtos y con un único elemento.',
    ],
    starter: `static int maximo(int[] a) {
    if (a.length == 0) {
        throw new IllegalArgumentException("Arreglo vacío");
    }
    int max = 0; // Reemplaza esta expresión.
    for (int i = 1; i < a.length; i++) {
        if (a[i] > max) max = a[i];
    }
    return max;
}`,
    answer: 'a[0]',
    accepted: ['a[0]', 'a [0]', 'a[ 0 ]', 'a [ 0 ]'],
    hints: [
      '0 no pertenece necesariamente al arreglo.',
      'El ciclo comienza en el índice 1. ¿Qué elemento todavía no ha considerado?',
      'El primer elemento está en la posición 0.',
    ],
    solution: 'int max = a[0];',
    explanation: 'Al comenzar, max ya representa el máximo del prefijo de un elemento. Cada iteración extiende ese prefijo. La validación del arreglo vacío hace seguro el acceso a a[0].',
    lessonId: 'control',
  },
  {
    id: 'seguir-recursion',
    title: 'La suma vuelve por la pila',
    kind: 'prediction',
    difficulty: 'Intermedio',
    prompt: '¿Qué devuelve sumar(a, 0)? Sigue las llamadas hasta el caso base y luego combina los resultados.',
    input: 'a = [3, -1, 4]; índice inicial = 0',
    expected: 'Un único número entero.',
    constraints: [
      'a no es null y el índice inicial es 0.',
      'Se supone que la suma cabe en un int.',
      'Para un arreglo vacío, el índice inicial coincide con a.length y el resultado es 0.',
    ],
    starter: `static int sumar(int[] a, int i) {
    if (i == a.length) return 0;
    return a[i] + sumar(a, i + 1);
}`,
    answer: '6',
    accepted: ['6', '+6'],
    hints: [
      'sumar(a, 3) devuelve 0 sin acceder a a[3].',
      'sumar(a, 2) devuelve 4 + 0.',
      'Los resultados al volver son 0 → 4 → 3 → 6.',
    ],
    solution: 'sumar(a, 3) = 0\nsumar(a, 2) = 4 + 0 = 4\nsumar(a, 1) = -1 + 4 = 3\nsumar(a, 0) = 3 + 3 = 6',
    explanation: 'La medida a.length - i disminuye en cada llamada y llega a cero. Hay n + 1 llamadas, tiempo Θ(n) y espacio auxiliar Θ(n) por la pila. En arreglos grandes, una versión iterativa evita el riesgo de desbordar la pila.',
    lessonId: 'recursion',
  },
  {
    id: 'implementar-duplicados',
    title: 'Detecta un valor repetido',
    kind: 'implementation',
    difficulty: 'Intermedio',
    prompt: 'Completa hayDuplicados en Java. Debe devolver true si existen dos posiciones distintas con el mismo valor, y false en otro caso. El editor permite practicar y comparar con la solución; este ejercicio no compila ni ejecuta código.',
    input: '[4, 1, 4] → true\n[-2, -2] → true\n[4, 1, 7] → false\n[] → false\n[9] → false',
    expected: 'Un método Java revisado manualmente con los cinco casos de ejemplo.',
    constraints: [
      'a no es null.',
      'Admite arreglos vacíos, negativos y valores repetidos más de dos veces.',
      'Usa ciclos y comparaciones; no necesitas colecciones.',
      'No compares una posición consigo misma: i y j deben ser diferentes.',
      'No modifiques el arreglo original.',
    ],
    starter: `static boolean hayDuplicados(int[] a) {
    // Compara cada posición con las posteriores.
    // Devuelve true al encontrar dos valores iguales.
    return false;
}`,
    answer: '',
    accepted: [],
    hints: [
      'Usa un índice i y un segundo índice j que empiece en i + 1.',
      'Si a[i] == a[j], ya encontraste un par de posiciones distintas.',
      'Devuelve false después de ambos ciclos; dentro del ciclo sería demasiado pronto.',
    ],
    solution: `static boolean hayDuplicados(int[] a) {
    for (int i = 0; i < a.length; i++) {
        for (int j = i + 1; j < a.length; j++) {
            if (a[i] == a[j]) return true;
        }
    }
    return false;
}`,
    explanation: 'Cada par de posiciones i < j se examina una vez. Un true siempre corresponde a un duplicado real. Si no se encuentra ninguno, se han examinado todos los pares y false es correcto. Ambos índices avanzan hacia límites finitos. Con cero o un elemento no hay pares y se devuelve false. Revisa tu código con los ejemplos y con [1, 2, 2, 3].',
    lessonId: 'correctitud',
  },
  {
    id: 'costo-duplicados',
    title: 'Cuenta los pares antes de medir',
    kind: 'complexity',
    difficulty: 'Intermedio',
    prompt: 'Para un arreglo de n elementos, ¿cuál es el orden de crecimiento del tiempo en el peor caso? Escribe una notación Big O ajustada, como O(n).',
    input: 'n = a.length; cada comparación y acceso a un entero tiene costo constante.',
    expected: 'Una expresión de complejidad en función de n.',
    constraints: [
      'El peor caso incluye un arreglo sin valores repetidos.',
      'Un retorno anticipado puede ahorrar trabajo en algunas entradas, pero no en todas.',
      'Analiza el crecimiento cuando n aumenta; no una duración en milisegundos.',
    ],
    starter: `static boolean hayDuplicados(int[] a) {
    for (int i = 0; i < a.length; i++) {
        for (int j = i + 1; j < a.length; j++) {
            if (a[i] == a[j]) return true;
        }
    }
    return false;
}`,
    answer: 'O(n²)',
    accepted: ['O(n²)', 'O(n^2)', 'O(n**2)', 'O(n*n)', 'O(n2)', 'Θ(n²)', 'Θ(n^2)', 'Theta(n^2)', 'n²', 'n^2', 'cuadrática', 'cuadratica'],
    hints: [
      'Sin duplicados, el método no retorna dentro de los ciclos.',
      'El segundo ciclo compara n - 1, luego n - 2, hasta 0 veces.',
      'La suma es n(n - 1)/2. Conserva el término de mayor crecimiento.',
    ],
    solution: 'Comparaciones: (n - 1) + (n - 2) + … + 1 = n(n - 1)/2.\nTiempo en el peor caso: Θ(n²), y por tanto O(n²).\nEspacio auxiliar: Θ(1).',
    explanation: 'Al duplicar un n grande, el número de comparaciones se aproxima a cuatro veces el original. La salida temprana mejora algunas entradas, pero un arreglo sin duplicados obliga a revisar todos los pares. El análisis de espacio excluye el arreglo de entrada y cuenta solo las variables auxiliares.',
    lessonId: 'eficiencia',
  },
];

export const questions: Question[] = [
  {
    id: 'q-algoritmo',
    type: 'choice',
    prompt: '¿Qué describe mejor un algoritmo?',
    options: [
      'Una lista de valores que siempre está ordenada.',
      'Un procedimiento de pasos precisos que produce un resultado y termina para las entradas válidas.',
      'Cualquier programa que usa Internet.',
      'El tiempo que tarda una computadora en ejecutar una función.',
    ],
    answer: 1,
    explanation: 'Un algoritmo expresa cómo resolver un problema mediante pasos definidos. Sus entradas válidas y el resultado esperado forman parte de su especificación.',
    lessonId: 'algoritmos',
  },
  {
    id: 'q-estructura',
    type: 'truefalse',
    prompt: 'Una estructura de datos define una forma de organizar y acceder a la información; un arreglo es un ejemplo.',
    options: ['Verdadero', 'Falso'],
    answer: 0,
    explanation: 'Un arreglo organiza elementos por índices. La estructura elegida influye en qué operaciones resultan sencillas o costosas.',
    lessonId: 'algoritmos',
  },
  {
    id: 'q-flujo',
    type: 'choice',
    prompt: 'En un diagrama de flujo, ¿qué representa normalmente un rombo con salidas «sí» y «no»?',
    options: ['El final del programa.', 'Una asignación de variable.', 'Una decisión basada en una condición.', 'Un arreglo de dos elementos.'],
    answer: 2,
    explanation: 'El rombo expresa una decisión. La condición determina qué rama seguir. El pseudocódigo puede expresar lo mismo con un condicional.',
    lessonId: 'pseudocodigo',
  },
  {
    id: 'q-orden-maximo',
    type: 'order',
    prompt: 'Para hallar el máximo sin usar un valor ficticio, ¿qué secuencia es correcta?',
    options: [
      'Leer a[0] → comprobar si el arreglo está vacío → recorrer → devolver.',
      'Inicializar max en 0 → devolver max → recorrer el arreglo.',
      'Recorrer desde a[1] → inicializar max en a[0] → comprobar entrada → devolver.',
      'Comprobar que no esté vacío → inicializar max en a[0] → recorrer desde a[1] → devolver max.',
    ],
    answer: 3,
    explanation: 'Primero se valida que exista un elemento. Luego se usa el primero como candidato, se compara con los restantes y se devuelve el resultado.',
    lessonId: 'pseudocodigo',
  },
  {
    id: 'q-ciclo',
    type: 'prediction',
    prompt: 'Con s = 0, se ejecuta «para i desde 1 hasta 4 inclusive: si i es par, s ← s + i». ¿Cuánto vale s al terminar?',
    options: ['4', '6', '10', '0'],
    answer: 1,
    explanation: 'Solo se suman 2 y 4. El ciclo visita cuatro valores, pero la condición permite dos actualizaciones: 0 + 2 + 4 = 6.',
    lessonId: 'control',
  },
  {
    id: 'q-funcion',
    type: 'choice',
    prompt: 'Una función Java es «static int doble(int x) { return 2 * x; }». ¿Qué devuelve doble(-3)?',
    options: ['-6', '-3', '6', 'No puede recibir negativos.'],
    answer: 0,
    explanation: 'El argumento -3 se asigna al parámetro x. La expresión 2 * x vale -6 y return lo entrega como resultado.',
    lessonId: 'control',
  },
  {
    id: 'q-caso-base',
    type: 'choice',
    prompt: 'Para factorial(n) = n × factorial(n - 1), con n entero no negativo, ¿qué caso base es correcto?',
    options: ['factorial(0) = 0.', 'factorial(n) = factorial(n + 1).', 'factorial(0) = 1.', 'Ninguno: toda llamada debe volver a llamarse.'],
    answer: 2,
    explanation: '0! = 1. Cada llamada con n > 0 reduce n hasta cero. Tanto el caso base como el avance hacia él son necesarios para terminar; el desbordamiento numérico debe considerarse al implementarlo.',
    lessonId: 'recursion',
  },
  {
    id: 'q-suma-vacia',
    type: 'prediction',
    prompt: 'sumar(a, i) devuelve 0 si i == a.length; en otro caso devuelve a[i] + sumar(a, i + 1). ¿Qué devuelve sumar([], 0)?',
    options: ['1', 'Error por acceder a a[0].', 'Una llamada infinita.', '0'],
    answer: 3,
    explanation: 'El caso base se cumple inmediatamente, antes de acceder al arreglo. La suma de cero elementos se define como 0.',
    lessonId: 'recursion',
  },
  {
    id: 'q-invariante',
    type: 'choice',
    prompt: 'Al buscar el máximo, antes de procesar a[i], ¿qué invariante permite justificar el algoritmo?',
    options: [
      'max es el máximo de todo el arreglo, incluso de la parte no visitada.',
      'max es el máximo entre a[0] y a[i - 1], inclusive.',
      'max siempre es positivo.',
      'El arreglo está ordenado.',
    ],
    answer: 1,
    explanation: 'El máximo del prefijo procesado se mantiene al comparar con el siguiente elemento. Cuando termina el recorrido, ese prefijo abarca todo el arreglo.',
    lessonId: 'correctitud',
  },
  {
    id: 'q-terminacion',
    type: 'truefalse',
    prompt: 'Un ciclo que empieza en i = 0 y ejecuta «mientras i < 5: i ← i - 1» termina porque i cambia en cada vuelta. Supón enteros sin límite.',
    options: ['Verdadero', 'Falso'],
    answer: 1,
    explanation: 'Cambiar no basta: i se aleja de 5 y siempre cumple i < 5. Una prueba de terminación necesita una medida no negativa que disminuya y no pueda hacerlo indefinidamente.',
    lessonId: 'correctitud',
  },
  {
    id: 'q-costo-maximo',
    type: 'complexity',
    prompt: 'Buscar el máximo de n ≥ 1 elementos realiza n - 1 comparaciones. ¿Cuál es su orden de crecimiento temporal ajustado?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    answer: 2,
    explanation: 'n - 1 crece linealmente con n: el tiempo es Θ(n). El algoritmo usa Θ(1) espacio auxiliar si solo guarda el índice y el candidato.',
    lessonId: 'eficiencia',
  },
  {
    id: 'q-costo-pares',
    type: 'complexity',
    prompt: 'Al comparar todos los pares de índices i < j se realizan n(n - 1)/2 comparaciones. Para n grande, si duplicas n, el trabajo se aproxima a…',
    options: ['Cuatro veces el original.', 'Dos veces el original.', 'La mitad del original.', 'El mismo trabajo.'],
    answer: 0,
    explanation: 'El término dominante es n²/2. Sustituir n por 2n multiplica ese término por cuatro. Es una aproximación de crecimiento, no una predicción exacta de milisegundos.',
    lessonId: 'eficiencia',
  },
];

export const glossary: GlossaryEntry[] = [
  { term: 'Algoritmo', definition: 'Procedimiento de pasos precisos para obtener el resultado especificado y terminar para las entradas válidas.', lessonId: 'algoritmos' },
  { term: 'Estructura de datos', definition: 'Forma de organizar información y definir cómo acceder a ella o modificarla.', lessonId: 'algoritmos' },
  { term: 'Arreglo', definition: 'Secuencia de elementos accesibles mediante índices. En los ejemplos Java, el primer índice es 0 y el último es longitud - 1.', lessonId: 'algoritmos' },
  { term: 'Pseudocódigo', definition: 'Descripción legible de los pasos de un algoritmo, independiente de la sintaxis estricta de un lenguaje.', lessonId: 'pseudocodigo' },
  { term: 'Diagrama de flujo', definition: 'Representación gráfica del control de un algoritmo mediante pasos, decisiones y flechas.', lessonId: 'pseudocodigo' },
  { term: 'Variable', definition: 'Nombre asociado a un valor que puede cambiar durante la ejecución.', lessonId: 'control' },
  { term: 'Condicional', definition: 'Construcción que elige qué instrucciones ejecutar según el valor verdadero o falso de una condición.', lessonId: 'control' },
  { term: 'Ciclo', definition: 'Construcción que repite instrucciones mientras se cumpla una condición o para una secuencia de valores.', lessonId: 'control' },
  { term: 'Función', definition: 'Unidad de instrucciones que recibe parámetros y puede devolver un resultado. Permite expresar y reutilizar una operación.', lessonId: 'control' },
  { term: 'Iteración', definition: 'Una ejecución del cuerpo de un ciclo; también se usa para describir soluciones basadas en repetición explícita.', lessonId: 'control' },
  { term: 'Recursión', definition: 'Técnica en la que una función se llama directa o indirectamente para resolver instancias más pequeñas del problema.', lessonId: 'recursion' },
  { term: 'Caso base', definition: 'Caso que una función recursiva resuelve directamente, sin realizar otra llamada recursiva.', lessonId: 'recursion' },
  { term: 'Pila de llamadas', definition: 'Estructura que conserva la información de las llamadas activas, como parámetros, variables locales y el punto al que regresar.', lessonId: 'recursion' },
  { term: 'Correctitud', definition: 'Propiedad de producir el resultado exigido por la especificación para todas las entradas válidas. La correctitud total incluye también la terminación.', lessonId: 'correctitud' },
  { term: 'Terminación', definition: 'Propiedad de finalizar tras una cantidad finita de pasos para cada entrada válida.', lessonId: 'correctitud' },
  { term: 'Invariante de ciclo', definition: 'Propiedad que se cumple antes de la primera iteración y se conserva tras cada vuelta; ayuda a justificar el resultado final.', lessonId: 'correctitud' },
  { term: 'Complejidad temporal', definition: 'Cómo crece la cantidad de operaciones de un algoritmo al aumentar el tamaño de la entrada, bajo un modelo de costo.', lessonId: 'eficiencia' },
  { term: 'Espacio auxiliar', definition: 'Memoria adicional que usa un algoritmo, además de la entrada. Incluye variables, estructuras temporales y la pila de llamadas.', lessonId: 'eficiencia' },
  { term: 'Big O', definition: 'Notación que expresa una cota superior asintótica de crecimiento. O(n) significa que, a partir de cierto tamaño, el costo está acotado por una constante multiplicada por n.', lessonId: 'eficiencia' },
  { term: 'Peor caso', definition: 'Mayor costo entre todas las entradas válidas de un mismo tamaño. Depende tanto del algoritmo como del tamaño considerado.', lessonId: 'eficiencia' },
];
