import type { ModuleContent } from './types.js';

export const module10: ModuleContent = {
  "moduleId": 10,
  "lessons": [
    {
      "id": "m10-busquedas",
      "moduleId": 10,
      "title": "Búsqueda lineal y binaria",
      "duration": 28,
      "summary": "El orden previo permite descartar intervalos, pero ese orden tiene condiciones y un costo de preparación.",
      "objectives": [
        "Explicar búsqueda lineal y binaria y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Definir qué significa encontrar",
          "paragraphs": [
            "Buscar devuelve una posición cuyo valor coincide con el objetivo, o menos uno si no existe. El contrato debe aclarar qué ocurre con repetidos: una búsqueda lineal de izquierda a derecha devuelve la primera coincidencia; la binaria básica puede devolver cualquiera. Ambas aceptan arreglo vacío y rechazan null en este ejemplo. No basta con retornar un valor verdadero si también necesitamos su posición. El resultado menos uno es un indicador válido porque ningún índice permitido es negativo. La búsqueda no modifica el arreglo ni necesita ordenar si su precondición ya se cumple."
          ]
        },
        {
          "title": "Recorrer secuencialmente",
          "paragraphs": [
            "La búsqueda lineal compara el objetivo con cada posición desde cero. El invariante dice que ninguna posición anterior al índice actual contiene el objetivo. Encontrar una coincidencia permite retornar inmediatamente; llegar a length demuestra ausencia. La variante es la cantidad de posiciones que faltan visitar. El mejor caso usa una comparación y cuesta Θ(1); el peor inspecciona n elementos y cuesta Θ(n). Sin hipótesis sobre la ubicación o distribución del objetivo no asignamos un promedio concreto. También funciona sobre datos desordenados y sobre secuencias que solo permiten avanzar mediante un iterador."
          ]
        },
        {
          "title": "Mantener un intervalo binario",
          "paragraphs": [
            "La búsqueda binaria exige orden no decreciente y acceso eficiente al medio. Mantiene un intervalo inclusivo [izq,der]. Si el medio coincide, retorna; si su valor es menor, todo lo anterior o igual al medio queda descartado y movemos izq a medio más uno. En caso contrario movemos der a medio menos uno. Usamos medio igual a izq más la mitad de der menos izq para evitar sumar dos índices grandes. Eliminar explícitamente el medio asegura que el intervalo disminuya; conservarlo puede producir un ciclo infinito en un intervalo de una posición."
          ]
        },
        {
          "title": "Correctitud y duplicados",
          "paragraphs": [
            "El invariante binario establece que, si el objetivo aparece y todavía no retornamos, alguna aparición está dentro del intervalo. El orden justifica descartar una mitad completa: si el medio es demasiado pequeño, ninguna posición previa puede contener un valor mayor. Al quedar izq mayor que der, el intervalo está vacío y no existe coincidencia. Con valores iguales no prometemos la primera aparición. Para lograrla guardamos un candidato al coincidir y continuamos a la izquierda, o buscamos el límite inferior y comprobamos igualdad al final. Estas variantes requieren contratos e invariantes ligeramente distintos."
          ]
        },
        {
          "title": "El costo de preparar y de acceder",
          "paragraphs": [
            "Cada vuelta binaria reduce aproximadamente a la mitad el intervalo, así que realiza O(log n) comparaciones y usa Θ(1) espacio auxiliar en versión iterativa. Pero ordenar previamente puede costar O(n log n) con un algoritmo por comparaciones. Para una consulta única, ordenar solamente para buscar puede resultar más trabajo que recorrer una vez. Muchas consultas pueden amortizar la preparación. Una LinkedList no permite obtener el elemento medio en Θ(1), por lo que trasladar directamente el código con get(i) no conserva automáticamente las garantías temporales del arreglo. Hay que analizar también las operaciones de la estructura."
          ]
        },
        {
          "title": "Traza y práctica con límites",
          "paragraphs": [
            "En [2,5,8,12,19], buscar doce comienza en el medio con ocho, conserva el intervalo de índices tres a cuatro y encuentra doce. Buscar siete descarta sucesivamente intervalos hasta quedar vacío. Probá también objetivo menor que todos, mayor que todos, un elemento y repeticiones. Las visualizaciones permiten contar igualdad y comparación de orden por separado; la notación asintótica no cambia por esa convención. Verificá que ordenar una copia puede alterar los índices respecto del arreglo original: si necesitás devolver la posición original, tenés que conservar esa información adicional antes de reordenar."
          ],
          "code": "BINARIA(a,x)\n  izq←0; der←n−1\n  mientras izq≤der\n    medio←izq+(der−izq)/2\n    si a[medio]=x: devolver medio\n    si a[medio]<x: izq←medio+1\n    si no: der←medio−1\n  devolver −1",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Lineal O(n); binaria O(log n)",
        "space": "Θ(1) auxiliar",
        "explanation": "La binaria necesita orden y acceso directo para reducir el intervalo eficientemente."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Para [2,5,8,12,19] y objetivo doce, los índices centrales son dos y tres. La segunda igualdad termina la búsqueda. El mismo procedimiento con objetivo siete conserva primero la mitad izquierda y después agota el intervalo sin encontrarlo.",
        "code": "class Busquedas {\n  static int lineal(int[] a, int x) {\n    if(a == null) throw new IllegalArgumentException();\n    for(int i=0;i<a.length;i++) if(a[i]==x) return i;\n    return -1;\n  }\n  // Precondición: a está ordenado de forma no decreciente.\n  static int binaria(int[] a, int x) {\n    if(a == null) throw new IllegalArgumentException();\n    int izq=0, der=a.length-1;\n    while(izq<=der) {\n      int medio=izq+(der-izq)/2;\n      if(a[medio]==x) return medio;\n      if(a[medio]<x) izq=medio+1;\n      else der=medio-1;\n    }\n    return -1;\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Implementá primeraAparicion sobre un arreglo ordenado y comprobá [3,3,3], objetivo ausente y vacío. Explicá cómo conservás el candidato cuando seguís buscando a la izquierda."
      },
      "takeaways": [
        "El orden previo permite descartar intervalos, pero ese orden tiene condiciones y un costo de preparación.",
        "La binaria necesita orden y acceso directo para reducir el intervalo eficientemente.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ],
      "visualization": "binary"
    },
    {
      "id": "m10-simples",
      "moduleId": 10,
      "title": "Bubble, Selection e Insertion Sort",
      "duration": 28,
      "summary": "Tres algoritmos cuadráticos mantienen invariantes distintos y responden de forma diferente a entradas casi ordenadas.",
      "objectives": [
        "Explicar bubble, selection e insertion sort y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Ordenar conserva una permutación",
          "paragraphs": [
            "Ordenar ascendentemente exige dos propiedades: cada elemento debe ser menor o igual que el siguiente y la salida debe contener exactamente los mismos elementos con sus multiplicidades. Es posible producir una secuencia creciente borrando repetidos, pero eso no sería un ordenamiento correcto. Los ejemplos modifican un int[] no nulo y no reservan otro arreglo proporcional al tamaño. Un arreglo vacío ya está ordenado y no necesita tratamiento especial dentro de los ciclos. Para estudiar estabilidad imaginaremos registros con una clave y una etiqueta, aunque la implementación de ejemplo trabaje con enteros simples."
          ]
        },
        {
          "title": "Burbuja fija un sufijo",
          "paragraphs": [
            "Bubble Sort compara vecinos y los intercambia solamente si están invertidos. En una pasada, el mayor del prefijo activo avanza hacia el extremo derecho. Tras la pasada, esa última posición queda definitiva y el prefijo se reduce. El invariante conserva un sufijo ordenado cuyos elementos no son menores que los pendientes. Si una pasada completa no realiza intercambios, no queda ninguna inversión entre vecinos y podemos terminar. Esa mejora hace que el mejor caso sea Θ(n), mientras promedio y peor siguen siendo Θ(n²). Usar comparación estricta evita intercambiar elementos con claves iguales y mantiene estabilidad."
          ]
        },
        {
          "title": "Selección fija un prefijo",
          "paragraphs": [
            "Selection Sort busca el mínimo del segmento pendiente y lo intercambia con la primera posición de ese segmento. Antes de cada vuelta, el prefijo contiene los elementos más pequeños en orden definitivo. La búsqueda del mínimo revisa todas las posiciones pendientes aunque la entrada ya esté ordenada, por lo que realiza Θ(n²) comparaciones en mejor y peor caso. Solo necesita O(n) intercambios, propiedad que puede interesar si escribir resulta costoso. El intercambio distante puede cambiar el orden relativo de iguales; la versión convencional no es estable. Elegir el primer mínimo no alcanza para evitar ese efecto."
          ]
        },
        {
          "title": "Inserción conserva un prefijo ordenado",
          "paragraphs": [
            "Insertion Sort toma el siguiente elemento y lo inserta en el lugar correcto dentro del prefijo ya ordenado. Guarda el valor para no perderlo al desplazar hacia la derecha los elementos estrictamente mayores. Al encontrar uno menor o igual, escribe el valor en el hueco. Si la entrada está ordenada, cada vuelta comprueba una condición y no desplaza nada: Θ(n). Si está invertida, suma uno más dos y así hasta n menos uno desplazamientos: Θ(n²). Es estable cuando no desplaza iguales y suele resultar útil para tamaños pequeños o secuencias con pocas inversiones."
          ]
        },
        {
          "title": "Correctitud y límites de comparación",
          "paragraphs": [
            "Los tres métodos preservan multiplicidades porque solo intercambian o mueven valores conservando temporalmente el que falta. Sus variantes de terminación usan el tamaño del segmento pendiente o el índice decreciente de desplazamiento. En inserción, el cortocircuito j mayor o igual que cero debe evaluarse antes de leer a[j]. Revertir ese orden puede intentar un índice negativo. Comparar enteros con mayor o menor evita el desbordamiento que produciría restarlos. No hay un ganador universal entre algoritmos cuadráticos: la cantidad de comparaciones, escrituras y desorden inicial cambia su comportamiento concreto."
          ]
        },
        {
          "title": "Una traza que distingue estrategias",
          "paragraphs": [
            "Para [3,1,2], burbuja deja tres al final después de comparar tres con uno y luego con dos. Selección encuentra uno y lo lleva al principio mediante un intercambio distante. Inserción primero forma [1,3] y luego coloca dos entre ambos. Los tres terminan [1,2,3], pero sus estados intermedios y contadores difieren. Probá también [2A,2B,1] con etiquetas: selección puede terminar [1,2B,2A], mostrando inestabilidad. Verificá vacío, repetidos y entrada ya ordenada. Registrar comparaciones y movimientos ayuda a explicar resultados antes de medir milisegundos."
          ],
          "code": "INSERCION(a)\n  para i desde 1 hasta n−1\n    x←a[i]; j←i−1\n    mientras j≥0 y a[j]>x: desplazar a[j]; j←j−1\n    a[j+1]←x",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Peor caso Θ(n²); inserción/burbuja mejor Θ(n)",
        "space": "Θ(1) auxiliar",
        "explanation": "El trabajo cuadrático surge de sumar recorridos de prefijos o sufijos de tamaños crecientes."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Insertion Sort sobre [3,1,2] guarda uno, desplaza tres y escribe uno. Luego guarda dos, desplaza tres y lo ubica después del uno. Se conservan los tres valores y cada prefijo resultante está ordenado.",
        "code": "class OrdenamientosSimples {\n  static void burbuja(int[] a) {\n    for(int fin=a.length-1;fin>0;fin--) {\n      boolean cambio=false;\n      for(int i=0;i<fin;i++) if(a[i]>a[i+1]) {\n        int t=a[i];a[i]=a[i+1];a[i+1]=t;cambio=true;\n      }\n      if(!cambio)break;\n    }\n  }\n  static void seleccion(int[] a) {\n    for(int i=0;i<a.length-1;i++) {\n      int min=i;\n      for(int j=i+1;j<a.length;j++) if(a[j]<a[min])min=j;\n      int t=a[i];a[i]=a[min];a[min]=t;\n    }\n  }\n  static void insercion(int[] a) {\n    for(int i=1;i<a.length;i++) {\n      int x=a[i],j=i-1;\n      while(j>=0&&a[j]>x){a[j+1]=a[j];j--;}\n      a[j+1]=x;\n    }\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Contá comparaciones e intercambios de Bubble y Selection sobre [1,2,3,4]. Explicá por qué el corte temprano modifica solo a uno de los métodos."
      },
      "takeaways": [
        "Tres algoritmos cuadráticos mantienen invariantes distintos y responden de forma diferente a entradas casi ordenadas.",
        "El trabajo cuadrático surge de sumar recorridos de prefijos o sufijos de tamaños crecientes.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ],
      "visualization": "bubble"
    },
    {
      "id": "m10-nlogn",
      "moduleId": 10,
      "title": "Merge, Quick y Heap Sort",
      "duration": 28,
      "summary": "Los métodos eficientes distribuyen el trabajo mediante mezcla, partición o selección de extremos.",
      "objectives": [
        "Explicar merge, quick y heap sort y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Merge Sort divide y mezcla",
          "paragraphs": [
            "Merge Sort divide un intervalo en dos mitades hasta llegar a cero o un elemento. Después mezcla las mitades ordenadas usando dos índices: toma siempre el menor de los elementos disponibles. El invariante de mezcla afirma que el prefijo de salida contiene los menores elementos consumidos en orden. Elegir primero el de la mitad izquierda cuando empatan conserva estabilidad. La recurrencia T(n) = dos T(n dividido dos) más Θ(n) da Θ(n log n). La versión sobre arreglos usa un búfer Θ(n), además de O(log n) de pila, y no es in-place bajo el criterio habitual."
          ]
        },
        {
          "title": "Quick Sort particiona",
          "paragraphs": [
            "Quick Sort elige un pivote y reorganiza el segmento para colocar valores menores o iguales a su izquierda y mayores a su derecha. El pivote queda en una posición definitiva y se ordenan recursivamente los dos lados. El ejemplo usa partición de Lomuto y pivote final para hacer visible la frontera entre grupos. Cada inspección extiende la zona de valores ya clasificados, conservando todos los elementos mediante intercambios. No mantiene estabilidad. La posición final del pivote debe excluirse de ambas llamadas; incluirla puede impedir que el tamaño del problema disminuya y romper la terminación."
          ]
        },
        {
          "title": "Promesas y peores casos del pivote",
          "paragraphs": [
            "Si las particiones se equilibran, Quick Sort realiza Θ(n log n) trabajo. Con pivote aleatorio se obtiene ese costo esperado bajo el análisis correspondiente, pero no una garantía determinista de peor caso. El pivote final del ejemplo puede producir Θ(n²) sobre una entrada ordenada o con todos los valores iguales, y su pila puede alcanzar Θ(n). Una partición en tres vías maneja mejor muchos repetidos; aleatorizar reduce la probabilidad de particiones adversas, y un diseño híbrido puede recurrir a Heap Sort cuando la profundidad aumenta demasiado. Cada mejora necesita su propio contrato y análisis."
          ]
        },
        {
          "title": "Heap Sort ofrece otra garantía",
          "paragraphs": [
            "Heap Sort construye un Max-Heap en Θ(n) y lleva repetidamente el máximo al final del prefijo activo. El sufijo resultante está ordenado y no vuelve a participar del heap. Cada extracción cuesta O(log n), de modo que el peor caso total es O(n log n). La implementación iterativa necesita Θ(1) auxiliar y no es estable. A diferencia de Quick Sort, su garantía no depende del equilibrio de particiones. A diferencia de Merge Sort convencional sobre arreglos, no necesita un búfer lineal. Los saltos entre índices del heap pueden tener constantes de caché distintas a las mezclas secuenciales."
          ]
        },
        {
          "title": "Correctitud por inducción y separación",
          "paragraphs": [
            "En Merge Sort, suponemos que las llamadas devuelven mitades ordenadas y demostramos que la mezcla produce su unión ordenada. En Quick Sort, la partición coloca el pivote con todos los valores del lado correcto y la hipótesis inductiva ordena cada lado. En Heap Sort, el máximo llevado al final nunca es menor que las claves que permanecen. Los tres disminuyen una medida: longitud de subintervalo o tamaño del heap. Es fundamental verificar también preservación de frecuencias, no solamente monotonía. Los detalles de límites inclusivos o exclusivos deben ser coherentes dentro de cada implementación."
          ]
        },
        {
          "title": "Comparar con entradas representativas",
          "paragraphs": [
            "Probá vacío, un elemento, ordenado, invertido, muchos repetidos y claves extremas. En el Quick Sort didáctico, no uses arreglos gigantes ya ordenados como si existiera una garantía de pila logarítmica: justamente ese caso exhibe su límite. Merge Sort debe copiar al búfer sin superponer lecturas que todavía necesita; el ejemplo mezcla completamente antes de copiar de vuelta. Las clases siguientes permiten contrastar estas decisiones sin colecciones de terceros. Para producción, una implementación estándar bien especificada suele ser preferible a adaptar un algoritmo parcial sin revisar estabilidad, memoria y manejo del peor caso."
          ],
          "code": "MERGE: ordenar mitades → mezclar\nQUICK: particionar → ordenar lados sin pivote\nHEAP: construir heap → extraer máximos al sufijo",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Merge Θ(n log n); Quick peor Θ(n²); Heap O(n log n)",
        "space": "Merge Θ(n); Quick O(n) peor; Heap Θ(1)",
        "explanation": "La política de partición y la estructura auxiliar determinan garantías distintas."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Para [4,1,3,2], Merge Sort combina [1,4] y [2,3] eligiendo 1,2,3,4. Quick Sort con pivote dos lo coloca en el índice uno y ordena [1] y [3,4]. Heap Sort lleva primero cuatro al final. La salida coincide; el trabajo intermedio y las garantías difieren.",
        "code": "class OrdenamientosRapidos {\n  static void mergeSort(int[] a) {\n    if(a==null)throw new IllegalArgumentException();\n    merge(a,new int[a.length],0,a.length);\n  }\n  static void merge(int[] a,int[] aux,int lo,int hi) {\n    if(hi-lo<=1)return;\n    int mid=lo+(hi-lo)/2;\n    merge(a,aux,lo,mid);merge(a,aux,mid,hi);\n    int i=lo,j=mid,k=lo;\n    while(i<mid&&j<hi)aux[k++]=a[i]<=a[j]?a[i++]:a[j++];\n    while(i<mid)aux[k++]=a[i++];\n    while(j<hi)aux[k++]=a[j++];\n    System.arraycopy(aux,lo,a,lo,hi-lo);\n  }\n  static void quickSort(int[] a) {\n    if(a==null)throw new IllegalArgumentException();\n    quick(a,0,a.length-1);\n  }\n  static void quick(int[] a,int lo,int hi) {\n    if(lo>=hi)return;\n    int p=partir(a,lo,hi);\n    quick(a,lo,p-1);quick(a,p+1,hi);\n  }\n  static int partir(int[] a,int lo,int hi) {\n    int pivote=a[hi],frontera=lo;\n    for(int j=lo;j<hi;j++)if(a[j]<=pivote){\n      int t=a[frontera];a[frontera++]=a[j];a[j]=t;\n    }\n    int t=a[frontera];a[frontera]=a[hi];a[hi]=t;\n    return frontera;\n  }\n}\nclass HeapSort {\n  static void hundir(int[] a, int i, int n) {\n    int x = a[i];\n    while (i < n / 2) {\n      int h = 2 * i + 1;\n      if (h + 1 < n && a[h + 1] > a[h]) h++;\n      if (x >= a[h]) break;\n      a[i] = a[h]; i = h;\n    }\n    a[i] = x;\n  }\n  static void ordenar(int[] a) {\n    if (a == null) throw new IllegalArgumentException();\n    for (int i = a.length / 2 - 1; i >= 0; i--) hundir(a, i, a.length);\n    for (int fin = a.length - 1; fin > 0; fin--) {\n      int t = a[0]; a[0] = a[fin]; a[fin] = t;\n      hundir(a, 0, fin);\n    }\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Instrumentá la profundidad máxima de Quick Sort final y aleatorio sobre entradas crecientes y con repetidos. Separá la conclusión experimental de la garantía asintótica."
      },
      "takeaways": [
        "Los métodos eficientes distribuyen el trabajo mediante mezcla, partición o selección de extremos.",
        "La política de partición y la estructura auxiliar determinan garantías distintas.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ]
    },
    {
      "id": "m10-counting-radix",
      "moduleId": 10,
      "title": "Counting y Radix Sort",
      "duration": 28,
      "summary": "Aprovechar el dominio de las claves permite ordenar sin depender solamente de comparaciones.",
      "objectives": [
        "Explicar counting y radix sort y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "El dominio agrega información",
          "paragraphs": [
            "La cota inferior Ω(n log n) de ordenamiento general por comparaciones no prohíbe algoritmos lineales que usan estructura adicional de las claves. Counting Sort utiliza enteros de un rango conocido; Radix Sort procesa dígitos. Su eficiencia depende no solo de n, sino del rango o la cantidad de dígitos. Ordenar diez valores dispersos entre números enormes mediante una tabla de frecuencias puede requerir memoria desproporcionada. Antes de elegir hay que declarar el dominio admitido, cómo se representan negativos y qué límites evitan reservas excesivas. Una clave numérica no significa automáticamente que cualquier método no comparativo resulte conveniente."
          ]
        },
        {
          "title": "Counting Sort y posiciones acumuladas",
          "paragraphs": [
            "Primero calculamos frecuencias de cada clave. La suma acumulada indica cuántos elementos son menores o iguales que una clave y por tanto su límite final en la salida. Recorremos la entrada desde el final, decrementamos el acumulado de la clave y colocamos allí el elemento. Esa dirección conserva el orden relativo de registros iguales: los últimos reciben primero las posiciones más altas. Después copiamos la salida al arreglo original. Una variante que solo emite frecuencias ordena enteros, pero no conserva datos asociados a registros si no los mueve explícitamente con su clave."
          ]
        },
        {
          "title": "Negativos y rango seguro",
          "paragraphs": [
            "Para admitir negativos usamos un desplazamiento: la clave mínima corresponde al índice cero y x corresponde a x menos mínimo. El tamaño necesario es máximo menos mínimo más uno. Esa resta puede desbordar int con extremos opuestos, por lo que la calculamos en long antes de decidir si reservar. El ejemplo limita el rango a un millón de posiciones como política didáctica explícita; rechaza rangos mayores en lugar de ocultar una reserva descontrolada. El tiempo y espacio son O(n más k), donde k es la amplitud del rango, no la cantidad de claves distintas presentes."
          ]
        },
        {
          "title": "Radix LSD y estabilidad por dígito",
          "paragraphs": [
            "Radix LSD procesa primero el dígito menos significativo, luego el siguiente y así sucesivamente. Cada pasada debe ser estable: así, al ordenar por un dígito más importante, se conserva el orden ya logrado por los menos importantes entre claves que empatan en el nuevo. Usamos Counting estable con diez cubetas para representación decimal. En [21,13,12], unidades produce [21,12,13] y decenas produce [12,13,21]. Ordenar cada cubeta de manera inestable puede destruir esa información previa y dejar una salida incorrecta aunque cada pasada aislada parezca ordenar su dígito."
          ]
        },
        {
          "title": "Contrato y análisis de Radix",
          "paragraphs": [
            "La versión incluida acepta únicamente enteros no negativos y rechaza negativos. Procesa tantas posiciones decimales como necesita el máximo; todo cero ya está ordenado sin pasadas adicionales. Guarda exp en long para que multiplicar la potencia de diez no desborde int antes de la última pasada. Con d dígitos y base b, cuesta O(d(n más b)) y utiliza O(n más b) auxiliar. Para enteros de ancho fijo y base fija, d está acotado por una constante; para números de longitud arbitraria no puede ignorarse. Los enteros con signo requieren una transformación de orden o un tratamiento adicional cuidadosamente definido."
          ]
        },
        {
          "title": "Verificación y selección",
          "paragraphs": [
            "En Counting, comprobá que las frecuencias acumuladas delimitan posiciones válidas y que cada entrada se coloca exactamente una vez. En Radix, la inducción afirma que tras la pasada d, los elementos están ordenados por sus d dígitos menos significativos. Probá ceros, repeticiones, rangos negativos pequeños y el mayor int permitido en Radix. Para Counting, verificá además que un rango extremo lanza la excepción documentada. Compará memoria con Merge Sort y tiempo con n y rango creciendo por separado: cambiar ambos a la vez impediría distinguir qué variable explica el costo observado."
          ],
          "code": "COUNTING: contar → acumular → colocar estable → copiar\nRADIX LSD: para cada dígito de menor a mayor\n  ordenar estable por ese dígito",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Counting O(n+k); Radix O(d(n+b))",
        "space": "O(n+k) u O(n+b)",
        "explanation": "El rango y la cantidad de dígitos forman parte explícita del tamaño relevante."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Counting sobre [−2,1,−2,0] usa rango cuatro y desplazamiento dos; produce [−2,−2,0,1]. Radix sobre [21,13,12] conserva el orden de unidades al ordenar decenas y produce [12,13,21]. Son contratos distintos: Radix del ejemplo rechaza negativos.",
        "code": "class OrdenamientosPorClave {\n  static void counting(int[] a) {\n    if(a==null)throw new IllegalArgumentException();\n    if(a.length==0)return;\n    int min=a[0],max=a[0];\n    for(int x:a){min=Math.min(min,x);max=Math.max(max,x);}\n    long rango=(long)max-min+1;\n    if(rango>1_000_000)throw new IllegalArgumentException(\"Rango excesivo\");\n    int[] cuenta=new int[(int)rango],salida=new int[a.length];\n    for(int x:a)cuenta[(int)((long)x-min)]++;\n    for(int i=1;i<cuenta.length;i++)cuenta[i]+=cuenta[i-1];\n    for(int i=a.length-1;i>=0;i--){\n      int c=(int)((long)a[i]-min);salida[--cuenta[c]]=a[i];\n    }\n    System.arraycopy(salida,0,a,0,a.length);\n  }\n  static void radixNoNegativo(int[] a) {\n    if(a==null)throw new IllegalArgumentException();\n    int max=0;\n    for(int x:a){if(x<0)throw new IllegalArgumentException(\"Solo no negativos\");max=Math.max(max,x);}\n    int[] salida=new int[a.length];\n    for(long exp=1;max/exp>0;exp*=10) {\n      int[] cuenta=new int[10];\n      for(int x:a)cuenta[(int)((x/exp)%10)]++;\n      for(int d=1;d<10;d++)cuenta[d]+=cuenta[d-1];\n      for(int i=a.length-1;i>=0;i--){int d=(int)((a[i]/exp)%10);salida[--cuenta[d]]=a[i];}\n      System.arraycopy(salida,0,a,0,a.length);\n    }\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Adaptá Counting a pares clave-etiqueta y verificá estabilidad. Justificá el límite de rango para un presupuesto de memoria concreto antes de reservar."
      },
      "takeaways": [
        "Aprovechar el dominio de las claves permite ordenar sin depender solamente de comparaciones.",
        "El rango y la cantidad de dígitos forman parte explícita del tamaño relevante.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ]
    },
    {
      "id": "m10-seleccion-medicion",
      "moduleId": 10,
      "title": "Estabilidad, memoria y medición de ordenamientos",
      "duration": 28,
      "summary": "Elegir exige relacionar contratos y garantías con la carga real antes de interpretar un cronómetro.",
      "objectives": [
        "Explicar estabilidad, memoria y medición de ordenamientos y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Estabilidad y ordenamientos sucesivos",
          "paragraphs": [
            "Un método estable conserva el orden de llegada entre elementos con claves iguales. Eso permite ordenar primero por una clave secundaria y después por la principal conservando la secundaria dentro de cada grupo. En registros de personas, ordenar por nombre y luego por ciudad mediante un algoritmo estable deja los nombres ordenados dentro de cada ciudad. Con enteros aislados no observamos esa identidad, pero las etiquetas hacen visible la diferencia. Merge Sort que elige izquierda al empatar e Insertion Sort que desplaza solo mayores son estables; Selection, Heap y Quick convencionales no ofrecen esa propiedad."
          ]
        },
        {
          "title": "In-place no significa ausencia de memoria",
          "paragraphs": [
            "Un algoritmo in-place suele permitir una cantidad constante de almacenamiento auxiliar, aunque algunas convenciones toleran una pila logarítmica y deben aclararse. Heap Sort iterativo usa Θ(1). Merge Sort convencional necesita Θ(n) adicional. Quick Sort modifica el arreglo pero su recursión consume memoria: O(log n) si las particiones son equilibradas y O(n) en el peor caso del ejemplo. Medir solamente el arreglo temporal ignora la pila y puede dar una conclusión errónea. Si el contrato exige conservar la entrada, copiarla añade Θ(n) incluso antes de ejecutar un método que internamente sea in-place."
          ]
        },
        {
          "title": "Elegir por restricciones",
          "paragraphs": [
            "Para pocas decenas de elementos o poca desorganización, Insertion Sort puede evitar estructuras auxiliares y trabajo innecesario. Si necesitamos estabilidad con garantía Θ(n log n), Merge Sort es una opción clara cuando hay memoria. Si necesitamos peor caso O(n log n) con auxiliar constante, Heap Sort satisface ese contrato. Counting conviene para rango pequeño, y Radix para claves adecuadas de pocos dígitos. Una búsqueda binaria posterior puede justificar ordenar una vez para muchas consultas. El costo de mantenimiento importa: si llegan cambios constantes, quizá una estructura ordenada dinámica sea más apropiada que ordenar todo de nuevo."
          ]
        },
        {
          "title": "Preparar un experimento reproducible",
          "paragraphs": [
            "Definí tamaños, distribuciones y métricas antes de medir. Usá la misma entrada inicial para cada algoritmo, generada con una semilla registrada; clonala antes de cada corrida porque ordenar modifica datos. Separá el tiempo de preparación si estudiás solamente ordenamiento, y medí la tarea completa cuando ese sea el objetivo. La JVM puede compilar código durante el calentamiento, así que conviene descartar rondas iniciales y repetir en procesos cuando sea necesario. System.nanoTime mide intervalos, pero una única diferencia no constituye un benchmark sólido. Registrá versiones de Java, máquina y parámetros para poder repetir."
          ]
        },
        {
          "title": "Verificar antes de interpretar tiempos",
          "paragraphs": [
            "Un algoritmo incorrecto puede parecer rápido porque deja trabajo sin realizar. Después de medir, comprobá monotonía y preservación de elementos mediante una referencia confiable o frecuencias. Consumí algún resultado para evitar que el trabajo carezca de efecto observable, sin incluir esa comprobación en el intervalo si no corresponde al contrato medido. Reportá mediana, dispersión y condiciones; el promedio solo puede ocultar pausas de recolección o valores atípicos. El ejemplo siguiente es un cronómetro educativo, no reemplaza un arnés especializado de microbenchmarking. Compara siempre operaciones semánticamente equivalentes y evita concluir a partir de diferencias pequeñas dentro del ruido."
          ]
        },
        {
          "title": "Práctica de rendimiento y explicación",
          "paragraphs": [
            "Implementá los métodos del módulo y armá una tabla con n, comparaciones, movimientos, memoria auxiliar y tiempo. Incluí entradas ordenadas, invertidas, aleatorias y con muchos iguales. Para algoritmos cuadráticos aumentá tamaños de forma prudente; duplicar n puede cuadruplicar el trabajo. Contrastá ese crecimiento con n log n y separá las constantes del orden asintótico. Si Quick Sort final falla por pila en una entrada adversa, registralo como límite del diseño y no como dato faltante. La conclusión debe explicar qué algoritmo elegís para una carga concreta y qué requisito justificaría cambiar esa decisión."
          ],
          "code": "MEDIR(entrada,algoritmo)\n  copia ← clonar entrada\n  inicio ← reloj\n  algoritmo(copia)\n  tiempo ← reloj − inicio\n  verificar salida fuera del intervalo",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Depende del algoritmo y la distribución",
        "space": "Incluye búferes, copias y pila",
        "explanation": "Las métricas experimentales complementan las garantías; no las sustituyen."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Para comparar Merge e Insertion sobre un arreglo ya ordenado, cada corrida recibe una copia idéntica. Se registra aparte el costo de clonar. Insertion realiza pocas comprobaciones por elemento; Merge mantiene su estructura de divisiones y mezclas. El resultado no permite extrapolar que Insertion gane con cualquier distribución.",
        "code": "class Medicion {\n  static volatile long control;\n  static long medir(int[] entrada, int repeticiones) {\n    if(entrada==null||repeticiones<=0)throw new IllegalArgumentException();\n    long total=0;\n    for(int r=0;r<repeticiones;r++) {\n      int[] copia=entrada.clone(); // Preparación fuera del intervalo medido.\n      long inicio=System.nanoTime();\n      java.util.Arrays.sort(copia);\n      total+=System.nanoTime()-inicio;\n      for(int i=1;i<copia.length;i++)if(copia[i-1]>copia[i])throw new AssertionError();\n      control+=copia.length==0?0:copia[copia.length/2];\n    }\n    return total/repeticiones;\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Diseñá y ejecutá localmente una comparación con tres distribuciones y cuatro tamaños. Entregá resultados verificados, dispersión y una elección motivada. Esta práctica no compila ni ejecuta código en la plataforma."
      },
      "takeaways": [
        "Elegir exige relacionar contratos y garantías con la carga real antes de interpretar un cronómetro.",
        "Las métricas experimentales complementan las garantías; no las sustituyen.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ]
    }
  ],
  "exercises": [
    {
      "id": "m10-e01",
      "moduleId": 10,
      "title": "Intervalo binario",
      "kind": "prediction",
      "difficulty": "Inicial",
      "prompt": "¿Qué índice devuelve la búsqueda binaria del ejemplo para doce?",
      "input": "[2,5,8,12,19], objetivo 12",
      "expected": "Índice desde cero.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "3",
      "accepted": [],
      "hints": [
        "El primer medio es el índice dos.",
        "Al descartar el índice dos, el siguiente intervalo es [3,4]."
      ],
      "solution": "3",
      "explanation": "Ocho es menor que doce, por lo que se conserva la mitad derecha.",
      "lessonId": "m10-busquedas"
    },
    {
      "id": "m10-e02",
      "moduleId": 10,
      "title": "Selección ordenada",
      "kind": "complexity",
      "difficulty": "Inicial",
      "prompt": "¿Cuál es el tiempo de Selection Sort sobre una entrada ya ordenada?",
      "input": "n elementos",
      "expected": "Notación asintótica.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "Θ(n²)",
      "accepted": [
        "O(n²)",
        "theta(n^2)",
        "O(n^2)"
      ],
      "hints": [
        "Sigue buscando el mínimo de cada sufijo.",
        "La entrada ordenada no evita comparar todos los candidatos a mínimo del sufijo."
      ],
      "solution": "Θ(n²)",
      "explanation": "La condición inicial no elimina los recorridos de selección.",
      "lessonId": "m10-simples"
    },
    {
      "id": "m10-e03",
      "moduleId": 10,
      "title": "Binaria que no avanza",
      "kind": "debug",
      "difficulty": "Intermedio",
      "prompt": "Con medio menor al objetivo se asigna izq=medio. ¿Qué corrección evita estancarse?",
      "input": "Intervalo inclusivo [izq,der]",
      "expected": "Asignación correcta.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "izq=medio+1",
      "accepted": [
        "izq = medio + 1",
        "izq ← medio + 1"
      ],
      "hints": [
        "El medio ya quedó descartado.",
        "En un intervalo de un elemento, conservar medio mantendría exactamente los mismos límites."
      ],
      "solution": "izq = medio + 1;",
      "explanation": "Excluir el medio hace disminuir estrictamente el intervalo.",
      "lessonId": "m10-busquedas"
    },
    {
      "id": "m10-e04",
      "moduleId": 10,
      "title": "Radix por unidades",
      "kind": "prediction",
      "difficulty": "Inicial",
      "prompt": "Salida estable tras ordenar solamente por unidades:",
      "input": "[21,13,12]",
      "expected": "Secuencia.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "21,12,13",
      "accepted": [
        "[21,12,13]",
        "21 12 13"
      ],
      "hints": [
        "Las unidades son uno, tres y dos.",
        "El orden estable conserva la secuencia original entre números con la misma unidad."
      ],
      "solution": "[21,12,13]",
      "explanation": "La siguiente pasada por decenas conserva este orden dentro de cada grupo.",
      "lessonId": "m10-counting-radix"
    },
    {
      "id": "m10-e05",
      "moduleId": 10,
      "title": "Implementar y medir",
      "kind": "implementation",
      "difficulty": "Intermedio",
      "prompt": "Implementá dos ordenamientos y un experimento reproducible. La plataforma no compila ni ejecuta tu solución; registrá la ejecución local.",
      "input": "Vacío, ordenado, invertido, repetidos y cuatro tamaños.",
      "expected": "Salida verificada y tabla de mediciones.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "// Preparar entradas y registrar resultados fuera de la plataforma.",
      "answer": "",
      "accepted": [],
      "hints": [
        "Cada corrida debe recibir una copia idéntica.",
        "Separá calentamiento y preparación de la medición."
      ],
      "solution": "Implementar Insertion y Merge; clonar entradas, calentar, medir varias repeticiones, verificar contra Arrays.sort y reportar mediana/dispersión junto con memoria y distribución.",
      "explanation": "La comparación necesita igualdad de contrato y control de entradas; medir una ejecución aislada no justifica una conclusión general.",
      "lessonId": "m10-seleccion-medicion"
    }
  ],
  "questions": [
    {
      "id": "m10-q01",
      "moduleId": 10,
      "type": "choice",
      "prompt": "¿Qué precondición necesita la búsqueda binaria del ejemplo?",
      "options": [
        "Arreglo ordenado no decrecientemente.",
        "Claves distintas.",
        "Longitud potencia de dos."
      ],
      "answer": 0,
      "explanation": "La decisión de descartar una mitad depende del orden.",
      "lessonId": "m10-busquedas"
    },
    {
      "id": "m10-q02",
      "moduleId": 10,
      "type": "truefalse",
      "prompt": "La búsqueda binaria básica siempre devuelve la primera aparición.",
      "options": [
        "Falso",
        "Verdadero"
      ],
      "answer": 0,
      "explanation": "Puede retornar cualquier posición coincidente.",
      "lessonId": "m10-busquedas"
    },
    {
      "id": "m10-q03",
      "moduleId": 10,
      "type": "prediction",
      "prompt": "Una pasada de burbuja ascendente fija:",
      "options": [
        "El máximo del prefijo en su extremo derecho.",
        "El mínimo siempre en índice cero.",
        "Todos los elementos."
      ],
      "answer": 0,
      "explanation": "Los intercambios vecinos transportan el mayor hasta el final.",
      "lessonId": "m10-simples"
    },
    {
      "id": "m10-q04",
      "moduleId": 10,
      "type": "complexity",
      "prompt": "Insertion Sort con entrada ya ordenada cuesta:",
      "options": [
        "Θ(n)",
        "Θ(n²)",
        "Θ(log n)"
      ],
      "answer": 0,
      "explanation": "Cada elemento exige una comprobación sin desplazar prefijos.",
      "lessonId": "m10-simples"
    },
    {
      "id": "m10-q05",
      "moduleId": 10,
      "type": "order",
      "prompt": "Merge Sort realiza:",
      "options": [
        "Dividir → ordenar mitades → mezclar",
        "Mezclar → elegir pivote → borrar",
        "Construir heap → dividir por dígitos"
      ],
      "answer": 0,
      "explanation": "La mezcla presupone mitades ordenadas.",
      "lessonId": "m10-nlogn"
    },
    {
      "id": "m10-q06",
      "moduleId": 10,
      "type": "choice",
      "prompt": "¿Cuál ofrece peor caso O(n log n) y auxiliar Θ(1) en versión iterativa?",
      "options": [
        "Heap Sort",
        "Merge Sort convencional.",
        "Quick Sort con pivote final."
      ],
      "answer": 0,
      "explanation": "El heap evita búfer lineal y particiones adversas.",
      "lessonId": "m10-nlogn"
    },
    {
      "id": "m10-q07",
      "moduleId": 10,
      "type": "truefalse",
      "prompt": "Radix LSD necesita pasadas estables.",
      "options": [
        "Verdadero",
        "Falso"
      ],
      "answer": 0,
      "explanation": "La estabilidad conserva el orden por dígitos menos significativos.",
      "lessonId": "m10-counting-radix"
    },
    {
      "id": "m10-q08",
      "moduleId": 10,
      "type": "prediction",
      "prompt": "Rango de Counting para claves de −2 a 1, inclusive:",
      "options": [
        "4",
        "3",
        "2"
      ],
      "answer": 0,
      "explanation": "Hay cuatro claves enteras posibles: −2, −1, 0 y 1. Se suma uno porque ambos extremos del intervalo están incluidos.",
      "lessonId": "m10-counting-radix"
    },
    {
      "id": "m10-q09",
      "moduleId": 10,
      "type": "complexity",
      "prompt": "Counting Sort depende de:",
      "options": [
        "n y amplitud k del rango.",
        "Solo log n.",
        "Solo cantidad de claves distintas."
      ],
      "answer": 0,
      "explanation": "Se reserva y recorre una tabla por posición del rango.",
      "lessonId": "m10-counting-radix"
    },
    {
      "id": "m10-q10",
      "moduleId": 10,
      "type": "order",
      "prompt": "Una comparación de rendimiento debe:",
      "options": [
        "Preparar copias → medir → verificar salida",
        "Ordenar una vez → reutilizar la salida como entrada distinta",
        "Medir → omitir validación"
      ],
      "answer": 0,
      "explanation": "Los métodos deben recibir entradas equivalentes y producir resultados correctos.",
      "lessonId": "m10-seleccion-medicion"
    }
  ],
  "glossary": [
    {
      "term": "Estabilidad",
      "definition": "Preservación del orden relativo de registros con claves iguales.",
      "lessonId": "m10-seleccion-medicion"
    },
    {
      "term": "In-place",
      "definition": "Uso del almacenamiento de entrada con auxiliar acotado según una convención explícita.",
      "lessonId": "m10-seleccion-medicion"
    },
    {
      "term": "Partición",
      "definition": "Reorganización alrededor de un pivote que separa grupos de claves.",
      "lessonId": "m10-nlogn"
    },
    {
      "term": "Inversión",
      "definition": "Par de posiciones i<j donde a[i]>a[j].",
      "lessonId": "m10-simples"
    },
    {
      "term": "Rango de claves",
      "definition": "Amplitud máximo−mínimo+1 usada por Counting Sort.",
      "lessonId": "m10-counting-radix"
    },
    {
      "term": "Benchmark",
      "definition": "Experimento reproducible que mide una carga definida y verifica sus resultados.",
      "lessonId": "m10-seleccion-medicion"
    }
  ]
};
