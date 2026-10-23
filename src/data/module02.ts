import type { ModuleContent } from './types.js';

export const module02: ModuleContent = {
  moduleId: 2,
  lessons: [
    {
      id: 'm02-modelo', moduleId: 2, title: 'Medir trabajo, memoria y casos', duration: 24,
      summary: 'Definí qué crece, qué operaciones contás y sobre qué entradas hacés una afirmación de eficiencia.',
      objectives: ['Definir tamaño de entrada y modelo de costo.', 'Separar espacio total y auxiliar.', 'Distinguir mejor, promedio y peor caso.'],
      prerequisites: ['Contratos, recorridos y correctitud del módulo 1.'],
      sections: [
        { title: 'El tamaño es parte del problema', paragraphs: [
          'El tiempo de una ejecución depende de la máquina, la versión de Java, las optimizaciones y los datos concretos. El análisis algorítmico abstrae esos detalles para estudiar cuánto trabajo necesita el procedimiento cuando crece la entrada. Antes de contar, declaramos qué representa n. Para un arreglo es su longitud; para una matriz rectangular conviene usar filas y columnas; para un grafo aparecerán vértices y aristas.',
          'Una entrada también tiene una representación. Si recibimos un entero N escrito en binario, su longitud es aproximadamente log₂ N bits. Un ciclo que realiza N pasos es lineal en el valor numérico, pero exponencial en su cantidad de bits. No llamaremos eficiente a un algoritmo solamente por ver una variable llamada n: debemos vincularla con el tamaño de los datos recibidos.',
        ] },
        { title: 'Elegir operaciones relevantes', paragraphs: [
          'Trabajaremos con un modelo de costo unitario para operaciones sobre enteros de tamaño fijo: acceder a un arreglo, comparar dos int o incrementar un índice cuesta tiempo constante. Sumar dos números de precisión arbitraria no tiene necesariamente ese costo: depende de cuántos dígitos se procesan. El modelo siempre necesita hipótesis.',
          'En un máximo, contar comparaciones entre elementos alcanza para explicar el crecimiento: hay n − 1. También se realizan asignaciones y comprobaciones del ciclo, pero agregan una cantidad proporcional a n. Para conocer un tiempo real necesitamos medir; para conocer el crecimiento, una cuenta representativa bien justificada suele bastar. Leer la entrada ya puede imponer un costo inevitable.',
        ] },
        { title: 'La memoria que el código no muestra a simple vista', paragraphs: [
          'El espacio total incluye datos de entrada, salida y estructuras de trabajo. El espacio auxiliar mide el almacenamiento adicional que necesita el algoritmo, y conviene indicar si excluimos la salida. Dos índices y un acumulador ocupan espacio constante; una copia de n elementos ocupa espacio lineal. Si contamos bits, además debemos considerar el tamaño de cada valor.',
          'La pila de llamadas también ocupa memoria. Un método recursivo que procesa un arreglo elemento por elemento puede usar espacio lineal sin crear ningún arreglo nuevo. Las estructuras temporales que dejan de utilizarse no siempre son liberadas inmediatamente por el recolector de Java; el análisis suele describir la memoria simultáneamente necesaria, no el instante exacto de cada recolección.',
        ] },
        { title: 'Tres preguntas distintas sobre las entradas', paragraphs: [
          'Para un tamaño fijo n, el mejor caso es el menor costo entre las entradas válidas y el peor caso es el mayor. En una búsqueda lineal, encontrar el objetivo en la primera posición necesita una comparación; una ausencia obliga a revisar n. El arreglo vacío se analiza aparte cuando la formulación de un caso requiere que exista una primera posición.',
          'El promedio requiere una distribución de probabilidad explícita. Si el valor está presente una única vez y su posición es uniforme entre n posiciones, el número esperado de comparaciones es (n + 1)/2. Si también puede estar ausente o ciertas posiciones son más probables, esa esperanza cambia. Promedio no significa tomar el punto medio entre el mejor y el peor resultado.',
          'Las garantías deben nombrar el caso y el recurso: “tiempo lineal en el peor caso y espacio auxiliar constante” es informativo. Decir solamente “usa poca memoria” no permite verificar nada. Tampoco una entrada favorable invalida una cota de peor caso: ambas afirmaciones responden preguntas diferentes.',
        ] },
      ],
      complexity: { time: 'Θ(n) en el peor caso', space: 'Θ(1) auxiliar', explanation: 'La búsqueda recorre hasta n posiciones. Bajo posición uniforme y éxito seguro, su esperanza también es Θ(n), aunque con aproximadamente la mitad de comparaciones.' },
      pitfalls: ['No definir si el tamaño de un número es su valor o su longitud en bits.', 'Suponer una distribución uniforme sin declararla.', 'Excluir la pila al analizar memoria recursiva.'],
      solved: { title: 'Contar comparaciones de una búsqueda', explanation: 'El resultado es un conteo, no la posición encontrada. Una ausencia devuelve longitud; una coincidencia en el índice i devuelve i + 1. El vacío devuelve 0.', code: `static int comparaciones(int[] a, int objetivo) {
    if (a == null) throw new IllegalArgumentException("Arreglo nulo");
    int cuenta = 0;
    for (int valor : a) {
        cuenta++;
        if (valor == objetivo) return cuenta;
    }
    return cuenta;
}` },
      practice: { title: 'Una búsqueda con probabilidades', prompt: 'En un arreglo de longitud 6 el objetivo está ausente con probabilidad 1/2; cuando está presente, cada posición tiene igual probabilidad. Calculá el número esperado de comparaciones de búsqueda lineal. Separá el evento ausencia del evento presencia y justificá por qué no basta promediar 1 y 6.' },
      takeaways: ['Tamaño y modelo de costo son hipótesis del análisis.', 'Tiempo y espacio son recursos independientes.', 'El promedio necesita probabilidades; el peor caso ofrece una garantía.'], lab: 'complexity', visualization: 'linear',
    },
    {
      id: 'm02-cotas', moduleId: 2, title: 'Cotas y familias de crecimiento', duration: 26,
      summary: 'Interpretá O, Ω y Θ y compará desde acceso constante hasta exploraciones exponenciales y factoriales.',
      objectives: ['Expresar cotas superiores, inferiores y ajustadas.', 'Comparar las siete familias del temario.', 'Evitar confundir notación con caso de ejecución.'], prerequisites: ['Modelo de costos y noción de función.'],
      sections: [
        { title: 'Una definición que permite comparar', paragraphs: [
          'Para funciones no negativas, T(n) pertenece a O(g(n)) si existen constantes c > 0 y n₀ tales que T(n) ≤ c·g(n) para todo n ≥ n₀. Es una cota superior eventual. T(n) pertenece a Ω(g(n)) si queda por encima de una constante positiva multiplicada por g(n). Si ambas afirmaciones se cumplen, escribimos Θ(g(n)): el crecimiento queda acotado por ambos lados.',
          'Por ejemplo, 4n + 12 pertenece a Θ(n), y también a O(n²). La segunda afirmación es verdadera pero menos precisa. Las constantes y los términos de menor orden desaparecen de la descripción asintótica; eso no significa que carezcan de importancia práctica para entradas pequeñas o para implementaciones con costos muy diferentes.',
        ] },
        { title: 'Constante, logarítmico y lineal', paragraphs: [
          'Consultar a[i] con un índice válido tiene costo Θ(1) en nuestro modelo. Reducir repetidamente una región a la mitad necesita Θ(log n) pasos: después de k reducciones queda aproximadamente n/2ᵏ, así que k debe rondar log₂ n. La base del logaritmo cambia un factor constante y no cambia la clase. Las excepciones de tamaños cero o uno se documentan sin alterar el crecimiento eventual.',
          'Recorrer todas las posiciones cuesta Θ(n). Que el código tenga una sola línea no implica tiempo constante: Arrays.sort o una llamada recursiva pueden esconder mucho trabajo. Tampoco un método con cien instrucciones fijas deja de ser constante si ninguna cantidad de repeticiones depende del tamaño. Hay que seguir las operaciones ejecutadas, no contar líneas fuente.',
        ] },
        { title: 'Lineal logarítmico y cuadrático', paragraphs: [
          'Muchos ordenamientos por comparación eficientes tienen costo Θ(n log n) en el peor caso. Podemos visualizar log n niveles que procesan una cantidad total proporcional a n por nivel. Duplicar n agrega trabajo proporcional a un poco más del doble, porque también aumenta el logaritmo.',
          'Examinar todos los pares de posiciones diferentes produce n(n − 1)/2 operaciones, que es Θ(n²). Duplicar una entrada grande aproxima una multiplicación por cuatro. La diferencia con n log n puede ser pequeña en pocos elementos y enorme al crecer. Las clases asintóticas describen esa tendencia; no predicen por sí solas el punto exacto donde una implementación supera a otra.',
        ] },
        { title: 'Exponencial y factorial', paragraphs: [
          'Un conjunto de n elementos tiene 2ⁿ subconjuntos: cada elemento genera una decisión incluir/excluir. Si una tarea debe emitirlos todos, no puede realizar una cantidad polinómica de emisiones. Materializar cada subconjunto como una lista independiente puede agregar un factor n al costo de la salida; separar decisiones y escritura evita ocultar ese detalle.',
          'Hay n! permutaciones de n elementos distintos. El primer lugar admite n elecciones, el siguiente n − 1 y así sucesivamente. Enumerar ordenamientos posibles crece todavía más rápido que 2ⁿ. Para n = 10 hay 1.024 subconjuntos y 3.628.800 permutaciones. Una poda puede mejorar muchas instancias sin eliminar necesariamente el peor caso exponencial o factorial.',
          'Las familias del temario se ordenan, para n suficientemente grande, como 1, log n, n, n log n, n², 2ⁿ y n!. O no significa peor caso y Ω no significa mejor caso. Podemos acotar con Θ tanto una función de mejor caso como una de peor caso o una esperanza: primero elegimos qué función estudiamos y luego damos su crecimiento.',
        ] },
      ],
      complexity: { time: 'Θ(log n) para reducciones a la mitad', space: 'Θ(1) auxiliar', explanation: 'Para n ≥ 1, dividir por dos hasta llegar a 1 realiza ⌊log₂ n⌋ iteraciones. La entrada 0 se rechaza para que el contrato sea explícito.' },
      pitfalls: ['Interpretar O(n²) como que siempre se hacen exactamente n² operaciones.', 'Confundir exponencial 2ⁿ con polinómico n².', 'Ignorar el costo de materializar todas las salidas.'],
      solved: { title: 'Contar reducciones a la mitad', explanation: 'La división entera descarta la fracción. Para n = 13, los valores son 13, 6, 3 y 1: tres iteraciones. El contador crece con log n, pero ocupa un solo entero.', code: `static int mitades(int n) {
    if (n < 1) throw new IllegalArgumentException("n debe ser positivo");
    int pasos = 0;
    while (n > 1) {
        n /= 2;
        pasos++;
    }
    return pasos;
}` },
      practice: { title: 'Ordenar crecimientos', prompt: 'Ordená de menor a mayor crecimiento log₂ n, n², 7, n log₂ n, n!, 2ⁿ y 3n. Calculá sus valores para n = 4 y n = 10 y explicá por qué una comparación en un tamaño pequeño no sustituye la clasificación asintótica.' },
      takeaways: ['Θ expresa una cota ajustada; O permite cotas superiores no ajustadas.', 'Un logaritmo suele aparecer al reducir la región por un factor constante.', 'El tamaño de la salida puede imponer tiempo exponencial o factorial.'], lab: 'complexity',
    },
    {
      id: 'm02-ciclos', moduleId: 2, title: 'Analizar ciclos sin contar llaves', duration: 25,
      summary: 'Traducí límites y avances de ciclos a sumas; reconocé regiones triangulares y recorridos geométricos.',
      objectives: ['Sumar costos de bloques consecutivos.', 'Contar ciclos dependientes e independientes.', 'Reconocer progresiones aritméticas y geométricas.'], prerequisites: ['Cotas asintóticas.', 'Ciclos for y while.'],
      sections: [
        { title: 'Bloques consecutivos se suman', paragraphs: [
          'Si un procedimiento realiza un recorrido de n elementos y después otro de n elementos, el costo es an + bn más términos constantes: Θ(n). No multiplicamos por la presencia de dos ciclos si uno termina antes de que comience el otro. Para una secuencia de bloques, sumamos sus costos y luego identificamos el término dominante.',
          'En una condición if, el costo de una ejecución incluye evaluar la condición y ejecutar solo la rama elegida. Para una cota de peor caso tomamos la rama más costosa entre las que realmente pueden ocurrir. Si una rama es imposible por las precondiciones, no debemos usarla para inventar un peor caso. Los retornos anticipados también cambian qué partes llegan a ejecutarse.',
        ] },
        { title: 'Anidación con límites independientes', paragraphs: [
          'Si el ciclo exterior hace n iteraciones y cada una ejecuta un ciclo de m iteraciones con trabajo constante, el total es Θ(nm). Solo se convierte en Θ(n²) cuando m también crece como n. En una matriz rectangular, mantener ambos parámetros explica mejor la situación que reemplazarlos prematuramente por uno.',
          'El espacio depende de lo almacenado simultáneamente, no de cuántas repeticiones hay. Dos índices reutilizados por ciclos anidados requieren espacio constante. En cambio, guardar un resultado por cada pareja podría requerir Θ(nm). El análisis temporal y el espacial deben reconstruir acciones diferentes del mismo código.',
        ] },
        { title: 'Límites que dependen de otro índice', paragraphs: [
          'Cuando j recorre desde i + 1 hasta n − 1, su cantidad de pasos depende de i. La cuenta es (n − 1) + (n − 2) + … + 1 = n(n − 1)/2. No hace falta que cada fila tenga n operaciones para que el total sea cuadrático: una región triangular conserva una fracción constante de las n² parejas posibles.',
          'La suma 1 + 2 + … + n se puede justificar emparejando extremos: cada pareja suma n + 1 y hay n/2 parejas, contando de forma equivalente el caso impar. Obtener una fórmula exacta ayuda a explicar ejemplos, pero para Θ(n²) también podríamos acotar la suma entre constantes multiplicadas por n² para tamaños suficientemente grandes.',
        ] },
        { title: 'El avance puede cambiar todo', paragraphs: [
          'Un índice que se multiplica por dos realiza aproximadamente log₂ n iteraciones. Si dentro de cada una se recorren n posiciones, el costo es Θ(n log n). Pero si el recorrido interior visita una cantidad igual al índice exterior, la suma es 1 + 2 + 4 + … hasta n, que es Θ(n), no Θ(n log n). Los límites importan tanto como la profundidad de anidación.',
          'En Java, escribir i *= 2 con int puede desbordar y romper la terminación. Para un análisis fiel debemos elegir un tipo con margen suficiente o controlar el siguiente avance antes de ejecutarlo. Una progresión matemática infinita y una secuencia de enteros de ancho fijo no son objetos idénticos.',
          'Un procedimiento práctico consiste en nombrar la operación que contamos, expresar cuántas veces se ejecuta para cada valor exterior y sumar esas cantidades. Luego revisamos casos límite como n = 0 y n = 1. Adivinar la complejidad por el aspecto del código puede funcionar en ejemplos sencillos y fallar justamente donde más necesitamos razonar.',
        ] },
      ],
      complexity: { time: 'Θ(n²)', space: 'Θ(1) auxiliar', explanation: 'El ejemplo visita exactamente n(n − 1)/2 parejas. long evita que el contador se desborde dentro del rango de long para todo n no negativo representable por int.' },
      pitfalls: ['Multiplicar costos de ciclos consecutivos.', 'Asignar automáticamente Θ(n²) a cualquier anidación de dos ciclos.', 'Ignorar el desbordamiento del índice en avances multiplicativos.'],
      solved: { title: 'Contar una región triangular', explanation: 'Para n = 4 el resultado es 6. La salida es long porque el número de parejas puede superar Integer.MAX_VALUE aunque n sea un int válido.', code: `static long contarPares(int n) {
    if (n < 0) throw new IllegalArgumentException("n negativo");
    long cuenta = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            cuenta++;
        }
    }
    return cuenta;
}` },
      practice: { title: 'Una anidación que es lineal', prompt: 'Analizá este patrón para n ≥ 1: p toma los valores 1, 2, 4… mientras p ≤ n; para cada p, otro ciclo realiza p operaciones. Usá long para p si n es int. Escribí la suma exacta en función de ⌊log₂ n⌋ y justificá una cota Θ(n). Comparalo con hacer n operaciones en cada iteración exterior.' },
      takeaways: ['Las secuencias suman costos y las anidaciones requieren contar por iteración.', 'Los límites dependientes se expresan con sumas.', 'La cantidad de operaciones y la cantidad de variables son medidas distintas.'], lab: 'complexity',
    },
    {
      id: 'm02-recurrencias', moduleId: 2, title: 'Recurrencias y teorema maestro', duration: 30,
      summary: 'Modelá llamadas recursivas, resolvé árboles de recurrencia y aplicá el teorema maestro con sus condiciones.',
      objectives: ['Separar llamadas recursivas y trabajo local.', 'Resolver recurrencias por niveles.', 'Aplicar los tres casos clásicos del teorema maestro.'], prerequisites: ['Recursión del módulo 1.', 'Logaritmos, sumas y cotas asintóticas.'],
      sections: [
        { title: 'La ecuación nace del procedimiento', paragraphs: [
          'Una relación de recurrencia expresa el costo de un problema mediante costos de instancias más pequeñas. Si un método procesa un elemento y llama al resto, T(n) = T(n − 1) + Θ(1), con T(0) = Θ(1). Desplegarla n veces produce Θ(n). La ecuación necesita tanto la parte recursiva como el caso base.',
          'Si un método divide un arreglo en dos mitades y suma los resultados, hace dos llamadas de tamaño aproximadamente n/2 y trabajo local constante: T(n) = 2T(n/2) + Θ(1). No debemos agregar un recorrido de n si el código no lo hace. Copiar las mitades, en cambio, sí agregaría trabajo proporcional al tamaño y cambiaría la recurrencia.',
        ] },
        { title: 'Mirar el árbol por niveles', paragraphs: [
          'En T(n) = 2T(n/2) + Θ(n), el primer nivel aporta Θ(n), el siguiente tiene dos problemas de costo local Θ(n/2) cada uno y vuelve a aportar Θ(n). Hay Θ(log n) niveles hasta llegar a tamaños constantes. El total es Θ(n log n), como ocurre al fusionar resultados de dos mitades ordenadas.',
          'En 2T(n/2) + Θ(1), el trabajo por nivel aumenta como 1, 2, 4… y el último nivel tiene Θ(n) hojas: el total es Θ(n). La altura del árbol por sí sola no es el tiempo total. Tampoco el número total de llamadas determina la memoria: en una ejecución secuencial solo queda activa una cadena de llamadas junto con el estado retenido por sus antecesoras.',
        ] },
        { title: 'Los tres casos clásicos', paragraphs: [
          'El teorema maestro se aplica a recurrencias de la forma T(n) = aT(n/b) + f(n), con a ≥ 1 y b > 1 constantes, subproblemas de tamaño uniforme y f(n) asintóticamente no negativa. Comparamos f(n) con nᵖ, donde p = log_b a. Redondeos habituales no alteran estas conclusiones cuando las hipótesis se conservan.',
          'Caso 1: si f(n) = O(nᵖ⁻ᵋ) para algún ε > 0, domina la cantidad de hojas y T(n) = Θ(nᵖ). Caso 2 clásico: si f(n) = Θ(nᵖ), cada nivel contribuye del mismo orden y T(n) = Θ(nᵖ log n). Caso 3: si f(n) = Ω(nᵖ⁺ᵋ) y se cumple la regularidad a·f(n/b) ≤ c·f(n) para alguna c < 1 a partir de cierto tamaño, entonces T(n) = Θ(f(n)).',
        ], bullets: ['2T(n/2) + 1 → caso 1 → Θ(n).', '2T(n/2) + n → caso 2 → Θ(n log n).', '2T(n/2) + n² → caso 3 → Θ(n²).'] },
        { title: 'Saber cuándo no usarlo', paragraphs: [
          'T(n) = T(n − 1) + 1 no reduce el tamaño por un factor constante y no entra en este formato. Tampoco lo hace T(n) = T(n/3) + T(2n/3) + n, porque las ramas tienen tamaños distintos. Que una recurrencia no encaje no significa que no tenga solución: podemos desplegarla, usar sustitución o aplicar otros resultados con hipótesis adecuadas.',
          'En el ejemplo de suma dividida, la memoria auxiliar es Θ(log n), porque la profundidad es logarítmica y cada llamada retiene una cantidad constante de datos. El tiempo es Θ(n) porque todas las hojas deben aportar sus valores. La separación entre cantidad total de nodos y profundidad vuelve a ser esencial.',
          'Una buena resolución termina comprobando el resultado contra el código y el caso base. Si obtenemos tiempo sublineal para una suma exacta de todos los elementos arbitrarios de un arreglo sin información adicional, algo probablemente quedó fuera de la cuenta. Revisar pequeñas potencias de dos ayuda a detectar una ecuación mal planteada.',
        ] },
      ],
      complexity: { time: 'Θ(n)', space: 'Θ(log n) auxiliar para n ≥ 2', explanation: 'La suma por intervalos genera dos subproblemas de mitad de tamaño y trabajo local constante. Para n = 0 o 1, tiempo y espacio son constantes.' },
      pitfalls: ['Aplicar el teorema maestro sin verificar el formato.', 'Olvidar la condición de regularidad del caso 3.', 'Confundir profundidad recursiva con número total de llamadas.'],
      solved: { title: 'Sumar sin copiar las mitades', explanation: 'Usamos intervalos semiabiertos [desde, hasta). La condición de intervalo vacío permite sumar un arreglo vacío. El acumulado usa long y cada posición se incorpora una sola vez.', code: `static long sumarDividido(int[] a) {
    if (a == null) throw new IllegalArgumentException("Arreglo nulo");
    return sumarRango(a, 0, a.length);
}
private static long sumarRango(int[] a, int desde, int hasta) {
    if (desde == hasta) return 0L;
    if (hasta - desde == 1) return a[desde];
    int medio = desde + (hasta - desde) / 2;
    return sumarRango(a, desde, medio) + sumarRango(a, medio, hasta);
}` },
      practice: { title: 'Elegir la herramienta correcta', prompt: 'Resolvé T(n)=T(n−1)+3, T(n)=4T(n/2)+n y T(n)=2T(n/2)+n² con base constante. Indicá dónde se aplica el teorema maestro, qué caso corresponde y por qué la primera necesita otra técnica. Para la tercera, verificá explícitamente la regularidad.' },
      takeaways: ['La recurrencia modela lo que realmente ejecuta cada llamada.', 'El teorema maestro tiene un dominio de aplicación concreto.', 'Memoria recursiva requiere estudiar la cadena activa, no sumar todas las llamadas.'], lab: 'complexity',
    },
    {
      id: 'm02-amortizado', moduleId: 2, title: 'Análisis amortizado y comparación de estrategias', duration: 27,
      summary: 'Explicá por qué una operación ocasionalmente costosa puede convivir con un costo constante por operación en una secuencia completa.',
      objectives: ['Distinguir amortizado y promedio probabilístico.', 'Analizar expansión geométrica por agregación.', 'Comparar decisiones con costos de preparación y memoria.'], prerequisites: ['Series geométricas y cotas.', 'Arreglos y copias.'],
      sections: [
        { title: 'El costo de una secuencia', paragraphs: [
          'Un arreglo dinámico combina un arreglo de capacidad reservada con una cantidad de elementos utilizados. Mientras queda lugar, agregar al final escribe una sola posición. Cuando se llena, puede crear otro arreglo de capacidad doble y copiar los elementos. Esa inserción particular cuesta tiempo lineal en la cantidad almacenada.',
          'El análisis amortizado pregunta cuánto cuesta una secuencia completa y reparte ese costo entre sus operaciones. No usa probabilidades sobre las entradas. Una garantía amortizada vale para cualquier secuencia permitida, aunque una persona elija deliberadamente los valores. Eso la distingue del tiempo esperado de una tabla hash o de un promedio basado en posiciones aleatorias.',
        ] },
        { title: 'Una suma geométrica paga las copias', paragraphs: [
          'Empezando con capacidad 1 y duplicando cuando hace falta, las expansiones copian 1, 2, 4, 8… elementos. Antes de completar m inserciones, la suma de las copias es menor que 2m. Además hacemos m escrituras de elementos nuevos y una cantidad constante de controles por operación. El costo total es Θ(m), por lo tanto agregar tiene costo amortizado Θ(1).',
          'Si aumentáramos la capacidad solamente en una posición, copiaríamos 1 + 2 + … + (m − 1), que es Θ(m²). La mejora depende de la política geométrica, no de llamar “dinámico” al arreglo. Podemos cambiar el factor de crecimiento y conservar una garantía similar si es una constante estrictamente mayor que uno.',
        ] },
        { title: 'Otras formas de ver el mismo presupuesto', paragraphs: [
          'El método contable cobra a cada inserción unas unidades extra y guarda el excedente para financiar una copia futura. El método potencial asigna un valor no negativo al estado de la estructura, como una reserva de trabajo pagado. Ambos formalizan la intuición de que las operaciones baratas acumulan recursos para las caras; no necesitan que una copia deje de costar lo que realmente cuesta.',
          'En este nivel basta la agregación para demostrar el resultado. Aun así, distinguir costo real y amortizado evita una promesa equivocada: una aplicación que necesita latencia máxima baja puede verse afectada por una expansión individual aunque el promedio de la secuencia sea pequeño. El requisito de respuesta inmediata y la eficiencia total son criterios diferentes.',
        ] },
        { title: 'El tiempo se compra con memoria y preparación', paragraphs: [
          'Duplicar capacidad deja posiciones libres, por lo que usamos espacio Θ(m) y temporalmente pueden coexistir el arreglo anterior y el nuevo. La memoria auxiliar de una expansión concreta es Θ(m). Una implementación real también debe manejar límites de capacidad y fallos de asignación; el análisis asintótico no garantiza memoria física ilimitada.',
          'Para elegir entre búsqueda lineal y ordenar antes de buscar, contamos todo el trabajo. Con q consultas sobre datos estables, q recorridos lineales cuestan O(qn); preparar con un ordenamiento de peor caso O(n log n) y luego búsquedas binarias cuesta O(n log n + q log n). Si las consultas modifican los datos o necesitan conservar el orden original, aparecen costos y restricciones adicionales.',
          'La práctica de este módulo consiste en formular estas comparaciones con hipótesis visibles. Un cuadro útil incluye contrato, tamaño, caso analizado, tiempo, espacio y preparación. No hay una etiqueta que sustituya esas decisiones: una estructura con mejor crecimiento puede ser innecesaria para pocos elementos o incompatible con la memoria disponible.',
        ] },
      ],
      complexity: { time: 'Θ(1) amortizado por agregado', space: 'Θ(n) almacenado; Θ(n) durante expansión', explanation: 'La garantía se refiere a la secuencia de agregados con crecimiento por duplicación. Una inserción que copia n elementos conserva costo real Θ(n).' },
      pitfalls: ['Confundir amortizado con promedio probabilístico.', 'Afirmar que cada agregado individual tarda tiempo constante.', 'Crecer de uno en uno y esperar el mismo análisis geométrico.'],
      solved: { title: 'Un arreglo dinámico de enteros', explanation: 'La clase demuestra la política de duplicación. Se rechaza una expansión que desbordaría el tamaño int. En una aplicación real podrían aparecer límites de asignación antes de ese valor.', code: `static final class Vector {
    private int[] datos = new int[1];
    private int cantidad;
    void agregar(int valor) {
        if (cantidad == datos.length) {
            if (datos.length > Integer.MAX_VALUE / 2) {
                throw new IllegalStateException("Capacidad máxima de esta implementación");
            }
            int[] nuevo = new int[datos.length * 2];
            System.arraycopy(datos, 0, nuevo, 0, cantidad);
            datos = nuevo;
        }
        datos[cantidad++] = valor;
    }
    int cantidad() { return cantidad; }
}` },
      practice: { title: 'Una política de crecimiento distinta', prompt: 'Compará agregar 1.000 elementos con capacidad inicial 1 y dos políticas: duplicar o agregar una sola posición. Calculá el número total de elementos copiados. Indicá costo real máximo, costo amortizado y memoria. Después explicá qué cambiaría si se triplicara la capacidad.' },
      takeaways: ['La amortización distribuye un costo de secuencia sin usar azar.', 'El crecimiento geométrico limita el total de copias.', 'Una garantía amortizada no limita la latencia de cada operación individual.'], lab: 'complexity',
    },
  ],
  exercises: [
    { id: 'm02-e-casos', moduleId: 2, title: 'Esperanza de búsqueda', kind: 'prediction', difficulty: 'Inicial', prompt: 'El objetivo está presente exactamente una vez en un arreglo de 7 elementos y todas las posiciones son equiprobables. ¿Cuántas comparaciones se esperan?', input: 'n = 7; éxito seguro; posición uniforme', expected: 'Un número entero.', constraints: ['Contar solo comparaciones con el objetivo.'], starter: '', answer: '4', accepted: ['4.0'], hints: ['Cada posición posible aporta un costo entre 1 y 7.', 'Sumá 1 + 2 + … + 7 y dividí entre 7.'], solution: '(1 + 2 + 3 + 4 + 5 + 6 + 7) / 7 = 4', explanation: 'La esperanza pondera cada costo por probabilidad 1/7; no existe evento de ausencia en este contrato.', lessonId: 'm02-modelo' },
    { id: 'm02-e-triangulo', moduleId: 2, title: 'Contar parejas', kind: 'complexity', difficulty: 'Inicial', prompt: 'Clasificá de forma ajustada el peor caso de dos ciclos con 0 ≤ i < n y i < j < n, sin salidas anticipadas.', input: 'Trabajo constante por pareja (i, j)', expected: 'Theta(n^2)', constraints: ['Dar una cota ajustada.'], starter: '', answer: 'Theta(n^2)', accepted: ['Θ(n²)', 'Θ(n^2)', 'n^2'], hints: ['Contá las iteraciones interiores para cada valor de i.', 'La suma es (n−1) + (n−2) + … + 1.'], solution: 'Θ(n²), porque n(n−1)/2 = (n²−n)/2.', explanation: 'La región es triangular pero sigue conteniendo una cantidad cuadrática de parejas. O(n²) es una cota superior correcta; Θ es más informativa.', lessonId: 'm02-ciclos' },
    { id: 'm02-e-debug', moduleId: 2, title: 'Una recurrencia mal modelada', kind: 'debug', difficulty: 'Intermedio', prompt: 'Un método hace dos llamadas sobre mitades sin copiarlas y suma sus dos resultados con trabajo constante. Se anotó T(n)=2T(n/2)+n. ¿Qué término local corresponde?', input: 'Caso base de tamaño 1; no hay recorridos ni copias', expected: 'Theta(1)', constraints: ['Responder el trabajo local, no el costo total.'], starter: '', answer: 'Theta(1)', accepted: ['Θ(1)', 'O(1)', '1'], hints: ['Separá el trabajo de las llamadas del trabajo que hace su padre.', 'Sumar dos resultados de tamaño fijo no recorre el arreglo.'], solution: 'T(n)=2T(n/2)+Θ(1), por lo tanto T(n)=Θ(n).', explanation: 'El término +n inventaba un recorrido inexistente.', lessonId: 'm02-recurrencias' },
    { id: 'm02-e-instrumentar', moduleId: 2, title: 'Instrumentar un algoritmo', kind: 'implementation', difficulty: 'Inicial', prompt: 'Este espacio no compila ni ejecuta código: la revisión es manual. Escribí un método Java que cuente las comparaciones de una búsqueda lineal y documentá mejor y peor caso, incluyendo vacío.', input: 'int[] no nulo y objetivo int', expected: 'Código y justificación manual.', constraints: ['No modificar el arreglo.', 'Contar la comparación que encuentra el objetivo.'], starter: 'static int comparaciones(int[] a, int objetivo) {\n    // Tu solución\n}', answer: '', accepted: [], hints: ['La comparación exitosa también debe contarse.', 'Incrementá antes de comprobar si hay coincidencia.'], solution: 'Usá un contador inicial 0; por cada elemento, incrementalo y retorná si coincide. Si se agota, devolvé el contador.', explanation: 'Revisá retorno anticipado, resultado 0 para vacío y n para ausencia. La clasificación debe declarar n y el recurso contado.', lessonId: 'm02-modelo' },
    { id: 'm02-e-comparar', moduleId: 2, title: 'Justificar una preparación', kind: 'implementation', difficulty: 'Intermedio', prompt: 'Este espacio no compila ni ejecuta código: la revisión es manual. Diseñá pseudocódigo para responder q búsquedas sobre un arreglo estable mediante ordenamiento previo y búsqueda binaria. Compará su costo con q búsquedas lineales y explicá si conservás el orden de entrada.', input: 'Arreglo de n enteros; q objetivos', expected: 'Pseudocódigo, contrato y análisis.', constraints: ['Incluir costo de ordenar y de una eventual copia.', 'Distinguir caso q = 1 de muchas consultas.'], starter: '// Contrato, preparación, consultas y comparación de costos', answer: '', accepted: [], hints: ['La preparación se paga una vez y la búsqueda se repite q veces.', 'Expresá el total con n y q, sin fijar uno de ellos como constante.'], solution: 'Copiar si debe conservarse la entrada; ordenar una vez con garantía O(n log n); responder cada consulta con búsqueda O(log n). Total O(n log n + q log n), frente a O(qn).', explanation: 'La conveniencia depende de q y de las restricciones. No basta comparar O(log n) contra O(n) omitiendo la preparación.', lessonId: 'm02-amortizado' },
  ],
  questions: [
    { id: 'm02-q1', moduleId: 2, type: 'choice', prompt: '¿Qué requiere un análisis de caso promedio?', options: ['Una distribución de probabilidad de entradas.', 'Solo el mejor caso.', 'Promediar las cotas máxima y mínima.'], answer: 0, explanation: 'La esperanza se calcula con probabilidades explícitas de los costos posibles.', lessonId: 'm02-modelo' },
    { id: 'm02-q2', moduleId: 2, type: 'truefalse', prompt: 'La pila de llamadas forma parte del espacio auxiliar.', options: ['Verdadero.', 'Falso.'], answer: 0, explanation: 'Cada marco activo conserva información aunque no exista una asignación explícita de arreglos.', lessonId: 'm02-modelo' },
    { id: 'm02-q3', moduleId: 2, type: 'complexity', prompt: '¿Qué cota ajustada describe 8n + 200?', options: ['Θ(n).', 'Θ(1).', 'Θ(n²).'], answer: 0, explanation: 'El término lineal domina y los factores constantes no cambian el orden.', lessonId: 'm02-cotas' },
    { id: 'm02-q4', moduleId: 2, type: 'order', prompt: 'Elegí el orden de menor a mayor crecimiento eventual.', options: ['log n, n, n log n, n², 2ⁿ, n!.', 'n, log n, n², n log n, n!, 2ⁿ.', 'log n, n log n, n, 2ⁿ, n², n!.'], answer: 0, explanation: 'La comparación es para n suficientemente grande; valores pequeños pueden ocultar diferencias.', lessonId: 'm02-cotas' },
    { id: 'm02-q5', moduleId: 2, type: 'prediction', prompt: '¿Cuántos pares i < j hay con n = 5?', options: ['10.', '25.', '5.'], answer: 0, explanation: 'Cada posición puede emparejarse con otras cuatro, pero dividir entre dos evita contar dos veces cada par: 5·4/2 = 10.', lessonId: 'm02-ciclos' },
    { id: 'm02-q6', moduleId: 2, type: 'complexity', prompt: 'Dos recorridos consecutivos de n elementos cuestan…', options: ['Θ(n).', 'Θ(n²).', 'Θ(log n).'], answer: 0, explanation: 'Los costos se suman: n + n = 2n.', lessonId: 'm02-ciclos' },
    { id: 'm02-q7', moduleId: 2, type: 'choice', prompt: '¿Qué recurrencia encaja directamente en el teorema maestro clásico?', options: ['2T(n/2) + n.', 'T(n−1) + 1.', 'T(n/3) + T(2n/3) + n.'], answer: 0, explanation: 'La forma requiere un número constante de subproblemas de igual tamaño n/b.', lessonId: 'm02-recurrencias' },
    { id: 'm02-q8', moduleId: 2, type: 'prediction', prompt: 'Si T(n)=2T(n/2)+Θ(n) y la base es constante, ¿qué resultado corresponde?', options: ['Θ(n log n).', 'Θ(n).', 'Θ(log n).'], answer: 0, explanation: 'Con a=2 y b=2, f(n)=Θ(n^log₂2); aplica el segundo caso clásico.', lessonId: 'm02-recurrencias' },
    { id: 'm02-q9', moduleId: 2, type: 'truefalse', prompt: 'Una cota amortizada constante permite alguna operación individual lineal.', options: ['Verdadero.', 'Falso.'], answer: 0, explanation: 'La garantía limita el costo total de la secuencia, no cada costo individual.', lessonId: 'm02-amortizado' },
    { id: 'm02-q10', moduleId: 2, type: 'order', prompt: 'Ordená el razonamiento de una expansión por duplicación.', options: ['Enumerar copias → sumar la serie geométrica → dividir el total entre operaciones.', 'Dividir primero → ignorar copias → medir una ejecución.', 'Contar variables → suponer costo constante → duplicar.'], answer: 0, explanation: 'La agregación demuestra un costo total lineal y luego obtiene el costo por operación.', lessonId: 'm02-amortizado' },
  ],
  glossary: [
    { term: 'Modelo de costo', definition: 'Hipótesis sobre qué operaciones se cuentan y cuánto cuestan según la representación de los datos.', lessonId: 'm02-modelo' },
    { term: 'Cota ajustada Θ', definition: 'Descripción asintótica que acota una función por arriba y por abajo con constantes positivas.', lessonId: 'm02-cotas' },
    { term: 'Recurrencia', definition: 'Relación que expresa el costo de una instancia mediante costos de instancias menores y trabajo local.', lessonId: 'm02-recurrencias' },
    { term: 'Teorema maestro', definition: 'Resultado para ciertas recurrencias aT(n/b)+f(n), sujeto a condiciones sobre la comparación y regularidad de f.', lessonId: 'm02-recurrencias' },
    { term: 'Costo amortizado', definition: 'Costo por operación obtenido al acotar una secuencia completa, sin requerir una distribución aleatoria.', lessonId: 'm02-amortizado' },
    { term: 'Espacio auxiliar', definition: 'Memoria adicional a la entrada, aclarando si se excluye la salida e incluyendo marcos recursivos.', lessonId: 'm02-modelo' },
  ],
};
