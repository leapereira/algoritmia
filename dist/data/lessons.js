export const lessons = [
    {
        id: 'algoritmos',
        moduleId: 1,
        title: 'Qué es un algoritmo',
        duration: 18,
        summary: 'Convertí un problema en un procedimiento preciso y descubrí cómo se relacionan los algoritmos con las estructuras de datos.',
        objectives: [
            'Distinguir problema, algoritmo, programa y estructura de datos.',
            'Escribir un contrato con entradas, resultados y casos límite.',
            'Diseñar un recorrido para encontrar el máximo de un arreglo.',
            'Explicar por qué un resultado correcto en un ejemplo no constituye una demostración.',
        ],
        prerequisites: ['Arreglos, métodos y tipos primitivos de Java.'],
        sections: [
            {
                title: 'Del problema al procedimiento',
                paragraphs: [
                    'Un problema describe qué queremos conseguir. Un algoritmo especifica cómo conseguirlo mediante pasos precisos, ejecutables y organizados. Para las entradas admitidas por su contrato, debe producir el resultado indicado y terminar. La descripción es finita, aunque la cantidad de pasos que se ejecuta puede depender del tamaño de la entrada.',
                    '“Encontrar el número más grande” plantea un objetivo, pero todavía deja decisiones abiertas. ¿Recibimos dos números o un arreglo? ¿Puede estar vacío? ¿Qué hacemos con valores repetidos? Un algoritmo comienza a tomar forma cuando resolvemos esas preguntas y describimos operaciones que otro ejecutor pueda realizar sin adivinar nuestra intención.',
                    'Un programa es una implementación en un lenguaje concreto. El mismo algoritmo puede escribirse en Java, Python o pseudocódigo. Un programa completo también incluye interfaz, validación, archivos y otras tareas; el algoritmo es el procedimiento que resuelve el problema que estamos estudiando.',
                ],
            },
            {
                title: 'Los datos también tienen una organización',
                paragraphs: [
                    'Una estructura de datos organiza información y define cómo acceder a ella o modificarla. Un arreglo permite consultar una posición por su índice. Una lista, una pila y un conjunto ofrecen otras operaciones y garantías. Elegir una estructura y elegir un algoritmo son decisiones relacionadas: el procedimiento aprovecha las operaciones disponibles.',
                    'En este módulo trabajaremos principalmente con int[]. Sus posiciones válidas van desde 0 hasta length − 1. Consultar valores[i] no busca el valor: accede directamente a una posición. Encontrar el mayor, en cambio, exige comparar candidatos. Es posible conocer perfectamente la sintaxis de los arreglos y todavía necesitar diseñar ese recorrido.',
                    'Más adelante una misma tarea podrá resolverse con estructuras distintas. Por ahora conviene distinguir la información almacenada —los números— de la organización elegida —el arreglo— y de las acciones que hacemos sobre ella —recorrer y comparar—.',
                ],
            },
            {
                title: 'Antes del código: el contrato',
                paragraphs: [
                    'Para calcular un máximo, elegimos este contrato: la entrada es un arreglo no nulo con al menos un entero; la salida es un valor que aparece en el arreglo y que no es menor que ninguno de sus elementos. El procedimiento no modifica el arreglo. Esas condiciones de entrada son precondiciones; la garantía final es una postcondición.',
                    'Un arreglo vacío no tiene máximo. Podríamos representarlo con OptionalInt o definir otro contrato, pero aquí lanzaremos IllegalArgumentException. Nunca usaremos 0 como respuesta especial: 0 es un entero válido y sería incorrecto para una entrada como [−8, −3, −11]. Un arreglo de un solo elemento sí tiene máximo: ese elemento.',
                ],
                bullets: [
                    'Entrada ordinaria: [4, 1, 9, 2] → 9.',
                    'Todos negativos: [−8, −3, −11] → −3.',
                    'Máximo repetido: [7, 2, 7] → 7.',
                    'Un elemento: [5] → 5; arreglo vacío o nulo → excepción definida por el contrato.',
                ],
            },
            {
                title: 'Construir una respuesta mientras recorremos',
                paragraphs: [
                    'Tomamos el primer elemento como mejor candidato. Luego visitamos cada posición restante. Si el valor visitado supera al candidato, lo reemplazamos; si no, lo conservamos. Al finalizar, todos los elementos habrán tenido la oportunidad de convertirse en máximo.',
                    'Para [4, 1, 9, 2], el candidato empieza en 4. Al mirar 1 sigue en 4; al mirar 9 pasa a 9; al mirar 2 permanece en 9. El índice indica dónde estamos, mientras que mejor resume lo que ya sabemos del prefijo recorrido. Esta idea de mantener un resumen aparecerá en muchas soluciones.',
                    'No necesitamos ordenar el arreglo ni crear una copia. Ordenar resolvería un problema más amplio y agregaría trabajo. El diseño útil aquí consiste en conservar solamente la información necesaria para responder nuestra pregunta.',
                ],
                code: `static int maximo(int[] valores) {
    if (valores == null || valores.length == 0) {
        throw new IllegalArgumentException("Se requiere un arreglo no vacío");
    }
    int mejor = valores[0];
    for (int i = 1; i < valores.length; i++) {
        if (valores[i] > mejor) {
            mejor = valores[i];
        }
    }
    return mejor;
}`,
                language: 'java',
            },
            {
                title: 'Entender una solución, además de ejecutarla',
                paragraphs: [
                    'Una traza registra el estado después de cada paso y ayuda a descubrir errores. Probar entradas variadas también aporta evidencia. Sin embargo, diez ejemplos correctos no garantizan que el programa funcione con cualquier entrada válida. Para esa garantía necesitaremos razonar sobre lo que se mantiene verdadero durante todo el recorrido.',
                    'Ya podemos anticipar ese razonamiento: después de visitar cierta cantidad de posiciones, mejor contiene el máximo de las posiciones visitadas. La lección de correctitud convertirá esta observación en una demostración. También distinguiremos cuántas operaciones realiza el algoritmo de cuántos milisegundos tarda una ejecución particular.',
                ],
            },
        ],
        complexity: {
            time: 'Θ(n)',
            space: 'Θ(1) auxiliar',
            explanation: 'Para n ≥ 1 se hacen exactamente n − 1 comparaciones entre elementos, además de trabajo constante por iteración. Solo se guardan el índice y el candidato; el arreglo de entrada no cuenta como memoria auxiliar.',
        },
        pitfalls: [
            'Inicializar el máximo en 0 hace fallar los arreglos cuyos elementos son todos negativos.',
            'Acceder a valores[0] antes de validar vacío y null incumple el contrato de errores elegido.',
            'Usar i <= valores.length intenta acceder a una posición inexistente.',
            'Confundir el valor máximo con el índice donde aparece.',
        ],
        solved: {
            title: 'Devolver la primera posición del máximo',
            explanation: 'Guardamos un índice en vez de un valor. Actualizarlo solo cuando encontramos un valor estrictamente mayor conserva la primera aparición en caso de empate. El contrato sigue exigiendo una entrada no nula y no vacía.',
            code: `static int indiceDelMaximo(int[] valores) {
    if (valores == null || valores.length == 0) {
        throw new IllegalArgumentException("Se requiere un arreglo no vacío");
    }
    int posicion = 0;
    for (int i = 1; i < valores.length; i++) {
        if (valores[i] > valores[posicion]) {
            posicion = i;
        }
    }
    return posicion;
}`,
        },
        practice: {
            title: 'Máximo y cantidad de apariciones',
            prompt: 'Diseñá un método que reciba un int[] no nulo y no vacío y devuelva cuántas veces aparece su valor máximo. Escribí primero el contrato y una traza para [3, 8, 8, 2, 8]. Resolvelo en un único recorrido, sin modificar el arreglo. Verificá también [−4], [−5, −2, −2] y [7, 7, 7]. Explicá qué ocurre con el contador al encontrar un máximo nuevo.',
        },
        takeaways: [
            'El problema fija el resultado; el algoritmo describe los pasos; el programa los implementa.',
            'El contrato elimina ambigüedades y hace explícitos los casos límite.',
            'El estado de un recorrido puede resumir información de los elementos ya visitados.',
            'La estructura de datos influye en las operaciones que podemos realizar con eficiencia.',
        ],
        visualization: 'max',
    },
    {
        id: 'pseudocodigo',
        moduleId: 1,
        title: 'Pseudocódigo y diagramas de flujo',
        duration: 20,
        summary: 'Expresá una misma solución con palabras precisas, pseudocódigo y un diagrama; aplicalo a invertir un arreglo.',
        objectives: [
            'Escribir pseudocódigo independiente de la sintaxis de Java.',
            'Interpretar secuencias, decisiones y repeticiones en un diagrama de flujo.',
            'Diseñar una inversión in situ con dos índices.',
            'Traducir una especificación a Java sin cambiar su significado.',
        ],
        prerequisites: ['La lección «Qué es un algoritmo».', 'Asignaciones e índices de arreglos en Java.'],
        sections: [
            {
                title: 'Una descripción que se pueda ejecutar a mano',
                paragraphs: [
                    'El pseudocódigo expresa un algoritmo con una notación legible, sin exigir todos los detalles de un lenguaje de programación. No existe una única sintaxis universal. Lo importante es declarar convenciones y mantener un significado preciso: una persona debería poder seguir los pasos y obtener siempre el mismo resultado para la misma entrada.',
                    'Usaremos ← para asignar, = para comparar en pseudocódigo, índices desde 0 y longitud(A) para el tamaño. En Java la asignación usa = y la comparación de enteros usa ==. Traducir requiere preservar el significado de cada operación, no reemplazar símbolos mecánicamente.',
                    'El nivel de detalle depende del propósito. “Intercambiar A[i] y A[j]” puede ser una operación suficientemente clara cuando todos entienden el intercambio; al implementarlo tendremos que conservar temporalmente uno de los valores. “Resolver el problema” nunca es un paso útil porque oculta justamente el procedimiento que queremos describir.',
                ],
            },
            {
                title: 'Especificar la inversión',
                paragraphs: [
                    'Invertir un arreglo significa colocar sus elementos en el orden opuesto. Para una longitud n, la posición final k debe contener el valor que estaba originalmente en n − 1 − k. La palabra “originalmente” importa: la postcondición se refiere al estado previo a las modificaciones.',
                    'Elegimos una operación in situ: modifica el mismo arreglo y no crea otro. Cualquier referencia que apunte a ese arreglo observará el cambio. Admitimos arreglos vacíos y de un elemento, porque ya cumplen la postcondición sin realizar intercambios. Rechazamos una referencia nula porque no representa un arreglo.',
                    'Ubicamos un índice en cada extremo. Intercambiamos esos elementos y avanzamos ambos hacia el centro. Cuando los índices se encuentran o se cruzan, no quedan parejas pendientes. En una longitud impar el elemento central permanece en su lugar.',
                ],
            },
            {
                title: 'Pseudocódigo de dos índices',
                paragraphs: [
                    'La condición izquierda < derecha evita intercambiar una posición consigo misma. Actualizar los dos índices reduce la región pendiente en dos elementos. La variable temporal conserva un dato que perderíamos si escribiéramos una asignación sobre la otra sin guardarlo primero.',
                    'Para [2, 5, 8, 1, 6], el primer intercambio produce [6, 5, 8, 1, 2]. El segundo produce [6, 1, 8, 5, 2]. Los índices quedan ambos en 2 y el ciclo termina. El 8 central no necesita moverse.',
                ],
                code: `PROCEDIMIENTO invertir(A)
    EXIGIR que A no sea nulo
    izquierda ← 0
    derecha ← longitud(A) − 1

    MIENTRAS izquierda < derecha HACER
        temporal ← A[izquierda]
        A[izquierda] ← A[derecha]
        A[derecha] ← temporal
        izquierda ← izquierda + 1
        derecha ← derecha − 1
    FIN MIENTRAS
FIN PROCEDIMIENTO`,
                language: 'text',
            },
            {
                title: 'Leer el flujo de control',
                paragraphs: [
                    'Un diagrama de flujo representa las operaciones mediante nodos y flechas. Habitualmente un óvalo indica inicio o fin, un rectángulo una acción y un rombo una decisión. Las salidas de una decisión deben indicar qué condición corresponde a cada camino. La forma del dibujo ayuda, pero la precisión está en las condiciones y las operaciones.',
                    'El siguiente esquema textual representa el mismo ciclo. La flecha de retorno significa que, después de actualizar los índices, volvemos a evaluar la condición. No es una recursión: seguimos dentro de la misma invocación. El camino “no” permite salir inmediatamente cuando la entrada está vacía o contiene un solo elemento.',
                ],
                code: `Inicio
  ↓
Validar A; izquierda ← 0; derecha ← longitud(A) − 1
  ↓
¿izquierda < derecha? ── no ──→ Fin
  │ sí
  ↓
Intercambiar A[izquierda] y A[derecha]
  ↓
izquierda ← izquierda + 1; derecha ← derecha − 1
  │
  └──────────→ volver a la decisión`,
                language: 'text',
            },
            {
                title: 'De la representación a la implementación',
                paragraphs: [
                    'El pseudocódigo permite revisar la idea antes de discutir detalles de Java. Al traducirlo comprobamos que cada acceso al arreglo ocurre únicamente mientras ambos índices son válidos. Con longitud 0, derecha vale −1, pero nunca se usa para acceder al arreglo porque la condición inicial ya es falsa.',
                    'Una buena traza registra el estado inicial, la condición, cada modificación y el estado final. Escribir únicamente el resultado esperado no permite ver dónde aparece un error. Para este algoritmo conviene incluir longitudes pares e impares y elementos repetidos: los valores pueden coincidir, pero sus posiciones siguen teniendo significado.',
                    'Pseudocódigo, diagrama y Java describen la misma solución desde representaciones diferentes. No son tres algoritmos distintos. La elección de representación debe ayudar a comunicar o verificar la idea; un diagrama enorme puede resultar menos claro que unas pocas líneas bien nombradas.',
                ],
            },
        ],
        complexity: {
            time: 'Θ(n)',
            space: 'Θ(1) auxiliar',
            explanation: 'Se realizan exactamente ⌊n/2⌋ intercambios; cada uno usa una cantidad constante de operaciones. El trabajo total se expresa como Θ(n + 1) si incluimos n = 0. Solo se guardan dos índices y un temporal.',
        },
        pitfalls: [
            'Asignar A[izquierda] = A[derecha] y luego A[derecha] = A[izquierda] duplica un valor y pierde el otro.',
            'Recorrer todas las posiciones intercambiando con su simétrica invierte dos veces y recupera el orden inicial.',
            'Olvidar mover uno de los índices deja una parte del arreglo sin resolver.',
            'Crear una copia cuando el contrato exige modificar el arreglo recibido cambia el comportamiento observable.',
        ],
        solved: {
            title: 'Inversión in situ en Java',
            explanation: 'El método devuelve void porque su resultado es la modificación del arreglo. En una entrada vacía, derecha vale −1 y el cuerpo nunca se ejecuta; en una entrada de un elemento tampoco hace falta intercambiar. null se rechaza explícitamente.',
            code: `static void invertir(int[] valores) {
    if (valores == null) {
        throw new IllegalArgumentException("El arreglo no puede ser nulo");
    }
    int izquierda = 0;
    int derecha = valores.length - 1;
    while (izquierda < derecha) {
        int temporal = valores[izquierda];
        valores[izquierda] = valores[derecha];
        valores[derecha] = temporal;
        izquierda++;
        derecha--;
    }
}`,
        },
        practice: {
            title: 'Invertir un intervalo',
            prompt: 'Adaptá la inversión para invertir solo las posiciones entre desde y hasta, ambas incluidas. Exigí 0 ≤ desde ≤ hasta < longitud y una entrada no nula. Escribí el contrato, pseudocódigo, un esquema de flujo y Java. Para [10, 20, 30, 40, 50], desde = 1 y hasta = 3, el resultado debe ser [10, 40, 30, 20, 50]. Probá también un intervalo de una posición y explicá por qué lo que queda fuera no cambia.',
        },
        takeaways: [
            'El pseudocódigo necesita convenciones explícitas, aunque no tenga un compilador.',
            'Un ciclo combina una condición de permanencia con operaciones que hacen avanzar el estado.',
            'La inversión con dos índices resuelve una pareja por iteración.',
            'In situ significa modificar la estructura recibida; conviene documentar ese efecto.',
        ],
        visualization: 'reverse',
    },
    {
        id: 'control',
        moduleId: 1,
        title: 'Variables, decisiones, ciclos y funciones',
        duration: 24,
        summary: 'Usá las herramientas de control de Java para recorrer datos con intención y detectar valores duplicados sin comparar pares de más.',
        objectives: [
            'Relacionar cada variable con un significado dentro del algoritmo.',
            'Elegir condiciones y límites de iteración coherentes con el contrato.',
            'Descomponer una solución en métodos con responsabilidades claras.',
            'Detectar duplicados comparando cada par de posiciones diferentes una sola vez.',
        ],
        prerequisites: ['Las dos lecciones anteriores.', 'Sintaxis básica de if, for, while y métodos en Java.'],
        sections: [
            {
                title: 'El estado tiene significado',
                paragraphs: [
                    'Una variable representa una parte del estado de la ejecución: una posición, un contador, un resultado parcial o una decisión. Saber que i es int dice qué valores puede almacenar; saber que i señala la primera posición del par que estamos comparando explica para qué existe. Ese significado debe permanecer claro a lo largo del código.',
                    'La asignación cambia el estado. Después de contador = contador + 1, el nuevo valor depende del anterior. En cambio, una expresión booleana evalúa una pregunta sobre el estado actual. Separar estas ideas permite razonar sobre un método sin confundir una comparación con una modificación.',
                    'En Java, los parámetros de tipo arreglo reciben una copia de la referencia. Reasignar el parámetro local no reemplaza la variable del llamador; modificar valores[i] sí cambia el arreglo compartido. Por eso un contrato debe aclarar si el método solo consulta o también modifica sus datos.',
                ],
            },
            {
                title: 'Decisiones que expresan el problema',
                paragraphs: [
                    'Un if elige qué instrucciones ejecutar según una condición. En una búsqueda de duplicados, la condición esencial será valores[i] == valores[j]. Si es verdadera para dos posiciones diferentes, ya tenemos un testigo suficiente y podemos devolver true inmediatamente.',
                    'Para enteros, == compara valores. Para objetos, == compara identidad de referencias, y la igualdad lógica suele requerir equals. No podemos trasladar sin más un algoritmo de int[] a una colección genérica: también tenemos que especificar qué significa que dos elementos sean iguales y cómo se tratan los nulos.',
                    'Los operadores && y || de Java evalúan con cortocircuito. En valores == null || valores.length == 0, si la primera parte es verdadera no se evalúa length. El orden importa para evitar desreferenciar null. Una condición debe ser segura además de representar la pregunta correcta.',
                ],
            },
            {
                title: 'Recorrer las parejas necesarias',
                paragraphs: [
                    'Diremos que hay duplicados si existen índices i y j tales que 0 ≤ i < j < n y valores[i] = valores[j]. La desigualdad i < j impide comparar una posición consigo misma y evita revisar dos veces el mismo par. Un arreglo vacío o de un elemento no contiene tales pares y, por lo tanto, no tiene duplicados.',
                    'El ciclo exterior elige i. El interior recorre j desde i + 1 hasta n − 1. Para [3, 5, 3], primero comparamos las posiciones (0, 1), luego (0, 2) y encontramos la coincidencia. Si ninguna comparación coincide, solo podemos responder false después de agotar todos los pares.',
                    'Elegir for es natural cuando el índice tiene inicio, condición y avance definidos. while es cómodo cuando la condición de progreso resulta más importante que un conteo. Ambos pueden describir el mismo procedimiento; la elección debe facilitar la lectura y hacer visibles los límites.',
                ],
                code: `// Pares de índices para un arreglo de longitud 4:
// i = 0: (0, 1), (0, 2), (0, 3)
// i = 1: (1, 2), (1, 3)
// i = 2: (2, 3)
// Total: 3 + 2 + 1 = 6 pares.`,
                language: 'java',
            },
            {
                title: 'Una función es una promesa pequeña',
                paragraphs: [
                    'Un método reúne una tarea con entradas y una garantía de salida. hayDuplicados responde una pregunta booleana y no necesita imprimir mensajes, ordenar ni alterar el arreglo. Esa responsabilidad acotada permite llamarlo desde una interfaz, una prueba o un programa de consola sin mezclar decisiones de presentación con el cálculo.',
                    'return finaliza toda la invocación del método. break solo abandona el ciclo más cercano, y continue pasa a la próxima iteración de ese ciclo. Para este problema, return true expresa directamente que encontramos la evidencia necesaria. return false debe quedar fuera de ambos ciclos: una primera pareja diferente no descarta coincidencias posteriores.',
                    'Los nombres y el alcance también ayudan. Declarar j en el ciclo interior evita usarlo accidentalmente fuera del lugar donde tiene sentido. Una variable temporal que ya no aporta información no debería convertirse en un campo de la clase: el estado local basta y hace más fácil analizar cada llamada.',
                ],
            },
            {
                title: 'Casos límite y trazas útiles',
                paragraphs: [
                    'Elegí ejemplos que fuercen caminos distintos: [], [4], [4, 4], [4, 9], [2, 7, 2] y [−3, 0, −3]. Incluí un duplicado al final para comprobar que no devolvés false demasiado pronto. Que todos los elementos sean distintos obliga al algoritmo a recorrer todas las parejas.',
                    'Una traza útil anota i, j, los dos valores y el resultado de la comparación. Si un índice produce una posición inválida, revisá primero inicio y condición del ciclo. Si falta una coincidencia, buscá qué pareja nunca se visitó. La corrección depende de cubrir los candidatos definidos por el contrato, no de que haya dos ciclos en el código.',
                ],
            },
        ],
        complexity: {
            time: 'Θ(n²) en el peor caso',
            space: 'Θ(1) auxiliar',
            explanation: 'Sin coincidencias se comparan n(n − 1)/2 pares. Si las primeras dos posiciones coinciden, se termina con una comparación: el mejor caso para n ≥ 2 es Θ(1). El método solo guarda índices.',
        },
        pitfalls: [
            'Empezar j en i provoca que cada elemento se compare consigo mismo y produce un true incorrecto.',
            'Devolver false dentro del ciclo descarta pares que todavía no fueron revisados.',
            'Comparar solamente vecinos no detecta duplicados separados en un arreglo sin ordenar.',
            'Usar == para igualdad lógica de objetos cambia el problema respecto del ejemplo con enteros.',
        ],
        solved: {
            title: 'Detectar si existe al menos un duplicado',
            explanation: 'Cada pareja de índices distintos aparece una sola vez gracias a j = i + 1. Encontrar un par igual permite terminar anticipadamente. Si se agotan ambos ciclos, no existe un par que satisfaga la definición de duplicado. El método admite vacío y no modifica el arreglo.',
            code: `static boolean hayDuplicados(int[] valores) {
    if (valores == null) {
        throw new IllegalArgumentException("El arreglo no puede ser nulo");
    }
    for (int i = 0; i < valores.length - 1; i++) {
        for (int j = i + 1; j < valores.length; j++) {
            if (valores[i] == valores[j]) {
                return true;
            }
        }
    }
    return false;
}`,
        },
        practice: {
            title: 'Contar pares iguales',
            prompt: 'Escribí un método que cuente pares de posiciones i < j con valores iguales, sin modificar el arreglo. Para [2, 2, 2] debe devolver 3: cuenta pares, no valores distintos ni repeticiones extra. Para [] y [7] debe devolver 0. Usá long para el contador y explicá por qué int puede no alcanzar para un arreglo grande. Antes del código, enumerá las parejas de [1, 2, 1, 2].',
        },
        takeaways: [
            'Cada variable y cada límite deben tener un significado relacionado con el problema.',
            'Los ciclos anidados pueden enumerar pares sin repetirlos ni comparar una posición consigo misma.',
            'Encontrar un testigo permite una respuesta positiva anticipada; negar su existencia exige agotar los candidatos.',
            'Un método con contrato y efectos claros es más fácil de reutilizar y verificar.',
        ],
        visualization: 'duplicates',
    },
    {
        id: 'recursion',
        moduleId: 1,
        title: 'Algoritmos iterativos y recursivos',
        duration: 25,
        summary: 'Seguí la pila de llamadas y aprendé a diseñar una recursión con caso base, reducción del problema y un costo explícito.',
        objectives: [
            'Distinguir repetición mediante ciclos y repetición mediante llamadas recursivas.',
            'Identificar caso base, paso recursivo y medida que decrece.',
            'Trazar la pila de llamadas y el retorno de resultados.',
            'Comparar la memoria auxiliar de una inversión iterativa y una recursiva.',
        ],
        prerequisites: ['Variables, decisiones, ciclos y funciones.', 'La inversión con dos índices.'],
        sections: [
            {
                title: 'Resolver una versión más pequeña',
                paragraphs: [
                    'Un algoritmo iterativo repite instrucciones mediante ciclos. Un algoritmo recursivo resuelve parte del problema llamándose con una instancia más pequeña del mismo tipo. La recursión no elimina la repetición; la organiza mediante invocaciones de métodos.',
                    'Para diseñarla necesitamos tres piezas: un caso base que se resuelva directamente, una reducción que acerque la entrada a ese caso y una explicación de cómo la solución pequeña permite resolver la grande. Escribir solamente una llamada al mismo método no aporta ninguna de esas garantías.',
                    'En la inversión, después de intercambiar los extremos queda el mismo problema sobre el intervalo interior. La diferencia es que el intervalo tiene dos posiciones menos. Un intervalo vacío o de una posición ya está invertido: esos son los casos base.',
                ],
            },
            {
                title: 'Cada invocación conserva su propio estado',
                paragraphs: [
                    'Cuando un método llama a otro, la ejecución conserva la información necesaria para continuar después del retorno. Podemos imaginar esa información como un marco en una pila: parámetros, variables locales y punto de continuación. Una llamada recursiva crea un nuevo marco para el mismo método, con sus propios valores locales.',
                    'Para invertir cinco elementos, los intervalos pendientes son [0, 4], [1, 3] y [2, 2]. La última llamada llega al caso base y retorna; luego retornan las anteriores. El arreglo es compartido por todas las invocaciones, pero izquierda y derecha pertenecen a cada llamada.',
                    'No confundas el avance de la llamada con una actualización global de sus parámetros. La llamada invertirRango(valores, izquierda + 1, derecha − 1) recibe nuevos enteros. Los parámetros del llamador no cambian por esa expresión; simplemente ya no necesita usarlos cuando la llamada termine.',
                ],
                code: `invertirRango(A, 0, 4)
  intercambia posiciones 0 y 4
  invertirRango(A, 1, 3)
    intercambia posiciones 1 y 3
    invertirRango(A, 2, 2)
      caso base: retorna
    retorna
  retorna`,
                language: 'text',
            },
            {
                title: 'El trabajo también puede ocurrir al volver',
                paragraphs: [
                    'En la inversión, el intercambio sucede antes de la llamada recursiva. En otros algoritmos la operación pendiente se completa después del retorno. Por ejemplo, la suma de un arreglo desde i puede definirse como 0 si i llega al final, o como valores[i] más la suma desde i + 1.',
                    'Para [4, 2, 7], la primera llamada espera 4 + sumaDesde(1); esa llamada espera 2 + sumaDesde(2); la siguiente espera 7 + sumaDesde(3). El caso base devuelve 0. Al volver se calculan 7, después 9 y finalmente 13. La pila almacena esas operaciones pendientes.',
                    'El resultado se expresa como long para evitar el desbordamiento que puede tener una suma de int. Con un arreglo Java de enteros y su longitud representable por int, el total matemático cabe en long. Esto no resuelve el límite de profundidad de la recursión: un arreglo largo todavía puede agotar la pila.',
                ],
                code: `static long sumar(int[] valores) {
    if (valores == null) {
        throw new IllegalArgumentException("El arreglo no puede ser nulo");
    }
    return sumarDesde(valores, 0);
}

private static long sumarDesde(int[] valores, int i) {
    if (i == valores.length) {
        return 0L;
    }
    return (long) valores[i] + sumarDesde(valores, i + 1);
}`,
                language: 'java',
            },
            {
                title: 'Por qué termina una recursión',
                paragraphs: [
                    'El caso base tiene que ser alcanzable. En invertirRango, la cantidad de posiciones todavía pendientes disminuye en dos cada vez que se hace una llamada. Al llegar a cero o una dejamos de llamar. En sumarDesde, la cantidad pendiente es longitud − i y disminuye en uno.',
                    'La reducción debe medirse con una cantidad entera no negativa y debe ser estricta en cada llamada que continúa. Si por error llamamos con los mismos límites, el tamaño no disminuye. Si el caso base solo contempla izquierda == derecha, una longitud par puede cruzar los índices sin detenerse. La condición izquierda >= derecha cubre ambos escenarios.',
                    'Una definición recursiva puede ser matemáticamente correcta y superar la capacidad de la pila en una máquina real. StackOverflowError no demuestra que el razonamiento matemático sea falso, pero sí que esa implementación no es adecuada para entradas tan profundas.',
                ],
            },
            {
                title: 'Elegir entre ciclo y recursión',
                paragraphs: [
                    'La inversión iterativa y la recursiva hacen los mismos intercambios y tardan un tiempo proporcional a la longitud. La versión iterativa mantiene dos índices en una sola invocación. La recursiva mantiene una cadena de llamadas cuya profundidad también crece con la longitud.',
                    'Java no garantiza eliminar llamadas recursivas finales. Aunque no quede trabajo después de una llamada, no debemos suponer que su marco desaparecerá automáticamente. Para invertir arreglos grandes, el ciclo es una elección más robusta y usa memoria auxiliar constante.',
                    'La recursión será especialmente natural cuando la propia estructura del problema tenga partes recursivas, como subárboles. El criterio no es que una forma sea siempre más elegante: queremos una solución clara, correcta y viable para los tamaños de entrada previstos.',
                ],
            },
        ],
        complexity: {
            time: 'Θ(n)',
            space: 'Θ(n) auxiliar en la versión recursiva',
            explanation: 'La inversión recursiva realiza ⌊n/2⌋ intercambios y tiene una profundidad de ⌊n/2⌋ + 1 llamadas para n ≥ 1. Cada marco ocupa espacio constante. La versión iterativa conserva el mismo tiempo con Θ(1) de memoria auxiliar.',
        },
        pitfalls: [
            'Agregar un caso base sin demostrar que los parámetros se acercan a él.',
            'Usar solo izquierda == derecha como parada deja sin cubrir el cruce de índices de longitudes pares.',
            'Olvidar retornar el resultado de una llamada en un método que debe devolver un valor.',
            'Suponer que Java convierte automáticamente la recursión final en un ciclo.',
        ],
        solved: {
            title: 'Invertir recursivamente sin copiar el arreglo',
            explanation: 'El método público valida la referencia y establece los límites. El auxiliar privado conserva las precondiciones de los índices y resuelve el intervalo interior. No crea otro arreglo, pero sí utiliza memoria de pila proporcional a la cantidad de llamadas.',
            code: `static void invertirRecursivo(int[] valores) {
    if (valores == null) {
        throw new IllegalArgumentException("El arreglo no puede ser nulo");
    }
    invertirRango(valores, 0, valores.length - 1);
}

private static void invertirRango(int[] valores, int izquierda, int derecha) {
    if (izquierda >= derecha) {
        return;
    }
    int temporal = valores[izquierda];
    valores[izquierda] = valores[derecha];
    valores[derecha] = temporal;
    invertirRango(valores, izquierda + 1, derecha - 1);
}`,
        },
        practice: {
            title: 'Máximo mediante una llamada más pequeña',
            prompt: 'Implementá un máximo recursivo para un int[] no nulo y no vacío. El auxiliar debe resolver el máximo del prefijo que termina en un índice dado. Usá el primer elemento como caso base; no uses 0 como respuesta vacía. Trazá [−8, −3, −11], indicá qué operaciones se realizan al volver y compará tiempo, memoria y riesgo de StackOverflowError con la versión iterativa.',
        },
        takeaways: [
            'Una recursión necesita caso base, reducción estricta y composición de resultados.',
            'Cada llamada conserva un marco independiente; el retorno deshace la cadena en orden inverso.',
            'Modificar el arreglo in situ no implica usar memoria auxiliar constante si hay recursión.',
            'La terminación matemática y los límites de la pila son aspectos distintos de una implementación.',
        ],
        visualization: 'reverse',
    },
    {
        id: 'correctitud',
        moduleId: 1,
        title: 'Correctitud y terminación',
        duration: 26,
        summary: 'Demostrá que un recorrido calcula lo prometido usando una invariante y una medida de progreso, y detectá lo que una prueba por ejemplos no alcanza a garantizar.',
        objectives: [
            'Distinguir correctitud parcial, terminación y correctitud total.',
            'Enunciar y demostrar una invariante de ciclo.',
            'Justificar la terminación con una variante entera no negativa.',
            'Usar contratos, contraejemplos y pruebas de casos límite de forma complementaria.',
        ],
        prerequisites: ['Algoritmos, contratos y recorridos.', 'Condicionales, ciclos y el algoritmo de máximo.'],
        sections: [
            {
                title: 'Qué significa que el algoritmo sea correcto',
                paragraphs: [
                    'La correctitud se expresa respecto de un contrato. Bajo ciertas precondiciones, si el procedimiento termina, ¿se cumple la postcondición? Esa pregunta corresponde a la correctitud parcial. Si además demostramos que termina para todas las entradas admitidas, obtenemos correctitud total.',
                    'Un ciclo infinito puede mantener una propiedad útil y aun así no resolver el problema. Un programa que termina y devuelve un número cualquiera tampoco lo resuelve. Necesitamos justificar tanto la calidad del resultado como la llegada a un estado final.',
                    'Para el máximo, la precondición es que el arreglo no sea nulo ni vacío. La postcondición exige que el resultado pertenezca al arreglo y sea mayor o igual que cada elemento. También prometemos no modificar la entrada. La validación que lanza una excepción define el comportamiento para las referencias rechazadas.',
                ],
            },
            {
                title: 'La invariante del máximo',
                paragraphs: [
                    'Una invariante de ciclo es una afirmación verdadera cada vez que llegamos a un punto concreto del ciclo, normalmente justo antes de evaluar su condición. No describe solamente el final. Relaciona el estado actual con el trabajo que ya se realizó.',
                    'Sea n la longitud del arreglo. Justo antes de cada evaluación de i < n, afirmamos: 1 ≤ i ≤ n y mejor es el máximo de valores[0..i). La notación [0..i) incluye los índices desde 0 hasta i − 1 y excluye i. Ese prefijo nunca está vacío porque i ≥ 1.',
                    'La afirmación precisa qué parte está resuelta y qué variable guarda su respuesta. Decir solamente “mejor es el máximo” sería ambiguo: ¿máximo de todo el arreglo o de una parte? Al inicio todavía no inspeccionamos todos los elementos, por lo que debemos nombrar el prefijo.',
                ],
                code: `int mejor = valores[0];
int i = 1;
// Invariante: 1 <= i <= valores.length y
// mejor = máximo de valores[0..i).
while (i < valores.length) {
    if (valores[i] > mejor) {
        mejor = valores[i];
    }
    i++;
}
return mejor;`,
                language: 'java',
            },
            {
                title: 'Las tres obligaciones de la demostración',
                paragraphs: [
                    'Inicialización: antes de la primera evaluación, i vale 1 y mejor vale valores[0]. El prefijo valores[0..1) contiene exactamente ese elemento, por lo que mejor es su máximo. Como n ≥ 1, también se cumple 1 ≤ i ≤ n.',
                    'Mantenimiento: suponemos que la invariante es verdadera y que i < n. El acceso valores[i] es válido. Si supera a mejor, lo guardamos; de lo contrario conservamos el máximo anterior. En ambos casos obtenemos el máximo del prefijo que incluye la posición i. Al incrementar i, ese prefijo pasa a ser exactamente valores[0..i) para el nuevo índice. Los límites también se conservan.',
                    'Salida: cuando la condición es falsa, i ≥ n. La invariante asegura i ≤ n, así que i = n. Por lo tanto, mejor es el máximo de valores[0..n), es decir, de todo el arreglo. Los únicos cambios fueron sobre variables locales: la entrada quedó intacta. Esto demuestra la correctitud parcial.',
                ],
            },
            {
                title: 'Demostrar que se alcanza la salida',
                paragraphs: [
                    'Una variante es una medida de trabajo pendiente. Para este ciclo elegimos V = n − i. Al evaluar la condición, la invariante garantiza V ≥ 0. Si ejecutamos el cuerpo, i < n, de modo que V > 0. Después de i++, V disminuye exactamente en uno.',
                    'Una cantidad entera no negativa no puede disminuir estrictamente para siempre. Por eso el ciclo debe llegar a V = 0 y terminar. Junto con la correctitud parcial, este argumento completa la correctitud total, dentro del modelo de ejecución usado.',
                    'No basta con decir que “i cambia”. Podría aumentar lejos de la salida, alternar entre dos valores o cambiar una variable irrelevante. La variante debe estar ligada a la condición y a un límite que impida infinitas disminuciones. El mismo razonamiento se aplica a la cantidad de elementos pendientes en una recursión.',
                ],
            },
            {
                title: 'Pruebas y contraejemplos',
                paragraphs: [
                    'Las pruebas ejecutables sirven para detectar fallos y comprobar que el código coincide con nuestra intención. Una demostración se refiere a un procedimiento y a un contrato precisos. Si el código implementado cambia, el argumento debe revisarse; un razonamiento sobre pseudocódigo correcto no salva una traducción defectuosa.',
                    'Un contraejemplo basta para refutar una afirmación universal. Si alguien inicializa mejor en 0 y afirma que siempre devuelve el máximo, [−5] muestra que la afirmación es falsa. Ese ejemplo también revela el origen del error: la inicialización no establece que mejor pertenezca al prefijo procesado.',
                    'Al diseñar casos incluí límites, empates, valores negativos y posiciones extremas. Después buscá qué parte del argumento respalda cada decisión del código. La prueba formal y los ejemplos cumplen funciones complementarias: una generaliza bajo hipótesis explícitas; los otros ayudan a encontrar hipótesis olvidadas y errores de implementación.',
                ],
            },
        ],
        complexity: {
            time: 'Θ(n)',
            space: 'Θ(1) auxiliar',
            explanation: 'La variante n − i baja de n − 1 a 0. Por lo tanto, el cuerpo se ejecuta exactamente n − 1 veces. La demostración no necesita crear copias de los prefijos: estos son objetos del razonamiento, no estructuras adicionales en memoria.',
        },
        pitfalls: [
            'Enunciar como invariante la postcondición completa, que todavía no se cumple al comenzar.',
            'Omitir la inicialización o el mantenimiento y justificar solamente el estado de salida.',
            'Demostrar que el resultado sería correcto si hubiera salida, pero no que el ciclo termina.',
            'Confundir una traza correcta para una entrada con una garantía para todas las entradas válidas.',
        ],
        solved: {
            title: 'Máximo con las obligaciones visibles',
            explanation: 'La validación establece la precondición del acceso inicial. La asignación inicial establece la invariante; la comparación y el incremento la mantienen. Al salir, i = n permite obtener la postcondición. La variante longitud − i garantiza terminación.',
            code: `static int maximoVerificado(int[] valores) {
    if (valores == null || valores.length == 0) {
        throw new IllegalArgumentException("Se requiere un arreglo no vacío");
    }

    int mejor = valores[0];
    int i = 1;
    // Invariante antes de la condición:
    // mejor es el máximo de valores[0..i), y 1 <= i <= length.
    // Variante: valores.length - i.
    while (i < valores.length) {
        if (valores[i] > mejor) {
            mejor = valores[i];
        }
        i++;
    }
    return mejor;
}`,
        },
        practice: {
            title: 'Demostrar la inversión',
            prompt: 'Demostrá la inversión iterativa de la lección de pseudocódigo. Llamá A₀ al arreglo original: las posiciones anteriores a izquierda y posteriores a derecha ya deben tener su valor final A₀[n − 1 − k]; el intervalo pendiente conserva los valores originales de sus posiciones. Incluí la relación derecha = n − 1 − izquierda. Justificá inicialización, mantenimiento y salida, y usá max(0, derecha − izquierda + 1) como variante. Tratá explícitamente el vacío y el elemento central de una longitud impar.',
        },
        takeaways: [
            'Correctitud total combina una postcondición válida con terminación.',
            'La invariante conecta el trabajo parcial con el resultado que queremos obtener.',
            'Inicialización, mantenimiento y salida son obligaciones diferentes.',
            'Una variante entera no negativa y estrictamente decreciente prueba que el progreso no puede continuar indefinidamente.',
        ],
        visualization: 'max',
    },
    {
        id: 'eficiencia',
        moduleId: 1,
        title: 'Una primera mirada a la eficiencia',
        duration: 26,
        summary: 'Compará cómo crecen el trabajo y la memoria de un algoritmo cuando crece la entrada; distinguí mediciones, cotas y compromisos entre tiempo y espacio.',
        objectives: [
            'Definir el tamaño de entrada y un modelo de operaciones.',
            'Interpretar O, Ω y Θ sin confundirlos con casos de ejecución.',
            'Reconocer crecimiento constante, logarítmico, lineal y cuadrático.',
            'Comparar soluciones considerando precondiciones, tiempo y memoria auxiliar.',
        ],
        prerequisites: ['Recorridos, ciclos anidados y recursión.', 'Contratos y correctitud.'],
        sections: [
            {
                title: 'Contar antes de medir',
                paragraphs: [
                    'Un algoritmo correcto puede resultar demasiado costoso para una entrada grande. El análisis de eficiencia estudia cómo crecen sus recursos con el tamaño del problema. Para un arreglo llamamos n a su longitud. En otros problemas el tamaño podría ser la cantidad de vértices de un grafo o la cantidad de dígitos de un número; hay que declararlo.',
                    'Usaremos un modelo donde acceder a una posición, comparar enteros de tamaño fijo o actualizar un índice cuesta una cantidad constante. No pretende describir cada nanosegundo de una computadora. Permite comparar tendencias sin depender de un procesador particular, de la carga del sistema o de la compilación de Java.',
                    'Medir sigue siendo útil: muestra constantes y efectos reales. Pero una sola medición no demuestra el crecimiento general. Para interpretar un experimento necesitamos entradas representativas, tamaños variados y condiciones controladas. Aquí primero aprenderemos a explicar cuántas operaciones exige el procedimiento.',
                ],
            },
            {
                title: 'Las cotas describen crecimiento',
                paragraphs: [
                    'O(g(n)) expresa una cota superior asintótica: a partir de algún tamaño, el costo no supera una constante multiplicada por g(n). Ω(g(n)) expresa una cota inferior. Θ(g(n)) indica que ambas cotas se cumplen y, por lo tanto, describe el orden de crecimiento ajustado.',
                    'Por ejemplo, 3n + 7 pertenece a Θ(n): factores constantes y términos de menor crecimiento no alteran la tendencia cuando n aumenta. También pertenece a O(n²), pero esa cota es menos informativa. Siempre que podamos justificarla, preferimos expresar una cota ajustada.',
                    'Estas notaciones no significan “peor”, “mejor” y “promedio”. Primero elegimos qué función analizamos —por ejemplo, el costo del peor caso de tamaño n— y después describimos sus cotas. Es perfectamente válido decir que el peor caso de un algoritmo es Θ(n²) y su mejor caso es Θ(1).',
                ],
                bullets: [
                    'Θ(1): una cantidad de trabajo acotada que no crece con n, como consultar una posición válida.',
                    'Θ(log n): reducir repetidamente la región pendiente a una fracción constante.',
                    'Θ(n): visitar todos los elementos una cantidad constante de veces.',
                    'Θ(n²): examinar una cantidad de pares proporcional al cuadrado del tamaño.',
                ],
            },
            {
                title: 'Reconocer el costo de nuestros recorridos',
                paragraphs: [
                    'El máximo realiza n − 1 comparaciones independientemente de los valores, así que su tiempo es Θ(n). Invertir realiza ⌊n/2⌋ intercambios: también es Θ(n). Recorrer dos veces el arreglo sigue siendo Θ(n), porque 2n crece linealmente; anidar un recorrido completo dentro de otro suele producir una cantidad de trabajo muy diferente.',
                    'La detección de duplicados por pares compara n(n − 1)/2 parejas cuando no encuentra ninguna coincidencia. Ese es su peor caso y crece como Θ(n²). Si las primeras dos posiciones son iguales, devuelve true tras una sola comparación: para n ≥ 2 el mejor caso es Θ(1). Sin una distribución de entradas no podemos afirmar un costo promedio concreto.',
                    'La cantidad de ciclos escritos no determina por sí sola la complejidad. Un ciclo puede duplicar su índice en cada paso y ser logarítmico; dos ciclos consecutivos pueden seguir siendo lineales. Hay que contar cuántas veces se ejecutan las operaciones relevantes.',
                ],
            },
            {
                title: 'Buscar mejor exige mirar las condiciones',
                paragraphs: [
                    'Una búsqueda secuencial revisa posiciones hasta encontrar un valor o agotar el arreglo: su peor caso es Θ(n). En un arreglo ordenado, la búsqueda binaria puede descartar aproximadamente la mitad de los candidatos por comparación y alcanzar Θ(log n) en el peor caso. Esa mejora depende de que el orden ya esté disponible.',
                    'Si tenemos una entrada sin ordenar y solo una consulta, ordenar primero también tiene costo. No podemos comparar solamente la búsqueda final y omitir la preparación. Para muchas consultas, en cambio, pagar una preparación una vez puede resultar conveniente. Esta distinción anticipa por qué el contexto de uso importa tanto como una etiqueta de complejidad.',
                    'La visualización de esta lección permite contar comparaciones de una búsqueda secuencial. Buscá un valor al principio, al final y uno ausente: el mismo algoritmo tiene recorridos distintos. El análisis del peor caso describe el recorrido más costoso entre las entradas del tamaño elegido.',
                ],
            },
            {
                title: 'Tiempo y espacio pueden intercambiarse',
                paragraphs: [
                    'La memoria auxiliar es la que el algoritmo necesita además de la entrada y, según la convención declarada, de su salida. El máximo y la inversión iterativa usan Θ(1) auxiliar. La inversión recursiva usa Θ(n) por la pila, aunque modifique el mismo arreglo. Un método que devuelve una copia invertida necesita Θ(n) para esa salida; debemos decir si la estamos contando.',
                    'Para duplicados podemos guardar los valores ya vistos en un HashSet. Si insertar y consultar cuestan tiempo constante esperado y amortizado bajo las hipótesis habituales del hash, el recorrido completo tiene tiempo esperado O(n), a cambio de O(n) de espacio adicional. Es una afirmación condicionada sobre la estructura, no una garantía de una comparación por elemento en toda ejecución posible.',
                    'La mejor solución depende del tamaño, la memoria disponible, los efectos permitidos y las garantías requeridas. Una mejora de tiempo que cambia el contrato o devuelve una respuesta equivocada no sirve. Primero fijamos qué debe hacer la solución; después comparamos sus costos bajo las mismas condiciones.',
                ],
            },
        ],
        complexity: {
            time: 'O(n) esperado con HashSet; Θ(n²) por pares en el peor caso',
            space: 'O(n) auxiliar con HashSet; Θ(1) por pares',
            explanation: 'El conjunto puede almacenar hasta n valores distintos. La versión con hash realiza como máximo n inserciones, cuyo costo constante esperado y amortizado depende de las hipótesis de dispersión. La versión por pares no necesita almacenamiento proporcional a n.',
        },
        pitfalls: [
            'Afirmar que O significa peor caso o que Ω significa mejor caso.',
            'Ignorar el costo de ordenar o preparar una estructura antes de usarla.',
            'Contar solo variables explícitas y olvidar la pila de llamadas o las colecciones auxiliares.',
            'Concluir que una estrategia es siempre más rápida por una medición con una entrada pequeña.',
            'Prometer tiempo constante garantizado para las operaciones de hash sin explicar las hipótesis.',
        ],
        solved: {
            title: 'Detectar duplicados guardando lo ya visto',
            explanation: 'HashSet.add devuelve false cuando el valor ya estaba presente; ese es el testigo de una repetición. El método conserva el contrato de no modificar el arreglo. Para una entrada con todos los valores distintos guarda n elementos. La mejora de tiempo esperado utiliza memoria adicional y depende de los costos de la estructura de hash.',
            code: `static boolean hayDuplicadosConConjunto(int[] valores) {
    if (valores == null) {
        throw new IllegalArgumentException("El arreglo no puede ser nulo");
    }
    java.util.Set<Integer> vistos = new java.util.HashSet<>();
    for (int valor : valores) {
        if (!vistos.add(valor)) {
            return true;
        }
    }
    return false;
}`,
        },
        practice: {
            title: 'Elegir y justificar una estrategia',
            prompt: 'Compará las dos soluciones de duplicados para arreglos de 10, 1.000 y 100.000 elementos distintos. Calculá los pares n(n − 1)/2 y contrastalos con n inserciones esperadas en un conjunto. Explicá memoria, mejor caso y precondiciones sin usar mediciones como demostración. Después analizá una tercera propuesta: ordenar el arreglo y comparar vecinos. Indicá que ordenar modifica la entrada o exige una copia, y que su costo depende del algoritmo de ordenamiento elegido.',
        },
        takeaways: [
            'La eficiencia describe cómo crecen los recursos con un tamaño de entrada definido.',
            'O es una cota superior; Θ expresa un orden ajustado. El caso analizado se declara aparte.',
            'El costo de preparación y la memoria auxiliar forman parte de la comparación.',
            'Las garantías de una estructura de datos y las condiciones de entrada sostienen las conclusiones de eficiencia.',
        ],
        visualization: 'linear',
    },
];
