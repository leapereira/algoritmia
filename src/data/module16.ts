import type { ModuleContent } from './types.js';

export const module16: ModuleContent = {
  "moduleId": 16,
  "lessons": [
    {
      "id": "m16-correctitud",
      "moduleId": 16,
      "title": "Correctitud formal e invariantes de ciclo",
      "duration": 28,
      "summary": "Un contrato, un invariante y una medida decreciente permiten justificar una solución para todas sus entradas.",
      "objectives": [
        "Explicar correctitud formal e invariantes de ciclo y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "De ejemplos a especificación",
          "paragraphs": [
            "Una demostración empieza definiendo qué entradas se admiten y qué significa responder correctamente. Las precondiciones describen el dominio y las postcondiciones relacionan salida con entrada. También debemos aclarar si se permite modificar los datos, cómo se representan errores y qué límites numéricos se aceptan. Una colección de pruebas aporta evidencia sobre casos particulares, pero no cubre por sí sola un dominio infinito. El razonamiento formal usa propiedades que se mantienen en todas las ejecuciones válidas. La correctitud parcial afirma que, si el algoritmo termina, cumple su postcondición; la correctitud total agrega una demostración de terminación."
          ]
        },
        {
          "title": "Elegir un invariante útil",
          "paragraphs": [
            "Para sumar un arreglo, antes de cada iteración con índice i mantenemos suma igual a la suma matemática del prefijo a[0..i), con cero menor o igual que i y i menor o igual que n. El intervalo es semiabierto: incluye cero y excluye i. Esa precisión evita ambigüedad sobre si el elemento actual ya fue procesado. Un invariante útil debe conectar el estado actual con el objetivo, ser verdadero al comenzar y sobrevivir cada vuelta. La afirmación suma es un número no alcanza, porque aunque sea cierta no permite deducir el resultado final."
          ]
        },
        {
          "title": "Inicialización, mantenimiento y salida",
          "paragraphs": [
            "Inicialización: con i igual a cero, el prefijo está vacío y su suma es cero. Mantenimiento: suponiendo que el invariante vale antes de la vuelta, agregar a[i] produce la suma del prefijo hasta i inclusive; incrementar i restablece exactamente la forma del invariante para el siguiente estado. Salida: cuando i iguala n, el prefijo coincide con todo el arreglo y obtenemos la postcondición. No usamos como premisa que el algoritmo ya sea correcto: demostramos cada paso a partir de operaciones y propiedades aritméticas. El acceso a[i] es válido porque el cuerpo solo se ejecuta con i menor que n."
          ]
        },
        {
          "title": "Probar terminación y considerar números",
          "paragraphs": [
            "La variante n menos i es un entero no negativo antes de cada vuelta y disminuye estrictamente en uno. Por tanto no puede haber infinitas iteraciones. Esta prueba completa la correctitud total bajo el modelo definido. Java usa enteros de ancho fijo: una demostración sobre números matemáticos no autoriza ignorar desbordamiento. La implementación acumula int en long y usa Math.addExact para no devolver silenciosamente una suma inválida. Para un arreglo Java de int, incluso la cota de cantidad de posiciones limita la suma dentro de long, pero el control explícito comunica la obligación y facilita adaptar el método a otros dominios."
          ]
        },
        {
          "title": "Razonar sobre implementaciones distintas",
          "paragraphs": [
            "Una solución recursiva suele demostrarse por inducción sobre el tamaño: el caso base cumple el contrato y el paso combina resultados de instancias menores. Un algoritmo que modifica una estructura necesita además invariantes de representación, como enlaces consistentes o tamaño coherente. La demostración debe corresponder al código real: cambiar mayor estricto por mayor o igual puede alterar el desempate, y mover una actualización antes de una lectura puede destruir una precondición. Revisar el contrato permite detectar estos cambios incluso cuando varias pruebas ordinarias siguen pasando. Conviene separar propiedades funcionales, terminación y costo para no usar una como sustituto de otra."
          ]
        },
        {
          "title": "Aplicación y práctica guiada",
          "paragraphs": [
            "Trazá [4,−2,7]: antes de cada vuelta las sumas de prefijo son cero, cuatro y dos; al salir obtenemos nueve. Probá vacío y valores extremos para comprobar que la implementación coincide con el argumento. Después redactá el invariante de una búsqueda que devuelve la primera coincidencia: ninguna posición anterior contiene el objetivo. Identificá qué afirmación cambia si la búsqueda retorna cualquier coincidencia o si se modifica el arreglo. La práctica consiste en escribir primero las tres obligaciones del invariante y la variante, y solo después seleccionar ejemplos que desafíen las hipótesis y los límites del contrato."
          ],
          "code": "SUMAR(a)\n  suma←0; i←0\n  mientras i<n\n    suma←suma+a[i]\n    i←i+1\n  devolver suma",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Θ(n)",
        "space": "Θ(1) auxiliar",
        "explanation": "Cada posición se procesa una vez y el invariante permite justificar ese recorrido."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "En [4,−2,7], la propiedad de prefijo evoluciona de suma cero para longitud cero a cuatro, dos y nueve. La variante pasa de tres a cero. La última propiedad prueba la respuesta y la variante prueba que se alcanza.",
        "code": "class PruebaDeSuma {\n  static long sumar(int[] a) {\n    if(a==null)throw new IllegalArgumentException();\n    long suma=0;\n    // Invariante: suma = suma matemática de a[0..i).\n    for(int i=0;i<a.length;i++) {\n      suma=Math.addExact(suma,(long)a[i]);\n    }\n    return suma;\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Demostrá total correctitud de invertir un arreglo con dos índices. Incluí preservación de la permutación, posiciones definitivas y una variante no negativa."
      },
      "takeaways": [
        "Un contrato, un invariante y una medida decreciente permiten justificar una solución para todas sus entradas.",
        "Cada posición se procesa una vez y el invariante permite justificar ese recorrido.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ],
      "lab": "design"
    },
    {
      "id": "m16-amortizado",
      "moduleId": 16,
      "title": "Análisis amortizado y método potencial",
      "duration": 28,
      "summary": "Una operación cara puede tener costo amortizado constante si una secuencia completa paga cada trabajo pocas veces.",
      "objectives": [
        "Explicar análisis amortizado y método potencial y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Analizar secuencias completas",
          "paragraphs": [
            "El análisis de peor caso por operación puede exagerar el costo de una secuencia cuando las operaciones caras son poco frecuentes. Un arreglo dinámico duplica capacidad ocasionalmente y una cola con dos pilas transfiere elementos solamente cuando necesita preparar salidas. Análisis amortizado limita el costo total de cualquier secuencia válida y reparte ese límite entre operaciones. No supone una distribución aleatoria ni significa promedio entre usuarios. Una operación individual todavía puede tardar mucho. Esa diferencia importa en sistemas con límites estrictos de latencia, donde una garantía amortizada no satisface necesariamente el tiempo máximo permitido por solicitud."
          ]
        },
        {
          "title": "Cola con dos pilas",
          "paragraphs": [
            "Representamos la cola mediante entrada y salida. Encolar agrega a entrada. Desencolar toma de salida; si está vacía, transfiere todos los elementos de entrada a salida invirtiendo su orden. El más antiguo queda entonces arriba y sale primero, conservando FIFO. La representación de salida contiene los elementos más antiguos listos para salir, y entrada los más nuevos en orden inverso. Transferir mientras salida todavía contiene elementos rompería ese orden. El ejemplo implementa pilas con nodos para que cada agregado o retiro sea constante en el modelo de costo, sin depender de otra política de ampliación."
          ]
        },
        {
          "title": "Método agregado",
          "paragraphs": [
            "Cada elemento se apila una vez en entrada, puede retirarse de ella una vez para transferirse, se apila una vez en salida y se retira una vez al desencolar. Nunca vuelve a entrada. Por tanto, en m operaciones se realizan O(m) primitivas de pila, aunque un desencolar particular transfiera Θ(n) elementos. Desde una cola inicialmente vacía, encolar y desencolar tienen costo O(1) amortizado. Las consultas de vacío y decisiones agregan trabajo constante por operación. Si empezáramos con una estructura precargada, habría que incluir el trabajo o potencial inicial en la contabilidad en vez de ignorarlo."
          ]
        },
        {
          "title": "Método potencial con una función concreta",
          "paragraphs": [
            "Tomamos potencial Φ igual a dos veces la cantidad de elementos en entrada. Es no negativo y empieza en cero. El costo amortizado es costo real más cambio de potencial. Encolar realiza una primitiva y aumenta Φ en dos, con costo amortizado tres. Desencolar con salida no vacía cuesta una y no cambia Φ. Si transfiere k elementos, realiza dos k primitivas para moverlos y una para extraer; Φ cae dos k y el costo amortizado vuelve a uno. Al sumar, los cambios de potencial se cancelan y dejan una cota del costo real total."
          ]
        },
        {
          "title": "Correctitud y memoria",
          "paragraphs": [
            "El argumento de costos no demuestra que la cola respete FIFO; necesitamos por separado el invariante de orden. Si salida está vacía, entrada contiene los elementos del más reciente al más antiguo y la inversión deja al más antiguo disponible. Después, las nuevas inserciones no adelantan a los elementos restantes en salida. Una extracción de vacío lanza NoSuchElementException. La memoria para n elementos es Θ(n); durante una transferencia, los nodos nuevos reemplazan progresivamente a los retirados y pueden convivir objetos hasta su recolección. El análisis algorítmico no promete cuándo el recolector recupera esos objetos ni la latencia de reserva real."
          ]
        },
        {
          "title": "Aplicar sin esconder límites",
          "paragraphs": [
            "Encolá uno, dos y tres. El primer desencolar transfiere tres y retorna uno; los siguientes retornan dos y tres con poco trabajo. Encolar cuatro mientras quedan salidas no lo adelanta. Probá alternar operaciones, encolar en ráfaga y vaciar por completo. Compará con el vector que duplica: las copias forman una serie geométrica y también dan costo lineal total. No concluyas que ambas estructuras tienen la misma latencia o memoria concreta. Para elegir, indicá si importa el tiempo total, el máximo por solicitud o el espacio máximo, y qué trabajo se contabiliza dentro de cada operación."
          ],
          "code": "DESENCOLAR\n  si salida vacía\n    mientras entrada no vacía: salida.push(entrada.pop())\n  si salida vacía: error\n  devolver salida.pop()",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "O(1) amortizado; desencolar O(n) individual",
        "space": "Θ(n) nodos",
        "explanation": "Cada elemento cruza las dos pilas una sola vez; el potencial financia la transferencia."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Después de encolar 1,2,3, entrada tiene tres elementos y potencial seis. Transferir cuesta seis primitivas, pero reduce potencial a cero; extraer uno añade una primitiva y el costo amortizado de la operación es uno. Las extracciones siguientes ya no transfieren.",
        "code": "class ColaAmortizada {\n  private static class Nodo {\n    final int valor; final Nodo siguiente;\n    Nodo(int v,Nodo s){valor=v;siguiente=s;}\n  }\n  private Nodo entrada,salida;\n  void encolar(int x){entrada=new Nodo(x,entrada);}\n  int desencolar(){\n    if(salida==null){\n      while(entrada!=null){\n        int x=entrada.valor;entrada=entrada.siguiente;\n        salida=new Nodo(x,salida);\n      }\n    }\n    if(salida==null)throw new java.util.NoSuchElementException();\n    int x=salida.valor;salida=salida.siguiente;return x;\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Definí una función potencial para un vector que duplica capacidad. Explicá el costo real y el cambio de potencial de una inserción con y sin ampliación."
      },
      "takeaways": [
        "Una operación cara puede tener costo amortizado constante si una secuencia completa paga cada trabajo pocas veces.",
        "Cada elemento cruza las dos pilas una sola vez; el potencial financia la transferencia.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ]
    },
    {
      "id": "m16-limites-np",
      "moduleId": 16,
      "title": "Límites inferiores, P, NP y reducciones",
      "duration": 28,
      "summary": "Una reducción compara dificultad entre problemas y exige cuidar la dirección de la transformación.",
      "objectives": [
        "Explicar límites inferiores, p, np y reducciones y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Límites del problema y del modelo",
          "paragraphs": [
            "Una cota superior describe un algoritmo; una cota inferior describe cuánto trabajo necesita cualquier algoritmo de una familia bajo un modelo especificado. Hallar el máximo de n valores necesita n menos uno comparaciones en el peor caso: cada valor salvo el ganador debe haber perdido alguna comparación. Ordenar claves distintas mediante comparaciones requiere Ω(n log n) por la cantidad de órdenes posibles que debe distinguir un árbol de decisiones binario. Esa cota no prohíbe Counting Sort, porque usa información del dominio además de comparar. Siempre debemos indicar si contamos comparaciones, accesos, bits o alguna otra operación."
          ]
        },
        {
          "title": "Problemas de decisión y clases",
          "paragraphs": [
            "P reúne problemas de decisión resolubles en tiempo polinómico en la longitud de la entrada. NP reúne los que tienen certificados de longitud polinómica verificables en tiempo polinómico; no significa no polinómico. Un problema en P también pertenece a NP. Para el ciclo hamiltoniano, un certificado es un orden de vértices que visita cada uno una vez y usa aristas del grafo al cerrar el ciclo. Verificar un candidato puede ser fácil aunque encontrarlo no lo sea. Las versiones de optimización, como minimizar un recorrido, se relacionan con decisiones mediante umbrales, pero sus enunciados deben distinguirse explícitamente."
          ]
        },
        {
          "title": "NP-difícil y NP-completo",
          "paragraphs": [
            "Un problema es NP-difícil si todos los problemas de NP se reducen a él en tiempo polinómico. Es NP-completo si además pertenece a NP. Por tanto demostrar solamente dificultad no establece pertenencia, y mostrar un verificador rápido tampoco demuestra NP-completitud. Las definiciones no permiten deducir por sí solas que P sea igual o distinto de NP; cualquiera de esas afirmaciones exigiría una demostración. En diseño, estas clases ayudan a reconocer cuándo buscar una solución exacta polinómica general podría requerir un avance fundamental y cuándo conviene explotar restricciones de una instancia concreta."
          ]
        },
        {
          "title": "La dirección de una reducción",
          "paragraphs": [
            "Escribimos A menor o igual polinómicamente que B cuando transformamos una instancia de A en una de B y conservamos la respuesta sí o no. Un algoritmo para B resolvería entonces A mediante transformación y consulta. Para demostrar que B es difícil, partimos de un A ya conocido como difícil; reducir B a un problema fácil no prueba esa dificultad. La transformación debe tener tamaño y tiempo polinómicos, y la equivalencia debe demostrarse en ambos sentidos. Una semejanza visual entre problemas o una conversión que cambia respuestas no constituye una reducción válida."
          ]
        },
        {
          "title": "De Hamilton a TSP por decisión",
          "paragraphs": [
            "Para un grafo simple no dirigido con n vértices, construimos un grafo completo ponderado: peso uno si la arista original existe y dos si no existe. Preguntamos si hay un tour que visite cada vértice una vez, regrese al inicio y cueste a lo sumo n. Si existe ciclo hamiltoniano original, sus n aristas cuestan uno y forman un tour de costo n. Si existe un tour de costo como máximo n, todas sus n aristas deben costar uno, porque cada una cuesta al menos uno: por lo tanto todas existían originalmente. La matriz de pesos se construye en Θ(n²)."
          ]
        },
        {
          "title": "Implementación, límites y práctica",
          "paragraphs": [
            "El código separa transformar de verificar: no resuelve el TSP ni enumera tours. El verificador revisa índices, unicidad y aristas consecutivas bajo el contrato de matriz válida; con matriz de adyacencia utiliza O(n) accesos para un certificado de n vértices y O(n) memoria. Construir la reducción necesita Θ(n²) tiempo y espacio. La lectura y validación completa de una representación puede agregar su propio costo. Probá triángulo, camino sin cierre, vértice repetido y certificado incompleto. Como práctica, redactá la equivalencia en ambos sentidos y explicá por qué elegir umbral n menos uno haría responder no incluso a un triángulo válido."
          ],
          "code": "GRAFO → distancias completas de pesos 1 o 2\nUmbral TSP ← n\nExiste ciclo Hamiltoniano ⇔ existe tour de costo ≤ n",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Reducción Θ(n²); verificar certificado O(n)",
        "space": "Reducción Θ(n²); verificador Θ(n)",
        "explanation": "La transformación es polinómica y preserva la decisión en ambos sentidos."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Un triángulo tiene tres aristas originales: el tour cuesta tres y satisface el umbral. En un camino de tres vértices falta el cierre; cualquier tour completo usa una arista de costo dos y cuesta cuatro, por lo que no satisface el umbral tres.",
        "code": "class ReduccionHamiltonTSP {\n  static int[][] distancias(boolean[][] g) {\n    if(g==null||g.length<3)throw new IllegalArgumentException();\n    int n=g.length;\n    for(boolean[] fila:g)if(fila==null||fila.length!=n)throw new IllegalArgumentException();\n    for(int i=0;i<n;i++)for(int j=0;j<n;j++)\n      if(g[i][j]!=g[j][i]||i==j&&g[i][j])throw new IllegalArgumentException();\n    int[][] d=new int[n][n];\n    for(int i=0;i<n;i++)for(int j=0;j<n;j++)d[i][j]=i==j?0:(g[i][j]?1:2);\n    return d;\n  }\n  // Precondición: g es una matriz válida de un grafo simple no dirigido.\n  static boolean verificarCiclo(boolean[][] g,int[] ciclo) {\n    if(g==null||ciclo==null||g.length<3||ciclo.length!=g.length)return false;\n    int n=g.length;boolean[] visto=new boolean[n];\n    for(boolean[] fila:g)if(fila==null||fila.length!=n)return false;\n    for(int v:ciclo){if(v<0||v>=n||visto[v])return false;visto[v]=true;}\n    for(int i=0;i<n;i++)if(!g[ciclo[i]][ciclo[(i+1)%n]])return false;\n    return true;\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Verificá la reducción en todos los grafos simples de cuatro vértices mediante enumeración local. Explicá qué prueba el experimento y qué partes siguen necesitando el argumento general."
      },
      "takeaways": [
        "Una reducción compara dificultad entre problemas y exige cuidar la dirección de la transformación.",
        "La transformación es polinómica y preserva la decisión en ambos sentidos.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ]
    },
    {
      "id": "m16-aproximacion",
      "moduleId": 16,
      "title": "Algoritmos aproximados y garantía de calidad",
      "duration": 28,
      "summary": "Una solución rápida puede ser útil cuando incluye una cota demostrada de distancia al óptimo.",
      "objectives": [
        "Explicar algoritmos aproximados y garantía de calidad y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Definir una garantía cuantitativa",
          "paragraphs": [
            "Un algoritmo aproximado para minimización produce una solución válida cuyo costo no supera α veces el óptimo, para una constante o función α especificada. Para maximización, la desigualdad se formula en la dirección correspondiente y debe explicitarse. Una heurística puede dar buenas soluciones empíricas sin una garantía demostrada. Tampoco debemos confundir aproximación con error numérico: aquí el objetivo puede ser entero exacto, pero aceptamos una solución subóptima por razones de costo computacional. Una garantía debe valer para todas las instancias de la clase admitida, y no solamente para una familia de ejemplos favorables."
          ]
        },
        {
          "title": "Cobertura de vértices no ponderada",
          "paragraphs": [
            "En un grafo simple no dirigido, una cobertura de vértices es un conjunto que contiene al menos un extremo de cada arista. Queremos minimizar su cantidad de vértices. Un procedimiento sencillo elige una arista todavía sin cubrir y agrega ambos extremos; repite hasta cubrir todas. Las aristas elegidas no comparten extremos entre sí, porque después de agregar los extremos ya quedan cubiertas todas sus aristas incidentes. Así forman un matching maximal: no podemos agregar otra arista disjunta. Maximal significa que no se puede extender, y no implica que tenga cardinalidad máxima entre todos los matchings."
          ]
        },
        {
          "title": "Demostrar la cota dos",
          "paragraphs": [
            "Sea M el matching elegido. Toda cobertura, incluida una óptima, debe tomar al menos un extremo de cada arista de M. Como esas aristas son disjuntas, esos extremos son vértices distintos, y OPT es al menos la cantidad de aristas de M. Nuestro algoritmo elige exactamente dos extremos por arista, así que su tamaño es dos veces esa cantidad y no supera dos OPT. La salida es válida porque al terminar ninguna arista queda con ambos extremos afuera. Para un grafo sin aristas devuelve vacío y la desigualdad cero menor o igual que dos por cero también se cumple sin dividir por el óptimo."
          ]
        },
        {
          "title": "Implementación y recorrido",
          "paragraphs": [
            "La versión sobre matriz recorre pares u menores que v. Si existe la arista y ninguno de sus extremos fue seleccionado, selecciona ambos. Si ya hay un extremo seleccionado, esa arista está cubierta y se omite. El conjunto solo crece, por lo que una arista omitida por estar cubierta no puede quedar descubierta después. La matriz se valida como cuadrada, simétrica y sin lazos. La complejidad es Θ(n²) por representación, con Θ(n) auxiliar para la selección. Con listas de adyacencia y un manejo adecuado de aristas podemos expresar el trabajo en O(n+m), sin cambiar la demostración de calidad."
          ]
        },
        {
          "title": "Límites de la garantía",
          "paragraphs": [
            "El orden de aristas puede cambiar la cobertura concreta y su tamaño, pero la cota dos sigue siendo válida. En una sola arista el algoritmo toma dos vértices cuando uno basta, mostrando que el factor puede alcanzarse. La prueba no se traslada directamente a vértices con pesos: elegir ambos extremos podría incluir uno arbitrariamente caro. Tampoco afirma que el matching elegido sea máximo ni que la cobertura sea mínima. Si una aplicación exige el óptimo, debemos recurrir a un algoritmo exacto, restricciones especiales del grafo o una búsqueda con certificación; una salida aproximada no cumple automáticamente ese contrato."
          ]
        },
        {
          "title": "Validar calidad y comparar opciones",
          "paragraphs": [
            "Probá grafo vacío, una arista, estrella, camino y triángulo. Verificá primero que cada arista tenga un extremo elegido. Para n pequeño, enumerá todos los subconjuntos y calculá OPT; comprobá después tamaño de salida menor o igual que dos OPT. Este contraste ayuda a encontrar errores, pero la demostración por matching cubre cualquier tamaño. Registrá además tiempo y memoria y compará con la búsqueda exacta. La práctica debe indicar si prioriza latencia, calidad garantizada o optimalidad, y por qué un resultado factible sin cota podría ser insuficiente para la decisión del sistema."
          ],
          "code": "COBERTURA(g)\n  C←vacío\n  para cada arista (u,v)\n    si u∉C y v∉C: agregar ambos a C\n  devolver C",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Θ(n²) con matriz; O(n+m) con listas",
        "space": "Θ(n) auxiliar",
        "explanation": "La prueba usa un matching disjunto como cota inferior del óptimo, no una suposición sobre elecciones locales."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Con una arista entre cero y uno, el algoritmo devuelve ambos extremos. OPT contiene uno solo, así que la salida alcanza exactamente el factor dos. En un triángulo puede elegir cero y uno y cubrir también las otras dos aristas; allí obtiene una cobertura óptima de tamaño dos.",
        "code": "class CoberturaAproximada {\n  static boolean[] resolver(boolean[][] g) {\n    if(g==null)throw new IllegalArgumentException();\n    int n=g.length;\n    for(boolean[] fila:g)if(fila==null||fila.length!=n)throw new IllegalArgumentException();\n    for(int i=0;i<n;i++)for(int j=0;j<n;j++)\n      if(g[i][j]!=g[j][i]||i==j&&g[i][j])throw new IllegalArgumentException();\n    boolean[] cubierta=new boolean[n];\n    for(int u=0;u<n;u++)for(int v=u+1;v<n;v++)\n      if(g[u][v]&&!cubierta[u]&&!cubierta[v]){cubierta[u]=true;cubierta[v]=true;}\n    return cubierta;\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Implementá una verificación exhaustiva de OPT para hasta doce vértices y contrastá la garantía en grafos generados. La plataforma no compila ni ejecuta esta práctica; documentá tus resultados locales."
      },
      "takeaways": [
        "Una solución rápida puede ser útil cuando incluye una cota demostrada de distancia al óptimo.",
        "La prueba usa un matching disjunto como cota inferior del óptimo, no una suposición sobre elecciones locales.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ]
    },
    {
      "id": "m16-sistemas-medicion",
      "moduleId": 16,
      "title": "Optimización, profiling y elección para sistemas reales",
      "duration": 28,
      "summary": "Optimizar significa conservar el contrato y mejorar una métrica relevante bajo una carga definida.",
      "objectives": [
        "Explicar optimización, profiling y elección para sistemas reales y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Empezar por la operación dominante",
          "paragraphs": [
            "Antes de cambiar código, describí la carga y el objetivo: cantidad de elementos, consultas por segundo, latencia máxima, memoria disponible y proporción de actualizaciones. Un historial con accesos por índice suele beneficiarse de un arreglo dinámico; una cola de prioridad necesita un heap; consultas ordenadas por rango pueden requerir un árbol. Una tabla hash favorece pertenencia esperada constante con claves adecuadas, mientras un árbol balanceado ofrece orden y operaciones logarítmicas. La elección debe considerar también persistencia, concurrencia y costo de mantener varias estructuras coherentes. Resolver un cuello de botella equivocado puede agregar complejidad sin mejorar la experiencia observada."
          ]
        },
        {
          "title": "Un contrato para optimizar duplicados",
          "paragraphs": [
            "Queremos devolver el menor índice j cuyo identificador ya apareció antes, o menos uno si todos son distintos. La versión ingenua compara cada nuevo valor con todo su prefijo, usando Θ(n²) comparaciones en el peor caso y auxiliar constante. Una versión con HashSet conserva los identificadores vistos y detecta la primera repetición al intentar agregar. El invariante dice que el conjunto contiene exactamente el prefijo procesado. Ese contrato importa: buscar cualquier par repetido mediante otro orden de ciclos podría devolver un duplicado diferente. La optimización tiene que preservar la posición requerida y no solo responder que existe alguna repetición."
          ]
        },
        {
          "title": "Intercambiar tiempo y espacio",
          "paragraphs": [
            "Con hashing bien distribuido y costo acotado de hash e igualdad, la versión con conjunto necesita O(n) tiempo esperado y O(u) memoria, donde u es la cantidad de claves distintas visitadas. No ofrece una garantía universal independiente de claves e implementación. Para cadenas largas, calcular hashes o comparar contenidos agrega trabajo proporcional a sus caracteres, y el modelo debe aclararlo. La validación inicial de todos los elementos nulos ya cuesta Θ(n), incluso si después la repetición aparece temprano. Usar un árbol para vistos cambia la expectativa por O(n log u) comparaciones y mantiene orden si también lo necesitamos."
          ]
        },
        {
          "title": "Benchmarking y profiling responden preguntas distintas",
          "paragraphs": [
            "Un benchmark mide una tarea definida con entradas, calentamiento, repeticiones y resultados verificados. Un profiler ayuda a localizar dónde se consume tiempo, se reserva memoria o se producen bloqueos durante una carga representativa. Antes de optimizar, comprobá si domina el algoritmo, la entrada y salida, la recolección o la espera por recursos. El cronómetro de una función aislada no describe automáticamente latencia de un servicio completo. Separá tiempo de CPU, tiempo transcurrido y memoria máxima cuando sean relevantes. Una mejora local puede no afectar el sistema si la fracción optimizada era pequeña dentro del total."
          ]
        },
        {
          "title": "Preservar correctitud y medir regresiones",
          "paragraphs": [
            "Compará ambas implementaciones sobre vacío, un elemento, repetidos al comienzo y al final, todos distintos y cadenas iguales con objetos distintos. La igualdad debe usar equals y no identidad de referencia. Verificá también el contrato de null antes de medir. Registrá tamaño, distribución, longitud de claves, versión Java y memoria. Un conjunto reduce comparaciones, pero puede aumentar asignaciones y presión del recolector; esa compensación debe verse en los datos. Evitá eliminar validaciones o modificar el resultado solo para mejorar una medición. La solución final debe explicar qué hipótesis del análisis se verifican y qué escenarios quedan fuera."
          ]
        },
        {
          "title": "Práctica final de diseño justificado",
          "paragraphs": [
            "Proponé un sistema de eventos con identificadores repetidos y prioridades. Definí primero si se ignora una repetición, se actualiza la prioridad o se conserva un historial. Elegí estructuras para pertenencia y extracción prioritaria, y explicitá cómo se mantienen consistentes ante cambios. Considerá una actualización de prioridad: modificar un objeto dentro de un heap no reordena automáticamente la estructura, por lo que necesitás una estrategia válida. Entregá contrato, alternativa inicial, prueba de correctitud, análisis temporal y espacial, benchmark y limitaciones. Una decisión defendible conecta cada costo con una operación real y explica qué cambio de carga justificaría revisar el diseño."
          ],
          "code": "PRIMERA_REPETICION(ids)\n  vistos←conjunto vacío\n  para j desde 0 hasta n−1\n    si ids[j]∈vistos: devolver j\n    agregar ids[j] a vistos\n  devolver −1",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Ingenuo peor Θ(n²); conjunto esperado O(n)",
        "space": "Ingenuo Θ(1); conjunto O(u)",
        "explanation": "La mejora usa memoria adicional y conserva la semántica bajo hipótesis explícitas de hashing."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Para [a,b,c,b,a], ambos métodos devuelven tres: es la primera posición que repite un identificador anterior. Un algoritmo que priorizara el primer valor inicial duplicado podría elegir a y devolver cuatro, incumpliendo este contrato aunque detecte un duplicado real.",
        "code": "class Repeticiones {\n  static void validar(String[] ids) {\n    if(ids==null)throw new IllegalArgumentException();\n    for(String id:ids)if(id==null)throw new IllegalArgumentException();\n  }\n  static int ingenuo(String[] ids) {\n    validar(ids);\n    for(int j=0;j<ids.length;j++)for(int i=0;i<j;i++)if(ids[i].equals(ids[j]))return j;\n    return -1;\n  }\n  static int conConjunto(String[] ids) {\n    validar(ids);\n    java.util.HashSet<String> vistos=new java.util.HashSet<>();\n    for(int j=0;j<ids.length;j++)if(!vistos.add(ids[j]))return j;\n    return -1;\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Diseñá, implementá localmente y justificá un sistema pequeño de eventos con repetidos y prioridad. Esta práctica no compila ni ejecuta código en la plataforma. Entregá pruebas y mediciones de las operaciones dominantes."
      },
      "takeaways": [
        "Optimizar significa conservar el contrato y mejorar una métrica relevante bajo una carga definida.",
        "La mejora usa memoria adicional y conserva la semántica bajo hipótesis explícitas de hashing.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ],
      "lab": "design"
    }
  ],
  "exercises": [
    {
      "id": "m16-e01",
      "moduleId": 16,
      "title": "Estado de prefijo",
      "kind": "prediction",
      "difficulty": "Inicial",
      "prompt": "¿Cuánto vale suma antes de procesar el último elemento?",
      "input": "[4,−2,7]",
      "expected": "Un entero.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "2",
      "accepted": [],
      "hints": [
        "El prefijo ya procesado contiene cuatro y menos dos.",
        "El siete todavía no pertenece al prefijo del invariante."
      ],
      "solution": "2",
      "explanation": "Antes del índice dos, suma representa a[0]+a[1], no el arreglo completo.",
      "lessonId": "m16-correctitud"
    },
    {
      "id": "m16-e02",
      "moduleId": 16,
      "title": "Transferencia amortizada",
      "kind": "complexity",
      "difficulty": "Inicial",
      "prompt": "¿Cuál es el costo amortizado por operación de la cola con dos pilas desde vacío?",
      "input": "m encolados/desencolados válidos",
      "expected": "Usá O.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "O(1)",
      "accepted": [
        "o(1)",
        "constante"
      ],
      "hints": [
        "Cada elemento pasa de entrada a salida una sola vez.",
        "Una transferencia cara no se repite para esos mismos elementos."
      ],
      "solution": "O(1) amortizado",
      "explanation": "La cantidad total de primitivas de pila es O(m), aunque un desencolar particular sea lineal.",
      "lessonId": "m16-amortizado"
    },
    {
      "id": "m16-e03",
      "moduleId": 16,
      "title": "Reducción en dirección incorrecta",
      "kind": "debug",
      "difficulty": "Intermedio",
      "prompt": "Para probar B difícil usando A ya difícil, ¿qué transformación necesitamos?",
      "input": "Reducciones polinómicas de decisión",
      "expected": "A→B o B→A.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "A→B",
      "accepted": [
        "A->B",
        "a a b"
      ],
      "hints": [
        "Un solucionador para B debe poder resolver A.",
        "La instancia original pertenece al problema cuya dificultad ya conocemos."
      ],
      "solution": "A → B",
      "explanation": "Transformar A en B permite reutilizar un algoritmo para B y transferir la dificultad de A.",
      "lessonId": "m16-limites-np"
    },
    {
      "id": "m16-e04",
      "moduleId": 16,
      "title": "Cobertura de una arista",
      "kind": "prediction",
      "difficulty": "Inicial",
      "prompt": "¿Cuántos vértices elige el algoritmo aproximado para una sola arista?",
      "input": "Vértices cero y uno conectados.",
      "expected": "Un entero.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "2",
      "accepted": [],
      "hints": [
        "El algoritmo agrega ambos extremos de una arista sin cubrir.",
        "El óptimo usa uno, pero la garantía permite el doble."
      ],
      "solution": "2",
      "explanation": "El caso alcanza el factor dos y muestra que la salida no siempre es mínima.",
      "lessonId": "m16-aproximacion"
    },
    {
      "id": "m16-e05",
      "moduleId": 16,
      "title": "Diseño completo y defendible",
      "kind": "implementation",
      "difficulty": "Intermedio",
      "prompt": "Optimizá la detección de primera repetición y justificá la elección de estructura. La plataforma no compila ni ejecuta tu código; aportá pruebas y benchmark locales.",
      "input": "Vacío, todos distintos, repetidos tempranos y tardíos.",
      "expected": "Mismo índice que la especificación y análisis de memoria.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "int primeraRepeticion(String[] ids) { /* completar */ }",
      "answer": "",
      "accepted": [],
      "hints": [
        "Definí el invariante del conjunto de vistos.",
        "Compará resultados con la versión ingenua antes de medir."
      ],
      "solution": "Conservar un conjunto del prefijo; devolver j cuando add indica que ya existe. Validar contrato y comparar contra doble ciclo j/i, midiendo entradas idénticas y consumo espacial.",
      "explanation": "La optimización preserva el primer índice repetido y cambia tiempo por memoria bajo hipótesis de hashing explícitas.",
      "lessonId": "m16-sistemas-medicion"
    }
  ],
  "questions": [
    {
      "id": "m16-q01",
      "moduleId": 16,
      "type": "choice",
      "prompt": "Correctitud total incluye:",
      "options": [
        "Resultado correcto y terminación para entradas válidas.",
        "Solo pasar pruebas.",
        "Solo terminar rápido."
      ],
      "answer": 0,
      "explanation": "La correctitud parcial requiere resultado si termina; la total añade que efectivamente termina.",
      "lessonId": "m16-correctitud"
    },
    {
      "id": "m16-q02",
      "moduleId": 16,
      "type": "truefalse",
      "prompt": "Un invariante se justifica solo comprobándolo al final.",
      "options": [
        "Falso",
        "Verdadero"
      ],
      "answer": 0,
      "explanation": "Hay que demostrar inicialización y mantenimiento, y luego usarlo al salir.",
      "lessonId": "m16-correctitud"
    },
    {
      "id": "m16-q03",
      "moduleId": 16,
      "type": "prediction",
      "prompt": "Potencial 2·|entrada| después de tres encolados desde vacío:",
      "options": [
        "6",
        "3",
        "0"
      ],
      "answer": 0,
      "explanation": "Cada encolado aumenta la cantidad en entrada en uno y el potencial en dos.",
      "lessonId": "m16-amortizado"
    },
    {
      "id": "m16-q04",
      "moduleId": 16,
      "type": "complexity",
      "prompt": "La cota Ω(n log n) para ordenar se aplica a:",
      "options": [
        "Algoritmos generales basados solo en comparaciones.",
        "Cualquier algoritmo de claves enteras sin excepciones.",
        "Solo Bubble Sort."
      ],
      "answer": 0,
      "explanation": "El modelo de comparaciones debe distinguir todos los órdenes posibles de claves distintas.",
      "lessonId": "m16-limites-np"
    },
    {
      "id": "m16-q05",
      "moduleId": 16,
      "type": "order",
      "prompt": "Una prueba de invariante organiza:",
      "options": [
        "Inicialización → mantenimiento → consecuencia al salir",
        "Resultado → adivinar entrada → ignorar ciclo",
        "Medición → conclusión sin hipótesis"
      ],
      "answer": 0,
      "explanation": "Ese orden conecta el estado inicial con todas las vueltas y con la postcondición.",
      "lessonId": "m16-correctitud"
    },
    {
      "id": "m16-q06",
      "moduleId": 16,
      "type": "choice",
      "prompt": "NP significa aquí:",
      "options": [
        "Certificados polinómicos verificables en tiempo polinómico.",
        "No polinómico.",
        "Problemas sin solución."
      ],
      "answer": 0,
      "explanation": "La clase se define por verificación y no afirma que sus problemas estén fuera de P.",
      "lessonId": "m16-limites-np"
    },
    {
      "id": "m16-q07",
      "moduleId": 16,
      "type": "truefalse",
      "prompt": "Un matching maximal siempre tiene cardinalidad máxima.",
      "options": [
        "Falso",
        "Verdadero"
      ],
      "answer": 0,
      "explanation": "Maximal solo impide agregar otra arista disjunta; puede existir un matching más grande.",
      "lessonId": "m16-aproximacion"
    },
    {
      "id": "m16-q08",
      "moduleId": 16,
      "type": "prediction",
      "prompt": "En la reducción Hamilton→TSP, un tour de n aristas todas de peso uno cuesta:",
      "options": [
        "n",
        "n−1",
        "2n"
      ],
      "answer": 0,
      "explanation": "El tour cierra el ciclo y por eso contiene exactamente n aristas para n vértices.",
      "lessonId": "m16-limites-np"
    },
    {
      "id": "m16-q09",
      "moduleId": 16,
      "type": "complexity",
      "prompt": "La cobertura aproximada sobre matriz tarda:",
      "options": [
        "Θ(n²)",
        "Θ(1)",
        "Θ(log n)"
      ],
      "answer": 0,
      "explanation": "La representación requiere revisar pares de vértices además de validar la matriz.",
      "lessonId": "m16-aproximacion"
    },
    {
      "id": "m16-q10",
      "moduleId": 16,
      "type": "order",
      "prompt": "Una optimización fundamentada sigue:",
      "options": [
        "Especificar → verificar equivalencia → medir → justificar",
        "Medir una vez → cambiar contrato → publicar",
        "Eliminar casos límite → comparar tiempos"
      ],
      "answer": 0,
      "explanation": "Los resultados deben conservar el contrato antes de interpretar cualquier mejora temporal.",
      "lessonId": "m16-sistemas-medicion"
    }
  ],
  "glossary": [
    {
      "term": "Correctitud total",
      "definition": "Cumplimiento del contrato junto con terminación para toda entrada válida.",
      "lessonId": "m16-correctitud"
    },
    {
      "term": "Variante",
      "definition": "Medida en un conjunto bien fundado que disminuye y permite demostrar terminación.",
      "lessonId": "m16-correctitud"
    },
    {
      "term": "Potencial",
      "definition": "Función no negativa del estado que contabiliza trabajo acumulado para análisis amortizado.",
      "lessonId": "m16-amortizado"
    },
    {
      "term": "Reducción polinómica",
      "definition": "Transformación eficiente que conserva respuestas de un problema de decisión en otro.",
      "lessonId": "m16-limites-np"
    },
    {
      "term": "NP-completo",
      "definition": "Problema en NP al que todos los problemas de NP se reducen polinómicamente.",
      "lessonId": "m16-limites-np"
    },
    {
      "term": "Factor de aproximación",
      "definition": "Cota demostrada entre la calidad de la salida y el óptimo bajo una convención explícita.",
      "lessonId": "m16-aproximacion"
    },
    {
      "term": "Profiling",
      "definition": "Observación de una ejecución para localizar consumo de tiempo, memoria o espera.",
      "lessonId": "m16-sistemas-medicion"
    }
  ]
};
