import type { ModuleContent } from './types.js';

export const module07: ModuleContent = {
  "moduleId": 7,
  "lessons": [
    {
      "id": "m07-avl",
      "moduleId": 7,
      "title": "Del ABB desbalanceado al árbol AVL",
      "duration": 28,
      "summary": "Controlar la altura del árbol convierte operaciones que podían ser lineales en operaciones logarítmicas.",
      "objectives": [
        "Explicar del abb desbalanceado al árbol avl y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "La forma también determina el costo",
          "paragraphs": [
            "Un árbol binario de búsqueda mantiene claves menores a la izquierda y mayores a la derecha. Esa propiedad permite descartar un subárbol, pero no garantiza que ambos tengan tamaños parecidos. Insertar claves crecientes uno, dos, tres y cuatro puede producir una cadena. Buscar la última visita todos los nodos: el costo depende de la altura h y es O(h), que puede llegar a O(n). Un AVL agrega una restricción estructural sobre las alturas sin modificar el orden del recorrido inorden. Así conserva las capacidades de búsqueda de un ABB y evita cadenas arbitrariamente largas."
          ]
        },
        {
          "title": "Altura y factor de balance",
          "paragraphs": [
            "Fijamos altura cero para un enlace nulo y altura uno para una hoja. La altura de un nodo es uno más el máximo entre las alturas de sus hijos. Su factor de balance es altura izquierda menos altura derecha. En un AVL, cada factor pertenece a −1, cero o uno. La convención del signo es importante: otros materiales pueden usar el opuesto. Guardar altura en cada nodo permite calcular el factor en tiempo constante a partir de las alturas ya actualizadas de los hijos. Recalcular toda la altura recursivamente en cada operación desperdiciaría esa ventaja."
          ]
        },
        {
          "title": "Por qué la altura es logarítmica",
          "paragraphs": [
            "Un AVL de altura h necesita al menos un subárbol de altura h − 1 y otro de altura h − 2 para alcanzar esa altura respetando el balance. Por eso su mínimo número de nodos satisface una recurrencia semejante a Fibonacci: N(h) = uno + N(h − 1) + N(h − 2). Ese mínimo crece exponencialmente con h, de modo que la altura crece logarítmicamente con n. No exigimos que todos los niveles estén llenos ni que ambos hijos tengan la misma cantidad de nodos. La condición usa alturas locales y permite diferentes formas válidas."
          ]
        },
        {
          "title": "Inserción y regreso recursivo",
          "paragraphs": [
            "Insertamos como en un ABB: descendemos comparando la clave hasta encontrar un enlace nulo. El ejemplo representa un conjunto e ignora una clave ya existente. Al regresar por la recursión, actualizamos la altura y examinamos el balance. Si aparece un factor dos o menos dos, una o dos rotaciones reparan la forma sin cambiar las claves ordenadas. Cada llamada devuelve la nueva raíz de su subárbol y el padre debe guardar esa referencia. El cliente también debe conservar la raíz devuelta por insertar; de otro modo perdería el cambio cuando rota el árbol completo."
          ]
        },
        {
          "title": "Correctitud de la reparación",
          "paragraphs": [
            "El argumento combina dos invariantes: el orden de búsqueda y el balance con alturas coherentes. La inserción modifica únicamente un camino hasta una hoja; los subárboles restantes siguen siendo válidos. Por hipótesis inductiva, la llamada al hijo devuelve un AVL correcto. Actualizar y rotar reorganiza unos pocos enlaces y conserva exactamente el mismo recorrido inorden. Después de la reparación, las alturas almacenadas coinciden con la estructura. La recursión termina porque cada descenso pasa a un subárbol estrictamente más pequeño. Una rotación aislada no elimina ni duplica claves y su costo es constante."
          ]
        },
        {
          "title": "Prueba incremental y costos",
          "paragraphs": [
            "Insertá treinta, veinte y diez. La raíz treinta alcanza balance dos y una rotación derecha deja veinte como raíz con hijos diez y treinta. El inorden sigue siendo diez, veinte, treinta. Para validar, comprobá después de cada inserción la propiedad de búsqueda, las alturas reales y que todos los factores estén entre menos uno y uno. Cubrí árbol vacío y claves repetidas. Buscar e insertar cuestan O(log n); esta implementación recursiva usa O(log n) de pila y Θ(n) para almacenar nodos. El balance no convierte el acceso por rango arbitrario en acceso directo por índice."
          ],
          "code": "INSERTAR(n,k)\n  insertar k como ABB\n  al regresar: actualizar altura\n  si balance sale de [-1,1]: rotar\n  devolver nueva raíz",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Búsqueda e inserción O(log n)",
        "space": "O(log n) pila; Θ(n) nodos",
        "explanation": "El balance AVL obliga a que el mínimo de nodos crezca exponencialmente con la altura."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "La secuencia 30,20,10 produce una rotación derecha y raíz 20. Insertar nuevamente 20 devuelve el mismo conjunto: no aumenta la cantidad de nodos. La raíz devuelta debe asignarse incluso en la primera inserción sobre null.",
        "code": "class AVL {\n  static class Nodo {\n    int clave, altura = 1; Nodo izq, der;\n    Nodo(int c) { clave = c; }\n  }\n  static int h(Nodo n) { return n == null ? 0 : n.altura; }\n  static int balance(Nodo n) { return n == null ? 0 : h(n.izq) - h(n.der); }\n  static void actualizar(Nodo n) { n.altura = 1 + Math.max(h(n.izq), h(n.der)); }\n  static Nodo derecha(Nodo y) {\n    Nodo x = y.izq, medio = x.der;\n    x.der = y; y.izq = medio; actualizar(y); actualizar(x); return x;\n  }\n  static Nodo izquierda(Nodo x) {\n    Nodo y = x.der, medio = y.izq;\n    y.izq = x; x.der = medio; actualizar(x); actualizar(y); return y;\n  }\n  static Nodo equilibrar(Nodo n) {\n    actualizar(n);\n    if (balance(n) > 1) {\n      if (balance(n.izq) < 0) n.izq = izquierda(n.izq);\n      return derecha(n);\n    }\n    if (balance(n) < -1) {\n      if (balance(n.der) > 0) n.der = derecha(n.der);\n      return izquierda(n);\n    }\n    return n;\n  }\n  static Nodo insertar(Nodo n, int c) {\n    if (n == null) return new Nodo(c);\n    if (c < n.clave) n.izq = insertar(n.izq, c);\n    else if (c > n.clave) n.der = insertar(n.der, c);\n    else return n;\n    return equilibrar(n);\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Implementá buscar y un verificador recursivo de alturas reales. Compará la altura al insertar cien claves crecientes en un ABB y en el AVL."
      },
      "takeaways": [
        "Controlar la altura del árbol convierte operaciones que podían ser lineales en operaciones logarítmicas.",
        "El balance AVL obliga a que el mínimo de nodos crezca exponencialmente con la altura.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ],
      "lab": "avl"
    },
    {
      "id": "m07-rotaciones",
      "moduleId": 7,
      "title": "Rotaciones LL, RR, LR y RL",
      "duration": 28,
      "summary": "Las rotaciones cambian enlaces locales y preservan el orden total de las claves.",
      "objectives": [
        "Explicar rotaciones ll, rr, lr y rl y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Rotar no significa ordenar de nuevo",
          "paragraphs": [
            "Una rotación modifica la raíz de un subárbol usando un hijo como pivote. No vuelve a comparar todas las claves ni construye nodos nuevos. En una rotación derecha sobre y, su hijo izquierdo x sube; y se convierte en hijo derecho de x. El antiguo subárbol derecho de x pasa a ser hijo izquierdo de y. Ese subárbol intermedio no puede descartarse: contiene claves mayores que x y menores que y, precisamente el intervalo que necesita su nueva posición. Dibujar los tres subárboles evita perder referencias al traducir la operación a Java."
          ]
        },
        {
          "title": "Casos exteriores LL y RR",
          "paragraphs": [
            "LL identifica un exceso de altura por la rama izquierda del hijo izquierdo. Se corrige con una rotación derecha sobre el ancestro desbalanceado. Para 30,20,10, el resultado es raíz veinte. RR es simétrico: 10,20,30 se corrige con una rotación izquierda. Los nombres describen el camino que produjo el problema y no el nombre de la rotación reparadora. Esta distinción evita elegir la operación opuesta. Tras mover enlaces actualizamos primero la altura del nodo que bajó y luego la del que subió, porque la segunda depende de la primera."
          ]
        },
        {
          "title": "Casos interiores LR y RL",
          "paragraphs": [
            "LR ocurre cuando el ancestro tiene exceso a la izquierda, pero su hijo izquierdo se inclina hacia la derecha. La secuencia 30,10,20 crea ese dibujo. Primero rotamos a la izquierda el hijo diez; después rotamos a la derecha el ancestro treinta. RL refleja la situación: 10,30,20 requiere derecha sobre el hijo y luego izquierda sobre el ancestro. En ambos casos veinte termina en la raíz. Una rotación simple no arregla necesariamente un caso interior: puede trasladar el desequilibrio sin reducir la altura correctamente. Las dos operaciones se componen mediante las raíces devueltas."
          ]
        },
        {
          "title": "Elegir a partir de factores",
          "paragraphs": [
            "Con factor igual a altura izquierda menos altura derecha, un nodo con factor mayor que uno necesita reparación por la izquierda. Si su hijo izquierdo tiene factor negativo, se aplica primero una rotación izquierda al hijo; en caso contrario alcanza la derecha simple. Para factor menor que menos uno se usa el criterio simétrico. Examinar factores de hijos también sirve al eliminar, cuando un hijo puede tener factor cero. Basarse únicamente en comparar la nueva clave insertada con un nieto no alcanza para describir todos los casos de eliminación y dificulta reutilizar la reparación."
          ]
        },
        {
          "title": "Demostrar preservación del orden",
          "paragraphs": [
            "Antes de una rotación derecha, las claves del subárbol izquierdo de x son menores que x, las del intermedio están entre x e y y las del derecho de y son mayores que y. Después, esos intervalos siguen ubicados en lados compatibles con sus nuevas raíces. El recorrido inorden permanece A, x, B, y, C. Esa igualdad demuestra que la búsqueda conserva sus decisiones. Las alturas deben verificarse aparte: preservar orden no demuestra balance. La rotación requiere que exista el hijo usado como pivote, condición garantizada por el factor que disparó la reparación."
          ]
        },
        {
          "title": "Traza, implementación y límites",
          "paragraphs": [
            "Construí cuatro árboles separados con 30,20,10; 10,20,30; 30,10,20; y 10,30,20. Los cuatro deben terminar con raíz veinte y hojas diez y treinta, pero usan secuencias distintas de rotaciones. Después agregá valores en el subárbol intermedio para verificar que no se pierda durante el cambio de enlaces. Una rotación simple realiza un número constante de asignaciones y actualizaciones; una doble ejecuta dos operaciones constantes. No confundas ese costo local con el costo O(log n) de llegar al punto desbalanceado. El código siguiente presenta primitivas completas y asume los hijos pivote existentes."
          ],
          "code": "LL → derecha(raíz)\nRR → izquierda(raíz)\nLR → izquierda(hijo izquierdo), derecha(raíz)\nRL → derecha(hijo derecho), izquierda(raíz)",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Cada rotación Θ(1)",
        "space": "Θ(1) auxiliar",
        "explanation": "Se modifica una cantidad fija de enlaces y alturas, sin recorrer subárboles."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Para 30,10,20, la rotación izquierda del subárbol con raíz 10 produce raíz 20 e hijo izquierdo 10. La rotación derecha sobre 30 completa el AVL. En todo momento se preserva el inorden 10,20,30.",
        "code": "class Rotaciones {\n  static class Nodo {\n    int clave, altura = 1; Nodo izq, der;\n    Nodo(int c) { clave = c; }\n  }\n  static int h(Nodo n) { return n == null ? 0 : n.altura; }\n  static void actualizar(Nodo n) { n.altura = 1 + Math.max(h(n.izq), h(n.der)); }\n  static Nodo derecha(Nodo y) {\n    Nodo x = y.izq, b = x.der;\n    x.der = y; y.izq = b; actualizar(y); actualizar(x); return x;\n  }\n  static Nodo izquierda(Nodo x) {\n    Nodo y = x.der, b = y.izq;\n    y.izq = x; x.der = b; actualizar(x); actualizar(y); return y;\n  }\n  static Nodo izquierdaDerecha(Nodo n) {\n    n.izq = izquierda(n.izq); return derecha(n);\n  }\n  static Nodo derechaIzquierda(Nodo n) {\n    n.der = derecha(n.der); return izquierda(n);\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Dibujá una rotación derecha con un subárbol intermedio que contenga la clave 25 entre raíces 20 y 30. Indicá cada enlace antes y después."
      },
      "takeaways": [
        "Las rotaciones cambian enlaces locales y preservan el orden total de las claves.",
        "Se modifica una cantidad fija de enlaces y alturas, sin recorrer subárboles.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ],
      "lab": "avl"
    },
    {
      "id": "m07-eliminacion-rojo-negro",
      "moduleId": 7,
      "title": "Eliminar en AVL y conocer rojo-negro",
      "duration": 28,
      "summary": "Al borrar hay que reparar todos los ancestros afectados; otros árboles usan reglas de balance diferentes.",
      "objectives": [
        "Explicar eliminar en avl y conocer rojo-negro y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Primero eliminar como en un ABB",
          "paragraphs": [
            "La eliminación busca la clave con comparaciones de búsqueda. Si no existe, conserva el árbol. Un nodo sin hijos se reemplaza por null; uno con un hijo se reemplaza por ese hijo. Con dos hijos copiamos la clave del sucesor inorden, que es el mínimo del subárbol derecho, y eliminamos esa clave de dicho subárbol. Esta estrategia funciona porque usamos claves enteras sin datos adicionales asociados. En un mapa habría que mover también el valor correspondiente. El conjunto de claves resultante debe ser exactamente el original excepto la clave solicitada, sin eliminar otras iguales porque aquí no se admiten duplicados."
          ]
        },
        {
          "title": "El regreso puede seguir reduciendo alturas",
          "paragraphs": [
            "A diferencia de una inserción, una reparación después de eliminar puede reducir la altura del subárbol y causar otro desequilibrio más arriba. Por eso continuamos actualizando y equilibrando todos los ancestros durante el regreso recursivo. El método equilibrar compartido usa los factores actuales de los hijos. Un hijo pesado con factor cero requiere una rotación simple, no una doble. Detenerse después de la primera reparación puede dejar un ancestro inválido aunque el subárbol local ya parezca correcto. La raíz retornada por eliminar debe guardarse, incluso cuando el árbol se vacía."
          ]
        },
        {
          "title": "La demostración inductiva",
          "paragraphs": [
            "Suponemos que la llamada recursiva devuelve un AVL que contiene las claves esperadas. Reemplazar un nodo por su único hijo conserva el orden porque todas esas claves ya estaban en el intervalo permitido por los ancestros. El sucesor es mayor que cualquier clave del hijo izquierdo y no mayor que las restantes del derecho, así que copiarlo mantiene el orden al quitar su aparición original. Después actualizamos altura y aplicamos las rotaciones necesarias. La medida de terminación es el tamaño del subárbol al que descendemos; localizar el sucesor también avanza por una cadena finita."
          ]
        },
        {
          "title": "Reglas esenciales de rojo-negro",
          "paragraphs": [
            "Un árbol rojo-negro mantiene el orden de búsqueda y añade un color por nodo. En la presentación clásica, la raíz es negra, las hojas externas nulas se consideran negras, un nodo rojo no tiene un hijo rojo y todos los caminos desde un nodo hasta hojas externas tienen la misma cantidad de nodos negros. Esas reglas permiten cierta diferencia de alturas, pero impiden cadenas arbitrarias: la altura es O(log n). No se exige factor AVL entre menos uno y uno. Las inserciones y eliminaciones se reparan mediante recoloreos y rotaciones, con casos diferentes a los del AVL."
          ]
        },
        {
          "title": "Elegir garantías y no solamente nombres",
          "paragraphs": [
            "AVL impone un balance más estricto y suele ofrecer caminos de búsqueda más cortos; rojo-negro admite formas menos estrictas y también garantiza operaciones logarítmicas. La conveniencia concreta depende de proporciones de lecturas, modificaciones, constantes y representación. En Java, TreeMap y TreeSet ofrecen orden por comparación y sus implementaciones usan árboles rojo-negro. No hay que implementar un algoritmo rojo-negro parcialmente copiando casos AVL: los invariantes son distintos. Esta lección introduce sus reglas y límites; la práctica de implementación detallada del módulo se concentra en AVL para poder comprobar íntegramente alturas y rotaciones."
          ]
        },
        {
          "title": "Casos de prueba y consumo",
          "paragraphs": [
            "Probá borrar una clave ausente, una hoja, la raíz única y una raíz con dos hijos. Construí además un AVL con varios niveles y quitá una secuencia creciente, comprobando invariantes después de cada operación. El costo es O(log n), incluyendo la búsqueda del sucesor y reparaciones constantes por nivel. La pila recursiva usa O(log n), mientras los nodos restantes ocupan Θ(n). Conservar referencias externas a nodos internos sería problemático al copiar la clave del sucesor; el ejemplo encapsula la representación para que el cliente observe claves y no identidades físicas de nodos."
          ],
          "code": "ELIMINAR(n,k)\n  quitar k como ABB, usando sucesor si tiene dos hijos\n  al regresar: actualizar altura y equilibrar\n  devolver raíz reparada",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Búsqueda y eliminación O(log n)",
        "space": "O(log n) pila",
        "explanation": "La altura logarítmica limita la búsqueda, el sucesor y la cantidad de ancestros a reparar."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Insertá 20,10,30,25,40 y eliminá 20. El sucesor es 25: su clave ocupa la raíz y se elimina su nodo original del subárbol derecho. El inorden final es 10,25,30,40. Volver a eliminar 20 no cambia el conjunto.",
        "code": "class AVLEliminacion {\n  static class Nodo {\n    int clave, altura = 1; Nodo izq, der;\n    Nodo(int c) { clave = c; }\n  }\n  static int h(Nodo n) { return n == null ? 0 : n.altura; }\n  static int balance(Nodo n) { return n == null ? 0 : h(n.izq) - h(n.der); }\n  static void actualizar(Nodo n) { n.altura = 1 + Math.max(h(n.izq), h(n.der)); }\n  static Nodo derecha(Nodo y) {\n    Nodo x = y.izq, medio = x.der;\n    x.der = y; y.izq = medio; actualizar(y); actualizar(x); return x;\n  }\n  static Nodo izquierda(Nodo x) {\n    Nodo y = x.der, medio = y.izq;\n    y.izq = x; x.der = medio; actualizar(x); actualizar(y); return y;\n  }\n  static Nodo equilibrar(Nodo n) {\n    actualizar(n);\n    if (balance(n) > 1) {\n      if (balance(n.izq) < 0) n.izq = izquierda(n.izq);\n      return derecha(n);\n    }\n    if (balance(n) < -1) {\n      if (balance(n.der) > 0) n.der = derecha(n.der);\n      return izquierda(n);\n    }\n    return n;\n  }\n  static Nodo insertar(Nodo n, int c) {\n    if (n == null) return new Nodo(c);\n    if (c < n.clave) n.izq = insertar(n.izq, c);\n    else if (c > n.clave) n.der = insertar(n.der, c);\n    else return n;\n    return equilibrar(n);\n  }\n\n  static Nodo eliminar(Nodo n, int c) {\n    if (n == null) return null;\n    if (c < n.clave) n.izq = eliminar(n.izq, c);\n    else if (c > n.clave) n.der = eliminar(n.der, c);\n    else {\n      if (n.izq == null) return n.der;\n      if (n.der == null) return n.izq;\n      Nodo sucesor = n.der;\n      while (sucesor.izq != null) sucesor = sucesor.izq;\n      n.clave = sucesor.clave;\n      n.der = eliminar(n.der, sucesor.clave);\n    }\n    return equilibrar(n);\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Implementá un verificador que devuelva altura y compruebe orden mediante límites long. Ejecutalo después de borrar todos los valores de un AVL en distintos órdenes."
      },
      "takeaways": [
        "Al borrar hay que reparar todos los ancestros afectados; otros árboles usan reglas de balance diferentes.",
        "La altura logarítmica limita la búsqueda, el sucesor y la cantidad de ancestros a reparar.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ],
      "lab": "avl"
    },
    {
      "id": "m07-heaps",
      "moduleId": 7,
      "title": "Heaps binarios y colas de prioridad",
      "duration": 28,
      "summary": "Un heap prioriza el extremo sin mantener todos los elementos en orden de búsqueda.",
      "objectives": [
        "Explicar heaps binarios y colas de prioridad y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Dos propiedades independientes",
          "paragraphs": [
            "Un heap binario combina forma completa y orden parcial. Completo significa que todos los niveles salvo quizá el último están llenos y el último se ocupa desde la izquierda. En un Min-Heap cada padre es menor o igual que sus hijos; en un Max-Heap es mayor o igual. Eso garantiza que la raíz contiene el mínimo o máximo global. No ordena los hermanos entre sí ni divide las claves en intervalos como un ABB. Por tanto buscar una clave cualquiera puede requerir O(n), aunque extraer el extremo sea eficiente. Repetidos son válidos y no rompen la propiedad."
          ]
        },
        {
          "title": "Representación compacta en arreglo",
          "paragraphs": [
            "Con índices desde cero, el hijo izquierdo de i está en dos por i más uno y el derecho en dos por i más dos. Para i mayor que cero, el padre está en piso de (i − 1) dividido dos. El prefijo útil de longitud size representa el árbol completo sin enlaces explícitos. Antes de acceder a un hijo comprobamos que el índice sea menor que size. Esta representación tiene buena localidad y ahorra objetos nodo. El arreglo puede ampliar capacidad como un vector dinámico; ese costo de reserva debe distinguirse del trabajo de restaurar el orden del heap."
          ]
        },
        {
          "title": "Insertar haciendo subir un valor",
          "paragraphs": [
            "Insertar agrega al final para preservar la forma completa. El único posible incumplimiento está entre el nuevo valor y su padre. Si el hijo es menor en un Min-Heap, lo hacemos subir; el padre baja al hueco. Repetimos hasta llegar a raíz o encontrar un padre suficientemente pequeño. Cada subida reduce la profundidad en uno, de modo que termina después de O(log n) pasos. Los subárboles ajenos al camino siguen válidos. El código conserva el nuevo valor en una variable y desplaza padres en vez de intercambiar dos celdas repetidamente."
          ]
        },
        {
          "title": "Extraer y hundir con el hijo correcto",
          "paragraphs": [
            "Extraer mínimo guarda la raíz, toma el último elemento y reduce size. El último valor ocupa provisionalmente la raíz y puede violar el orden hacia abajo. Elegimos el menor de los dos hijos, porque bajar al mayor podría dejar al menor por encima de un padre incorrecto. Mientras el valor sea mayor que ese hijo lo descendemos. La forma completa se conserva al quitar solamente la última posición. Con un solo elemento, la operación deja size en cero y no intenta acceder a hijos. Extraer de vacío lanza la excepción indicada por el contrato."
          ]
        },
        {
          "title": "Cola de prioridad y prioridades mutables",
          "paragraphs": [
            "Una cola de prioridad devuelve el elemento con mejor prioridad, que puede diferir del que llegó primero. Java PriorityQueue es un Min-Heap según el orden natural o el Comparator elegido. offer agrega, peek consulta sin quitar y poll extrae; las dos últimas retornan null al estar vacía. Si varios elementos comparan igual, no se garantiza conservar su orden de llegada. Para una política estable puede incluirse un número secuencial como criterio secundario. Mutar la prioridad de un objeto que ya está adentro no reordena automáticamente el heap y puede invalidar el comportamiento esperado."
          ]
        },
        {
          "title": "Traza, límites y costos",
          "paragraphs": [
            "Al insertar siete, tres, cinco y uno en un Min-Heap, el uno termina en la raíz y las extracciones producen uno, tres, cinco y siete. El arreglo interno no tiene por qué estar completamente ordenado antes de extraer. Consultar raíz cuesta Θ(1); insertar y extraer cuestan O(log n), sin contar una ampliación individual del almacenamiento. El ejemplo usa memoria Θ(n) y trabajo auxiliar constante durante los ajustes. Para un Max-Heap invertimos las comparaciones. En comparadores de enteros evitamos restar prioridades, porque la resta puede desbordar; Integer.compare expresa correctamente el orden."
          ],
          "code": "INSERTAR(x): agregar al final y subir\nEXTRAER: guardar raíz; mover último a raíz; hundir\nMINIMO: devolver raíz sin modificar el heap",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Raíz Θ(1); insertar/extraer O(log n)",
        "space": "Θ(n) almacenamiento",
        "explanation": "La forma completa mantiene altura logarítmica; reparar sigue un solo camino."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Insertar 7,3,5,1 puede dejar el arreglo [1,3,5,7]. Extraer uno mueve siete a raíz y elige al hijo tres para hundirlo, dejando [3,7,5]. Aunque siete aparezca antes que cinco en el arreglo, el heap sigue siendo válido.",
        "code": "class MinHeap {\n  private int[] a = new int[4]; private int size;\n  int size() { return size; }\n  void insertar(int x) {\n    if (size == a.length) a = java.util.Arrays.copyOf(a, a.length * 2);\n    int i = size++;\n    while (i > 0) {\n      int p = (i - 1) / 2;\n      if (a[p] <= x) break;\n      a[i] = a[p]; i = p;\n    }\n    a[i] = x;\n  }\n  int extraerMinimo() {\n    if (size == 0) throw new java.util.NoSuchElementException();\n    int minimo = a[0], x = a[--size], i = 0;\n    while (2 * i + 1 < size) {\n      int hijo = 2 * i + 1;\n      if (hijo + 1 < size && a[hijo + 1] < a[hijo]) hijo++;\n      if (x <= a[hijo]) break;\n      a[i] = a[hijo]; i = hijo;\n    }\n    if (size > 0) a[i] = x;\n    return minimo;\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Agregá peek y transformá la estructura en Max-Heap. Probá repetidos y verificá que extraer todos los elementos produce una secuencia monótona."
      },
      "takeaways": [
        "Un heap prioriza el extremo sin mantener todos los elementos en orden de búsqueda.",
        "La forma completa mantiene altura logarítmica; reparar sigue un solo camino.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ],
      "lab": "heap"
    },
    {
      "id": "m07-heapsort",
      "moduleId": 7,
      "title": "Construcción lineal y Heap Sort",
      "duration": 28,
      "summary": "Construir el heap desde abajo y reducir su prefijo permite ordenar con memoria auxiliar constante.",
      "objectives": [
        "Explicar construcción lineal y heap sort y sus condiciones de uso.",
        "Seguir una traza y justificar el resultado para casos límite.",
        "Relacionar la implementación Java con sus costos de tiempo y espacio."
      ],
      "prerequisites": [
        "Arreglos, referencias, métodos y ciclos de Java.",
        "Lectura de invariantes y notación asintótica."
      ],
      "sections": [
        {
          "title": "Construir sin insertar uno por uno",
          "paragraphs": [
            "Podemos formar un heap insertando cada elemento, obteniendo una cota O(n log n). Una construcción más eficiente repara desde el último padre hasta la raíz. Los índices desde n dividido dos hasta el final ya representan hojas y no necesitan reparación. Cuando hundimos un padre, sus subárboles hijos ya son heaps porque se procesaron antes. Este orden bottom-up hace que cada reparación tenga una precondición simple. La raíz se procesa al final, cuando ambos lados ya cumplen orden y solamente el valor del padre podría violarlo. El arreglo resultante tiene forma completa automáticamente por su representación."
          ]
        },
        {
          "title": "Por qué construir cuesta Θ(n)",
          "paragraphs": [
            "Multiplicar n nodos por la altura máxima logarítmica da una cota superior válida pero poco ajustada. La mitad aproximada de los nodos son hojas y no bajan; un cuarto puede bajar un nivel; un octavo, dos; y así sucesivamente. La suma de costos se acota por n multiplicado por una serie convergente de alturas divididas por potencias de dos. El resultado es O(n), y leer o considerar todos los elementos impone Ω(n), por lo que construir cuesta Θ(n). Este análisis depende de la distribución de alturas de un árbol completo, no de suposiciones aleatorias sobre las claves."
          ]
        },
        {
          "title": "Ordenar usando un Max-Heap",
          "paragraphs": [
            "Para obtener orden ascendente construimos un Max-Heap. Intercambiamos su raíz, que es el mayor, con la última posición del prefijo activo. Esa posición queda fijada en el sufijo ordenado y ya no participa del heap. Reducimos el tamaño activo y hundimos la nueva raíz. Repetimos hasta que quede un solo valor. Usar Min-Heap con el mismo procedimiento colocaría mínimos al final y produciría orden descendente. La función hundir recibe un límite exclusivo n para que nunca lea el sufijo que contiene valores definitivos ni intente volver a reorganizarlos."
          ]
        },
        {
          "title": "Invariante y terminación",
          "paragraphs": [
            "Antes de cada extracción, el prefijo activo es un Max-Heap y el sufijo está ordenado de menor a mayor. Además, toda clave del prefijo es menor o igual que cualquiera del sufijo. Llevar el máximo a su última posición disponible preserva esa separación y extiende el sufijo en una celda. Hundir restaura únicamente la propiedad del prefijo, que pudo romperse en la raíz. La variable fin disminuye en cada vuelta y no es negativa, de modo que el algoritmo termina. Al quedar un elemento, la separación entre prefijo y sufijo demuestra que todo el arreglo está ordenado."
          ]
        },
        {
          "title": "Estabilidad, memoria y elección",
          "paragraphs": [
            "Heap Sort realiza O(n log n) trabajo en el peor caso y usa Θ(1) memoria auxiliar en esta implementación iterativa. No es estable: las extracciones pueden cambiar el orden relativo de registros con claves iguales. Es in-place porque reusa el arreglo y solamente guarda unos índices y valores temporales. Frente a Merge Sort ahorra un búfer lineal, pero pierde estabilidad; frente a Quick Sort ofrece una garantía de peor caso sin depender de pivotes. Eso no asegura que sea más rápido en cada máquina: los saltos entre posiciones del heap pueden aprovechar peor la caché que recorridos secuenciales."
          ]
        },
        {
          "title": "Práctica integrada del módulo",
          "paragraphs": [
            "Ejecutá el código sobre vacío, un elemento, iguales, orden ascendente, descendente y extremos Integer.MIN_VALUE e Integer.MAX_VALUE. No compara mediante restas y por eso el orden de esos extremos sigue siendo correcto. Después verificá monotonía y preservación de frecuencias: comprobar solamente que aparece el mínimo y el máximo no detecta pérdidas internas. Como práctica principal, completá además el AVL con inserción, eliminación y recorridos, y registrá los casos LL, RR, LR y RL activados por cada secuencia. Contrastá ambas estructuras: el AVL mantiene orden de búsqueda; el heap solamente prioriza un extremo."
          ],
          "code": "HEAPSORT(a)\n  construir Max-Heap desde el último padre\n  para fin desde n-1 hasta 1\n    intercambiar raíz y a[fin]\n    hundir raíz en prefijo [0,fin)",
          "language": "text"
        }
      ],
      "complexity": {
        "time": "Construcción Θ(n); ordenar O(n log n)",
        "space": "Θ(1) auxiliar",
        "explanation": "Se extraen n máximos con reparaciones de hasta altura logarítmica."
      },
      "pitfalls": [
        "Omitir la precondición del procedimiento cambia las garantías demostradas.",
        "Comprobar únicamente entradas ordinarias deja sin cubrir vacío, mínimo y empates."
      ],
      "solved": {
        "title": "Implementación y caso resuelto",
        "explanation": "Para [4,1,3,2], construir el Max-Heap puede producir [4,2,3,1]. La primera extracción fija cuatro al final; reparar el prefijo deja tres como raíz. Tras las siguientes extracciones obtenemos [1,2,3,4]. Ningún elemento del sufijo vuelve al heap.",
        "code": "class HeapSort {\n  static void hundir(int[] a, int i, int n) {\n    int x = a[i];\n    while (i < n / 2) {\n      int h = 2 * i + 1;\n      if (h + 1 < n && a[h + 1] > a[h]) h++;\n      if (x >= a[h]) break;\n      a[i] = a[h]; i = h;\n    }\n    a[i] = x;\n  }\n  static void ordenar(int[] a) {\n    if (a == null) throw new IllegalArgumentException();\n    for (int i = a.length / 2 - 1; i >= 0; i--) hundir(a, i, a.length);\n    for (int fin = a.length - 1; fin > 0; fin--) {\n      int t = a[0]; a[0] = a[fin]; a[fin] = t;\n      hundir(a, 0, fin);\n    }\n  }\n}"
      },
      "practice": {
        "title": "Comprobación y transferencia",
        "prompt": "Implementá el AVL completo usando las primitivas y registrá rotaciones al insertar y eliminar. Para Heap Sort, contá comparaciones en tamaños crecientes y separá construcción de extracción."
      },
      "takeaways": [
        "Construir el heap desde abajo y reducir su prefijo permite ordenar con memoria auxiliar constante.",
        "Se extraen n máximos con reparaciones de hasta altura logarítmica.",
        "Una traza ayuda a descubrir errores; el argumento de correctitud cubre todas las entradas del contrato."
      ],
      "lab": "heap"
    }
  ],
  "exercises": [
    {
      "id": "m07-e01",
      "moduleId": 7,
      "title": "Reconocer LL",
      "kind": "prediction",
      "difficulty": "Inicial",
      "prompt": "¿Qué raíz queda tras insertar 30,20,10 en un AVL?",
      "input": "AVL vacío",
      "expected": "Una clave.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "20",
      "accepted": [],
      "hints": [
        "El exceso está en izquierda-izquierda.",
        "El nodo veinte es el pivote que sube y treinta se convierte en su hijo derecho."
      ],
      "solution": "20",
      "explanation": "Una rotación derecha conserva el inorden y deja veinte en la raíz.",
      "lessonId": "m07-avl"
    },
    {
      "id": "m07-e02",
      "moduleId": 7,
      "title": "Actualizar alturas",
      "kind": "debug",
      "difficulty": "Intermedio",
      "prompt": "En una rotación derecha, ¿qué nodo se actualiza primero: el que sube o el que baja?",
      "input": "x sube; y baja",
      "expected": "Escribí sube o baja.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "baja",
      "accepted": [
        "el que baja",
        "y"
      ],
      "hints": [
        "La nueva altura de x depende de la altura nueva de y.",
        "Actualizar primero el que sube reutilizaría la altura antigua de su nuevo hijo."
      ],
      "solution": "Actualizar primero y y después x.",
      "explanation": "El orden inverso usaría una altura antigua y puede inducir reparaciones incorrectas.",
      "lessonId": "m07-rotaciones"
    },
    {
      "id": "m07-e03",
      "moduleId": 7,
      "title": "Construcción bottom-up",
      "kind": "complexity",
      "difficulty": "Inicial",
      "prompt": "¿Cuál es la complejidad ajustada de construir un heap desde abajo?",
      "input": "n elementos",
      "expected": "Usá Θ u O.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "Θ(n)",
      "accepted": [
        "O(n)",
        "theta(n)",
        "lineal"
      ],
      "hints": [
        "La mayoría de los nodos está cerca de las hojas.",
        "Agrupá nodos por distancia a las hojas: aproximadamente la mitad no necesita bajar."
      ],
      "solution": "Θ(n)",
      "explanation": "La suma de costos por alturas forma una serie convergente multiplicada por n.",
      "lessonId": "m07-heapsort"
    },
    {
      "id": "m07-e04",
      "moduleId": 7,
      "title": "Extraer mínimos",
      "kind": "prediction",
      "difficulty": "Inicial",
      "prompt": "¿En qué orden salen al extraer todos de un Min-Heap con 7,1,5,1?",
      "input": "Cuatro extracciones",
      "expected": "Secuencia de valores.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "",
      "answer": "1,1,5,7",
      "accepted": [
        "[1,1,5,7]",
        "1 1 5 7"
      ],
      "hints": [
        "Los repetidos se almacenan también.",
        "Después de devolver un mínimo, la estructura debe reparar la raíz antes de la siguiente extracción."
      ],
      "solution": "[1,1,5,7]",
      "explanation": "Cada extracción devuelve el mínimo de los valores restantes.",
      "lessonId": "m07-heaps"
    },
    {
      "id": "m07-e05",
      "moduleId": 7,
      "title": "AVL verificable",
      "kind": "implementation",
      "difficulty": "Intermedio",
      "prompt": "Implementá insertar y eliminar con alturas y rotaciones. La actividad no compila ni ejecuta código; contrastá manualmente tus invariantes.",
      "input": "30,10,20,40; borrar 30; borrar ausente 99",
      "expected": "Inorden 10,20,40 y factores válidos.",
      "constraints": [
        "Respetá el contrato y justificá los casos límite."
      ],
      "starter": "Nodo insertar(Nodo raiz, int clave) { /* completar */ }",
      "answer": "",
      "accepted": [],
      "hints": [
        "Cada llamada devuelve la nueva raíz.",
        "En eliminación hay que continuar reparando ancestros."
      ],
      "solution": "Usar las primitivas de AVL, insertar por orden, eliminar como ABB y equilibrar al regresar. Comprobar alturas reales, límites de claves e inorden.",
      "explanation": "Orden y balance son obligaciones separadas. Probar las cuatro rotaciones y borrar hasta vacío cubre cambios estructurales distintos.",
      "lessonId": "m07-eliminacion-rojo-negro"
    }
  ],
  "questions": [
    {
      "id": "m07-q01",
      "moduleId": 7,
      "type": "choice",
      "prompt": "¿Qué no garantiza por sí solo un ABB?",
      "options": [
        "Altura logarítmica.",
        "Orden inorden.",
        "Que las claves menores estén a la izquierda."
      ],
      "answer": 0,
      "explanation": "Una inserción creciente puede formar una cadena.",
      "lessonId": "m07-avl"
    },
    {
      "id": "m07-q02",
      "moduleId": 7,
      "type": "truefalse",
      "prompt": "Con altura(null)=0, una hoja tiene altura uno.",
      "options": [
        "Verdadero",
        "Falso"
      ],
      "answer": 0,
      "explanation": "La altura es uno más el máximo de alturas de hijos.",
      "lessonId": "m07-avl"
    },
    {
      "id": "m07-q03",
      "moduleId": 7,
      "type": "prediction",
      "prompt": "30,10,20 activa el caso:",
      "options": [
        "LR",
        "LL",
        "RR"
      ],
      "answer": 0,
      "explanation": "El exceso baja primero a izquierda y luego a derecha.",
      "lessonId": "m07-rotaciones"
    },
    {
      "id": "m07-q04",
      "moduleId": 7,
      "type": "order",
      "prompt": "Reparación de LR:",
      "options": [
        "Izquierda en hijo → derecha en raíz",
        "Derecha en hijo → izquierda en raíz",
        "Dos izquierdas en raíz"
      ],
      "answer": 0,
      "explanation": "La primera operación transforma el caso interior en exterior.",
      "lessonId": "m07-rotaciones"
    },
    {
      "id": "m07-q05",
      "moduleId": 7,
      "type": "complexity",
      "prompt": "Una rotación AVL simple cuesta:",
      "options": [
        "Θ(1)",
        "Θ(n)",
        "Θ(log n)"
      ],
      "answer": 0,
      "explanation": "Se cambian enlaces y alturas de pocos nodos.",
      "lessonId": "m07-rotaciones"
    },
    {
      "id": "m07-q06",
      "moduleId": 7,
      "type": "choice",
      "prompt": "Tras eliminar en AVL, ¿hasta dónde se revisan ancestros?",
      "options": [
        "Hasta la raíz, si corresponde.",
        "Solo el primer ancestro.",
        "Nunca se revisan."
      ],
      "answer": 0,
      "explanation": "La reducción de altura puede propagarse.",
      "lessonId": "m07-eliminacion-rojo-negro"
    },
    {
      "id": "m07-q07",
      "moduleId": 7,
      "type": "truefalse",
      "prompt": "Un rojo-negro exige factor AVL en cada nodo.",
      "options": [
        "Falso",
        "Verdadero"
      ],
      "answer": 0,
      "explanation": "Usa colores y altura negra, con reglas distintas.",
      "lessonId": "m07-eliminacion-rojo-negro"
    },
    {
      "id": "m07-q08",
      "moduleId": 7,
      "type": "prediction",
      "prompt": "En un heap desde índice cero, el hijo izquierdo de i=3 está en:",
      "options": [
        "7",
        "6",
        "8"
      ],
      "answer": 0,
      "explanation": "En el arreglo con raíz en cero, cada padre i ocupa hijos 2i+1 y 2i+2; para i=3, el izquierdo está en el índice siete.",
      "lessonId": "m07-heaps"
    },
    {
      "id": "m07-q09",
      "moduleId": 7,
      "type": "complexity",
      "prompt": "Buscar una clave arbitraria en un heap puede costar:",
      "options": [
        "O(n)",
        "O(1)",
        "O(log n) garantizado"
      ],
      "answer": 0,
      "explanation": "El orden es entre padres e hijos, no entre subárboles por intervalos.",
      "lessonId": "m07-heaps"
    },
    {
      "id": "m07-q10",
      "moduleId": 7,
      "type": "order",
      "prompt": "Una vuelta de Heap Sort ascendente:",
      "options": [
        "Intercambiar máximo con fin → reducir prefijo → hundir raíz",
        "Hundir sufijo → borrar máximo",
        "Ordenar hermanos → duplicar raíz"
      ],
      "answer": 0,
      "explanation": "El máximo queda definitivo y solo se repara el prefijo activo.",
      "lessonId": "m07-heapsort"
    }
  ],
  "glossary": [
    {
      "term": "Factor de balance",
      "definition": "Altura izquierda menos altura derecha bajo la convención de este módulo.",
      "lessonId": "m07-avl"
    },
    {
      "term": "Rotación",
      "definition": "Cambio local de enlaces que conserva el recorrido inorden.",
      "lessonId": "m07-rotaciones"
    },
    {
      "term": "Altura negra",
      "definition": "Cantidad común de nodos negros en caminos hacia hojas externas de un rojo-negro.",
      "lessonId": "m07-eliminacion-rojo-negro"
    },
    {
      "term": "Heap completo",
      "definition": "Árbol con niveles completos salvo quizá el último, ocupado desde la izquierda.",
      "lessonId": "m07-heaps"
    },
    {
      "term": "Cola de prioridad",
      "definition": "TAD que extrae un extremo según prioridad en vez de orden de llegada.",
      "lessonId": "m07-heaps"
    },
    {
      "term": "Heapify bottom-up",
      "definition": "Construcción de heap hundiendo padres desde el último hacia la raíz.",
      "lessonId": "m07-heapsort"
    }
  ]
};
