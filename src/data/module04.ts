import type { ModuleContent } from './types.js';

export const module04: ModuleContent = {
  "moduleId": 4,
  "lessons": [
    {
      "id": "m04-arreglos",
      "moduleId": 4,
      "title": "Arreglos: índices, recorridos y desplazamientos",
      "duration": 28,
      "summary": "Separar longitud física y tamaño lógico permite razonar sobre acceso, inserción y eliminación.",
      "objectives": [
        "Explicar arreglos: índices, recorridos y desplazamientos y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Una secuencia con posiciones precisas",
          "paragraphs": [
            "Un arreglo Java reserva una cantidad fija de posiciones del mismo tipo. Su propiedad length expresa capacidad física y no cambia después de construirlo. Los índices válidos pertenecen al intervalo desde cero, incluido, hasta length, excluido. Acceder por índice no recorre posiciones anteriores: bajo el modelo habitual de memoria RAM requiere tiempo constante. Esto no implica que buscar un valor desconocido también sea constante. Para encontrar una coincidencia sin información adicional debemos inspeccionar elementos, y en el peor caso visitamos todas las posiciones."
          ]
        },
        {
          "title": "Capacidad y tamaño lógico",
          "paragraphs": [
            "Una estructura puede utilizar solamente el prefijo de un arreglo. Si la capacidad es ocho y el tamaño lógico es tres, los elementos pertenecen a las posiciones cero, uno y dos; el resto está disponible. Un cero almacenado no indica que una celda esté libre, porque cero también puede ser un dato válido. Conservamos un contador separado llamado n. El invariante de representación exige cero menor o igual que n y n menor o igual que capacidad. Cada operación debe preservar ese intervalo y el orden de los elementos existentes."
          ]
        },
        {
          "title": "Insertar sin destruir información",
          "paragraphs": [
            "Insertar el valor nueve en la posición uno de [4, 7, 2] produce [4, 9, 7, 2]. Antes de escribir el nueve movemos el dos a la posición tres y el siete a la posición dos. El desplazamiento se realiza de derecha a izquierda: hacerlo al revés sobrescribiría datos que todavía necesitamos copiar. Admitimos insertar en pos igual a n para agregar al final, pero exigimos una celda libre. Durante el ciclo, el sufijo ya desplazado conserva exactamente los elementos originales en su posición nueva."
          ]
        },
        {
          "title": "Eliminar y definir el contrato",
          "paragraphs": [
            "Eliminar la posición uno de [4, 9, 7, 2] desplaza siete y dos hacia la izquierda y reduce n. El recorrido avanza desde el hueco: así cada lectura usa una celda todavía intacta. El contrato distingue índices válidos para consultar o eliminar, que deben ser estrictamente menores que n, de índices de inserción, que pueden igualarlo. Limpiar la antigua última celda no define la eliminación lógica: lo hace reducir n. En arreglos de objetos conviene además escribir null para liberar una referencia que podría retener memoria."
          ]
        },
        {
          "title": "Pseudocódigo y correctitud",
          "paragraphs": [
            "El procedimiento de inserción comienza en j igual a n, copia a[j − 1] en a[j] y decrementa j mientras j sea mayor que pos. Después escribe el nuevo valor y aumenta el tamaño. La variante j − pos disminuye en cada vuelta y nunca es negativa, por lo que termina. Al finalizar, el prefijo anterior a pos sigue intacto y el sufijo original ocupa exactamente las posiciones siguientes. La eliminación usa el argumento simétrico: el prefijo ya compactado contiene todos los elementos que deben preceder al siguiente hueco."
          ],
          "code": "INSERTAR(a,n,pos,x)\n  exigir 0 ≤ pos ≤ n < capacidad\n  para j desde n hasta pos+1: a[j] ← a[j-1]\n  a[pos] ← x\n  devolver n+1",
          "language": "text"
        },
        {
          "title": "Costos y comprobación paso a paso",
          "paragraphs": [
            "Acceder a una celda cuesta Θ(1); recorrer el prefijo útil cuesta Θ(n). Insertar en pos desplaza n − pos elementos: es constante al final si existe capacidad, y lineal al principio. Eliminar desplaza n − pos − 1 elementos. Ambos métodos usan espacio auxiliar constante y modifican el arreglo recibido. Probá capacidad uno, inserción en vacío, eliminación del único elemento e índice negativo. Para capacidad completa, este contrato rechaza la inserción en lugar de ocultar una redimensión. No confundas el valor retornado, que es el nuevo tamaño, con un arreglo nuevo."
          ]
        }
      ],
      "complexity": {
        "time": "Acceso Θ(1); insertar/eliminar O(n)",
        "space": "Θ(1) auxiliar",
        "explanation": "El número de desplazamientos depende de la posición; el arreglo conserva su capacidad fija."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Con capacidad cinco, n = 3 y datos [4,7,2,0,0], insertar en posición uno copia 2 al índice tres, copia 7 al dos y escribe 9 al uno. Devuelve cuatro. Eliminar luego el índice dos deja el prefijo [4,9,2] y devuelve tres. Los ceros del resto no pertenecen a la secuencia.",
        "code": "class Arreglos {\n  static int insertar(int[] a, int n, int pos, int valor) {\n    if (a == null || n < 0 || n >= a.length || pos < 0 || pos > n)\n      throw new IllegalArgumentException();\n    for (int j = n; j > pos; j--) a[j] = a[j - 1];\n    a[pos] = valor;\n    return n + 1;\n  }\n  static int eliminar(int[] a, int n, int pos) {\n    if (a == null || n < 0 || n > a.length || pos < 0 || pos >= n)\n      throw new IllegalArgumentException();\n    for (int j = pos; j < n - 1; j++) a[j] = a[j + 1];\n    a[n - 1] = 0;\n    return n - 1;\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Implementá búsqueda del primer valor en el prefijo útil. Indicá el comportamiento con n = 0 y justificá por qué nunca consultás a[n]."
      },
      "takeaways": [
        "Separar longitud física y tamaño lógico permite razonar sobre acceso, inserción y eliminación.",
        "El número de desplazamientos depende de la posición; el arreglo conserva su capacidad fija.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ]
    },
    {
      "id": "m04-dinamicos",
      "moduleId": 4,
      "title": "Arreglos dinámicos y crecimiento amortizado",
      "duration": 28,
      "summary": "Un vector combina un arreglo fijo con una política de capacidad y un tamaño lógico.",
      "objectives": [
        "Explicar arreglos dinámicos y crecimiento amortizado y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "La abstracción y su almacenamiento",
          "paragraphs": [
            "Un arreglo dinámico ofrece una secuencia que puede crecer aunque cada arreglo interno tenga longitud fija. Mantiene una referencia al almacenamiento actual y un contador de elementos. Cuando falta capacidad, reserva otro arreglo, copia el prefijo útil y reemplaza la referencia. El cliente consulta el tamaño lógico, no el espacio reservado. En Java, ArrayList implementa esta idea para referencias a objetos; int[] almacena enteros primitivos y evita el empaquetado Integer. La política concreta de crecimiento pertenece a la implementación y no debe inferirse del contrato general de una lista."
          ]
        },
        {
          "title": "Agregar y ampliar",
          "paragraphs": [
            "Nuestro vector comienza con capacidad uno y duplica cuando size iguala length. Para agregar cinco elementos realiza capacidades uno, dos, cuatro y ocho. Algunas inserciones solo escriben una celda; otras copian todos los elementos existentes. Es importante reservar y copiar antes de sustituir el almacenamiento, porque perder la referencia antigua antes de copiar destruiría el acceso a los datos. El orden permanece igual: el elemento que estaba en el índice i se copia al mismo índice i. Solamente después se escribe el nuevo elemento y se incrementa size."
          ]
        },
        {
          "title": "Por qué el costo amortizado es constante",
          "paragraphs": [
            "En una secuencia de n agregados desde vacío, las ampliaciones copian cantidades uno, dos, cuatro y así sucesivamente. La suma geométrica es menor que dos veces n, por lo que todas las copias juntas cuestan O(n). Las n escrituras nuevas también cuestan O(n). Dividir ese costo total entre n operaciones da O(1) amortizado por agregado. Esto no promete una latencia constante para cada llamada: la operación que amplía sigue costando Θ(n). Tampoco es una afirmación probabilística ni un promedio sobre entradas elegidas al azar."
          ]
        },
        {
          "title": "Errores de políticas alternativas",
          "paragraphs": [
            "Aumentar la capacidad en una sola posición cada vez copia uno más dos más tres y así hasta n, produciendo Θ(n²) trabajo total. Duplicar utiliza más espacio reservado pero reduce las copias. Si también reducimos capacidad después de eliminar, hacerlo inmediatamente al quedar por debajo de la mitad puede provocar oscilaciones con inserciones y eliminaciones alternadas. Una solución usa histéresis: reducir solamente al cuarto de ocupación, manteniendo una capacidad mínima. Hay que analizar la secuencia completa para garantizar costos amortizados al combinar ambas operaciones."
          ]
        },
        {
          "title": "Correctitud y límites reales",
          "paragraphs": [
            "El invariante exige que size esté entre cero y capacidad y que el prefijo de longitud size represente la secuencia. Copiar ese prefijo preserva cada posición, y agregar en size extiende la secuencia exactamente en un elemento. La variante del ciclo de copia es la cantidad de celdas pendientes. En Java también hay límites prácticos: duplicar un int puede desbordar y una reserva puede fallar por falta de memoria. El ejemplo comprueba el límite aritmético antes de duplicar; ese control no garantiza que exista memoria suficiente para completar la reserva."
          ]
        },
        {
          "title": "Espacio, casos y experimentación",
          "paragraphs": [
            "El almacenamiento reservado es Θ(n) cuando el vector ha crecido geométricamente y no se han borrado elementos masivamente. Durante una ampliación conviven el arreglo viejo y el nuevo, así que el pico de memoria también es lineal. Obtener un elemento válido sigue siendo Θ(1), mientras insertar en medio continúa desplazando un sufijo. Registrá las capacidades después de ocho agregados y separá escrituras nuevas de copias. Verificá la preservación del orden comparando get(i) con la secuencia insertada; cubrí además get(−1), get(size) y la primera ampliación."
          ],
          "code": "AGREGAR(x)\n  si tamaño = capacidad: reservar doble y copiar prefijo\n  datos[tamaño] ← x\n  tamaño ← tamaño + 1",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Agregar O(1) amortizado; O(n) individual",
        "space": "Θ(n) almacenamiento",
        "explanation": "La suma geométrica de copias permite n agregados en O(n), aunque una ampliación individual sea lineal."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Al agregar [8,6,4,2,0], las ampliaciones copian 1 + 2 + 4 = 7 valores, además de cinco escrituras. El quinto agregado provoca capacidad ocho. get(4) devuelve cero porque esa posición pertenece al prefijo útil; las posiciones cinco a siete siguen reservadas pero no son elementos.",
        "code": "class VectorEnteros {\n  private int[] datos = new int[1];\n  private int size;\n  int size() { return size; }\n  int get(int i) {\n    if (i < 0 || i >= size) throw new IndexOutOfBoundsException();\n    return datos[i];\n  }\n  void add(int valor) {\n    if (size == datos.length) {\n      if (datos.length > Integer.MAX_VALUE / 2) throw new IllegalStateException(\"Capacidad máxima\");\n      int[] nuevos = new int[datos.length * 2];\n      System.arraycopy(datos, 0, nuevos, 0, size);\n      datos = nuevos;\n    }\n    datos[size++] = valor;\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Agregá removeLast con limpieza de referencia en una versión genérica. Diseñá una política de reducción al cuarto y explicá qué evita la oscilación."
      },
      "takeaways": [
        "Un vector combina un arreglo fijo con una política de capacidad y un tamaño lógico.",
        "La suma geométrica de copias permite n agregados en O(n), aunque una ampliación individual sea lineal.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ]
    },
    {
      "id": "m04-simple",
      "moduleId": 4,
      "title": "Lista simplemente enlazada desde cero",
      "duration": 28,
      "summary": "Los nodos conectados por referencias ofrecen inserciones locales sin desplazar una secuencia.",
      "objectives": [
        "Explicar lista simplemente enlazada desde cero y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "La secuencia se forma siguiendo enlaces",
          "paragraphs": [
            "Una lista simplemente enlazada representa cada elemento con un nodo que contiene un valor y una referencia siguiente. La referencia cabeza identifica el primer nodo; null marca el final. Los nodos no requieren posiciones contiguas y sus direcciones físicas no se utilizan como índices lógicos. Para encontrar el tercer elemento comenzamos en cabeza y seguimos dos enlaces. Una lista vacía tiene cabeza y cola nulas y tamaño cero. Mantener cola permite agregar al final sin volver a recorrer todos los nodos; conservarla impone actualizarla en los casos límite."
          ]
        },
        {
          "title": "Agregar conservando extremos",
          "paragraphs": [
            "Para agregar un valor reservamos un nodo cuyo siguiente es null. Si la lista estaba vacía, cabeza recibe ese nodo. En caso contrario, el siguiente de la antigua cola lo enlaza. Finalmente cola pasa a señalar al nuevo y size aumenta. El orden de esas instrucciones garantiza que nunca perdamos el acceso al comienzo. El invariante afirma que cola es el último nodo alcanzable y que cola.siguiente es null. Insertar al principio es igualmente local: nuevo.siguiente recibe cabeza y después cabeza recibe nuevo, ajustando cola si antes estaba vacía."
          ]
        },
        {
          "title": "Buscar y eliminar la primera coincidencia",
          "paragraphs": [
            "Para borrar por valor recorremos con dos referencias, actual y anterior. Antes de cada comparación, anterior identifica el predecesor de actual, salvo que actual sea cabeza. Si encontramos el valor, enlazamos anterior con actual.siguiente; si no hay anterior, movemos cabeza. Si actual era cola, la nueva cola es anterior. Cuando el único nodo se elimina, ambas referencias quedan nulas. Retornamos false si no existe coincidencia y true si se quitó exactamente una. Los valores repetidos posteriores permanecen porque el contrato pide eliminar solamente la primera aparición."
          ]
        },
        {
          "title": "Correctitud del recorrido",
          "paragraphs": [
            "El invariante de búsqueda dice que ningún nodo anterior a actual contiene el objetivo y que el prefijo recorrido conserva sus enlaces originales. Avanzar simultáneamente anterior y actual mantiene esa relación. La lista es finita y acíclica, así que la cantidad de nodos pendientes disminuye hasta encontrar el valor o alcanzar null. Al eliminar, sustituimos exactamente el enlace que apuntaba al nodo elegido y preservamos el orden relativo de todos los demás. Desconectar actual.siguiente no es necesario para la secuencia, pero hace explícito que el nodo retirado ya no continúa dentro de ella."
          ]
        },
        {
          "title": "Costos que dependen de tener la referencia",
          "paragraphs": [
            "Agregar al final con cola cuesta Θ(1). Buscar por valor y obtener por índice cuestan O(n). Eliminar después de un predecesor conocido cuesta Θ(1), pero encontrar ese predecesor puede costar Θ(n). Por eso afirmar que cualquier eliminación de lista es constante resulta incorrecto. La implementación completa de abajo usa referencias privadas para que el cliente no pueda corromper enlaces ni modificar size directamente. No usa las colecciones predefinidas de Java: constituye el núcleo de la práctica de construir una lista propia y controlar sus invariantes."
          ]
        },
        {
          "title": "Traza y batería de casos",
          "paragraphs": [
            "Agregá 4, luego 7 y luego 4: cabeza señala el primer cuatro y cola el último. eliminarPrimero(4) mueve cabeza al siete y conserva la cola. Repetir elimina el cuatro final y actualiza cola al siete. Eliminar siete deja la lista vacía. Una eliminación adicional retorna false. Además probá quitar un valor ausente, consultar un índice igual a size y agregar después de vaciar. Para comprobar integridad, contá nodos alcanzables y compará con size; verificá que el último coincide con cola y que ningún recorrido visita un mismo nodo dos veces."
          ],
          "code": "BUSCAR(x)\n  actual ← cabeza\n  mientras actual ≠ null y actual.valor ≠ x\n    actual ← actual.siguiente\n  devolver actual",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Agregar Θ(1); búsqueda/eliminación por valor O(n)",
        "space": "Θ(n) nodos; Θ(1) auxiliar",
        "explanation": "Los cambios de enlaces son locales; localizar la posición sigue requiriendo recorrido."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "La secuencia de agregados 4,7,4 crea tres nodos. Eliminar el primer cuatro conserva [7,4], tamaño dos y la misma cola. Eliminar el segundo cuatro deja [7], con cabeza igual a cola. Eliminar siete establece ambas referencias en null. Este ejemplo ejercita cabeza, cola y nodo único.",
        "code": "class ListaSimple {\n  static class Nodo {\n    int valor; Nodo siguiente;\n    Nodo(int valor, Nodo siguiente) { this.valor = valor; this.siguiente = siguiente; }\n  }\n  private Nodo cabeza, cola;\n  private int size;\n  int size() { return size; }\n  void agregar(int valor) {\n    Nodo nuevo = new Nodo(valor, null);\n    if (cola == null) cabeza = nuevo;\n    else cola.siguiente = nuevo;\n    cola = nuevo; size++;\n  }\n  boolean eliminarPrimero(int valor) {\n    Nodo anterior = null, actual = cabeza;\n    while (actual != null && actual.valor != valor) {\n      anterior = actual; actual = actual.siguiente;\n    }\n    if (actual == null) return false;\n    if (anterior == null) cabeza = actual.siguiente;\n    else anterior.siguiente = actual.siguiente;\n    if (actual == cola) cola = anterior;\n    actual.siguiente = null; size--; return true;\n  }\n  int get(int i) {\n    if (i < 0 || i >= size) throw new IndexOutOfBoundsException();\n    Nodo actual = cabeza;\n    while (i-- > 0) actual = actual.siguiente;\n    return actual.valor;\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Extendé ListaSimple con insertarAlInicio e invertir. La revisión es manual: la plataforma no compila ni ejecuta tu código. Justificá la actualización de cola y probá vacío, un nodo y tres nodos."
      },
      "takeaways": [
        "Los nodos conectados por referencias ofrecen inserciones locales sin desplazar una secuencia.",
        "Los cambios de enlaces son locales; localizar la posición sigue requiriendo recorrido.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ],
      "lab": "linked-list"
    },
    {
      "id": "m04-dobles-circulares",
      "moduleId": 4,
      "title": "Listas dobles y circulares",
      "duration": 28,
      "summary": "Agregar enlaces previos y cerrar la cadena modifica operaciones e invariantes de terminación.",
      "objectives": [
        "Explicar listas dobles y circulares y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Dos direcciones por nodo",
          "paragraphs": [
            "Una lista doble agrega una referencia anterior además de siguiente. Si un nodo x tiene sucesor y, el anterior de y debe ser x; la propiedad simétrica también debe cumplirse. Esto permite recorrer en ambos sentidos y quitar un nodo conocido sin buscar su predecesor. El costo es una referencia adicional por nodo y más asignaciones por cambio estructural. Un arreglo no obtiene estas capacidades agregando índices negativos: los enlaces representan relaciones explícitas entre objetos. Antes de escribir una operación conviene dibujar los cuatro enlaces afectados y sus extremos."
          ]
        },
        {
          "title": "Centinela circular para unificar casos",
          "paragraphs": [
            "Usaremos un nodo centinela que no representa un elemento. Sus enlaces apuntan a sí mismo cuando la lista está vacía. En una lista no vacía, siguiente conduce al primero y anterior al último. Esto hace circular la estructura y elimina muchos tratamientos especiales de extremos: el predecesor del primero y el sucesor del último son el centinela. No hay un valor reservado para reconocerlo; se compara identidad de referencia. Aunque contenga el número cero, ese valor nunca se expone como elemento y puede coexistir con ceros reales almacenados en otros nodos."
          ]
        },
        {
          "title": "Insertar y quitar reconectando vecinos",
          "paragraphs": [
            "Para insertar un nodo entre izquierdo y derecho, asignamos nuevo.anterior igual a izquierdo y nuevo.siguiente igual a derecho; luego izquierdo.siguiente y derecho.anterior pasan a apuntar al nuevo. Quitar un nodo hace izquierdo.siguiente igual a derecho y derecho.anterior igual a izquierdo. Estas operaciones requieren conservar las referencias vecinas antes de desconectar. En quitarPrimero, el sucesor puede ser el propio centinela: esa misma fórmula deja correctamente vacía la lista de un elemento. size se incrementa o decrementa una sola vez después de completar la reconexión."
          ]
        },
        {
          "title": "Circular simple y condición de parada",
          "paragraphs": [
            "Una lista circular también puede tener solamente enlaces siguientes. Mantener una cola permite representar cabeza como cola.siguiente y agregar al principio o al final con cambios constantes. En cualquier versión circular, recorrer hasta null no termina: el último vuelve al comienzo. Podemos detenernos al regresar a la referencia inicial, usando un ciclo que procese primero y compruebe después, o visitar exactamente size nodos. Para la doble con centinela, arrancamos en centinela.siguiente y continuamos mientras actual sea distinto del centinela. Esa condición excluye el nodo artificial de la secuencia."
          ]
        },
        {
          "title": "Correctitud y administración de nodos",
          "paragraphs": [
            "El invariante circular exige consistencia en ambas direcciones y que una vuelta alcance exactamente size elementos antes del centinela. Insertar preserva todos los enlaces ajenos al intervalo elegido y establece las dos igualdades nuevas de reciprocidad. Eliminar restaura la reciprocidad entre los vecinos que quedan. Nunca se permite quitar el centinela: representa la estructura y no un dato. Mantener los nodos privados evita que el cliente desconecte parcialmente la lista. Una referencia externa a un nodo retirado podría retenerlo; asignar null a sus enlaces reduce la retención de cadenas completas."
          ]
        },
        {
          "title": "Costos y prueba guiada",
          "paragraphs": [
            "La construcción vacía establece dos referencias y cuesta Θ(1). Insertar al final y quitar el primero cuestan Θ(1), incluso al pasar entre vacío y un elemento. Localizar un índice todavía cuesta O(n), aunque una lista doble puede empezar desde el extremo más cercano. El ejemplo rechaza quitar de vacío con NoSuchElementException. Probá agregar 8 y 9, quitar ocho y luego nueve, y verificar que ambos enlaces del centinela vuelven a apuntarse a sí mismos. Después agregá cero y confirmá que no se confunde con el centinela por compartir el mismo valor."
          ],
          "code": "RECORRER(centinela)\n  actual ← centinela.siguiente\n  mientras actual ≠ centinela\n    visitar actual.valor\n    actual ← actual.siguiente",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Cambios con nodo conocido Θ(1); localizar O(n)",
        "space": "Θ(n) nodos",
        "explanation": "Las referencias dobles permiten reconexión local, pero no acceso aleatorio por índice."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "La lista vacía cumple centinela.siguiente == centinela. Agregar ocho coloca un nodo entre el centinela y él mismo; agregar nueve lo coloca después del ocho. Quitar primero cambia dos enlaces; tras quitar ambos elementos se recupera el estado vacío sin ramas adicionales para el último nodo.",
        "code": "class ListaDoble {\n  private static class Nodo {\n    int valor; Nodo anterior, siguiente;\n    Nodo(int v) { valor = v; }\n  }\n  private final Nodo centinela = new Nodo(0);\n  private int size;\n  ListaDoble() { centinela.siguiente = centinela; centinela.anterior = centinela; }\n  void agregarFinal(int v) {\n    Nodo n = new Nodo(v), ultimo = centinela.anterior;\n    n.anterior = ultimo; n.siguiente = centinela;\n    ultimo.siguiente = n; centinela.anterior = n; size++;\n  }\n  int quitarPrimero() {\n    if (size == 0) throw new java.util.NoSuchElementException();\n    Nodo n = centinela.siguiente;\n    centinela.siguiente = n.siguiente;\n    n.siguiente.anterior = centinela;\n    n.anterior = null; n.siguiente = null; size--;\n    return n.valor;\n  }\n  int size() { return size; }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Implementá quitarUltimo y un recorrido inverso que termine correctamente. Explicá por qué no debe comparar el valor del nodo con cero para encontrar el centinela."
      },
      "takeaways": [
        "Agregar enlaces previos y cerrar la cadena modifica operaciones e invariantes de terminación.",
        "Las referencias dobles permiten reconexión local, pero no acceso aleatorio por índice.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ]
    },
    {
      "id": "m04-eleccion-memoria",
      "moduleId": 4,
      "title": "Referencias, memoria y elección de secuencia",
      "duration": 28,
      "summary": "La estructura adecuada depende del patrón de acceso y de cómo se conservan las referencias.",
      "objectives": [
        "Explicar referencias, memoria y elección de secuencia y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Referencias y alias en Java",
          "paragraphs": [
            "Una variable de tipo arreglo o nodo almacena una referencia a un objeto, no una copia completa del contenido. Si b recibe a, ambas variables pueden señalar el mismo objeto. Cambiar un elemento mediante b se observa también mediante a. Copiar un arreglo de referencias duplica las referencias, pero no los objetos referidos: es una copia superficial. Estas distinciones importan al definir si una operación modifica la entrada, devuelve una vista o produce una estructura independiente. Encapsular el almacenamiento y exponer métodos protege los invariantes frente a modificaciones externas accidentales."
          ]
        },
        {
          "title": "Alcanzabilidad y recolección",
          "paragraphs": [
            "Java recupera objetos cuando dejan de ser alcanzables desde las raíces que conserva la máquina virtual. El programador normalmente no libera nodos manualmente. Quitar un nodo de una lista puede volverlo recuperable, pero una referencia externa todavía podría mantenerlo vivo. Los ciclos no implican por sí mismos una fuga: un grupo de nodos circular sin referencias alcanzables también puede recolectarse. En cambio, olvidar borrar una referencia en un arreglo interno puede retener un objeto que ya no pertenece al tamaño lógico. El momento efectivo de recolección no forma parte del contrato algorítmico."
          ]
        },
        {
          "title": "ArrayList frente a LinkedList",
          "paragraphs": [
            "ArrayList ofrece acceso por índice Θ(1) y agregado final O(1) amortizado; insertar o quitar en medio desplaza un sufijo. LinkedList de Java es doblemente enlazada: agregar o quitar en extremos cuesta Θ(1), mientras get(i) requiere recorrido desde un extremo y cuesta O(n) en general. Modificar con un iterador ya situado puede cambiar enlaces localmente. Eso no convierte en constante insertar por un índice desconocido. Ambas admiten elementos repetidos y preservan orden, pero sus costos reflejan representaciones distintas. La interfaz List describe comportamiento y no promete igual complejidad para todas las implementaciones."
          ]
        },
        {
          "title": "El recorrido accidentalmente cuadrático",
          "paragraphs": [
            "Un ciclo que usa get(i) para cada índice de una LinkedList repite búsquedas desde los extremos y puede consumir Θ(n²). Un iterador conserva su posición y recorre los enlaces una vez, logrando Θ(n). El for mejorado utiliza ese mecanismo y sirve también para ArrayList. La suma de abajo usa long y Math.addExact para detectar un desbordamiento excepcional en vez de producir silenciosamente un resultado incorrecto. Define además el manejo de null: rechaza tanto la lista nula como cualquier elemento nulo antes de convertirlo en número primitivo."
          ]
        },
        {
          "title": "Localidad y costos que el orden asintótico no muestra",
          "paragraphs": [
            "Los arreglos agrupan celdas contiguas y suelen aprovechar la caché del procesador al recorrer. Las listas necesitan leer referencias y pueden dispersar nodos, además de reservar un objeto por elemento. Dos recorridos Θ(n) pueden mostrar tiempos distintos sin contradicción. Para millones de enteros, un int[] evita objetos Integer y enlaces adicionales. Si necesitamos cambios frecuentes en una ubicación que ya está identificada por un nodo, la lista puede ser conveniente. Hay que medir la carga real y la memoria ocupada antes de decidir a partir de un eslogan sobre inserciones rápidas."
          ]
        },
        {
          "title": "Diseñar una comparación justa",
          "paragraphs": [
            "Especificá primero cuántas consultas aleatorias, recorridos, inserciones y eliminaciones realizará el sistema. Compará estructuras con el mismo contrato de duplicados, orden y null. Separá la construcción del tiempo de operación si la pregunta estudia solamente consultas; incluí ambos si mide la tarea completa. Probá secuencias vacías, un elemento, muchos repetidos y cambios sucesivos de tamaño. Para el recorrido, el invariante dice que total suma exactamente los valores ya visitados; avanzar el iterador agrega uno y la cantidad pendiente disminuye. Al finalizar se obtiene la suma completa sin modificar la colección recibida."
          ],
          "code": "SUMAR(lista)\n  total ← 0\n  para cada valor mediante iterador\n    total ← total + valor\n  devolver total",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Recorrido con iterador Θ(n)",
        "space": "Θ(1) auxiliar",
        "explanation": "Mantener la posición evita repetir búsquedas; el espacio de la colección pertenece a la entrada."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Una LinkedList con [10,−3,5] se recorre mediante iterador y produce totales 10,7,12. Cada enlace se sigue una sola vez. Sustituir el recorrido por un ciclo con get(i) mantiene el resultado, pero puede cambiar el costo total de lineal a cuadrático.",
        "code": "class Recorridos {\n  static long suma(java.util.List<Integer> lista) {\n    if (lista == null) throw new IllegalArgumentException();\n    long total = 0;\n    for (Integer valor : lista) {\n      if (valor == null) throw new IllegalArgumentException(\"Elemento nulo\");\n      total = Math.addExact(total, valor.longValue());\n    }\n    return total;\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Proponé una estructura para un historial con muchas lecturas por índice y otra para una cola con cambios en extremos. Fundamentá las operaciones dominantes y el costo de memoria."
      },
      "takeaways": [
        "La estructura adecuada depende del patrón de acceso y de cómo se conservan las referencias.",
        "Mantener la posición evita repetir búsquedas; el espacio de la colección pertenece a la entrada.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ]
    }
  ],
  "exercises": [
    {
      "id": "m04-e01",
      "moduleId": 4,
      "title": "Insertar desplazando",
      "kind": "prediction",
      "difficulty": "Inicial",
      "prompt": "¿Cuál es el prefijo útil después de insertar 9 en posición 1?",
      "input": "[4,7,2], n=3, capacidad=5",
      "expected": "Escribí el arreglo útil.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "4,9,7,2",
      "accepted": [
        "[4,9,7,2]",
        "4 9 7 2"
      ],
      "hints": [
        "Copiá desde el final.",
        "El índice uno recibe el nuevo valor."
      ],
      "solution": "[4,9,7,2]",
      "explanation": "Se desplazan 2 y 7 antes de escribir 9.",
      "lessonId": "m04-arreglos"
    },
    {
      "id": "m04-e02",
      "moduleId": 4,
      "title": "Agregar al vector",
      "kind": "complexity",
      "difficulty": "Inicial",
      "prompt": "¿Cuál es el costo amortizado de agregar al final duplicando capacidad?",
      "input": "n agregados desde vacío",
      "expected": "Usá notación O.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "O(1)",
      "accepted": [
        "o(1)",
        "1",
        "constante"
      ],
      "hints": [
        "Sumá las copias de ampliaciones.",
        "Las ampliaciones copian 1+2+4+… elementos y esa suma es menor que 2n."
      ],
      "solution": "O(1) amortizado",
      "explanation": "Las copias forman una progresión geométrica con suma O(n).",
      "lessonId": "m04-dinamicos"
    },
    {
      "id": "m04-e03",
      "moduleId": 4,
      "title": "La cola quedó obsoleta",
      "kind": "debug",
      "difficulty": "Intermedio",
      "prompt": "Al eliminar el último nodo, ¿qué referencia debe actualizarse?",
      "input": "anterior.siguiente = null; size--;",
      "expected": "Nombre de la referencia.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "cola",
      "accepted": [
        "tail"
      ],
      "hints": [
        "El último nodo alcanzable ahora es anterior.",
        "Si se quitó el único nodo, anterior es null y la referencia al último también debe quedar nula."
      ],
      "solution": "cola = anterior;",
      "explanation": "Si no se actualiza cola, el siguiente agregado se conecta a un nodo que ya no pertenece a la lista.",
      "lessonId": "m04-simple"
    },
    {
      "id": "m04-e04",
      "moduleId": 4,
      "title": "Lista circular vacía",
      "kind": "prediction",
      "difficulty": "Inicial",
      "prompt": "Tras quitar el único nodo, ¿a qué apunta centinela.siguiente?",
      "input": "Lista doble circular con centinela",
      "expected": "Nombre del nodo.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "centinela",
      "accepted": [
        "al centinela"
      ],
      "hints": [
        "La estructura vacía conserva el círculo.",
        "Los enlaces del centinela nunca usan null para representar el estado vacío."
      ],
      "solution": "centinela",
      "explanation": "El centinela queda como su propio sucesor y predecesor.",
      "lessonId": "m04-dobles-circulares"
    },
    {
      "id": "m04-e05",
      "moduleId": 4,
      "title": "Invertir la lista propia",
      "kind": "implementation",
      "difficulty": "Intermedio",
      "prompt": "Implementá invertir en ListaSimple. Esta actividad no compila ni ejecuta el código; su revisión es manual.",
      "input": "vacío; [8]; [1,2,3]",
      "expected": "[]; [8]; [3,2,1]",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "void invertir() { /* completar */ }",
      "answer": "",
      "accepted": [],
      "hints": [
        "Guardá siguiente antes de invertir el enlace.",
        "La cabeza original se convierte en cola."
      ],
      "solution": "Guardar anterior=null y actual=cabeza; fijar cola=cabeza; mientras actual!=null guardar siguiente, hacer actual.siguiente=anterior y avanzar; finalizar cabeza=anterior.",
      "explanation": "El prefijo invertido y el sufijo pendiente particionan los nodos originales. Cada nodo se mueve una sola vez: Θ(n) tiempo y Θ(1) auxiliar.",
      "lessonId": "m04-simple"
    }
  ],
  "questions": [
    {
      "id": "m04-q01",
      "moduleId": 4,
      "type": "choice",
      "prompt": "¿Qué representa length en un arreglo Java?",
      "options": [
        "Su cantidad fija de posiciones.",
        "El tamaño lógico de cualquier vector.",
        "El último índice válido."
      ],
      "answer": 0,
      "explanation": "La última posición es length−1 y el tamaño útil puede ser menor.",
      "lessonId": "m04-arreglos"
    },
    {
      "id": "m04-q02",
      "moduleId": 4,
      "type": "truefalse",
      "prompt": "Acceder por índice en un arreglo requiere recorrer las celdas anteriores.",
      "options": [
        "Falso",
        "Verdadero"
      ],
      "answer": 0,
      "explanation": "El acceso aleatorio cuesta Θ(1) en el modelo RAM.",
      "lessonId": "m04-arreglos"
    },
    {
      "id": "m04-q03",
      "moduleId": 4,
      "type": "prediction",
      "prompt": "Se agrega a un vector lleno de capacidad cuatro. ¿Qué capacidad usa nuestro ejemplo?",
      "options": [
        "8",
        "5",
        "4"
      ],
      "answer": 0,
      "explanation": "La implementación duplica la capacidad.",
      "lessonId": "m04-dinamicos"
    },
    {
      "id": "m04-q04",
      "moduleId": 4,
      "type": "complexity",
      "prompt": "¿Cuánto cuesta una ampliación que copia n valores?",
      "options": [
        "Θ(n)",
        "Θ(1)",
        "Θ(log n)"
      ],
      "answer": 0,
      "explanation": "El costo individual de ampliar es lineal aunque agregar sea constante amortizado.",
      "lessonId": "m04-dinamicos"
    },
    {
      "id": "m04-q05",
      "moduleId": 4,
      "type": "order",
      "prompt": "Orden correcto para insertar al principio de una lista no vacía:",
      "options": [
        "nuevo.siguiente=cabeza → cabeza=nuevo",
        "cabeza=nuevo → nuevo.siguiente=cabeza",
        "cabeza=null → nuevo=null"
      ],
      "answer": 0,
      "explanation": "Primero conservamos la referencia al antiguo primer nodo.",
      "lessonId": "m04-simple"
    },
    {
      "id": "m04-q06",
      "moduleId": 4,
      "type": "choice",
      "prompt": "¿Qué hace posible agregar al final de una lista simple en Θ(1)?",
      "options": [
        "Mantener una referencia cola.",
        "Conocer solamente size.",
        "Buscar desde cabeza cada vez."
      ],
      "answer": 0,
      "explanation": "Cola identifica directamente el nodo que debe enlazarse.",
      "lessonId": "m04-simple"
    },
    {
      "id": "m04-q07",
      "moduleId": 4,
      "type": "truefalse",
      "prompt": "Un ciclo inalcanzable de nodos Java puede ser recolectado.",
      "options": [
        "Verdadero",
        "Falso"
      ],
      "answer": 0,
      "explanation": "La recolección depende de alcanzabilidad, no de que haya ciclos.",
      "lessonId": "m04-eleccion-memoria"
    },
    {
      "id": "m04-q08",
      "moduleId": 4,
      "type": "prediction",
      "prompt": "Eliminar 4 de [4,7,4] con eliminarPrimero deja:",
      "options": [
        "[7,4]",
        "[7]",
        "[4,7]"
      ],
      "answer": 0,
      "explanation": "El contrato elimina solamente la primera coincidencia.",
      "lessonId": "m04-simple"
    },
    {
      "id": "m04-q09",
      "moduleId": 4,
      "type": "complexity",
      "prompt": "Recorrer LinkedList usando get(i) repetidamente puede costar:",
      "options": [
        "Θ(n²)",
        "Θ(1)",
        "Θ(log n)"
      ],
      "answer": 0,
      "explanation": "Cada get vuelve a localizar una posición; un iterador evita esa repetición.",
      "lessonId": "m04-eleccion-memoria"
    },
    {
      "id": "m04-q10",
      "moduleId": 4,
      "type": "order",
      "prompt": "Orden conceptual para eliminar un nodo doble conocido:",
      "options": [
        "Guardar vecinos → reconectar vecinos → desconectar nodo",
        "Desconectar nodo → intentar localizar vecinos",
        "Reducir tamaño → borrar centinela"
      ],
      "answer": 0,
      "explanation": "Conservar vecinos evita perder las referencias necesarias.",
      "lessonId": "m04-dobles-circulares"
    }
  ],
  "glossary": [
    {
      "term": "Tamaño lógico",
      "definition": "Cantidad de elementos que pertenecen a la secuencia, independiente de la capacidad reservada.",
      "lessonId": "m04-arreglos"
    },
    {
      "term": "Capacidad",
      "definition": "Número de celdas disponibles en el almacenamiento interno.",
      "lessonId": "m04-dinamicos"
    },
    {
      "term": "Nodo",
      "definition": "Objeto con un valor y enlaces a otros nodos de una estructura.",
      "lessonId": "m04-simple"
    },
    {
      "term": "Centinela",
      "definition": "Nodo artificial que representa límites y no cuenta como elemento.",
      "lessonId": "m04-dobles-circulares"
    },
    {
      "term": "Alias",
      "definition": "Referencias distintas que identifican el mismo objeto mutable.",
      "lessonId": "m04-eleccion-memoria"
    },
    {
      "term": "Localidad espacial",
      "definition": "Cercanía de posiciones de memoria que puede favorecer el uso de caché.",
      "lessonId": "m04-eleccion-memoria"
    }
  ]
};
