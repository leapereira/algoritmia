import type { ModuleContent } from './types.js';

export const module05: ModuleContent = {
  moduleId: 5,
  lessons: [
    {
      id: 'm05-pilas', moduleId: 5, title: 'TAD y pilas: un contrato LIFO', duration: 26,
      summary: 'Separá comportamiento e implementación y construí una pila con operaciones y errores explícitos.',
      objectives: ['Especificar un tipo abstracto de dato.', 'Mantener la disciplina LIFO.', 'Comparar arreglos y nodos para una pila.'], prerequisites: ['Referencias, arreglos y listas enlazadas.', 'Complejidad amortizada.'],
      sections: [
        { title: 'El comportamiento antes de la representación', paragraphs: [
          'Un tipo abstracto de dato, o TAD, especifica valores y operaciones observables sin imponer cómo se guardan internamente. La pila representa una secuencia cuyo extremo accesible llamamos cima. Apilar agrega en ese extremo; desapilar retira el elemento más recientemente agregado que todavía no fue retirado. Esta disciplina se llama LIFO: último en entrar, primero en salir.',
          'El contrato distingue push, pop, peek y una consulta de vacío. pop devuelve y elimina la cima; peek la devuelve sin eliminarla. Debemos decidir qué ocurre al consultar una pila vacía. En los ejemplos lanzaremos NoSuchElementException. Devolver un entero especial sería ambiguo: cualquier int puede ser un dato válido. Una capacidad máxima, si existe, también forma parte del contrato de esa implementación.',
        ] },
        { title: 'Representar la cima con un arreglo', paragraphs: [
          'Una pila de capacidad fija usa un arreglo y una cantidad utilizada. La invariante es 0 ≤ cantidad ≤ capacidad; los elementos de la pila ocupan el prefijo [0, cantidad), y la cima está en cantidad − 1 si no está vacía. Apilar escribe en cantidad y después incrementa. Desapilar decrementa y lee la posición que acaba de quedar fuera del prefijo.',
          'El acceso a una posición es constante. Si el arreglo es fijo, las operaciones permitidas tienen costo de peor caso constante; una pila llena rechaza el agregado. Si la capacidad se duplica automáticamente, un agregado puede copiar todos los elementos, aunque el costo amortizado siga siendo constante. La distinción entre TAD y representación permite cambiar esta decisión sin cambiar el orden LIFO.',
        ] },
        { title: 'Representar la cima con nodos', paragraphs: [
          'Una lista simplemente enlazada puede guardar la cima en su cabeza. Apilar crea un nodo cuyo siguiente es la cabeza anterior; desapilar avanza la cabeza al siguiente nodo. No hace falta recorrer la lista ni guardar un enlace al final, porque todas las operaciones ocurren en el mismo extremo. Bajo el modelo usual, cada modificación usa tiempo constante.',
          'Cada nodo agrega memoria para una referencia, además del dato y el costo del objeto. El arreglo suele aprovechar mejor la localidad; los nodos permiten crecer sin copiar el contenido completo. En Java, retirar el enlace a un nodo permite que sea recolectado cuando ninguna otra referencia lo mantiene accesible. Con objetos en un arreglo, conviene poner null en la posición retirada para no retenerlos innecesariamente.',
        ] },
        { title: 'Elegir una pila por el orden que necesitamos', paragraphs: [
          'La pila aparece en deshacer acciones, en llamados de métodos y en procedimientos que necesitan volver sobre decisiones recientes. Su valor no consiste en almacenar cualquier secuencia, sino en imponer un orden que hace natural el algoritmo. Si necesitamos retirar el elemento más antiguo, estamos pidiendo una cola y debemos cambiar el TAD.',
          'En la biblioteca de Java podemos expresar una pila mediante Deque y ArrayDeque. Es conveniente programar contra la interfaz cuando sus operaciones representan el contrato requerido. Una implementación genérica añade decisiones sobre nulos y referencias, pero no cambia el principio LIFO. Los ejemplos con int aíslan el mecanismo antes de introducir esos detalles.',
          'Para verificar una pila no alcanza con apilar y desapilar un elemento. Probá varias inserciones, consultas de cima sin extracción, vaciado completo y operaciones sobre vacío. Una secuencia push(4), push(9), pop(), push(2), pop(), pop() debe devolver 9, 2 y 4. Ese comportamiento observable debe coincidir tanto con arreglos como con nodos.',
        ] },
      ],
      complexity: { time: 'Θ(1) por operación en la pila fija', space: 'Θ(c) reservado', explanation: 'c es la capacidad elegida. Una pila enlazada usa Θ(k) para k elementos. La variante dinámica por duplicación tiene push amortizado Θ(1), con expansiones individuales lineales.' },
      pitfalls: ['Confundir peek con pop.', 'Leer cantidad en vez de cantidad − 1 como cima.', 'Prometer crecimiento ilimitado en una implementación de capacidad fija.'],
      solved: { title: 'Pila fija con contrato de errores', explanation: 'La cantidad marca la primera posición libre. Capacidad cero es válida como estructura siempre llena; ninguna operación accede al arreglo sin revisar antes el estado.', code: `static final class Pila {
    private final int[] datos;
    private int cantidad;
    Pila(int capacidad) {
        if (capacidad < 0) throw new IllegalArgumentException("Capacidad negativa");
        datos = new int[capacidad];
    }
    boolean vacia() { return cantidad == 0; }
    void push(int valor) {
        if (cantidad == datos.length) throw new IllegalStateException("Pila llena");
        datos[cantidad++] = valor;
    }
    int peek() {
        if (vacia()) throw new java.util.NoSuchElementException();
        return datos[cantidad - 1];
    }
    int pop() {
        if (vacia()) throw new java.util.NoSuchElementException();
        return datos[--cantidad];
    }
}` },
      practice: { title: 'Una pila con nodos', prompt: 'Implementá el mismo contrato usando nodos enlazados desde la cima. Incluí push, pop, peek, vacia y cantidad. No recorras la estructura para ninguna de esas operaciones. Demostrá que la secuencia del ejemplo devuelve lo mismo y compará memoria con una capacidad fija muy superior a la cantidad utilizada.' },
      takeaways: ['El TAD define comportamiento; la estructura define su representación.', 'LIFO retira primero lo agregado más recientemente.', 'Una pila vacía y una pila llena requieren decisiones explícitas.'], lab: 'stack',
    },
    {
      id: 'm05-colas', moduleId: 5, title: 'Colas FIFO y arreglos circulares', duration: 27,
      summary: 'Implementá una cola sin desplazar elementos y distinguí posiciones físicas del orden lógico.',
      objectives: ['Mantener orden FIFO.', 'Interpretar índices circulares y cantidad.', 'Comparar cola circular y cola enlazada.'], prerequisites: ['TAD y arreglos.', 'Referencias y nodos.'],
      sections: [
        { title: 'Atender en orden de llegada', paragraphs: [
          'Una cola retira primero el elemento que lleva más tiempo esperando: FIFO, primero en entrar, primero en salir. Agregar ocurre al final y retirar ocurre al frente. Una consulta de frente no elimina. La disciplina sirve para tareas pendientes, recorridos por niveles y procesamiento de solicitudes cuando queremos conservar el orden de llegada.',
          'No necesitamos mantener físicamente el primer elemento en la posición cero. Si después de cada retiro desplazamos todos los demás, cada operación puede costar tiempo lineal. Una representación más adecuada conserva un índice que señala el frente y reutiliza las posiciones que quedan libres. El orden lógico de la cola y el orden de índices del arreglo dejan de coincidir necesariamente.',
        ] },
        { title: 'Dar la vuelta al final del arreglo', paragraphs: [
          'Una cola circular de capacidad c almacena frente, fin y cantidad. frente indica la próxima posición a retirar; fin, la próxima a escribir. Después de usar una posición avanzamos con (índice + 1) módulo c. Con c = 4, la secuencia física es 0, 1, 2, 3, 0, 1… No estamos moviendo los datos al dar la vuelta.',
          'La invariante exige 0 ≤ cantidad ≤ c y ambos índices dentro del arreglo. Los elementos lógicos están en las posiciones (frente + k) módulo c para 0 ≤ k < cantidad. Usar una cantidad explícita permite distinguir vacío de lleno aunque frente y fin sean iguales en ambos casos. Otra convención reserva una casilla libre, pero no debe mezclarse con esta.',
        ] },
        { title: 'Ejecutar una vuelta completa', paragraphs: [
          'Con capacidad 3, agregar 10, 20 y 30 deja fin nuevamente en cero y cantidad en tres. Retirar devuelve 10 y avanza frente a uno. Ahora agregar 40 utiliza la posición cero que quedó libre. El orden de salida siguiente es 20, 30, 40, aunque el arreglo físico pueda verse como [40, 20, 30].',
          'Antes de escribir verificamos si la cola está llena; antes de leer verificamos si está vacía. Exigimos capacidad positiva para evitar módulo cero. Las consultas de frente y de cantidad no deben cambiar los índices. Una traza que registre los tres campos después de cada operación ayuda a descubrir errores de vuelta y de estados extremos.',
        ] },
        { title: 'La alternativa de nodos y las garantías', paragraphs: [
          'Una cola simplemente enlazada mantiene referencias al primer y al último nodo. Encolar enlaza desde el último y actualiza el final; desencolar avanza el primero. Cuando retiramos el único elemento debemos dejar también el último en null. Ese caso conecta la invariante de vacío con ambos extremos y suele ser origen de referencias obsoletas.',
          'Con ambas referencias, cada operación enlazada tiene costo constante bajo el modelo de asignación usual. Sin referencia al último, agregar al final exigiría recorrer la lista. La cola circular fija evita asignaciones por elemento, mientras que los nodos agregan flexibilidad de crecimiento y sobrecosto de referencias. Una circular dinámica debe copiar en orden lógico al expandirse, no copiar ciegamente el arreglo y conservar índices incompatibles.',
          'La memoria física disponible sigue siendo finita aunque una API no exponga capacidad. Al elegir entre rechazar, bloquear o ampliar una cola llena estamos definiendo políticas distintas. Aquí rechazamos con una excepción: no hay concurrencia ni espera. El algoritmo FIFO no implica por sí mismo seguridad entre hilos.',
        ] },
      ],
      complexity: { time: 'Θ(1) por operación', space: 'Θ(c)', explanation: 'La cola circular fija reutiliza posiciones con actualizaciones constantes. La capacidad c se reserva al construirla y no se realizan desplazamientos.' },
      pitfalls: ['Usar frente == fin como único criterio de vacío y lleno.', 'Desplazar todo el arreglo después de cada extracción.', 'Olvidar reiniciar el último nodo al vaciar una cola enlazada.'],
      solved: { title: 'Cola circular de capacidad fija', explanation: 'Los índices avanzan de forma independiente y la cantidad distingue los estados. El valor de una casilla retirada puede quedar en el arreglo de int: el contrato solo considera las posiciones lógicas ocupadas.', code: `static final class ColaCircular {
    private final int[] datos;
    private int frente, fin, cantidad;
    ColaCircular(int capacidad) {
        if (capacidad <= 0) throw new IllegalArgumentException("Capacidad no positiva");
        datos = new int[capacidad];
    }
    int cantidad() { return cantidad; }
    void encolar(int valor) {
        if (cantidad == datos.length) throw new IllegalStateException("Cola llena");
        datos[fin] = valor;
        fin = (fin + 1) % datos.length;
        cantidad++;
    }
    int desencolar() {
        if (cantidad == 0) throw new java.util.NoSuchElementException();
        int valor = datos[frente];
        frente = (frente + 1) % datos.length;
        cantidad--;
        return valor;
    }
}` },
      practice: { title: 'Cola enlazada sin recorridos', prompt: 'Construí una cola con nodos y referencias frente y ultimo. Implementá agregar, retirar, consultar y cantidad. Probá agregar uno, retirarlo y volver a agregar: ambos extremos deben recuperarse correctamente. Después diseñá cómo copiarías una cola circular llena a una capacidad doble conservando el orden FIFO.' },
      takeaways: ['FIFO separa el extremo de entrada del de salida.', 'Los índices circulares reutilizan casillas sin mover el resto.', 'Una cantidad explícita elimina la ambigüedad entre vacío y lleno.'], lab: 'queue',
    },
    {
      id: 'm05-deques', moduleId: 5, title: 'Deque: dos extremos, varias disciplinas', duration: 25,
      summary: 'Construí una cola de doble extremo y usala como una pila, una cola o una herramienta para comparar extremos.',
      objectives: ['Especificar las cuatro operaciones de un deque.', 'Mantener enlaces bidireccionales y extremos.', 'Seleccionar operaciones de Deque en Java según el contrato.'], prerequisites: ['Pilas, colas y listas dobles.'],
      sections: [
        { title: 'Generalizar sin perder el contrato', paragraphs: [
          'Un deque, o cola de doble extremo, permite agregar y retirar tanto al principio como al final. No es una cola de prioridad: no selecciona por valor ni mantiene los elementos ordenados. Su contrato incluye agregarPrimero, agregarUltimo, retirarPrimero, retirarUltimo y consultas equivalentes sin extracción.',
          'Podemos obtener una pila agregando y retirando siempre del mismo extremo. Podemos obtener una cola agregando al final y retirando al principio. La estructura ofrece más operaciones, pero el algoritmo decide qué disciplina sigue. Mezclar extremos accidentalmente cambia el orden observable aunque ninguna operación individual produzca una excepción.',
        ] },
        { title: 'Enlaces en ambas direcciones', paragraphs: [
          'Para implementar los cuatro extremos en tiempo constante con nodos, una lista doble mantiene anterior y siguiente en cada nodo, además de primero y ultimo. Una lista simple permite retirar el primero fácilmente, pero retirar el último requiere encontrar su anterior mediante un recorrido. La referencia ultimo no resuelve por sí sola ese problema.',
          'La invariante exige que primero.anterior y ultimo.siguiente sean null si hay elementos; para cada enlace siguiente debe existir el enlace anterior inverso. En vacío, ambos extremos son null y cantidad es cero. Al agregar el primer nodo, este ocupa ambos extremos. Al retirar el último, ambos vuelven a null. Esos casos no son detalles opcionales: conectan representaciones de tamaños distintos.',
        ] },
        { title: 'Elegir una representación o una biblioteca', paragraphs: [
          'También podemos usar un arreglo circular con espacio libre a ambos lados lógicos. Agregar primero retrocede el índice inicial con cuidado de no producir un resto negativo; agregar último usa el siguiente hueco final. Si la capacidad crece geométricamente, las operaciones tienen costo amortizado constante, pero una expansión individual copia una cantidad lineal.',
          'La interfaz java.util.Deque ofrece familias de métodos con políticas diferentes. removeFirst y getFirst lanzan una excepción en vacío; pollFirst y peekFirst devuelven null. Por eso implementaciones como ArrayDeque no admiten elementos nulos: null funciona como señal de ausencia en esas operaciones. Elegir una familia coherente vuelve explícito cómo manejamos un extremo vacío.',
        ] },
        { title: 'Una aplicación que necesita los dos extremos', paragraphs: [
          'Para comprobar si una secuencia es palíndroma, podemos comparar y retirar su primer y último elemento repetidamente. Si difieren, rechazamos; si quedan cero o uno, aceptamos. El deque hace visibles las dos fronteras pendientes. Para un arreglo o String con acceso indexado, dos índices pueden resolver lo mismo sin construir otra estructura; el TAD no debe ocultar un costo de preparación innecesario.',
          'Un deque también aparece en algoritmos de ventanas deslizantes, donde algunos elementos dejan de ser candidatos por el frente y otros por el final. Ese uso exige una invariante adicional, no se obtiene solamente por elegir la colección. Aquí nos concentramos en que las operaciones estructurales preserven el orden y los enlaces.',
          'Para verificar la implementación, alterná agregados y retiros en ambos extremos y compará la secuencia lógica con una lista de referencia. Probá especialmente tamaños cero, uno y dos. Una estructura puede parecer correcta en recorridos hacia adelante y tener enlaces anteriores rotos; revisar ambos sentidos permite detectar esa asimetría. Mantener los nodos privados impide que el llamador modifique enlaces sin actualizar el resto de la estructura. La encapsulación protege precisamente las invariantes que justifican las operaciones y sus costos.',
        ] },
      ],
      complexity: { time: 'Θ(1) por modificación de extremo', space: 'Θ(k)', explanation: 'La versión doblemente enlazada guarda dos referencias por nodo y k elementos. Los recorridos completos siguen costando Θ(k); la garantía constante se refiere a los extremos.' },
      pitfalls: ['Creer que un deque ordena por prioridad.', 'Usar una lista simple y prometer retirar el último en Θ(1).', 'Actualizar el siguiente sin mantener su anterior inverso.'],
      solved: { title: 'Deque de nodos con los cuatro extremos', explanation: 'Cada operación trata explícitamente la transición entre vacío y un elemento. Los enlaces descartados quedan fuera de la estructura accesible por sus extremos.', code: `static final class DequeNodos {
    private static final class Nodo {
        int valor; Nodo anterior, siguiente;
        Nodo(int valor) { this.valor = valor; }
    }
    private Nodo primero, ultimo;
    void agregarPrimero(int valor) {
        Nodo n = new Nodo(valor); n.siguiente = primero;
        if (primero == null) ultimo = n; else primero.anterior = n;
        primero = n;
    }
    void agregarUltimo(int valor) {
        Nodo n = new Nodo(valor); n.anterior = ultimo;
        if (ultimo == null) primero = n; else ultimo.siguiente = n;
        ultimo = n;
    }
    int retirarPrimero() {
        if (primero == null) throw new java.util.NoSuchElementException();
        int valor = primero.valor; primero = primero.siguiente;
        if (primero == null) ultimo = null; else primero.anterior = null;
        return valor;
    }
    int retirarUltimo() {
        if (ultimo == null) throw new java.util.NoSuchElementException();
        int valor = ultimo.valor; ultimo = ultimo.anterior;
        if (ultimo == null) primero = null; else ultimo.siguiente = null;
        return valor;
    }
}` },
      practice: { title: 'Palíndromo con contrato preciso', prompt: 'Usá Deque<Character> para decidir si una cadena es palíndroma. Definí si distinguís mayúsculas, espacios y signos; primero resolvé una versión literal sobre unidades char. Probá vacío, una letra y abba. Compará el espacio con una solución de dos índices y explicá por qué char no representa siempre un carácter Unicode completo.' },
      takeaways: ['El deque permite ambos extremos sin imponer prioridad.', 'Enlaces dobles permiten retirar el último sin recorrer.', 'La preparación de una estructura también forma parte del costo del algoritmo.'], lab: 'queue',
    },
    {
      id: 'm05-notaciones', moduleId: 5, title: 'Infija, prefija y postfija', duration: 30,
      summary: 'Interpretá expresiones sin ambigüedad y convertí notación infija a postfija mediante una pila de operadores.',
      objectives: ['Distinguir las tres posiciones de un operador.', 'Aplicar precedencia y asociatividad.', 'Convertir una expresión tokenizada a postfija.'], prerequisites: ['Pilas y expresiones aritméticas binarias.'],
      sections: [
        { title: 'El mismo árbol puede escribirse de tres maneras', paragraphs: [
          'La expresión infija (8 − 3) × 2 coloca cada operador entre sus operandos. La prefija escribe × − 8 3 2, y la postfija escribe 8 3 − 2 ×. Las tres describen la misma estructura: restar primero y multiplicar después. Prefija y postfija no necesitan paréntesis si conocemos la cantidad de operandos de cada operador.',
          'En infija necesitamos reglas de precedencia: multiplicación y división se agrupan antes que suma y resta. También necesitamos asociatividad: las cuatro operaciones de este módulo se interpretan de izquierda a derecha cuando tienen igual precedencia. Por eso 8 − 3 − 2 significa (8 − 3) − 2, y no 8 − (3 − 2). Los paréntesis pueden imponer otra agrupación.',
        ] },
        { title: 'Tokens y gramática antes del algoritmo', paragraphs: [
          'Un token es una unidad significativa: un número completo, un operador o un paréntesis. No podemos recorrer solamente caracteres si queremos admitir 123. En el conversor resuelto recibimos String[] ya tokenizado, con enteros no negativos, operadores binarios +, −, *, / y paréntesis. La extracción de tokens desde texto es una tarea separada.',
          'Excluimos el menos unario y la multiplicación implícita: −3 y 2(4+1) necesitarían reglas adicionales. Un indicador esperaOperando permite rechazar secuencias como 2 3, + 4 y 4 +. Un número o un paréntesis de apertura debe aparecer donde esperamos un operando; un operador binario debe seguir a una expresión completa. Validar solamente el balance de paréntesis no garantiza una expresión bien formada.',
        ] },
        { title: 'Una pila posterga operadores', paragraphs: [
          'Al leer un número lo enviamos directamente a la salida. Al leer un operador, sacamos hacia la salida los operadores de la pila cuya precedencia sea mayor o igual, y luego apilamos el nuevo. Esa comparación con igualdad implementa la asociatividad izquierda. Un paréntesis de apertura actúa como barrera: no lo emitimos.',
          'Al cerrar paréntesis, emitimos operadores hasta encontrar la apertura correspondiente y la descartamos. Al terminar, vaciamos los operadores restantes; una apertura sobrante significa error. Para 8 − 3 * 2, la multiplicación queda encima de la resta y sale primero: 8 3 2 * −. Cada token se lee una vez y cada operador entra y sale de la pila una vez.',
        ], code: 'PARA cada token\n  número: emitir\n  apertura: apilar\n  operador: emitir operadores pendientes de precedencia mayor o igual; apilar\n  cierre: emitir hasta apertura y descartar apertura\nAL FINAL emitir operadores restantes; rechazar paréntesis pendientes', language: 'text' },
        { title: 'La estructura explica el orden', paragraphs: [
          'La pila guarda operaciones cuya posición en la salida todavía depende de lo que viene. Su cima es la última operación pendiente dentro del paréntesis actual. Emitir un operador antes de que sus operandos hayan sido emitidos rompería la propiedad que permite evaluar postfija sin buscar hacia atrás.',
          'La notación prefija se puede evaluar recorriendo de derecha a izquierda y usando una pila de valores. Para un operador binario, el primer valor extraído es su operando izquierdo y el segundo su derecho. En postfija, recorriendo de izquierda a derecha, la extracción tiene el orden inverso. En suma y producto el error puede pasar inadvertido; resta y división lo revelan.',
          'La conversión no evalúa todavía los números. Incluso puede trabajar con identificadores simbólicos si el contrato y la tokenización los admiten. Separar análisis de notación, conversión y evaluación permite verificar cada etapa y distinguir un error sintáctico de uno aritmético como dividir por cero.',
        ] },
      ],
      complexity: { time: 'Θ(L)', space: 'Θ(t) referencias', explanation: 't es el número de tokens y L su longitud total. Cada operador se apila y desapila como máximo una vez, pero reconocer números también lee sus caracteres. Con tokens de tamaño acotado, el tiempo se expresa como Θ(t).' },
      pitfalls: ['Emitir paréntesis en postfija.', 'Usar solo precedencia mayor y cambiar la asociatividad de resta y división.', 'Confundir token numérico con un único carácter.'],
      solved: { title: 'Conversor infija → postfija tokenizado', explanation: 'La gramática admite solo operadores binarios y números enteros no negativos. El método devuelve tokens y rechaza operandos adyacentes, operadores sin operandos y paréntesis no balanceados.', code: `static java.util.List<String> aPostfija(String[] tokens) {
    if (tokens == null) throw new IllegalArgumentException("Tokens nulos");
    java.util.List<String> salida = new java.util.ArrayList<>();
    java.util.Deque<String> operadores = new java.util.ArrayDeque<>();
    boolean esperaOperando = true;
    for (String t : tokens) {
        if (t == null) throw new IllegalArgumentException("Token nulo");
        if (t.matches("[0-9]+")) {
            if (!esperaOperando) throw new IllegalArgumentException("Falta operador");
            salida.add(t); esperaOperando = false;
        } else if (t.equals("(")) {
            if (!esperaOperando) throw new IllegalArgumentException("Falta operador");
            operadores.push(t);
        } else if (t.equals(")")) {
            if (esperaOperando) throw new IllegalArgumentException("Falta operando");
            while (!operadores.isEmpty() && !operadores.peek().equals("(")) salida.add(operadores.pop());
            if (operadores.isEmpty()) throw new IllegalArgumentException("Cierre sin apertura");
            operadores.pop();
        } else if (precedencia(t) > 0) {
            if (esperaOperando) throw new IllegalArgumentException("Falta operando");
            while (!operadores.isEmpty() && precedencia(operadores.peek()) >= precedencia(t)) salida.add(operadores.pop());
            operadores.push(t); esperaOperando = true;
        } else throw new IllegalArgumentException("Token inválido");
    }
    if (esperaOperando) throw new IllegalArgumentException("Expresión incompleta");
    while (!operadores.isEmpty()) {
        String t = operadores.pop();
        if (t.equals("(")) throw new IllegalArgumentException("Apertura sin cierre");
        salida.add(t);
    }
    return salida;
}
private static int precedencia(String t) {
    if (t.equals("+") || t.equals("-")) return 1;
    if (t.equals("*") || t.equals("/")) return 2;
    return 0;
}` },
      practice: { title: 'El orden cambia el resultado', prompt: 'Convertí a postfija y prefija las expresiones 10 − 4 − 2 y 10 − (4 − 2). Dibujá el árbol de operadores de cada una, trazá la pila del conversor y evaluá los resultados. Agregá pruebas de rechazo para 2 3, (), 4 + y 2 ( 3 ).' },
      takeaways: ['Precedencia y asociatividad resuelven ambigüedades de infija.', 'La pila mantiene operadores que todavía no deben emitirse.', 'Tokenizar, convertir y evaluar son responsabilidades diferentes.'], lab: 'stack',
    },
    {
      id: 'm05-expresiones', moduleId: 5, title: 'Validar paréntesis y evaluar expresiones', duration: 30,
      summary: 'Usá invariantes de pila para comprobar anidamiento y evaluar postfija sin perder el orden de los operandos.',
      objectives: ['Validar delimitadores anidados por tipo y orden.', 'Evaluar operadores binarios sobre una pila.', 'Rechazar expresiones mal formadas y errores aritméticos.'], prerequisites: ['Pilas y las tres notaciones de expresiones.'],
      sections: [
        { title: 'Contar aperturas no alcanza', paragraphs: [
          'Para un solo tipo de paréntesis podemos llevar un balance, siempre que ningún prefijo tenga más cierres que aperturas y el balance final sea cero. Si aparecen (), [] y {}, necesitamos recordar además el orden de apertura. La cadena ([)] tiene la misma cantidad de aperturas y cierres por tipo, pero su anidamiento es incorrecto.',
          'Apilamos cada apertura. Ante un cierre, la pila debe tener una apertura del tipo correspondiente en su cima; la retiramos. Si está vacía o el tipo no coincide, rechazamos inmediatamente. Al terminar, aceptamos solo si la pila está vacía. Los caracteres que no son delimitadores pueden ignorarse, pero ese comportamiento debe figurar en el contrato del validador.',
        ] },
        { title: 'La invariante explica la validación', paragraphs: [
          'Después de procesar un prefijo válido, la pila contiene exactamente sus aperturas todavía no cerradas, con la más reciente en la cima. Una apertura nueva extiende ese historial. Un cierre correcto elimina la última apertura pendiente. Un cierre incompatible no puede repararse leyendo más caracteres, porque ya contradice el orden de anidamiento.',
          'La terminación se obtiene porque cada paso consume un carácter de una cadena finita. La pila puede llegar a almacenar todos los caracteres cuando son aperturas, por lo que el peor espacio es lineal. La cadena vacía es válida para este contrato. Validar delimitadores no detecta errores como 3 + * 2: esa cadena puede estar balanceada y aun así no ser una expresión aritmética.',
        ] },
        { title: 'Evaluar postfija mantiene resultados parciales', paragraphs: [
          'En postfija apilamos números. Para un operador binario necesitamos al menos dos valores; retiramos primero el derecho y después el izquierdo, calculamos y apilamos el resultado. En 8 3 − 2 *, la pila pasa por [8], [8,3], [5], [5,2] y [10], escribiendo aquí la base a la izquierda. La pila de Java usa push para su cima, independientemente de cómo dibujemos la traza.',
          'La invariante dice que la pila contiene resultados de subexpresiones completas todavía pendientes de combinar. Un operador reduce dos resultados a uno. Al terminar debe quedar exactamente uno: cero significa expresión vacía y varios indican operandos sin combinar. Tener una pila no vuelve válida cualquier secuencia de tokens; hay que comprobar esas condiciones.',
        ] },
        { title: 'Errores de sintaxis y de aritmética', paragraphs: [
          'El evaluador admite números con signo ya tokenizados, por ejemplo −3 como un único token. El símbolo − aislado sigue siendo un operador binario. Usamos long y operaciones exactas para detectar desbordamiento en suma, resta y producto. La división entera de Java trunca hacia cero; no representa fracciones, y dividir por cero debe rechazarse.',
          'La división Long.MIN_VALUE / −1 necesita una comprobación adicional porque su resultado matemático no cabe en long. Elegir el tipo numérico y su política de error es parte del contrato, no una cuestión separada del algoritmo. Si quisiéramos racionales o decimales exactos, necesitaríamos otra representación y otro modelo de costo.',
          'El recorrido usa una cantidad lineal de operaciones de pila. Si analizamos caracteres, parsear un token largo también cuesta según su longitud; por eso la cota más precisa para el texto incluye todos sus caracteres. Combinar el conversor anterior con este evaluador permite procesar infija, conservando errores separados entre las dos etapas.',
        ] },
      ],
      complexity: { time: 'O(L)', space: 'O(t)', explanation: 'L es la cantidad total de caracteres de los tokens y t su cantidad. Las operaciones aritméticas sobre long tienen tamaño fijo; cada token participa en una cantidad constante de operaciones de pila.' },
      pitfalls: ['Aceptar ([)] usando solo contadores.', 'Invertir los operandos de resta o división al extraer de la pila.', 'Aceptar una pila final de dos valores como resultado válido.'],
      solved: { title: 'Evaluador postfijo con errores explícitos', explanation: 'La resta calcula izquierdo − derecho. El método rechaza falta de operandos, resultados sobrantes, tokens nulos y operaciones cuyo resultado no se representa en long.', code: `static long evaluarPostfija(String[] tokens) {
    if (tokens == null) throw new IllegalArgumentException("Tokens nulos");
    java.util.Deque<Long> pila = new java.util.ArrayDeque<>();
    for (String t : tokens) {
        if (t == null) throw new IllegalArgumentException("Token nulo");
        if (t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/")) {
            if (pila.size() < 2) throw new IllegalArgumentException("Faltan operandos");
            long derecho = pila.pop(), izquierdo = pila.pop();
            pila.push(aplicar(izquierdo, derecho, t));
        } else pila.push(Long.parseLong(t));
    }
    if (pila.size() != 1) throw new IllegalArgumentException("Expresión incompleta");
    return pila.pop();
}
private static long aplicar(long a, long b, String op) {
    switch (op) {
        case "+": return Math.addExact(a, b);
        case "-": return Math.subtractExact(a, b);
        case "*": return Math.multiplyExact(a, b);
        case "/":
            if (b == 0 || (a == Long.MIN_VALUE && b == -1)) throw new ArithmeticException("División no representable");
            return a / b;
        default: throw new IllegalArgumentException("Operador inválido");
    }
}` },
      practice: { title: 'Validador y evaluador prefijo', prompt: 'Implementá primero un validador de (), [] y {} que ignore los demás caracteres. Probá ([{}]), ([)], ) y vacío. Después adaptá el evaluador para prefija recorriendo de derecha a izquierda: verificá − 8 3 y / 8 2 para demostrar que respetás el orden. Conservá los chequeos de cantidad de operandos y resultado final único.' },
      takeaways: ['Una pila conserva aperturas pendientes en el orden correcto.', 'En postfija se extrae primero el operando derecho.', 'El contrato numérico y las condiciones de error también forman parte de la correctitud.'], lab: 'stack',
    },
  ],
  exercises: [
    { id: 'm05-e-lifo', moduleId: 5, title: 'Seguir una pila', kind: 'prediction', difficulty: 'Inicial', prompt: 'Indicá, separados por comas, los valores que devuelven los pop.', input: 'push(4), push(9), pop(), push(2), pop(), pop()', expected: '9, 2, 4', constraints: ['La capacidad es suficiente.'], starter: '', answer: '9,2,4', accepted: ['9, 2, 4'], hints: ['Dibujá el contenido de la pila después de cada operación.', 'Solo retirás la cima actual; push(2) no reemplaza el 4 pendiente.'], solution: '9, 2, 4', explanation: 'Después del primer pop queda 4; el nuevo 2 pasa a ser la cima.', lessonId: 'm05-pilas' },
    { id: 'm05-e-circular', moduleId: 5, title: 'Retirar sin desplazar', kind: 'complexity', difficulty: 'Inicial', prompt: '¿Cuál es la cota ajustada de desencolar de una cola circular fija no vacía?', input: 'Un índice de frente, uno de fin y cantidad', expected: 'Theta(1)', constraints: ['No se realiza expansión.'], starter: '', answer: 'Theta(1)', accepted: ['Θ(1)', 'constante'], hints: ['La representación no mueve los elementos restantes.', 'Solo cambiás un índice y un contador.'], solution: 'Θ(1)', explanation: 'La representación circular evita mover el resto de los elementos.', lessonId: 'm05-colas' },
    { id: 'm05-e-resta', moduleId: 5, title: 'Orden de operandos', kind: 'debug', difficulty: 'Inicial', prompt: 'El evaluador lee 8 3 −, extrae primero b=3 y luego a=8, pero calcula b−a. ¿Cuál debería ser el resultado correcto?', input: '8 3 -', expected: '5', constraints: ['Resta entera binaria.'], starter: 'long resultado = b - a;', answer: '5', accepted: [], hints: ['La resta no es conmutativa: 8−3 y 3−8 difieren.', 'El primer extraído es el operando derecho.'], solution: 'long resultado = a - b; // 5', explanation: 'La versión equivocada produce −5. La suma habría ocultado el error por conmutatividad.', lessonId: 'm05-expresiones' },
    { id: 'm05-e-parentesis', moduleId: 5, title: 'Validador de delimitadores', kind: 'implementation', difficulty: 'Intermedio', prompt: 'Este espacio no compila ni ejecuta código: la revisión es manual. Implementá un validador de (), [] y {} que ignore otros caracteres y rechace cruces de tipos.', input: 'String no nulo; vacío es válido', expected: 'Código, invariante y casos de prueba.', constraints: ['O(n) tiempo.', 'No alcanza con contar aperturas.'], starter: 'static boolean balanceado(String texto) {\n    // Tu solución\n}', answer: '', accepted: [], hints: ['La apertura más reciente debe cerrarse antes que las anteriores.', 'Guardá las aperturas en una pila y compará la cima ante un cierre.'], solution: 'Apilar aperturas; para cada cierre, rechazar si no existe cima compatible y retirarla en caso contrario; al terminar exigir pila vacía.', explanation: 'La pila debe representar exactamente las aperturas del prefijo aún no cerradas. ([)] se rechaza aunque sus cantidades coincidan.', lessonId: 'm05-expresiones' },
    { id: 'm05-e-evaluador', moduleId: 5, title: 'Expresiones prefijas', kind: 'implementation', difficulty: 'Intermedio', prompt: 'Este espacio no compila ni ejecuta código: la revisión es manual. Escribí un evaluador de tokens prefijos con +, −, * y / sobre long. Recorre de derecha a izquierda y valida estructura y errores aritméticos.', input: 'Tokens de números con signo u operadores binarios', expected: 'Código y trazas de − 8 3 y / 8 2.', constraints: ['Un único resultado final.', 'Detectar falta de operandos y división por cero.'], starter: 'static long evaluarPrefija(String[] tokens) {\n    // Tu solución\n}', answer: '', accepted: [], hints: ['Empezá por el último token para encontrar operandos antes del operador.', 'Al recorrer al revés, el primer valor extraído es el izquierdo.'], solution: 'Recorrer desde el último token; apilar números; para un operador extraer izquierdo y luego derecho, aplicar y apilar. Comprobar una única salida.', explanation: 'El cambio de dirección cambia el orden de extracción respecto de postfija. Para − 8 3 el resultado es 5.', lessonId: 'm05-notaciones' },
  ],
  questions: [
    { id: 'm05-q1', moduleId: 5, type: 'choice', prompt: '¿Qué define un TAD?', options: ['Operaciones y comportamiento observables.', 'Una distribución exacta de objetos en memoria.', 'Solo el nombre de una clase.'], answer: 0, explanation: 'La representación puede variar preservando el contrato.', lessonId: 'm05-pilas' },
    { id: 'm05-q2', moduleId: 5, type: 'prediction', prompt: 'Tras push(3), push(8), peek(), ¿qué elemento se retira con pop()?', options: ['8.', '3.', 'Ninguno: peek vació la pila.'], answer: 0, explanation: 'peek consulta sin retirar; 8 sigue siendo la cima.', lessonId: 'm05-pilas' },
    { id: 'm05-q3', moduleId: 5, type: 'truefalse', prompt: 'Una cola circular puede tener frente == fin estando llena si guarda cantidad.', options: ['Verdadero.', 'Falso.'], answer: 0, explanation: 'cantidad diferencia lleno de vacío con esta convención.', lessonId: 'm05-colas' },
    { id: 'm05-q4', moduleId: 5, type: 'complexity', prompt: '¿Cuánto cuesta retirar el último de una lista simple si solo guardamos primero y ultimo?', options: ['Θ(n) en el peor caso.', 'Θ(1) siempre.', 'Θ(log n).'], answer: 0, explanation: 'Hay que encontrar el nodo anterior al último recorriendo enlaces.', lessonId: 'm05-deques' },
    { id: 'm05-q5', moduleId: 5, type: 'choice', prompt: '¿Qué disciplina resulta de agregar al final y retirar al principio?', options: ['FIFO.', 'LIFO.', 'Prioridad por valor.'], answer: 0, explanation: 'El primero agregado permanece en el frente hasta ser retirado.', lessonId: 'm05-deques' },
    { id: 'm05-q6', moduleId: 5, type: 'order', prompt: 'Elegí la postfija de 8 − 3 * 2.', options: ['8 3 2 * −.', '8 3 − 2 *.', '− 8 * 3 2.'], answer: 0, explanation: 'La multiplicación se evalúa antes que la resta.', lessonId: 'm05-notaciones' },
    { id: 'm05-q7', moduleId: 5, type: 'prediction', prompt: '¿Cuánto vale 8 3 − 2 * en postfija?', options: ['10.', '2.', '−10.'], answer: 0, explanation: 'La resta toma los dos valores anteriores y deja 5 en la pila; luego el producto combina ese resultado con 2 y obtiene 10.', lessonId: 'm05-expresiones' },
    { id: 'm05-q8', moduleId: 5, type: 'truefalse', prompt: 'La cadena ([)] debe rechazarse aunque tenga cantidades iguales de aperturas y cierres.', options: ['Verdadero.', 'Falso.'], answer: 0, explanation: 'El primer cierre no corresponde a la apertura más reciente.', lessonId: 'm05-expresiones' },
    { id: 'm05-q9', moduleId: 5, type: 'complexity', prompt: '¿Cuánto tarda convertir t tokens a postfija si los tokens tienen tamaño acotado?', options: ['Θ(t).', 'Θ(t²).', 'Θ(log t).'], answer: 0, explanation: 'Cada operador entra y sale una sola vez, aunque exista un while dentro del recorrido.', lessonId: 'm05-notaciones' },
    { id: 'm05-q10', moduleId: 5, type: 'order', prompt: 'Ordená una evaluación binaria postfija.', options: ['Extraer derecho → extraer izquierdo → calcular izquierdo operador derecho → apilar.', 'Extraer izquierdo → extraer derecho → invertir expresión → apilar.', 'Apilar operador → extraer toda la pila → sumar.'], answer: 0, explanation: 'La cima contiene el último operando emitido, que es el derecho.', lessonId: 'm05-expresiones' },
  ],
  glossary: [
    { term: 'TAD', definition: 'Tipo abstracto de dato especificado por sus valores, operaciones y garantías observables.', lessonId: 'm05-pilas' },
    { term: 'LIFO', definition: 'Disciplina que retira primero el último elemento agregado pendiente.', lessonId: 'm05-pilas' },
    { term: 'FIFO', definition: 'Disciplina que retira primero el elemento agregado más antiguo pendiente.', lessonId: 'm05-colas' },
    { term: 'Cola circular', definition: 'Cola cuyo almacenamiento en arreglo reutiliza posiciones avanzando índices con vuelta al inicio.', lessonId: 'm05-colas' },
    { term: 'Deque', definition: 'Secuencia que permite agregar, consultar y retirar por ambos extremos.', lessonId: 'm05-deques' },
    { term: 'Notación postfija', definition: 'Escritura de una expresión donde cada operador aparece después de sus operandos.', lessonId: 'm05-notaciones' },
    { term: 'Asociatividad', definition: 'Regla que resuelve el agrupamiento entre operadores de igual precedencia.', lessonId: 'm05-notaciones' },
  ],
};
