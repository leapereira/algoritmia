import type { ModuleContent } from './types.js';

export const module13: ModuleContent = {
  "moduleId": 13,
  "lessons": [
    {
      "id": "m13-estado-fibonacci",
      "moduleId": 13,
      "title": "Estados, memoización y tabulación",
      "duration": 28,
      "summary": "Programación dinámica calcula una vez cada subproblema y reutiliza el resultado sin perder su significado.",
      "objectives": [
        "Explicar estados, memoización y tabulación y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Reconocer superposición y estructura",
          "paragraphs": [
            "Una solución recursiva puede resolver muchas veces el mismo subproblema. Fibonacci ingenuo calcula F(n−1) y F(n−2), y ambos vuelven a necesitar valores anteriores. El árbol de llamadas crece exponencialmente aunque solo existan n más uno argumentos distintos. Programación dinámica organiza esos estados para calcular cada uno una sola vez. La subestructura óptima permite componer soluciones óptimas de problemas menores, y la superposición explica por qué conviene guardarlas. No basta con reconocer una fórmula recursiva: primero debemos definir qué información identifica completamente un subproblema y qué resultado exacto almacenará cada estado."
          ]
        },
        {
          "title": "Definir estado y recurrencia",
          "paragraphs": [
            "Fijamos F(0)=0 y F(1)=1. Para n mayor o igual que dos, F(n)=F(n−1)+F(n−2). El estado es solamente el índice n porque no hay otra condición que afecte el resultado. En otros problemas puede incluir capacidad restante, posición de una cadena o recursos disponibles. Una clave incompleta mezclaría resultados que pertenecen a situaciones distintas. Antes del código, escribí dominio, casos base, transición y respuesta final. También verificá que las dependencias avanzan hacia casos más pequeños: si la recurrencia contiene ciclos sin tratamiento adicional, memoizar por sí solo no garantiza terminación."
          ]
        },
        {
          "title": "Memoización top-down",
          "paragraphs": [
            "La memoización conserva la forma recursiva y consulta una tabla antes de resolver. Si el estado ya tiene respuesta, la devuelve; si no, calcula sus dependencias y almacena el resultado. Usamos menos uno como marca porque Fibonacci válido nunca es negativo. No siempre existe un valor especial libre: en problemas con resultados arbitrarios puede necesitarse una tabla booleana de calculado. Top-down visita únicamente estados alcanzados, pero conserva la pila de llamadas. El argumento de correctitud usa inducción: los casos base cumplen la definición y combinar respuestas correctas de estados menores produce el valor correcto del estado actual."
          ]
        },
        {
          "title": "Tabulación bottom-up y espacio",
          "paragraphs": [
            "La tabulación elige un orden donde cada dependencia esté disponible antes de usarla. Para Fibonacci, avanzamos desde cero y uno hasta n. Después de cada vuelta, dos variables representan los últimos valores consecutivos necesarios; no hace falta conservar toda la tabla si solamente pedimos F(n). Antes de iterar con índice i, anterior es F(i−2) y actual es F(i−1). Calcular su suma y desplazar ambas referencias numéricas preserva el invariante. El tiempo sigue siendo Θ(n), pero la memoria auxiliar baja de Θ(n) a Θ(1). Esa compresión sería insuficiente si el contrato necesitara devolver todos los valores intermedios."
          ]
        },
        {
          "title": "Límites numéricos y costos",
          "paragraphs": [
            "Aunque el número de estados sea lineal, los valores crecen rápido. El código limita n al intervalo de cero a noventa y dos, porque F(92) cabe en long y F(93) ya no. Math.addExact detecta desbordamiento si se viola accidentalmente esa expectativa. Para n arbitrario podemos usar BigInteger, pero sumar números de más dígitos deja de ser una operación constante bajo un modelo de bits. Memoizar usa Θ(n) tabla y Θ(n) pila; tabular con dos variables usa espacio constante bajo enteros de ancho fijo. No confundas reducir operaciones con eliminar todas las restricciones de representación."
          ]
        },
        {
          "title": "Práctica y contraste de técnicas",
          "paragraphs": [
            "Para n igual a cinco, los valores son cero, uno, uno, dos, tres y cinco. La memoización alcanza cada estado nuevo una vez y reutiliza los repetidos; la tabulación los visita en orden. Compará el número de llamadas con la recursión ingenua sin medir únicamente milisegundos. Probá n cero, uno, dos, noventa y dos y entradas rechazadas. Divide y vencerás suele separar subproblemas independientes; aquí las dependencias se superponen. Greedy tomaría decisiones locales sin reconsiderarlas, mientras la programación dinámica conserva alternativas mediante estados. La técnica se elige por la estructura del problema y no por agregar una tabla sin una definición clara."
          ],
          "code": "RESOLVER(n)\n  si n≤1: devolver n\n  si calculado[n]: devolver memo[n]\n  memo[n]←RESOLVER(n−1)+RESOLVER(n−2)\n  devolver memo[n]",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Θ(n) estados y operaciones de ancho fijo",
        "space": "Memo Θ(n); tabulación comprimida Θ(1)",
        "explanation": "Cada estado se resuelve una vez; el tamaño numérico debe respetar el contrato long."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "F(5) requiere los estados F(0) a F(5). Una vez que F(3) se calculó al resolver F(4), la segunda solicitud lo recupera de la tabla. La versión de dos variables termina con anterior igual a tres y actual igual a cinco. Ambas responden cinco.",
        "code": "class FibonacciDP {\n  static void validar(int n) {\n    if(n<0||n>92)throw new IllegalArgumentException(\"Se requiere 0 <= n <= 92\");\n  }\n  static long memoizado(int n) {\n    validar(n);\n    long[] memo=new long[n+1];java.util.Arrays.fill(memo,-1);\n    return resolver(n,memo);\n  }\n  static long resolver(int n,long[] memo) {\n    if(n<=1)return n;\n    if(memo[n]!=-1)return memo[n];\n    memo[n]=Math.addExact(resolver(n-1,memo),resolver(n-2,memo));\n    return memo[n];\n  }\n  static long tabulado(int n) {\n    validar(n);\n    if(n<=1)return n;\n    long anterior=0,actual=1;\n    for(int i=2;i<=n;i++){\n      long siguiente=Math.addExact(anterior,actual);\n      anterior=actual;actual=siguiente;\n    }\n    return actual;\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Contá llamadas y estados distintos en Fibonacci ingenuo y memoizado para n=10. Explicá por qué los dos números no significan lo mismo."
      },
      "takeaways": [
        "Programación dinámica calcula una vez cada subproblema y reutiliza el resultado sin perder su significado.",
        "Cada estado se resuelve una vez; el tamaño numérico debe respetar el contrato long.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ],
      "lab": "dp"
    },
    {
      "id": "m13-mochila",
      "moduleId": 13,
      "title": "Mochila 0/1 y orden de actualización",
      "duration": 28,
      "summary": "La capacidad y el prefijo de objetos forman estados que conservan todas las elecciones relevantes.",
      "objectives": [
        "Explicar mochila 0/1 y orden de actualización y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Contrato del problema",
          "paragraphs": [
            "Tenemos objetos con peso entero positivo y valor no negativo, y una capacidad entera W. Cada objeto puede elegirse como máximo una vez. Buscamos el mayor valor total sin superar la capacidad; está permitido dejar espacio libre y elegir ninguno. Este es el problema de mochila cero o uno, distinto de la mochila fraccionaria y de la ilimitada. Ordenar por valor por peso y elegir codiciosamente no garantiza el óptimo en este contrato. El estado debe recordar qué objetos todavía están disponibles, porque dos situaciones con igual capacidad restante pueden tener futuros distintos si ya consumieron objetos diferentes."
          ]
        },
        {
          "title": "Estado con prefijos y recurrencia",
          "paragraphs": [
            "Definimos DP[i][c] como el mayor valor usando solamente los primeros i objetos y capacidad a lo sumo c. La fila cero vale cero para cualquier capacidad: sin objetos solo existe la selección vacía. Para el objeto i, podemos excluirlo y usar DP[i−1][c], o incluirlo si su peso cabe y sumar su valor a DP[i−1][c−peso]. Tomamos el máximo de ambas opciones. Usar siempre la fila anterior en las dos alternativas garantiza que el mismo objeto no reaparece dentro de su propia solución. Si no cabe, la única alternativa válida es excluirlo."
          ]
        },
        {
          "title": "Demostración de optimalidad",
          "paragraphs": [
            "Toda solución válida pertenece exactamente a una de dos categorías: incluye el objeto actual o no lo incluye. En el segundo caso, no puede superar el óptimo del prefijo anterior con la misma capacidad. En el primero, quitar ese objeto deja una selección válida del prefijo anterior con la capacidad reducida. Si esa selección no fuera óptima podríamos reemplazarla por otra mejor y aumentar el valor total, contradiciendo optimalidad. Comparar las dos categorías cubre todas las posibilidades sin enumerar cada subconjunto explícitamente. La inducción sobre i justifica cada fila a partir de la anterior."
          ]
        },
        {
          "title": "Una dimensión y dirección descendente",
          "paragraphs": [
            "Si solamente necesitamos el valor óptimo, guardamos un arreglo mejor[c]. Procesamos cada objeto recorriendo capacidades desde W hacia su peso. Así mejor[c−peso] todavía pertenece a la fila anterior, porque esa posición menor no se actualizó durante el objeto actual. Recorrer hacia arriba reutilizaría valores ya modificados y permitiría seleccionar repetidamente el mismo objeto, cambiando el problema a mochila ilimitada. Este detalle no es una microoptimización: determina la semántica del algoritmo. La compresión reduce espacio de Θ(nW) a Θ(W), pero pierde directamente la información necesaria para reconstruir todos los objetos elegidos."
          ]
        },
        {
          "title": "Complejidad pseudopolinómica y reconstrucción",
          "paragraphs": [
            "El tiempo es O(nW), que depende del valor numérico de la capacidad. Si W está representado en binario, su escritura necesita solo O(log W) bits, de modo que O(nW) no es necesariamente polinómico en la longitud de la entrada. Por eso llamamos pseudopolinómico a este diseño. Para reconstruir una selección, podemos conservar la tabla completa y comparar filas al retroceder: si el valor cambió, el objeto fue elegido y reducimos la capacidad. En empates puede haber varias selecciones óptimas. El código usa long para valores acumulados y valida tamaños compatibles, pesos positivos y capacidad no negativa."
          ]
        },
        {
          "title": "Caso resuelto y práctica",
          "paragraphs": [
            "Con pesos [2,3,4], valores [3,4,5] y W=5, elegir los objetos de pesos dos y tres produce valor siete, mejor que el objeto de peso cuatro. El objeto de peso tres compara la alternativa de excluirlo con cuatro más el óptimo para capacidad dos, que ya vale tres. Probá W cero, ningún objeto, todos demasiado pesados y repetidos como objetos independientes. Una capacidad enorme puede agotar memoria aunque el algoritmo sea correcto: el contrato de un sistema real debe incluir un presupuesto viable. Verificá en tamaños pequeños contra enumeración de subconjuntos para detectar errores de dirección."
          ],
          "code": "DP[i,c]←DP[i−1,c]\nsi peso[i]≤c:\n  DP[i,c]←max(DP[i,c], valor[i]+DP[i−1,c−peso[i]])\nrespuesta←DP[n,W]",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "O(nW), pseudopolinómico",
        "space": "Θ(W) valor; Θ(nW) reconstrucción directa",
        "explanation": "La capacidad numérica forma parte del costo y la dirección descendente impide reutilizar objetos."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Para W=5, el segundo objeto usa mejor[2]=3 y genera mejor[5]=7. Recorrer capacidades de mayor a menor garantiza que esa posición dos no contiene ya el segundo objeto. Con un único objeto peso dos y valor tres, W cuatro debe devolver tres y nunca seis.",
        "code": "class Mochila01 {\n  static long maximo(int[] pesos,int[] valores,int capacidad) {\n    if(pesos==null||valores==null||pesos.length!=valores.length||capacidad<0)\n      throw new IllegalArgumentException();\n    for(int i=0;i<pesos.length;i++)if(pesos[i]<=0||valores[i]<0)throw new IllegalArgumentException();\n    long[] mejor=new long[Math.addExact(capacidad,1)];\n    for(int i=0;i<pesos.length;i++) {\n      for(int c=capacidad;c>=pesos[i];c--) {\n        mejor[c]=Math.max(mejor[c],Math.addExact(mejor[c-pesos[i]],(long)valores[i]));\n      }\n    }\n    return mejor[capacidad];\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Añadí reconstrucción con una tabla bidimensional y explicitá qué selección elegís cuando varias dan el mismo valor. Verificá por enumeración hasta diez objetos."
      },
      "takeaways": [
        "La capacidad y el prefijo de objetos forman estados que conservan todas las elecciones relevantes.",
        "La capacidad numérica forma parte del costo y la dirección descendente impide reutilizar objetos.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ],
      "lab": "dp"
    },
    {
      "id": "m13-lcs",
      "moduleId": 13,
      "title": "Subsecuencia común más larga",
      "duration": 28,
      "summary": "Una tabla sobre pares de prefijos compara decisiones de descartar caracteres sin exigir contigüidad.",
      "objectives": [
        "Explicar subsecuencia común más larga y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Subsecuencia no es subcadena",
          "paragraphs": [
            "Una subsecuencia se obtiene eliminando cero o más caracteres sin cambiar el orden de los restantes. No necesita ocupar posiciones consecutivas. Por ejemplo, ACE es subsecuencia de ABCDE, pero no es una subcadena contigua. LCS pide la mayor longitud común a dos secuencias y, opcionalmente, una secuencia que la alcance. Puede haber varias respuestas óptimas distintas. El ejemplo Java compara unidades char de UTF-16; para texto con emojis o criterios lingüísticos puede necesitarse convertir a puntos de código o grafemas antes de aplicar el mismo algoritmo. El tamaño n representa aquí la longitud en esas unidades elegidas."
          ]
        },
        {
          "title": "Definir dos prefijos",
          "paragraphs": [
            "DP[i][j] representa la longitud de una LCS entre los primeros i caracteres de a y los primeros j de b. Si alguno de los prefijos es vacío, la longitud es cero. Cuando los últimos caracteres coinciden, podemos añadir ese carácter a una LCS de los prefijos anteriores y obtener uno más DP[i−1][j−1]. Cuando difieren, cualquier subsecuencia común debe prescindir de al menos uno de esos dos últimos caracteres: elegimos el máximo entre DP[i−1][j] y DP[i][j−1]. El estado contiene ambos índices porque la misma posición de una cadena puede combinarse con distintos prefijos de la otra."
          ]
        },
        {
          "title": "Justificar las transiciones",
          "paragraphs": [
            "Si los extremos coinciden, existe una solución óptima que los empareja: el resto pertenece a prefijos menores y no puede superar su LCS. Si difieren, no pueden emparejarse entre sí como último símbolo común. Una solución óptima debe omitir el extremo de una cadena o el de la otra, por lo que las dos alternativas cubren todas las posibilidades. La tabla se llena por filas crecientes y columnas crecientes, de modo que cada celda usa dependencias ya calculadas. La inducción sobre la suma i más j justifica bases y recurrencia sin depender de un ejemplo particular."
          ]
        },
        {
          "title": "Reconstruir una respuesta",
          "paragraphs": [
            "Desde DP[n][m], si los caracteres finales coinciden, registramos el carácter y retrocedemos en diagonal. Si no coinciden, vamos hacia la celda superior o izquierda con mayor longitud. Recolectamos caracteres en orden inverso y al terminar invertimos la secuencia. En un empate puede elegirse cualquiera de las dos direcciones y aun así obtener una LCS válida, aunque distinta. Para caracteres fuera de un alfabeto simple debemos respetar la unidad de texto fijada por el contrato al reconstruir. La implementación incluida devuelve solo la longitud para separar esa garantía de las decisiones de representación y desempate."
          ]
        },
        {
          "title": "Tiempo, espacio y compresión",
          "paragraphs": [
            "La tabla tiene (n+1)(m+1) celdas y cada transición realiza trabajo constante, así que cuesta Θ(nm) tiempo y Θ(nm) memoria. Para obtener únicamente la longitud, una fila depende de la anterior y del prefijo actual: podemos conservar dos filas, o una con una variable diagonal, usando O(min(n,m)) espacio si elegimos la cadena corta como columnas. Reconstruir desde esa compresión no es inmediato porque se perdieron decisiones; existen técnicas adicionales, pero no debemos prometer reconstrucción gratis. Antes de reservar, estimá cuántas celdas caben en memoria y recordá que Java representa una matriz como un arreglo de filas."
          ]
        },
        {
          "title": "Ejemplo y comprobaciones",
          "paragraphs": [
            "Para a=ABC y b=AC, la coincidencia A forma longitud uno y la coincidencia C extiende la diagonal correspondiente hasta dos. La respuesta es AC. Si ambas cadenas están vacías, la celda inicial vale cero; si no comparten símbolos, toda la tabla permanece cero. Probá caracteres repetidos y varias respuestas óptimas, como AB y BA. La validación de una secuencia reconstruida debe comprobar que es subsecuencia de ambas y que su longitud coincide con el óptimo; comparar con una única cadena esperada puede rechazar otra solución igualmente correcta. Esta técnica también permite medir similitud sin exigir que los símbolos sean contiguos."
          ],
          "code": "LCS(i,j)\n  si i=0 o j=0: devolver 0\n  si a[i−1]=b[j−1]: devolver 1+LCS(i−1,j−1)\n  devolver max(LCS(i−1,j),LCS(i,j−1))",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Θ(nm)",
        "space": "Θ(nm); longitud comprimida O(min(n,m))",
        "explanation": "Cada par de prefijos se evalúa una vez; recuperar la secuencia requiere conservar decisiones adicionales."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "La tabla para ABC y AC tiene cuatro filas y tres columnas. La fila de A alcanza uno, B conserva ese valor y C permite llegar a dos mediante diagonal. La longitud óptima es dos y AC es una subsecuencia válida de ambas.",
        "code": "class SubsecuenciaComun {\n  static int longitud(String a,String b) {\n    if(a==null||b==null)throw new IllegalArgumentException();\n    int n=a.length(),m=b.length();\n    int[][] dp=new int[n+1][m+1];\n    for(int i=1;i<=n;i++)for(int j=1;j<=m;j++) {\n      if(a.charAt(i-1)==b.charAt(j-1))dp[i][j]=1+dp[i-1][j-1];\n      else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);\n    }\n    return dp[n][m];\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Reconstruí una LCS y probá AB frente a BA. Explicá por qué tanto A como B son respuestas correctas y cómo adaptarías la validación."
      },
      "takeaways": [
        "Una tabla sobre pares de prefijos compara decisiones de descartar caracteres sin exigir contigüidad.",
        "Cada par de prefijos se evalúa una vez; recuperar la secuencia requiere conservar decisiones adicionales.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ]
    },
    {
      "id": "m13-edicion",
      "moduleId": 13,
      "title": "Distancia de edición",
      "duration": 28,
      "summary": "El costo de transformar prefijos se compone eligiendo insertar, eliminar o sustituir el último símbolo.",
      "objectives": [
        "Explicar distancia de edición y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Un contrato de operaciones permitidas",
          "paragraphs": [
            "La distancia de Levenshtein mide la menor cantidad de inserciones, eliminaciones y sustituciones necesarias para transformar una cadena en otra, con costo uno por operación. Mantener un símbolo igual cuesta cero. Transponer dos símbolos vecinos no está incluido; agregarlo definiría otra distancia con recurrencias diferentes. Los ejemplos comparan unidades char de UTF-16, como la lección LCS. Hay que fijar esa unidad antes de interpretar resultados de texto real. Las cadenas vacías son entradas válidas: convertir vacío en una cadena de longitud m requiere exactamente m inserciones y no puede lograrse con menos operaciones."
          ]
        },
        {
          "title": "Estado de transformación de prefijos",
          "paragraphs": [
            "Definimos DP[i][j] como el costo mínimo de transformar el prefijo de longitud i de a en el prefijo de longitud j de b. La primera columna vale i porque debemos eliminar todos los caracteres; la primera fila vale j porque debemos insertarlos. Para una celda interior consideramos eliminar el último de a, insertar el último de b o emparejar ambos mediante conservación o sustitución. Tomamos el mínimo entre DP[i−1][j]+1, DP[i][j−1]+1 y DP[i−1][j−1]+costo. El costo diagonal es cero si los símbolos coinciden y uno si difieren."
          ]
        },
        {
          "title": "Por qué el mínimo es correcto",
          "paragraphs": [
            "Cualquier transformación óptima puede analizarse por su última decisión relevante sobre los prefijos. Si termina eliminando, antes resolvió el prefijo de a sin su último símbolo. Si inserta, antes produjo el prefijo de b sin su último símbolo. Si empareja ambos extremos, antes transformó los prefijos menores. Las alternativas cubren las formas posibles de alinear los extremos bajo las operaciones admitidas. Reemplazar un prefijo por una transformación más barata mejoraría la solución total, por lo que usamos subsoluciones óptimas. Las dependencias disminuyen i o j y la tabla creciente las resuelve sin ciclos."
          ]
        },
        {
          "title": "Traza y recuperación de operaciones",
          "paragraphs": [
            "Para transformar gato en pato, conservar ato y sustituir g por p da distancia uno. Para vacío y sol, la primera fila describe tres inserciones. Para ab y ba, una transposición no está disponible: el costo es dos usando dos sustituciones o una eliminación y una inserción. Si guardamos toda la tabla, podemos retroceder desde la esquina final eligiendo una operación que explique el costo de la celda. Puede haber varias secuencias mínimas; el desempate debe ser consistente. Anotar posiciones requiere atención porque insertar y eliminar desplazan índices durante la ejecución efectiva de las operaciones reconstruidas."
          ]
        },
        {
          "title": "Comparación con LCS y espacio",
          "paragraphs": [
            "LCS maximiza una subsecuencia conservada, mientras distancia de edición minimiza operaciones permitidas. Si solo admitimos inserciones y eliminaciones, existe una relación con n+m−2LCS; cuando permitimos sustitución de costo uno, esa fórmula ya no representa en general la distancia de Levenshtein. Por ejemplo, cambiar a por b cuesta uno aquí, pero requiere eliminar e insertar si no existe sustitución. El tiempo es Θ(nm) y la tabla completa ocupa Θ(nm). Para devolver solo el número, dos filas alcanzan y reducen memoria a O(min(n,m)), manteniendo la misma transición y los bordes correctos."
          ]
        },
        {
          "title": "Límites y práctica de validación",
          "paragraphs": [
            "La distancia unitaria es no negativa, vale cero para cadenas iguales y es simétrica. Estos hechos sirven como propiedades de prueba, aunque no reemplazan la demostración. Probá vacío, símbolos iguales, sin coincidencias, repeticiones y cambios al principio y al final. Para entradas enormes, la tabla puede ser inviable; si solo interesan distancias hasta un umbral pequeño, un diseño por bandas puede ahorrar trabajo con una justificación adicional. No reduzcas arbitrariamente celdas sin demostrar que una solución aceptable no pasa por ellas. La práctica consiste en explicar el significado de cada transición antes de optimizar memoria o limitar el espacio de búsqueda."
          ],
          "code": "EDIT(i,j) ← min(\n  EDIT(i−1,j)+1,\n  EDIT(i,j−1)+1,\n  EDIT(i−1,j−1)+(a[i−1]≠b[j−1])\n)",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Θ(nm)",
        "space": "Θ(nm); valor comprimido O(min(n,m))",
        "explanation": "Cada par de prefijos evalúa tres alternativas constantes con bases explícitas."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Para gato y pato, la diagonal conserva a, t y o, y paga una sustitución en g/p: resultado uno. Para a y b, la sustitución también cuesta uno, mostrando por qué la fórmula basada solamente en inserciones y eliminaciones daría otro valor.",
        "code": "class DistanciaEdicion {\n  static int distancia(String a,String b) {\n    if(a==null||b==null)throw new IllegalArgumentException();\n    int n=a.length(),m=b.length();\n    int[][] dp=new int[n+1][m+1];\n    for(int i=0;i<=n;i++)dp[i][0]=i;\n    for(int j=0;j<=m;j++)dp[0][j]=j;\n    for(int i=1;i<=n;i++)for(int j=1;j<=m;j++) {\n      int sustituir=dp[i-1][j-1]+(a.charAt(i-1)==b.charAt(j-1)?0:1);\n      dp[i][j]=Math.min(sustituir,1+Math.min(dp[i-1][j],dp[i][j-1]));\n    }\n    return dp[n][m];\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Agregá costos configurables positivos para insertar, borrar y sustituir. Indicá qué propiedad puede perderse si insertar y borrar tienen costos distintos."
      },
      "takeaways": [
        "El costo de transformar prefijos se compone eligiendo insertar, eliminar o sustituir el último símbolo.",
        "Cada par de prefijos evalúa tres alternativas constantes con bases explícitas.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ]
    },
    {
      "id": "m13-matrices-eleccion",
      "moduleId": 13,
      "title": "Caminos en matrices y elección de técnica",
      "duration": 28,
      "summary": "Un orden acíclico de dependencias permite contar o optimizar rutas sin repetir subproblemas.",
      "objectives": [
        "Explicar caminos en matrices y elección de técnica y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Definir movimientos y obstáculos",
          "paragraphs": [
            "En una matriz de filas R y columnas C buscamos contar caminos desde la esquina superior izquierda a la inferior derecha. Solo se puede avanzar una celda a la derecha o hacia abajo, y las celdas bloqueadas no se visitan. Cada camino queda determinado por su secuencia de decisiones y no contiene ciclos porque fila o columna aumenta. Si el inicio o el destino está bloqueado, la respuesta es cero. Una matriz sin filas o sin columnas también tiene cero caminos bajo este contrato. La matriz debe ser rectangular: filas de longitudes diferentes no representan el tablero definido."
          ]
        },
        {
          "title": "Estado y fronteras",
          "paragraphs": [
            "DP[i][j] cuenta caminos válidos que terminan en la celda i,j. Si está bloqueada, vale cero. Si es el origen libre, vale uno por el camino inicial de longitud cero. En otra celda libre, todo camino entra desde arriba o desde la izquierda; esas categorías son disjuntas, por lo que sumamos sus cantidades. Las posiciones externas a la matriz aportan cero. Llenar por filas crecientes permite usar ambas dependencias ya calculadas. La suma cuenta alternativas, mientras un problema de costo mínimo tomaría el menor costo previo y agregaría el costo de la celda actual."
          ]
        },
        {
          "title": "Compresión de memoria y correctitud",
          "paragraphs": [
            "Con un arreglo dp de C posiciones, antes de procesar la celda actual dp[j] representa la cantidad que venía desde arriba, y dp[j−1] ya contiene la cantidad que llega desde la izquierda en la fila presente. Sumarlas actualiza el estado. Si la celda está bloqueada debemos asignar cero para impedir que sobreviva un camino desde una fila anterior. Inicializar dp[0] con uno establece el caso base; un origen bloqueado lo convierte inmediatamente en cero. La inducción sobre fila más columna demuestra la recurrencia y el recorrido visita cada celda exactamente una vez."
          ]
        },
        {
          "title": "Ejemplo y límites numéricos",
          "paragraphs": [
            "Una matriz libre de dos filas y tres columnas tiene tres caminos: derecha-derecha-abajo, derecha-abajo-derecha y abajo-derecha-derecha. Si bloqueamos la celda superior central, solo queda el que baja primero. Las cantidades crecen rápidamente en matrices grandes; usamos Math.addExact con long para detectar desbordamiento en lugar de aceptar un valor negativo aparente. BigInteger permitiría resultados mayores con costo de aritmética variable. El tiempo es Θ(RC) y la memoria auxiliar Θ(C), además del tablero de entrada. Si elegimos orientar el recorrido por la dimensión menor podemos usar O(min(R,C)) memoria con un diseño equivalente."
          ]
        },
        {
          "title": "Comparar programación dinámica, Greedy y divide y vencerás",
          "paragraphs": [
            "Divide y vencerás resulta adecuado cuando los subproblemas se separan con poca superposición, como las mitades de Merge Sort. Programación dinámica organiza un grafo de dependencias donde varios estados reutilizan resultados. Greedy elige una opción local irrevocable y necesita una prueba de que alguna solución óptima la contiene. En una matriz de costos arbitrarios, tomar siempre el vecino más barato puede llevar a una zona costosa y no garantiza el mínimo final. Una tabla conserva ambas alternativas. Tampoco conviene usar programación dinámica si el estado necesario es gigantesco y no existe una representación manejable: definir estados es parte del problema de diseño."
          ]
        },
        {
          "title": "Práctica integrada y comprobaciones",
          "paragraphs": [
            "Para cada problema del módulo escribí estado, bases, transición, orden, respuesta y complejidad antes de programar. Luego trazá una instancia pequeña y contrastá contra búsqueda exhaustiva para tamaños diminutos. En caminos, probá origen bloqueado, destino bloqueado, una fila, una columna y matriz vacía. En mochila, verificá que un objeto no se reutilice; en cadenas, distinguí longitud de reconstrucción. Reducir memoria exige identificar qué dependencias siguen vivas y cuáles pueden descartarse. La solución final debe explicar por qué evita cálculos repetidos y qué información necesita conservar para recuperar una solución concreta, además de su valor óptimo."
          ],
          "code": "CAMINOS(i,j)\n  si bloqueada: devolver 0\n  si origen libre: devolver 1\n  devolver CAMINOS(i−1,j)+CAMINOS(i,j−1)",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Θ(RC)",
        "space": "Θ(C) auxiliar",
        "explanation": "Cada celda combina dos dependencias; el recorrido por filas permite conservar solo la frontera activa."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "En el tablero libre de 2×3, las filas de cantidades son [1,1,1] y [1,2,3]. Con un obstáculo en la posición superior central pasan a [1,0,0] y [1,1,1], por lo que queda un camino. El cero del obstáculo impide propagar rutas inexistentes.",
        "code": "class CaminosMatriz {\n  static long contar(boolean[][] bloqueada) {\n    if(bloqueada==null)throw new IllegalArgumentException();\n    int filas=bloqueada.length;\n    if(filas==0)return 0;\n    if(bloqueada[0]==null)throw new IllegalArgumentException();\n    int cols=bloqueada[0].length;\n    for(boolean[] fila:bloqueada)if(fila==null||fila.length!=cols)throw new IllegalArgumentException();\n    if(cols==0)return 0;\n    long[] dp=new long[cols];dp[0]=1;\n    for(int i=0;i<filas;i++)for(int j=0;j<cols;j++) {\n      if(bloqueada[i][j])dp[j]=0;\n      else if(j>0)dp[j]=Math.addExact(dp[j],dp[j-1]);\n    }\n    return dp[cols-1];\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Adaptá la tabla para obtener costo mínimo y reconstruir un camino en una matriz con obstáculos. Esta actividad no compila ni ejecuta código en la plataforma; revisá los estados y casos límite manualmente."
      },
      "takeaways": [
        "Un orden acíclico de dependencias permite contar o optimizar rutas sin repetir subproblemas.",
        "Cada celda combina dos dependencias; el recorrido por filas permite conservar solo la frontera activa.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ],
      "lab": "dp"
    }
  ],
  "exercises": [
    {
      "id": "m13-e01",
      "moduleId": 13,
      "title": "Fibonacci con estados",
      "kind": "prediction",
      "difficulty": "Inicial",
      "prompt": "¿Cuánto vale F(7) con F(0)=0 y F(1)=1?",
      "input": "F(n)=F(n−1)+F(n−2)",
      "expected": "Un entero.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "13",
      "accepted": [],
      "hints": [
        "Construí desde cero y uno.",
        "F(5)=5 y F(6)=8; la transición suma los dos anteriores."
      ],
      "solution": "13",
      "explanation": "La secuencia es 0,1,1,2,3,5,8,13.",
      "lessonId": "m13-estado-fibonacci"
    },
    {
      "id": "m13-e02",
      "moduleId": 13,
      "title": "Objeto reutilizado",
      "kind": "debug",
      "difficulty": "Intermedio",
      "prompt": "En mochila 0/1 comprimida, ¿en qué dirección deben recorrerse capacidades?",
      "input": "Un objeto peso 2 valor 3; W=4",
      "expected": "Ascendente o descendente.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "descendente",
      "accepted": [
        "de mayor a menor"
      ],
      "hints": [
        "Ascender podría sumar el objeto dos veces.",
        "Con recorrido ascendente, la capacidad cuatro podría leer una capacidad dos ya actualizada con el mismo objeto."
      ],
      "solution": "De W hacia el peso del objeto.",
      "explanation": "Las posiciones menores todavía deben representar la fila anterior.",
      "lessonId": "m13-mochila"
    },
    {
      "id": "m13-e03",
      "moduleId": 13,
      "title": "Tabla de LCS",
      "kind": "complexity",
      "difficulty": "Inicial",
      "prompt": "¿Cuál es el tiempo de LCS para longitudes n y m?",
      "input": "Tabla de prefijos",
      "expected": "Usá O o Θ.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "Θ(nm)",
      "accepted": [
        "O(nm)",
        "O(n*m)",
        "theta(nm)"
      ],
      "hints": [
        "Se calcula una vez cada par de prefijos.",
        "Cada celda combina como máximo tres valores previamente disponibles mediante trabajo constante."
      ],
      "solution": "Θ(nm)",
      "explanation": "Hay (n+1)(m+1) celdas y trabajo constante por transición.",
      "lessonId": "m13-lcs"
    },
    {
      "id": "m13-e04",
      "moduleId": 13,
      "title": "Distancia unitaria",
      "kind": "prediction",
      "difficulty": "Inicial",
      "prompt": "Distancia de Levenshtein entre a y b:",
      "input": "Insertar, borrar y sustituir cuestan uno.",
      "expected": "Un entero.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "1",
      "accepted": [],
      "hints": [
        "Sustituir es una operación admitida.",
        "Conservar cero operaciones solo sería posible si los dos caracteres fueran iguales."
      ],
      "solution": "1",
      "explanation": "Una sustitución transforma a en b y no puede hacerse con cero operaciones.",
      "lessonId": "m13-edicion"
    },
    {
      "id": "m13-e05",
      "moduleId": 13,
      "title": "Camino óptimo con explicación",
      "kind": "implementation",
      "difficulty": "Intermedio",
      "prompt": "Implementá costo mínimo con obstáculos y reconstrucción. La plataforma no compila ni ejecuta código; revisá manualmente la tabla y el camino.",
      "input": "Matriz 3×3; solo derecha y abajo.",
      "expected": "Costo y secuencia de celdas válidas.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "// Definir estado, bases, transición y reconstrucción.",
      "answer": "",
      "accepted": [],
      "hints": [
        "Usá un valor separado para inalcanzable.",
        "Guardá un predecesor cuando mejores el costo."
      ],
      "solution": "Definir dp como mínimo costo hasta cada celda, inicializar origen, excluir bloqueadas y elegir mejor entre arriba e izquierda; conservar predecesores y retroceder desde destino.",
      "explanation": "Una transición solo combina rutas válidas y cada celda depende de posiciones anteriores; el retroceso recupera decisiones sin volver a resolver.",
      "lessonId": "m13-matrices-eleccion"
    }
  ],
  "questions": [
    {
      "id": "m13-q01",
      "moduleId": 13,
      "type": "choice",
      "prompt": "¿Qué identifica un estado correcto?",
      "options": [
        "Toda la información relevante para resolver ese subproblema.",
        "Solo un índice, en cualquier problema.",
        "El resultado final conocido."
      ],
      "answer": 0,
      "explanation": "Estados diferentes no deben mezclarse si permiten futuros distintos.",
      "lessonId": "m13-estado-fibonacci"
    },
    {
      "id": "m13-q02",
      "moduleId": 13,
      "type": "truefalse",
      "prompt": "Memoizar elimina automáticamente la pila recursiva.",
      "options": [
        "Falso",
        "Verdadero"
      ],
      "answer": 0,
      "explanation": "Top-down sigue conservando llamadas activas.",
      "lessonId": "m13-estado-fibonacci"
    },
    {
      "id": "m13-q03",
      "moduleId": 13,
      "type": "prediction",
      "prompt": "Con un objeto peso 2 valor 3 y W=4, mochila 0/1 devuelve:",
      "options": [
        "3",
        "6",
        "0"
      ],
      "answer": 0,
      "explanation": "El objeto puede elegirse una sola vez.",
      "lessonId": "m13-mochila"
    },
    {
      "id": "m13-q04",
      "moduleId": 13,
      "type": "complexity",
      "prompt": "O(nW) para mochila se llama pseudopolinómico porque:",
      "options": [
        "W es un valor numérico con representación de O(log W) bits.",
        "Siempre es exponencial en n.",
        "No termina para W impar."
      ],
      "answer": 0,
      "explanation": "Depender de W no equivale a depender polinómicamente de su longitud binaria.",
      "lessonId": "m13-mochila"
    },
    {
      "id": "m13-q05",
      "moduleId": 13,
      "type": "order",
      "prompt": "Orden para construir una solución DP:",
      "options": [
        "Definir estado → bases/transición → orden → respuesta",
        "Reservar tabla → adivinar resultado → elegir estado",
        "Medir → omitir bases"
      ],
      "answer": 0,
      "explanation": "El significado de los estados fundamenta todo lo demás.",
      "lessonId": "m13-estado-fibonacci"
    },
    {
      "id": "m13-q06",
      "moduleId": 13,
      "type": "choice",
      "prompt": "LCS permite:",
      "options": [
        "Omitir caracteres conservando su orden relativo.",
        "Reordenar libremente caracteres.",
        "Solo segmentos contiguos."
      ],
      "answer": 0,
      "explanation": "Una subsecuencia no tiene que ser una subcadena.",
      "lessonId": "m13-lcs"
    },
    {
      "id": "m13-q07",
      "moduleId": 13,
      "type": "truefalse",
      "prompt": "Levenshtein unitario incluye transposición como una operación.",
      "options": [
        "Falso",
        "Verdadero"
      ],
      "answer": 0,
      "explanation": "El contrato usa inserción, eliminación y sustitución.",
      "lessonId": "m13-edicion"
    },
    {
      "id": "m13-q08",
      "moduleId": 13,
      "type": "prediction",
      "prompt": "Caminos derecha/abajo en tablero libre 2×3:",
      "options": [
        "3",
        "2",
        "6"
      ],
      "answer": 0,
      "explanation": "La tabla termina en la cantidad tres.",
      "lessonId": "m13-matrices-eleccion"
    },
    {
      "id": "m13-q09",
      "moduleId": 13,
      "type": "complexity",
      "prompt": "Fibonacci tabulado con dos variables usa:",
      "options": [
        "Θ(1) auxiliar con enteros de ancho fijo.",
        "Θ(n) pila.",
        "Θ(n²) tabla."
      ],
      "answer": 0,
      "explanation": "Solo conserva dos valores consecutivos.",
      "lessonId": "m13-estado-fibonacci"
    },
    {
      "id": "m13-q10",
      "moduleId": 13,
      "type": "order",
      "prompt": "Al procesar una celda bloqueada en caminos comprimidos:",
      "options": [
        "Asignar dp[j]=0 → continuar",
        "Conservar dp[j] antiguo → sumar izquierda",
        "Copiar total final al obstáculo"
      ],
      "answer": 0,
      "explanation": "El valor anterior representaba caminos desde arriba que no pueden atravesar el bloqueo.",
      "lessonId": "m13-matrices-eleccion"
    }
  ],
  "glossary": [
    {
      "term": "Estado DP",
      "definition": "Descripción completa de un subproblema cuyo resultado puede reutilizarse.",
      "lessonId": "m13-estado-fibonacci"
    },
    {
      "term": "Memoización",
      "definition": "Evaluación top-down que guarda la respuesta de cada estado alcanzado.",
      "lessonId": "m13-estado-fibonacci"
    },
    {
      "term": "Tabulación",
      "definition": "Evaluación de estados en un orden donde sus dependencias ya están resueltas.",
      "lessonId": "m13-estado-fibonacci"
    },
    {
      "term": "Pseudopolinómico",
      "definition": "Costo polinómico en valores numéricos que no necesariamente es polinómico en su longitud de representación.",
      "lessonId": "m13-mochila"
    },
    {
      "term": "Subsecuencia",
      "definition": "Elementos obtenidos mediante eliminaciones, conservando orden relativo.",
      "lessonId": "m13-lcs"
    },
    {
      "term": "Reconstrucción",
      "definition": "Recuperación de decisiones concretas que alcanzan el valor óptimo calculado.",
      "lessonId": "m13-matrices-eleccion"
    }
  ]
};
