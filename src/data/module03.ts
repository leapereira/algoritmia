import type { ModuleContent } from './types.js';

export const module03: ModuleContent = {
  moduleId: 3,
  lessons: [
    {
      id: 'm03-contratos', moduleId: 3, title: 'Recursión, contratos y pila de llamadas', duration: 25,
      summary: 'Construye una llamada más pequeña y explica qué información queda pendiente hasta su retorno.',
      objectives: ['Definir casos base y recursivos.', 'Trazar marcos de la pila.', 'Demostrar terminación y correctitud por inducción.'],
      prerequisites: ['Funciones, arreglos y contratos.', 'Complejidad temporal y espacial.'],
      sections: [
        { title: 'Un contrato que también sirve para la llamada pequeña', paragraphs: [
          'La recursión permite expresar una solución mediante otras instancias del mismo problema. No consiste simplemente en escribir una función que se llama: cada llamada debe cumplir un contrato y acercarse a un caso resuelto directamente. Para factorial definimos una entrada entera n entre 0 y 20 y una salida long igual al producto de los enteros de 1 a n. El producto vacío vale 1, por lo que 0! = 1. El límite superior evita desbordamiento: 20! cabe en long y 21! no. Aceptar cualquier n sin aclarar esa restricción rompería el contrato de la implementación aunque la identidad matemática siguiera siendo cierta.',
        ] },
        { title: 'Descomponer, detener y componer', paragraphs: [
          'Si n es cero, devolvemos 1. Si es positivo, suponemos que la llamada factorial(n − 1) calcula correctamente el producto anterior y lo multiplicamos por n. Hay tres obligaciones distintas: el caso base debe responder correctamente; la instancia delegada debe ser válida y menor; la composición debe reconstruir la respuesta original. Para n = 3 la expansión es 3 × factorial(2), luego 2 × factorial(1), luego 1 × factorial(0). La última llamada responde de inmediato. La expansión describe las obligaciones pendientes, no cuatro resultados simultáneos. Primero se alcanza la base y después se completan las multiplicaciones en el orden inverso.',
        ], code: 'factorial(n):\n    exigir 0 ≤ n ≤ 20\n    si n = 0: devolver 1\n    devolver n × factorial(n - 1)', language: 'text' },
        { title: 'Qué conserva la pila', paragraphs: [
          'Cada invocación tiene un marco con su parámetro n, sus variables locales y el punto al que volver. Al entrar con n = 3 siguen activos los marcos de 3, 2, 1 y 0. Cuando retorna el de cero, el de uno todavía recuerda su propio n. Obtiene 1 × 1, devuelve 1 y desaparece; luego regresan 2 y 6. Dibujar la pila evita confundir el valor local de un marco con una variable global. La profundidad máxima es n + 1, por lo que la memoria auxiliar es Θ(n). Aunque no declaremos un arreglo, las llamadas consumen memoria real y una profundidad grande puede provocar StackOverflowError.',
        ] },
        { title: 'Correctitud y terminación son argumentos separados', paragraphs: [
          'La inducción prueba el resultado: para cero, el valor 1 coincide con la definición; si la llamada de n − 1 cumple su contrato, multiplicarla por n produce n!. La medida n es un entero no negativo que disminuye estrictamente hasta cero, así que la recursión termina matemáticamente. La validación inicial impide que un negativo se aleje indefinidamente del caso base. En una máquina finita también necesitamos que alcancen la pila y el tipo numérico. En este ejemplo n está limitado a 20, pero ese control no es una propiedad automática de la recursión. Probar una función para tres valores no reemplaza estas obligaciones generales.',
        ] },
        { title: 'Contar trabajo y elegir una implementación', paragraphs: [
          'El tiempo satisface T(n) = T(n − 1) + Θ(1), con T(0) = Θ(1), y por tanto es Θ(n). El costo de los marcos también es lineal. Una versión iterativa puede acumular el producto con memoria auxiliar constante bajo el mismo contrato. La forma recursiva se parece a la definición y facilita el razonamiento inductivo; esa claridad debe compararse con el costo de ejecución y la profundidad esperada. Para estudiar una solución anota tanto el número total de llamadas como la cantidad máxima activa: son magnitudes diferentes. Conserva pruebas para cero, uno, veinte, entradas rechazadas y equivalencia con una versión iterativa.',
        ] },
      ],
      complexity: { time: 'Θ(n)', space: 'Θ(n) auxiliar', explanation: 'Hay n + 1 llamadas y n multiplicaciones; el contrato limita n a 20 para que el resultado quepa en long.' },
      pitfalls: ['Usar 0 como resultado de 0!.', 'Omitir la validación de negativos o el límite numérico.', 'Contar solo variables explícitas y olvidar la pila.'],
      solved: { title: 'Factorial con dominio explícito', explanation: 'La validación establece el dominio; el auxiliar reduce n y devuelve un producto exacto dentro de ese dominio.', code: `static long factorial(int n) {
    if (n < 0 || n > 20) throw new IllegalArgumentException("n debe estar entre 0 y 20");
    return factorialValido(n);
}
static long factorialValido(int n) {
    if (n == 0) return 1L;
    return n * factorialValido(n - 1);
}` },
      practice: { title: 'Resolver y medir profundidad', prompt: 'Implementa el máximo recursivo de un arreglo no nulo y no vacío. Usa el máximo del prefijo de longitud k, traza [-8,-3,-11], demuestra la base y cuenta llamadas totales, profundidad y memoria. Contrasta con una implementación iterativa y explica por qué el arreglo vacío se rechaza.' },
      takeaways: ['El caso base resuelve una instancia completa.', 'Cada marco conserva su propio estado.', 'La terminación usa una medida decreciente; la correctitud usa el contrato.'], lab: 'recursion',
    },
    {
      id: 'm03-formas', moduleId: 3, title: 'Formas de recursión y el caso Fibonacci', duration: 27,
      summary: 'Distingue llamadas directas, indirectas, múltiples y de cola sin confundir su trabajo con su profundidad.',
      objectives: ['Clasificar dependencias recursivas.', 'Comparar Fibonacci ingenuo y acumulativo.', 'Comprender las limitaciones de la recursión de cola en Java.'], prerequisites: ['Marcos de llamadas y factorial.'],
      sections: [
        { title: 'Directa e indirecta', paragraphs: [
          'Una recursión es directa cuando un método se llama a sí mismo. En la indirecta intervienen varios métodos: esPar(n) puede delegar en esImpar(n − 1), que a su vez delega en esPar(n − 1). Para enteros no negativos, esPar(0) devuelve true y esImpar(0) devuelve false. El argumento de terminación debe cubrir todo el ciclo de dependencias; revisar cada método aisladamente puede ocultar una llamada que aumenta el problema. Esta clasificación describe la forma de las llamadas, no su costo. La pareja de métodos consume Θ(n) tiempo y pila si cada llamada disminuye el argumento en uno, igual que una cadena directa de longitud semejante.',
        ] },
        { title: 'Varias llamadas, trabajo repetido', paragraphs: [
          'Fibonacci define F(0) = 0, F(1) = 1 y F(n) = F(n − 1) + F(n − 2). Su traducción literal es una recursión múltiple: un marco genera dos llamadas. Para F(5), las ramas vuelven a calcular F(3), F(2) y F(1) varias veces. El árbol de llamadas puede tener una cantidad exponencial de nodos aunque su altura sea lineal. Decir que utiliza memoria exponencial porque realiza trabajo exponencial sería incorrecto: durante una evaluación secuencial, las ramas se procesan una después de otra. La pila conserva solo una ruta activa más los resultados parciales de sus ancestros, de longitud O(n).',
        ], code: 'fibonacci(n):\n    si n < 2: devolver n\n    devolver fibonacci(n - 1) + fibonacci(n - 2)', language: 'text' },
        { title: 'Una llamada de cola', paragraphs: [
          'Una llamada está en posición de cola cuando su resultado se devuelve directamente, sin una operación pendiente. En factorial(n), la multiplicación por n impide esa condición. Podemos transformar el estado agregando un acumulador: factorialCola(n, acumulado) delega en factorialCola(n − 1, acumulado × n). Para Fibonacci, dos acumuladores a y b representan términos consecutivos; al avanzar pasan a b y a + b. Esa representación elimina las ramas repetidas, pero no demuestra por sí misma uso constante de memoria. Java no garantiza la eliminación de llamadas de cola. Una traducción recursiva sigue pudiendo crear un marco por paso y desbordar la pila.',
        ] },
        { title: 'La invariante que permite iterar', paragraphs: [
          'En la versión iterativa mantenemos a = F(i) y b = F(i + 1). Antes de la primera vuelta i vale cero, a vale cero y b vale uno. Calcular siguiente = a + b y desplazar ambos valores conserva esa relación para i + 1. Tras n vueltas, a es F(n). Una implementación con long admite F(92), pero una actualización que calcule F(93) desbordaría aunque el resultado solicitado fuera válido. El código resuelto evita ese cálculo final innecesario: trata cero aparte y mantiene los dos últimos términos hasta alcanzar n. La elección de límites y de estado forma parte del algoritmo, no un detalle posterior.',
        ] },
        { title: 'Recursión frente a iteración', paragraphs: [
          'La versión ingenua tarda Θ(φⁿ), donde φ es la razón áurea; O(2ⁿ) también es una cota superior válida y más sencilla. La iteración tarda Θ(n) y usa Θ(1) memoria auxiliar para enteros de tamaño fijo. Memoizar es otra posibilidad: guardar cada F(k) evita recalcularlo y cambia el tiempo a Θ(n), con Θ(n) almacenamiento y pila según la implementación. Para elegir, observa si hay subproblemas repetidos, si la estructura es naturalmente jerárquica y si la profundidad puede ser grande. Prueba cero, uno, dos, los mayores valores permitidos y negativos. Una mejora de rendimiento que cambia el resultado por desbordamiento no cumple el contrato original.',
        ] },
      ],
      complexity: { time: 'Θ(n) iterativo; Θ(φⁿ) ingenuo', space: 'Θ(1) iterativo; Θ(n) pila ingenua', explanation: 'El árbol ingenuo repite subproblemas; los acumuladores conservan solo dos términos y evitan las repeticiones.' },
      pitfalls: ['Suponer optimización de cola garantizada en Java.', 'Confundir cantidad total de llamadas con profundidad.', 'Calcular F(93) accidentalmente al devolver F(92).'],
      solved: { title: 'Fibonacci sin una suma fuera del contrato', explanation: 'La versión recursiva de cola puede convertirse en un ciclo que conserva los dos últimos términos y calcula exactamente hasta n.', code: `static long fibonacci(int n) {
    if (n < 0 || n > 92) throw new IllegalArgumentException("n fuera de [0,92]");
    if (n == 0) return 0L;
    long anterior = 0L, actual = 1L;
    for (int i = 2; i <= n; i++) {
        long siguiente = anterior + actual;
        anterior = actual;
        actual = siguiente;
    }
    return actual;
}` },
      practice: { title: 'Tres formas, un resultado', prompt: 'Escribe Fibonacci ingenuo, memoizado e iterativo. Para n de 0 a 30 verifica igualdad; cuenta llamadas para n = 5,10,20 y compara profundidad. Escribe también esPar/esImpar para entradas no negativas y justifica la terminación del ciclo indirecto.' },
      takeaways: ['Múltiples llamadas pueden repetir instancias.', 'Una llamada de cola no implica memoria constante en Java.', 'Una invariante explícita permite sustituir una cadena por un ciclo.'], lab: 'recursion',
    },
    {
      id: 'm03-binaria', moduleId: 3, title: 'Búsqueda binaria recursiva', duration: 24,
      summary: 'Reduce un intervalo ordenado conservando todos los candidatos posibles y sin errores en sus límites.',
      objectives: ['Definir intervalos semiabiertos.', 'Demostrar el descarte de una mitad.', 'Analizar tiempo y pila logarítmicos.'], prerequisites: ['Orden total e índices de arreglos.', 'Caso base y reducción.'],
      sections: [
        { title: 'La precondición que permite descartar', paragraphs: [
          'La búsqueda binaria encuentra una posición cuyo valor coincide con el objetivo en un arreglo ordenado de menor a mayor, o devuelve −1 si no existe. El orden es una precondición decisiva. Sin él, una comparación con el centro no permite eliminar posiciones. El algoritmo resuelto admite duplicados y promete cualquier coincidencia, no necesariamente la primera. También admite un arreglo vacío y rechaza null. Comprobar el orden completo antes de cada consulta costaría Θ(n), así que no lo incorporamos al núcleo cuya complejidad queremos estudiar. El llamador debe garantizar el orden o pagar una validación explícita una vez, y contar ese costo por separado.',
        ] },
        { title: 'Un intervalo sin ambigüedades', paragraphs: [
          'Usaremos [inicio, fin): incluye inicio y excluye fin. Al comienzo es [0, a.length), y está vacío cuando inicio ≥ fin. El centro se calcula como inicio + (fin − inicio) / 2, evitando sumar dos límites grandes. Si a[centro] es menor que el objetivo, descartamos hasta centro inclusive y recurrimos en [centro + 1, fin). Si es mayor, buscamos en [inicio, centro). En ambos casos el intervalo se acorta incluso cuando contiene un solo elemento. Mezclar esta convención con límites inclusivos es una fuente frecuente de ciclos infinitos y accesos fuera del arreglo. Dibuja las posiciones que quedan, no solamente las fórmulas.',
        ], code: 'buscar(a, objetivo, inicio, fin):\n    si inicio ≥ fin: devolver -1\n    centro ← inicio + (fin - inicio) / 2\n    si a[centro] = objetivo: devolver centro\n    si a[centro] < objetivo:\n        devolver buscar(a, objetivo, centro + 1, fin)\n    devolver buscar(a, objetivo, inicio, centro)', language: 'text' },
        { title: 'Seguir una consulta completa', paragraphs: [
          'Con [1,3,5,7,9,11,13] y objetivo 11, el intervalo inicial tiene centro 3, cuyo valor es 7. El objetivo solo puede estar a la derecha, de modo que continuamos con [4,7). Su centro es 5 y a[5] vale 11: devolvemos 5. Para objetivo 12, tras comparar 11 elegimos [6,7), cuyo único valor es 13, y después [6,6), vacío. Ese caso base devuelve −1 sin leer a[6] de nuevo. Los marcos anteriores no necesitan combinar resultados: devuelven directamente el índice recibido. Aun estando la llamada en posición de cola, en Java el número de marcos puede crecer logarítmicamente.',
        ] },
        { title: 'Correctitud por candidatos conservados', paragraphs: [
          'La invariante recursiva afirma que, si existe una coincidencia aún no encontrada, hay alguna dentro del intervalo pendiente. Si el centro es menor que el objetivo, todos los valores a su izquierda son también menores o iguales al centro por el orden; ninguno puede coincidir. El argumento simétrico justifica descartar la derecha cuando el centro es mayor. Una coincidencia permite devolver su índice inmediatamente. Al quedar vacío el conjunto de candidatos, −1 es correcto. La medida fin − inicio es no negativa y disminuye estrictamente en cada llamada no base. Para buscar la primera repetición habría que recordar una coincidencia y seguir explorando su lado izquierdo.',
        ] },
        { title: 'El costo y sus condiciones', paragraphs: [
          'Cada llamada usa trabajo constante y conserva como máximo cerca de la mitad del intervalo. La recurrencia T(n) = T(⌊n/2⌋) + Θ(1) da Θ(log n) en el peor caso para n positivo; el caso vacío cuesta Θ(1). La profundidad y la memoria auxiliar son Θ(log n) en el peor caso, mientras que una implementación iterativa necesita Θ(1) auxiliar. Tener acceso por índice constante es otra hipótesis: no debemos trasladar sin revisión este costo a una lista enlazada. Incluye pruebas para entrada vacía, un elemento, objetivos en ambos extremos, ausentes por debajo y por encima, y valores repetidos. Cada prueba debe respetar el orden requerido por el contrato.',
        ] },
      ],
      complexity: { time: 'Θ(log n) peor caso; Θ(1) vacío', space: 'Θ(log n) pila peor caso', explanation: 'Cada llamada reduce aproximadamente a la mitad el intervalo y usa una cantidad constante de estado local.' },
      pitfalls: ['Llamar sobre datos sin ordenar.', 'Recurrir con el mismo intervalo.', 'Prometer la primera aparición cuando se devuelve cualquier coincidencia.'],
      solved: { title: 'Buscar con límites semiabiertos', explanation: 'El auxiliar no valida el orden: es una precondición. La llamada base precede a cualquier lectura del centro.', code: `static int buscar(int[] a, int objetivo) {
    if (a == null) throw new IllegalArgumentException("Arreglo nulo");
    return buscarRango(a, objetivo, 0, a.length);
}
static int buscarRango(int[] a, int objetivo, int inicio, int fin) {
    if (inicio >= fin) return -1;
    int centro = inicio + (fin - inicio) / 2;
    if (a[centro] == objetivo) return centro;
    if (a[centro] < objetivo) return buscarRango(a, objetivo, centro + 1, fin);
    return buscarRango(a, objetivo, inicio, centro);
}` },
      practice: { title: 'Encontrar la primera aparición', prompt: 'Adapta la búsqueda para devolver el menor índice de una coincidencia. Traza [1,2,2,2,5] buscando 2 y prueba vacío, ausente y todos iguales. Justifica los límites y compara memoria de la versión recursiva con la iterativa.' },
      takeaways: ['El orden justifica cada descarte.', 'Una convención de intervalos debe mantenerse en todas las llamadas.', 'Devolver cualquier coincidencia y devolver la primera son contratos distintos.'], visualization: 'binary',
    },
    {
      id: 'm03-merge', moduleId: 3, title: 'Divide y vencerás con Merge Sort', duration: 29,
      summary: 'Divide en partes independientes, ordénalas y combina resultados sin repetir subproblemas.',
      objectives: ['Reconocer las tres etapas del paradigma.', 'Implementar una mezcla estable.', 'Derivar tiempo y memoria del árbol de recursión.'], prerequisites: ['Arreglos, intervalos y recurrencias.'],
      sections: [
        { title: 'Dividir no es toda la estrategia', paragraphs: [
          'Divide y vencerás separa una instancia en subproblemas más pequeños, resuelve cada uno y combina sus respuestas. La independencia de las partes y el costo de combinar importan tanto como el tamaño de la división. Merge Sort ordena la mitad izquierda y la derecha, después mezcla ambas secuencias ordenadas. Un rango de cero o un elemento ya está ordenado. A diferencia del Fibonacci ingenuo, las dos mitades contienen regiones distintas y no repiten el mismo trabajo. El contrato exige que al terminar el rango esté ordenado y conserve exactamente los mismos elementos con sus multiplicidades. Ordenar correctamente no permite perder uno de dos valores iguales.',
        ] },
        { title: 'La mezcla como algoritmo independiente', paragraphs: [
          'Supongamos ordenados [inicio, medio) y [medio, fin). Copiamos ese rango a un auxiliar y mantenemos dos índices, uno en cada mitad. En cada posición de salida elegimos el menor elemento pendiente. Si una mitad se agota, todos sus elementos ya fueron usados y copiamos los restantes de la otra. Cuando hay empate elegimos primero la izquierda. Esa decisión conserva la estabilidad: elementos iguales mantienen su orden relativo de entrada, algo observable al ordenar registros por una clave. La invariante de mezcla dice que el prefijo escrito contiene los menores elementos de ambas mitades, en orden, y que cada índice señala su siguiente elemento no consumido.',
        ], code: 'ordenar(inicio, fin):\n    si fin - inicio ≤ 1: devolver\n    medio ← inicio + (fin - inicio) / 2\n    ordenar(inicio, medio)\n    ordenar(medio, fin)\n    mezclar las dos mitades ordenadas', language: 'text' },
        { title: 'Una traza desde las hojas', paragraphs: [
          'Para [4,1,3,2], dividimos en [4,1] y [3,2], y luego en cuatro rangos unitarios. Las primeras mezclas producen [1,4] y [2,3]. En la mezcla final se elige 1 de la izquierda, 2 y 3 de la derecha, y finalmente 4. Las llamadas descienden hasta los casos base antes de producir rangos mayores ordenados. La inducción sobre la longitud prueba la correctitud: las partes menores quedan ordenadas por hipótesis y la mezcla correcta reconstruye el rango. El número de elementos no cambia porque cada paso consume exactamente una posición del auxiliar y escribe exactamente una posición de salida. La longitud disminuye en las llamadas, garantizando terminación.',
        ] },
        { title: 'Distribuir el costo por niveles', paragraphs: [
          'La recurrencia es T(n) = 2T(n/2) + Θ(n), omitiendo redondeos que no alteran el orden. Hay Θ(log n) niveles y en cada uno las mezclas suman Θ(n) trabajo, dando Θ(n log n) incluso en el peor caso. La versión presentada mezcla aunque el arreglo ya esté ordenado, de modo que mantiene ese orden también en el mejor caso. El auxiliar tiene longitud n y se crea una sola vez, no en cada llamada. La pila agrega Θ(log n) y queda dominada por Θ(n) memoria auxiliar total. La suma de todas las longitudes procesadas durante la ejecución no equivale a memoria simultáneamente viva.',
        ] },
        { title: 'Detalles que sostienen las garantías', paragraphs: [
          'Copiar desde el auxiliar evita sobrescribir valores que todavía necesitamos comparar. Usar a[i] después de modificar a sería un fallo de dependencia de datos. Los límites deben excluir fin tanto en la recursión como en la copia y en la escritura. Para demostrar estabilidad con enteros no basta observar valores iguales: imagina registros 2A y 2B y verifica que A siga antes que B. Prueba longitudes cero, uno, impares, todos iguales y ya ordenados. Si los datos no caben en memoria, la mezcla de secuencias ordenadas también inspira ordenamientos externos; sus costos deben incluir lecturas y escrituras de almacenamiento, no solo comparaciones en RAM.',
        ] },
      ],
      complexity: { time: 'Θ(n log n)', space: 'Θ(n) auxiliar', explanation: 'Las mezclas de un nivel suman trabajo lineal; hay profundidad logarítmica y un único auxiliar de n elementos.' },
      pitfalls: ['Leer del arreglo que se está sobrescribiendo en la mezcla.', 'Perder estabilidad eligiendo primero la derecha en empate.', 'Contar memoria acumulada en vez de memoria máxima simultánea.'],
      solved: { title: 'Merge Sort con auxiliar compartido', explanation: 'Las copias se limitan al rango actual. Los límites semiabiertos permiten que el mismo caso base cubra vacío y singleton.', code: `static void mergeSort(int[] a) {
    if (a == null) throw new IllegalArgumentException("Arreglo nulo");
    mergeRango(a, new int[a.length], 0, a.length);
}
static void mergeRango(int[] a, int[] aux, int inicio, int fin) {
    if (fin - inicio <= 1) return;
    int medio = inicio + (fin - inicio) / 2;
    mergeRango(a, aux, inicio, medio);
    mergeRango(a, aux, medio, fin);
    System.arraycopy(a, inicio, aux, inicio, fin - inicio);
    int i = inicio, j = medio;
    for (int k = inicio; k < fin; k++) {
        if (i == medio) a[k] = aux[j++];
        else if (j == fin || aux[i] <= aux[j]) a[k] = aux[i++];
        else a[k] = aux[j++];
    }
}` },
      practice: { title: 'Una mezcla observable', prompt: 'Ordena registros con clave y posición original mediante Merge Sort. Comprueba estabilidad con claves repetidas. Instrumenta comparaciones y profundidad para tamaños 0,1,3,8,16 y explica el consumo máximo de memoria sin sumar todos los rangos como si coexistieran.' },
      takeaways: ['La combinación necesita su propia prueba.', 'Las mitades disjuntas evitan los subproblemas repetidos.', 'Un auxiliar compartido conserva memoria lineal.'],
    },
    {
      id: 'm03-quick', moduleId: 3, title: 'Quick Sort y decisiones sobre la recursión', duration: 29,
      summary: 'Separa elementos respecto de un pivote y compara sus garantías con Merge Sort y las versiones iterativas.',
      objectives: ['Mantener una invariante de partición.', 'Reconocer casos cuadráticos.', 'Comparar tiempo, estabilidad y profundidad.'], prerequisites: ['Divide y vencerás y mezcla de rangos.'],
      sections: [
        { title: 'Combinar poco, particionar antes', paragraphs: [
          'Quick Sort reorganiza un rango respecto de un pivote: los menores o iguales quedan a su izquierda y los mayores a su derecha. Después ordena recursivamente ambos lados, excluyendo la posición final del pivote. La mayor parte del trabajo ocurre antes de las llamadas, en contraste con Merge Sort, que combina después. El pivote no necesita ser la mediana, pero la calidad de la separación afecta profundamente el costo. Elegir siempre el último valor es sencillo y permite estudiar un caso adverso concreto. El algoritmo presentado modifica el arreglo, conserva todas sus ocurrencias y no promete estabilidad. Esas propiedades deben estar claras antes de comparar rendimientos.',
        ] },
        { title: 'Una partición con frontera explícita', paragraphs: [
          'En un rango inclusivo [izquierda, derecha], guardamos el último valor como pivote. El índice i marca la siguiente posición disponible para un elemento menor o igual. Al avanzar j, mantenemos que [izquierda,i) contiene valores menores o iguales y [i,j) valores mayores. Si a[j] debe ir a la izquierda, lo intercambiamos con a[i] e incrementamos i. Al terminar, colocamos el pivote en i mediante un último intercambio. Las dos regiones cumplen su relación con el pivote, pero todavía pueden estar desordenadas internamente. Por eso la partición no es por sí sola un ordenamiento. Los intercambios preservan el multiconjunto de valores y no requieren un auxiliar proporcional a n.',
        ], code: 'quickSort(izquierda, derecha):\n    si izquierda ≥ derecha: devolver\n    p ← particionar(izquierda, derecha)\n    quickSort(izquierda, p - 1)\n    quickSort(p + 1, derecha)', language: 'text' },
        { title: 'Probar el orden y la terminación', paragraphs: [
          'La partición coloca al pivote en una posición que puede conservar en una ordenación final. Por hipótesis inductiva, cada lado queda ordenado después de su llamada. Como todo valor izquierdo es menor o igual que el pivote y todo valor derecho es mayor, la concatenación completa está ordenada. El caso base cubre rangos vacíos y unitarios. Excluir p de ambas llamadas es esencial: aun si el pivote queda en un extremo, el mayor subproblema tiene un elemento menos. Para [3,1,2], el pivote 2 acaba en la posición central y quedan dos casos unitarios. Para datos ordenados con pivote final, una región queda vacía y la otra casi conserva la longitud.',
        ] },
        { title: 'El peor caso no desaparece por promediar', paragraphs: [
          'Con particiones equilibradas, T(n) = 2T(n/2) + Θ(n) da Θ(n log n). Con un extremo fijo, T(n) = T(n − 1) + Θ(n) da Θ(n²) y pila Θ(n). Arreglos ya ordenados, inversos y todos iguales son adversos para esta variante de dos regiones. Elegir un pivote aleatorio ofrece tiempo esperado Θ(n log n), pero no elimina el peor caso teórico. Una partición de tres regiones trata mejor muchos repetidos al separar menores, iguales y mayores. Para reducir memoria podemos recurrir sobre el lado menor y continuar con un ciclo sobre el mayor: la profundidad queda O(log n), aunque el tiempo aún pueda ser cuadrático.',
        ] },
        { title: 'Práctica del módulo: resolver y explicar memoria', paragraphs: [
          'Compara Quick Sort con Merge Sort bajo el mismo contrato y con entradas copiadas para evitar que el primer algoritmo favorezca al segundo. Registra comparaciones, profundidad máxima, memoria auxiliar y estabilidad por separado. Una versión iterativa de Quick Sort necesita conservar rangos pendientes en una pila explícita; eliminar la sintaxis recursiva no elimina automáticamente ese estado. Si haces procesamiento iterativo del lado grande, explica por qué las llamadas restantes se reducen al menos a la mitad. Incluye vacío, singleton, negativos, todos iguales y arreglos crecientes. Resolver problemas recursivos y analizar su consumo de memoria exige identificar qué marcos coexisten, no solamente sumar todas las operaciones de la traza.',
        ] },
      ],
      complexity: { time: 'Θ(n²) peor caso; Θ(n log n) equilibrado', space: 'Θ(n) pila peor caso', explanation: 'La partición usa espacio constante; la selección del pivote determina la altura de la cadena de rangos de esta implementación.' },
      pitfalls: ['Volver a incluir el pivote en una llamada.', 'Confundir esperado con garantizado.', 'Declarar espacio O(1) e ignorar las llamadas recursivas.'],
      solved: { title: 'Quick Sort de dos regiones', explanation: 'Esta versión didáctica usa pivote final y muestra explícitamente sus casos adversos. No es una recomendación universal de implementación.', code: `static void quickSort(int[] a) {
    if (a == null) throw new IllegalArgumentException("Arreglo nulo");
    quickRango(a, 0, a.length - 1);
}
static void quickRango(int[] a, int izq, int der) {
    if (izq >= der) return;
    int p = particionar(a, izq, der);
    quickRango(a, izq, p - 1);
    quickRango(a, p + 1, der);
}
static int particionar(int[] a, int izq, int der) {
    int pivote = a[der], i = izq;
    for (int j = izq; j < der; j++) {
        if (a[j] <= pivote) {
            int t = a[i]; a[i] = a[j]; a[j] = t; i++;
        }
    }
    int t = a[i]; a[i] = a[der]; a[der] = t;
    return i;
}` },
      practice: { title: 'La misma solución, menos pila', prompt: 'Transforma Quick Sort para recurrir solo sobre el lado menor y procesar el mayor mediante un ciclo. Compara resultados y profundidad con la versión original en entradas ordenadas y aleatorias. Documenta por qué mejora el límite de pila sin prometer una mejora del peor caso temporal.' },
      takeaways: ['Particionar y ordenar son operaciones diferentes.', 'La profundidad depende del equilibrio.', 'Iterar requiere conservar o eliminar justificadamente el trabajo pendiente.'],
    },
  ],
  exercises: [
    { id:'m03-e-factorial',moduleId:3,title:'Volver desde el caso base',kind:'prediction',difficulty:'Inicial',prompt:'¿Qué devuelve factorial(4), con factorial(0)=1 y factorial(n)=n*factorial(n-1)?',input:'n = 4',expected:'Un entero.',constraints:['0 ≤ n ≤ 20.'],starter:'factorial(4) = 4 * factorial(3)',answer:'24',accepted:['24'],hints:['Llega primero a factorial(0).','Los retornos son 1,1,2,6…'],solution:'4! = 4 × 3 × 2 × 1 = 24.',explanation:'Cada marco completa una multiplicación al volver; la profundidad máxima es cinco.',lessonId:'m03-contratos' },
    { id:'m03-e-fibonacci',moduleId:3,title:'Tiempo frente a profundidad',kind:'complexity',difficulty:'Intermedio',prompt:'¿Cuál es la complejidad de la pila del Fibonacci ingenuo en su peor caso, usando evaluación secuencial?',input:'F(n)=F(n-1)+F(n-2)',expected:'Una cota ajustada, como O(n).',constraints:['n es no negativo.','Cuenta llamadas activas, no llamadas totales.'],starter:'if (n < 2) return n;\nreturn fib(n - 1) + fib(n - 2);',answer:'O(n)',accepted:['O(n)','Θ(n)','Theta(n)'],hints:['Solo una rama se expande a la vez.','La ruta más larga baja desde n hasta 1.'],solution:'Pila Θ(n), aunque el trabajo total es exponencial.',explanation:'Los marcos de ramas ya terminadas se liberan; el máximo simultáneo sigue una ruta del árbol.',lessonId:'m03-formas' },
    { id:'m03-e-binaria',moduleId:3,title:'Un intervalo que no encoge',kind:'debug',difficulty:'Inicial',prompt:'En búsqueda binaria con [inicio,fin), a[centro] es menor que el objetivo. ¿Qué expresión debe sustituir centro al calcular el nuevo inicio?',input:'Un intervalo de un elemento con objetivo mayor.',expected:'La expresión del nuevo inicio.',constraints:['Fin es exclusivo.'],starter:'return buscar(a, objetivo, centro, fin);',answer:'centro + 1',accepted:['centro + 1','centro+1'],hints:['El centro ya no puede coincidir.','Con un elemento, conservar centro repite el rango.'],solution:'return buscar(a, objetivo, centro + 1, fin);',explanation:'Descartar el centro garantiza reducción estricta y evita recursión infinita.',lessonId:'m03-binaria' },
    { id:'m03-e-mezcla',moduleId:3,title:'Combinar dos secuencias',kind:'prediction',difficulty:'Inicial',prompt:'¿Qué secuencia produce la mezcla de [1,4,8] y [2,4,7]? Escribe los valores separados por comas.',input:'[1,4,8] y [2,4,7]',expected:'Seis valores separados por comas.',constraints:['Conserva ambas apariciones de 4.'],starter:'Elegir repetidamente el menor frente pendiente.',answer:'1,2,4,4,7,8',accepted:['1,2,4,4,7,8','[1,2,4,4,7,8]'],hints:['El primer valor es 1.','En el empate deben consumirse dos posiciones distintas.'],solution:'[1,2,4,4,7,8]',explanation:'Mezclar conserva multiplicidades; el empate no elimina valores.',lessonId:'m03-merge' },
    { id:'m03-e-quick',moduleId:3,title:'Quick Sort con menos marcos',kind:'implementation',difficulty:'Intermedio',prompt:'Implementa Quick Sort recursando solo sobre el lado menor. El editor no compila ni ejecuta; verifica tu código en un IDE.',input:'[], [1], [4,3,2,1], [2,2,2]',expected:'Implementación y análisis manual.',constraints:['No pierdas el pivote ni incluyas su posición en llamadas.','Compara resultados con Arrays.sort sobre una copia.'],starter:'static void ordenar(int[] a, int izq, int der) {\n    // Particionar, recurrir en la parte menor, iterar en la mayor.\n}',answer:'',accepted:[],hints:['Mantén un while (izq < der).','Compara p-izq con der-p.','Tras resolver la izquierda, mueve izq a p+1; simétricamente para la derecha.'],solution:'Dentro del while, particiona en p. Si p-izq < der-p, llama sobre [izq,p-1] y asigna izq=p+1. En otro caso llama sobre [p+1,der] y asigna der=p-1. Usa la partición de la lección.',explanation:'La rama recursiva nunca supera la mitad del rango. La pila queda O(log n); las particiones adversas todavía pueden sumar Θ(n²) tiempo.',lessonId:'m03-quick' },
  ],
  questions: [
    {id:'m03-q1',moduleId:3,type:'choice',prompt:'¿Qué debe demostrar una llamada recursiva además de un caso base correcto?',options:['Que el argumento siempre aumente.','Que se aproxime al caso base y componga la respuesta correcta.','Que use variables globales.'],answer:1,explanation:'La reducción garantiza terminación y la composición conecta contratos.',lessonId:'m03-contratos'},
    {id:'m03-q2',moduleId:3,type:'prediction',prompt:'¿Cuántos marcos simultáneos alcanza factorial(3), incluyendo factorial(0)?',options:['3','6','4'],answer:2,explanation:'Están activos los marcos de 3,2,1 y 0.',lessonId:'m03-contratos'},
    {id:'m03-q3',moduleId:3,type:'truefalse',prompt:'Java garantiza eliminar los marcos de toda llamada de cola.',options:['Verdadero','Falso'],answer:1,explanation:'No existe esa garantía; debe contarse la pila de la implementación recursiva.',lessonId:'m03-formas'},
    {id:'m03-q4',moduleId:3,type:'complexity',prompt:'¿Qué costo temporal tiene Fibonacci iterativo con dos acumuladores?',options:['Θ(n)','Θ(n²)','Θ(2ⁿ)'],answer:0,explanation:'Realiza una suma por término y conserva dos términos.',lessonId:'m03-formas'},
    {id:'m03-q5',moduleId:3,type:'order',prompt:'¿Qué secuencia respeta la búsqueda binaria recursiva?',options:['Leer centro → validar vacío → dividir.','Validar intervalo vacío → comparar centro → elegir un intervalo estrictamente menor.','Dividir → conservar siempre el centro → volver.'],answer:1,explanation:'La base precede a los accesos y cada descarte reduce candidatos.',lessonId:'m03-binaria'},
    {id:'m03-q6',moduleId:3,type:'choice',prompt:'Con valores repetidos, la búsqueda binaria básica presentada devuelve…',options:['Siempre la primera coincidencia.','Siempre la última.','Cualquier coincidencia encontrada.'],answer:2,explanation:'Para encontrar la primera hay que continuar hacia la izquierda tras un acierto.',lessonId:'m03-binaria'},
    {id:'m03-q7',moduleId:3,type:'complexity',prompt:'¿Qué representa 2T(n/2)+Θ(n) en Merge Sort?',options:['Dos mitades y una mezcla lineal.','Una llamada y una búsqueda constante.','n llamadas de tamaño n.'],answer:0,explanation:'Las dos partes se resuelven y después se combinan leyendo sus elementos.',lessonId:'m03-merge'},
    {id:'m03-q8',moduleId:3,type:'truefalse',prompt:'Elegir primero el elemento de la izquierda en empates permite una mezcla estable.',options:['Verdadero','Falso'],answer:0,explanation:'El elemento izquierdo precedía al derecho en el arreglo original.',lessonId:'m03-merge'},
    {id:'m03-q9',moduleId:3,type:'prediction',prompt:'Quick Sort con pivote final sobre un arreglo creciente deja inicialmente partes de tamaños…',options:['n/2 y n/2.','n-1 y 0.','0 y 0.'],answer:1,explanation:'El pivote máximo queda al final y todos los demás quedan a su izquierda.',lessonId:'m03-quick'},
    {id:'m03-q10',moduleId:3,type:'choice',prompt:'Recurrir solo sobre el lado menor permite garantizar…',options:['Tiempo Θ(n log n) en toda entrada.','Estabilidad.','Pila O(log n), aunque el tiempo pueda ser cuadrático.'],answer:2,explanation:'Reduce la profundidad de llamadas, no el costo de cada partición.',lessonId:'m03-quick'},
  ],
  glossary: [
    {term:'Recursión directa',definition:'Un método se llama a sí mismo sobre otra instancia del problema.',lessonId:'m03-formas'},
    {term:'Recursión indirecta',definition:'Un ciclo de llamadas entre métodos vuelve a un método anterior.',lessonId:'m03-formas'},
    {term:'Recursión de cola',definition:'La llamada recursiva es la última operación y su resultado se devuelve sin composición pendiente.',lessonId:'m03-formas'},
    {term:'Marco de llamada',definition:'Estado de una invocación activa: parámetros, variables locales y punto de retorno.',lessonId:'m03-contratos'},
    {term:'Divide y vencerás',definition:'Resolver partes menores y combinar sus respuestas para resolver la instancia original.',lessonId:'m03-merge'},
    {term:'Partición',definition:'Reorganización que separa valores según su relación con un pivote.',lessonId:'m03-quick'},
    {term:'Estabilidad de mezcla',definition:'Conservación del orden relativo original de los elementos con la misma clave.',lessonId:'m03-merge'},
  ],
};
