import type { ModuleContent } from './types.js';

export const module11: ModuleContent = {
  moduleId: 11,
  lessons: [
    {
      id: 'm11-representacion', moduleId: 11, title: 'Modelar y representar un grafo', duration: 27,
      summary: 'Convertí relaciones entre entidades en vértices y aristas y elegí una representación según las operaciones necesarias.',
      objectives: ['Distinguir dirección y ponderación.', 'Comparar matrices y listas de adyacencia.', 'Expresar complejidad con V y E.'], prerequisites: ['Arreglos, listas y complejidad.'],
      sections: [
        { title: 'Entidades y relaciones con significado', paragraphs: [
          'Un grafo contiene un conjunto de vértices y relaciones llamadas aristas. Una ciudad puede ser un vértice y una carretera una arista. En un grafo dirigido, una arista u→v permite viajar en ese sentido y no implica v→u. En uno no dirigido, la relación no tiene orientación y puede recorrerse en ambos sentidos.',
          'Un grafo ponderado asigna un peso a cada arista, por ejemplo kilómetros, minutos o costo. Esas magnitudes no son intercambiables: una ruta mínima en distancia puede no minimizar tiempo. En un grafo no ponderado, cada arista suele representar un paso de igual costo. También debemos decidir si admitimos lazos de un vértice a sí mismo y varias aristas entre el mismo par.',
        ] },
        { title: 'Caminos y preguntas diferentes', paragraphs: [
          'Un camino sigue una secuencia de aristas compatibles. En un grafo dirigido debe respetar su dirección. Un ciclo vuelve al punto inicial; para hablar de caminos simples o ciclos simples excluimos repeticiones intermedias. La conectividad pregunta si es posible llegar; los caminos mínimos preguntan cuál es el menor costo entre las posibilidades.',
          'Usaremos V para cantidad de vértices y E para aristas del modelo. En listas de un grafo no dirigido, cada arista suele almacenarse dos veces, una en cada extremo. Eso conserva Θ(V+E) de espacio porque el factor dos es constante. Un vértice aislado también ocupa representación aunque no tenga aristas; por eso no podemos omitir V de todas las cuentas.',
        ] },
        { title: 'Matriz y lista de adyacencia', paragraphs: [
          'Una matriz de adyacencia reserva V×V posiciones. Consultar si existe u→v cuesta Θ(1), pero enumerar vecinos de u exige revisar una fila de V posiciones y el espacio es Θ(V²). Para pesos, necesitamos distinguir ausencia de un peso cero. Una matriz con null para ausencia o una matriz booleana separada evita usar cero como señal ambigua.',
          'Una lista de adyacencia guarda para cada vértice sus aristas salientes. Usa Θ(V+E), enumera los vecinos de u en tiempo proporcional a su grado de salida y no permite consultar una arista arbitraria en tiempo constante sin una estructura adicional. En grafos poco densos suele ahorrar mucho espacio; en grafos densos o con muchas consultas directas la matriz puede ser apropiada.',
        ] },
        { title: 'Representar sin cambiar el problema', paragraphs: [
          'El constructor resuelto recibe triples origen, destino y peso. En no dirigido agrega ambas orientaciones. Admite pesos negativos y paralelas porque representar un grafo no equivale a garantizar que Dijkstra pueda procesarlo. Cada algoritmo posterior impondrá sus propias precondiciones. Los índices válidos son 0 hasta V−1 y se validan antes de acceder a una lista.',
          'Una lista vacía no significa vértice inexistente: puede ser un vértice sin salidas. En un grafo dirigido también importa el grado de entrada, que no se obtiene contando solamente su propia lista. Para calcularlo recorremos todas las aristas y aumentamos el contador del destino.',
          'Antes de programar un recorrido escribí qué significa visitar una arista, si los costos son no negativos y si el grafo puede estar desconectado. Las pruebas deben incluir aislados, caminos en un solo sentido, peso cero y aristas paralelas si el contrato las admite. Un algoritmo correcto para un grafo simple no siempre conserva su prueba ante un multigrafo.',
        ] },
      ],
      complexity: { time: 'Θ(V+E) para construir listas', space: 'Θ(V+E)', explanation: 'Se crea una lista por vértice y una o dos entradas por arista. La matriz alternativa requiere Θ(V²) incluso si existen pocas aristas.' },
      pitfalls: ['Usar cero para ausencia y perder aristas de peso cero.', 'Olvidar la orientación en grafos dirigidos.', 'Confundir número de aristas del modelo con entradas almacenadas en ambas direcciones.'],
      solved: { title: 'Lista de adyacencia ponderada', explanation: 'La representación conserva los pesos y valida índices. En no dirigido los lazos aparecen dos veces con esta convención; los recorridos que solo buscan alcanzabilidad toleran esa repetición.', code: `static final class Arista {
    final int destino, peso;
    Arista(int destino,int peso) { this.destino=destino; this.peso=peso; }
}
static java.util.List<java.util.List<Arista>> crearGrafo(int vertices,int[][] aristas,boolean dirigido) {
    if(vertices<0 || aristas==null) throw new IllegalArgumentException();
    java.util.List<java.util.List<Arista>> g=new java.util.ArrayList<>();
    for(int i=0;i<vertices;i++) g.add(new java.util.ArrayList<>());
    for(int[] e:aristas) {
        if(e==null || e.length!=3 || e[0]<0 || e[0]>=vertices || e[1]<0 || e[1]>=vertices) throw new IllegalArgumentException();
        g.get(e[0]).add(new Arista(e[1],e[2]));
        if(!dirigido) g.get(e[1]).add(new Arista(e[0],e[2]));
    }
    return g;
}` },
      practice: { title: 'Una red de ciudades', prompt: 'Modelá cinco ciudades, una aislada, una carretera de doble sentido y una calle de sentido único. Definí si el peso representa tiempo o distancia. Construí lista y matriz sin confundir ausencia con peso cero; compará espacio y costo de enumerar las salidas de una ciudad.' },
      takeaways: ['Dirección y ponderación son decisiones independientes.', 'V y E aparecen por motivos diferentes en las cotas.', 'La representación debe conservar exactamente las relaciones del modelo.'], lab: 'graph',
    },
    {
      id: 'm11-recorridos', moduleId: 11, title: 'BFS, DFS, componentes y ciclos', duration: 30,
      summary: 'Recorré grafos completos sin repetir vértices y adaptá el estado para distancias, componentes y ciclos no dirigidos.',
      objectives: ['Distinguir frontera FIFO y LIFO.', 'Encontrar componentes conexas.', 'Detectar ciclos sin confundir la arista de regreso al padre.'], prerequisites: ['Listas de adyacencia, pilas y colas.'],
      sections: [
        { title: 'Una frontera organiza el trabajo pendiente', paragraphs: [
          'BFS, búsqueda en anchura, guarda una cola de vértices descubiertos pendientes de expandir. Marcamos un vértice cuando lo encolamos, no cuando sale: así no lo agregamos muchas veces desde vecinos distintos. En un grafo no ponderado, las capas de la cola corresponden a cantidades de aristas desde el origen.',
          'Al descubrir v desde u asignamos distancia[v]=distancia[u]+1 y padre[v]=u. El primer descubrimiento tiene distancia mínima porque todos los vértices de capas anteriores se expanden antes. La garantía minimiza cantidad de aristas, no la suma de pesos diferentes. BFS también sirve para alcanzabilidad en grafos ponderados, pero sus distancias por capas no resuelven ese costo ponderado.',
        ] },
        { title: 'Profundidad y pila', paragraphs: [
          'DFS, búsqueda en profundidad, sigue una rama antes de terminar otras pendientes. Puede implementarse recursivamente o con una pila explícita. La versión recursiva conserva además el punto exacto donde continuará el recorrido de vecinos. Una pila simple de vértices alcanza para alcanzabilidad, aunque no reproduce necesariamente el mismo orden ni los tiempos de finalización de la versión recursiva.',
          'Los marcados impiden volver a expandir un vértice ya descubierto y hacen que los ciclos no produzcan recursión infinita. Con listas, cada vértice y cada entrada de adyacencia se procesa una cantidad constante de veces: Θ(V+E). Con matriz, buscar vecinos mediante filas eleva el recorrido completo a Θ(V²). La memoria auxiliar habitual es O(V).',
        ] },
        { title: 'Un recorrido no siempre cubre todo', paragraphs: [
          'Desde un origen solo visitamos los vértices alcanzables. Para encontrar componentes conexas de un grafo no dirigido, recorremos todos los vértices y comenzamos un nuevo DFS cada vez que encontramos uno sin marcar. Cada inicio recibe una etiqueta distinta, compartida por todo lo que alcanza. Un aislado forma una componente de un solo vértice.',
          'En un grafo dirigido, repetir este procedimiento no calcula componentes fuertemente conexas. La alcanzabilidad puede existir en un sentido y no en el otro, y las etiquetas dependerían del orden de inicio. Las componentes débiles ignoran direcciones; las fuertes requieren alcanzabilidad mutua y otros algoritmos. El código resuelto tiene como precondición un grafo no dirigido con listas válidas.',
        ] },
        { title: 'Detectar ciclos necesita información adicional', paragraphs: [
          'En un grafo simple no dirigido, un DFS encuentra un ciclo si observa un vecino marcado que no es el padre del vértice actual. La arista al padre aparece en ambas listas y no demuestra un ciclo por sí sola. Si admitimos aristas paralelas necesitamos identificar aristas: dos conexiones al mismo padre no son necesariamente la misma arista de regreso.',
          'En dirigido no sirve la regla del padre. Una arista hacia un vértice activo en la pila recursiva revela un ciclo; una arista hacia un vértice ya finalizado puede ser perfectamente válida. Usar estados no visitado, activo y finalizado mantiene esa distinción. La siguiente lección presenta otra detección de ciclos dirigidos mediante grados de entrada.',
          'Para comparar recorridos no exijas un orden único cuando la lista de vecinos puede variar. Verificá el conjunto alcanzado, las etiquetas y, para BFS, las distancias mínimas. Un árbol de padres es un testigo de caminos descubiertos; no contiene necesariamente todas las aristas originales ni representa por sí solo todo el grafo. El origen de cada recorrido no tiene padre.',
        ], code: 'DFS-CICLO(u, padre) para grafo simple no dirigido\n  marcar u\n  para cada vecino v\n    si v no está marcado: si DFS-CICLO(v,u) detecta ciclo, devolver verdadero\n    si v está marcado y v ≠ padre: devolver verdadero\n  devolver falso', language: 'text' },
      ],
      complexity: { time: 'Θ(V+E)', space: 'O(V) auxiliar', explanation: 'El barrido exterior cubre todas las componentes. Marcar al apilar evita duplicados pendientes y mantiene la pila dentro de O(V).' },
      pitfalls: ['Marcar solo al extraer y acumular copias del mismo vértice.', 'Llamar componentes fuertes a las etiquetas de un DFS dirigido arbitrario.', 'Confundir la arista al padre con un ciclo no dirigido.'],
      solved: { title: 'Etiquetar componentes no dirigidas', explanation: 'Las listas deben ser simétricas y contener índices válidos. La etiqueta −1 significa no descubierto. Los aislados reciben una etiqueta propia y el grafo vacío devuelve un arreglo vacío.', code: `static int[] componentes(int[][] ady) {
    if(ady==null) throw new IllegalArgumentException();
    int[] componente=new int[ady.length]; java.util.Arrays.fill(componente,-1);
    java.util.Deque<Integer> pila=new java.util.ArrayDeque<>(); int etiqueta=0;
    for(int inicio=0;inicio<ady.length;inicio++) {
        if(componente[inicio]!=-1) continue;
        componente[inicio]=etiqueta; pila.push(inicio);
        while(!pila.isEmpty()) {
            int u=pila.pop();
            for(int v:ady[u]) if(componente[v]==-1) { componente[v]=etiqueta; pila.push(v); }
        }
        etiqueta++;
    }
    return componente;
}` },
      practice: { title: 'BFS con caminos y ciclos', prompt: 'Implementá BFS con distancias y padres usando −1 para inalcanzable. Reconstruí un camino al destino sin volver a recorrer todo el grafo. Después implementá detección de ciclos en un grafo simple no dirigido y justificá la excepción de la arista al padre. Probá dos componentes, un aislado y un triángulo.' },
      takeaways: ['FIFO produce capas y LIFO explora profundidad.', 'El recorrido exterior permite cubrir componentes desconectadas.', 'Detectar ciclos requiere distinguir tipos de aristas o estados.'], lab: 'graph',
    },
    {
      id: 'm11-topologico', moduleId: 11, title: 'Orden topológico y ciclos dirigidos', duration: 27,
      summary: 'Ordená dependencias con el algoritmo de Kahn y usá los vértices pendientes como evidencia de un ciclo.',
      objectives: ['Definir un orden topológico.', 'Mantener grados de entrada pendientes.', 'Detectar que un grafo dirigido no es acíclico.'], prerequisites: ['Grafos dirigidos y BFS.'],
      sections: [
        { title: 'Dependencias antes que recorridos', paragraphs: [
          'Un orden topológico es una secuencia de todos los vértices donde cada arista u→v coloca u antes que v. Modela tareas que deben completarse antes de otras. No busca el camino más corto ni ordena por la etiqueta numérica de los vértices. Un mismo grafo puede tener muchos órdenes válidos.',
          'Existe un orden topológico exactamente cuando el grafo dirigido es acíclico, llamado DAG. Un ciclo exige que cada una de sus tareas aparezca antes que la siguiente y que la última aparezca antes que la primera: ninguna secuencia lineal puede satisfacerlo. Un lazo u→u ya impide la existencia de orden.',
        ] },
        { title: 'Kahn mantiene tareas disponibles', paragraphs: [
          'Calculamos el grado de entrada de cada vértice contando todas las aristas que llegan a él. Los de grado cero no tienen requisitos pendientes y entran en una cola. Sacamos uno, lo emitimos y eliminamos conceptualmente sus aristas salientes decrementando el grado de cada destino. Si un destino llega a cero, queda disponible.',
          'No necesitamos borrar físicamente las listas del grafo: el arreglo de grados representa el estado residual. Las aristas paralelas, si existen, se cuentan y descuentan cada una. Usar una cola ordinaria elige un orden válido según el descubrimiento; una cola de prioridad podría elegir siempre la menor etiqueta disponible, pero agregaría costo logarítmico.',
        ] },
        { title: 'Por qué el orden respeta cada arista', paragraphs: [
          'La invariante dice que el grado guardado de un vértice no emitido cuenta exactamente sus predecesores pendientes, con multiplicidad de aristas. Solo emitimos vértices cuyo conteo es cero. Por lo tanto, todos los orígenes de sus aristas entrantes ya aparecieron antes, y agregarlo al final conserva el orden de todas las dependencias procesadas.',
          'Cuando retiramos u, descontar sus salidas mantiene la invariante. Cada vértice entra en la cola a lo sumo una vez: el grado disminuye y solo alcanza cero una vez. Cada arista se examina al calcular grados y al emitir su origen. La terminación resulta del número finito de vértices emitibles, y la implementación nunca debe seguir decrementando desde un vértice emitido dos veces.',
        ] },
        { title: 'Reconocer el ciclo sin inventar un orden', paragraphs: [
          'Si emitimos V vértices, la secuencia obtenida es un orden topológico. Si la cola se vacía antes, todos los vértices restantes tienen alguna entrada desde otro restante. Seguir esas dependencias en un conjunto finito obliga a repetir un vértice y, por tanto, revela que existe un ciclo. No necesariamente todos los vértices pendientes pertenecen al ciclo: algunos pueden depender de él.',
          'Otra técnica utiliza DFS con estados activo y finalizado. Una arista hacia un activo detecta ciclo; si no hay ciclos, invertir el orden de finalización produce un orden topológico. Mezclar simplemente “visitado” con “activo” rechazaría dependencias compartidas válidas. Kahn evita la pila recursiva y permite ver qué tareas están listas en cada paso.',
          'Un orden topológico también permite procesar caminos o dependencias por programación dinámica en un DAG, incluso con pesos negativos, porque no hay posibilidad de regresar a un vértice anterior mediante un ciclo. Esa observación no significa que Kahn calcule distancias: entrega la secuencia sobre la cual otro algoritmo podrá trabajar. El grafo original queda intacto porque solamente actualizamos contadores auxiliares, no sus listas de vecinos.',
        ] },
      ],
      complexity: { time: 'Θ(V+E)', space: 'O(V) auxiliar', explanation: 'Grados, cola y salida requieren espacio lineal. Se examinan todas las aristas dos veces y cada vértice se emite como máximo una vez.' },
      pitfalls: ['Devolver una secuencia parcial como si ordenara todo el grafo.', 'Confundir orden topológico con orden de etiquetas.', 'Suponer que todo vértice bloqueado pertenece necesariamente al ciclo.'],
      solved: { title: 'Orden topológico con detección', explanation: 'El método recibe listas válidas de un grafo dirigido. Rechaza con una excepción si no puede emitir todos los vértices; en vacío devuelve una secuencia vacía.', code: `static int[] topologico(int[][] ady) {
    int n=ady.length; int[] grado=new int[n], orden=new int[n];
    for(int[] vecinos:ady) for(int v:vecinos) grado[v]++;
    java.util.Deque<Integer> cola=new java.util.ArrayDeque<>();
    for(int v=0;v<n;v++) if(grado[v]==0) cola.addLast(v);
    int cantidad=0;
    while(!cola.isEmpty()) {
        int u=cola.removeFirst(); orden[cantidad++]=u;
        for(int v:ady[u]) if(--grado[v]==0) cola.addLast(v);
    }
    if(cantidad!=n) throw new IllegalArgumentException("El grafo tiene un ciclo dirigido");
    return orden;
}` },
      practice: { title: 'Planificar materias', prompt: 'Representá prerrequisitos de seis materias como un DAG y obtené dos órdenes válidos si existen. Verificá cada arista comparando posiciones en la secuencia. Agregá un ciclo y explicá qué materias quedan pendientes y cuáles podrían estar bloqueadas sin pertenecer al ciclo.' },
      takeaways: ['Un DAG admite órdenes topológicos y un ciclo los impide.', 'Grado de entrada cero significa ausencia de requisitos pendientes.', 'Una salida parcial detecta bloqueo, no constituye una solución completa.'], lab: 'graph',
    },
    {
      id: 'm11-dijkstra', moduleId: 11, title: 'Dijkstra y rutas de costo no negativo', duration: 32,
      summary: 'Calculá distancias mínimas desde un origen y reconstruí rutas con una cola de prioridad.',
      objectives: ['Aplicar relajación de aristas.', 'Justificar la elección del mínimo con pesos no negativos.', 'Manejar entradas obsoletas y destinos inalcanzables.'], prerequisites: ['Grafos ponderados y colas de prioridad.'],
      sections: [
        { title: 'De alcanzabilidad a distancia', paragraphs: [
          'La distancia mínima desde s a v es el menor costo de un camino válido, sumando pesos. El origen tiene distancia cero por el camino vacío. Un destino inalcanzable tiene distancia infinita. Para Dijkstra exigimos que todos los pesos sean no negativos; cero está permitido y no equivale a ausencia de arista.',
          'Mantenemos distancias tentativas, inicialmente infinito salvo el origen. Relajar u→v significa comparar la distancia conocida de v con distancia[u]+peso(u,v). Si el nuevo camino mejora, actualizamos la distancia y guardamos u como predecesor. Es una operación local que conserva un testigo real para toda distancia finita.',
        ] },
        { title: 'Elegir la menor distancia pendiente', paragraphs: [
          'Dijkstra extrae el vértice pendiente de menor distancia tentativa. Con pesos no negativos, ningún camino que todavía pase por otro vértice pendiente puede volver más tarde con un costo menor para el extraído. Ese argumento permite fijar su distancia como definitiva. Una arista negativa rompe justamente esa desigualdad, aunque el grafo no tenga ciclos negativos.',
          'Una cola de prioridad binaria encuentra rápidamente el menor candidato. La implementación perezosa no modifica una entrada anterior cuando mejora una distancia: inserta una nueva pareja vértice/distancia. Al extraer, descarta la pareja si su distancia ya no coincide con la mejor actual. Sin esa comprobación puede expandir un vértice muchas veces con información vieja.',
        ] },
        { title: 'Seguir un ejemplo y recuperar la ruta', paragraphs: [
          'Si las aristas son A→B con 7, A→C con 2 y C→B con 1, la primera relajación deja B=7 y C=2. Extraer C mejora B a 3. La entrada B=7 sigue en la cola, pero será descartada después. El predecesor de B pasa de A a C y permite recuperar A,C,B.',
          'Para reconstruir, partimos del destino y seguimos predecesores hasta el origen, luego invertimos la secuencia. Antes verificamos si su distancia es infinita. El origen tiene predecesor −1 y su ruta contiene solamente al origen. Si varios caminos empatan, actualizar solo ante mejora estricta conserva uno de ellos; no debemos exigir un camino único cuando hay empates.',
        ] },
        { title: 'Garantías numéricas y costo de la cola', paragraphs: [
          'Usamos pesos int y distancias long. Las comparaciones de prioridades utilizan Long.compare, porque restar dos valores y convertir puede desbordar y violar el orden de la cola. Math.addExact detecta cualquier suma no representable en vez de convertirla silenciosamente en una distancia pequeña. Long.MAX_VALUE representa infinito y nunca debe sumarse como si fuera una distancia real.',
          'En una lista con cola perezosa pueden aparecer O(E) entradas y extracciones. Una cota segura es O(V + E log(E+1)), con memoria auxiliar O(V+E). Para grafos simples la relación E ≤ V² permite expresiones habituales con log V. Una cola con decrease-key y una entrada por vértice tiene otras cuentas de memoria y operaciones; no debemos atribuirlas sin más al código perezoso.',
          'La práctica de ciudades debe verificar también una ruta inexistente, caminos de costo cero, empates y una ruta indirecta más barata que la directa. Una solución que dibuja una línea entre dos ciudades sin comprobar aristas válidas no entrega un camino del grafo, aunque su suma parezca correcta. Para múltiples consultas desde el mismo origen podemos reutilizar el resultado; si cambian los pesos o las conexiones, esa información necesita revisarse o recalcularse.',
        ] },
      ],
      complexity: { time: 'O(V + E log(E+1))', space: 'O(V+E) auxiliar', explanation: 'La validación recorre las aristas; la cola perezosa puede guardar una entrada por mejora. En grafos simples suele expresarse como O((V+E)log V).' },
      pitfalls: ['Aplicar Dijkstra con aristas negativas.', 'Procesar entradas obsoletas sin comprobar su distancia.', 'Restar prioridades para implementar el comparador y provocar overflow.'],
      solved: { title: 'Distancias y predecesores con prioridad perezosa', explanation: 'El contrato exige listas e índices válidos. Se comprueban pesos negativos incluso en componentes no alcanzables. El resultado conserva infinito y −1 para destinos sin ruta.', code: `static final class Arista {
    final int destino,peso; Arista(int d,int p){destino=d;peso=p;}
}
static final class Rutas {
    final long[] distancia; final int[] previo;
    Rutas(long[] d,int[] p){distancia=d;previo=p;}
}
static Rutas dijkstra(java.util.List<java.util.List<Arista>> g,int origen) {
    int n=g.size(); if(origen<0 || origen>=n) throw new IllegalArgumentException();
    for(java.util.List<Arista> lista:g) for(Arista e:lista) if(e.peso<0 || e.destino<0 || e.destino>=n) throw new IllegalArgumentException();
    long[] d=new long[n]; int[] previo=new int[n];
    java.util.Arrays.fill(d,Long.MAX_VALUE); java.util.Arrays.fill(previo,-1); d[origen]=0;
    java.util.PriorityQueue<long[]> cola=new java.util.PriorityQueue<>((a,b)->Long.compare(a[1],b[1]));
    cola.add(new long[]{origen,0});
    while(!cola.isEmpty()) {
        long[] entrada=cola.remove(); int u=(int)entrada[0];
        if(entrada[1]!=d[u]) continue;
        for(Arista e:g.get(u)) {
            long candidato=Math.addExact(d[u],(long)e.peso);
            if(candidato<d[e.destino]) {
                d[e.destino]=candidato; previo[e.destino]=u;
                cola.add(new long[]{e.destino,candidato});
            }
        }
    }
    return new Rutas(d,previo);
}` },
      practice: { title: 'Ruta óptima entre ciudades', prompt: 'Asigná índices a ciudades y construí una red dirigida de tiempos no negativos. Usá Dijkstra y reconstruí la ruta origen→destino, devolviendo ausencia cuando no existe. Verificá que cada paso corresponda a una arista y que la suma coincida con la distancia. Incluí la ruta indirecta A→C→B del ejemplo y un destino aislado.' },
      takeaways: ['Relajar mejora una distancia mediante un camino concreto.', 'Los pesos no negativos justifican fijar el mínimo pendiente.', 'Distancias, predecesores e inalcanzabilidad son partes del resultado.'], lab: 'graph',
    },
    {
      id: 'm11-bellman', moduleId: 11, title: 'Bellman–Ford y pesos negativos', duration: 29,
      summary: 'Relajá sistemáticamente aristas y distinguí una ruta cara de la ausencia de un mínimo por ciclos negativos.',
      objectives: ['Explicar las V−1 pasadas.', 'Detectar ciclos negativos alcanzables.', 'Seleccionar Bellman–Ford frente a Dijkstra.'], prerequisites: ['Relajación y caminos mínimos.'],
      sections: [
        { title: 'Un peso negativo cambia la estrategia', paragraphs: [
          'Algunos modelos admiten aristas negativas: una transferencia puede representar una ganancia o un ajuste de costo. Dijkstra deja de ofrecer su garantía porque un vértice aparentemente resuelto puede mejorar desde otro que se procese después. Bellman–Ford no fija vértices por prioridad: repite relajaciones sobre todas las aristas.',
          'Un ciclo de suma negativa alcanzable desde el origen permite recorrerlo una y otra vez reduciendo el costo. Para destinos alcanzables desde ese ciclo, no existe un costo mínimo finito. Eso es diferente de no tener camino, cuyo costo representamos como infinito positivo. Un ciclo negativo en otra componente que no puede alcanzarse desde el origen no afecta sus distancias.',
        ] },
        { title: 'La cantidad de aristas organiza la prueba', paragraphs: [
          'Inicializamos cero en el origen e infinito en los demás. Después hacemos hasta V−1 pasadas, relajando todas las aristas en cada una. Si no hay ciclos negativos relevantes, un camino mínimo puede elegirse simple: eliminar ciclos de costo no negativo no empeora el costo, por lo que bastan V−1 aristas.',
          'Después de k pasadas, las distancias no son mayores que los costos de los mejores caminos de hasta k aristas. Si actualizamos en el mismo arreglo, una mejora puede propagarse por varias aristas durante una sola pasada; por eso no afirmamos que cada distancia represente exactamente caminos de como máximo k aristas. El orden puede acelerar la propagación sin romper la garantía que necesitamos.',
        ] },
        { title: 'Una pasada adicional detecta el problema', paragraphs: [
          'Tras V−1 pasadas, comprobamos si alguna arista desde un vértice de distancia finita todavía permite mejorar. Si ocurre, existe un ciclo negativo alcanzable. La comprobación no debe relajar desde infinito: sumar a la señal de ausencia puede desbordar y fabricar una distancia. El método resuelto rechaza todo el resultado cuando detecta ese caso.',
          'Una API más elaborada puede marcar solamente los destinos afectados por el ciclo, conservando distancias finitas de otras ramas. Para ello identifica vértices que todavía mejoran y propaga esa influencia por el grafo. No alcanza con marcar solo los vértices del ciclo: cualquier destino alcanzable desde ellos también admite costos arbitrariamente bajos.',
        ] },
        { title: 'Parada anticipada y límites del modelo', paragraphs: [
          'Si una pasada completa no cambia ninguna distancia, las siguientes tampoco cambiarán: el arreglo ya es estable frente a todas las relajaciones. Podemos terminar antes. El peor caso permanece O(VE), pero una instancia favorable puede necesitar pocas pasadas. La representación por lista de aristas es conveniente porque cada pasada examina todas las conexiones sin buscar listas por vértice.',
          'El código utiliza long y Math.addExact para no ocultar desbordamientos. En presencia de ciclos negativos los acumulados pueden seguir disminuyendo durante las pasadas; el contrato numérico necesita que esas sumas sean representables o que el error se comunique. Un límite matemático de costo no equivale automáticamente al rango de un tipo de máquina.',
          'Para ciudades con tiempos físicos no negativos, Dijkstra suele ser la elección más eficiente. Bellman–Ford es útil cuando el modelo permite ajustes negativos o necesitamos detectar ciclos negativos. En grafos no dirigidos, una arista negativa representada en ambos sentidos crea inmediatamente un recorrido cerrado de costo negativo: debemos revisar si ese modelo de viaje tiene sentido. La representación no debe agregar orientaciones que el dominio prohíba.',
        ] },
      ],
      complexity: { time: 'O(VE) peor caso', space: 'O(V) auxiliar', explanation: 'Hay hasta V−1 pasadas y una comprobación adicional. Una pasada sin cambios permite salida anticipada; los arreglos de aristas pertenecen a la entrada.' },
      pitfalls: ['Relajar desde Long.MAX_VALUE.', 'Afirmar que cualquier ciclo negativo del grafo afecta al origen.', 'Confundir distancia infinita por ausencia con costo sin mínimo finito.'],
      solved: { title: 'Bellman–Ford con detección alcanzable', explanation: 'Los triples representan aristas dirigidas y sus pesos int. Las sumas no representables lanzan ArithmeticException; un ciclo negativo alcanzable lanza IllegalStateException.', code: `static long[] bellmanFord(int vertices,int[][] aristas,int origen) {
    if(vertices<=0 || origen<0 || origen>=vertices || aristas==null) throw new IllegalArgumentException();
    for(int[] e:aristas) if(e==null || e.length!=3 || e[0]<0 || e[0]>=vertices || e[1]<0 || e[1]>=vertices) throw new IllegalArgumentException();
    long[] d=new long[vertices]; java.util.Arrays.fill(d,Long.MAX_VALUE); d[origen]=0;
    for(int pasada=1;pasada<vertices;pasada++) {
        boolean cambio=false;
        for(int[] e:aristas) if(d[e[0]]!=Long.MAX_VALUE) {
            long candidato=Math.addExact(d[e[0]],(long)e[2]);
            if(candidato<d[e[1]]) { d[e[1]]=candidato; cambio=true; }
        }
        if(!cambio) break;
    }
    for(int[] e:aristas) if(d[e[0]]!=Long.MAX_VALUE && Math.addExact(d[e[0]],(long)e[2])<d[e[1]])
        throw new IllegalStateException("Ciclo negativo alcanzable");
    return d;
}` },
      practice: { title: 'Un ciclo que importa y otro que no', prompt: 'Construí un grafo dirigido con una ruta que mejora mediante una arista negativa sin formar ciclos. Después agregá un ciclo negativo primero en una componente inalcanzable y luego conectalo al origen. Trazá qué debe devolver o rechazar Bellman–Ford en cada caso. Identificá también qué destinos quedarían afectados por el ciclo.' },
      takeaways: ['V−1 aristas alcanzan para caminos simples.', 'Una mejora posterior revela un ciclo negativo alcanzable.', 'El modelo debe distinguir ausencia de ruta y ausencia de un mínimo finito.'], lab: 'graph',
    },
    {
      id: 'm11-kruskal', moduleId: 11, title: 'Union–Find y Kruskal', duration: 32,
      summary: 'Uní componentes sin crear ciclos y construí un bosque de expansión mínima ordenando aristas.',
      objectives: ['Implementar conjuntos disjuntos.', 'Combinar compresión de caminos y unión por tamaño.', 'Justificar la selección de Kruskal.'], prerequisites: ['Árboles, grafos no dirigidos y ordenamiento.'],
      sections: [
        { title: 'Conectar toda la red no es buscar una ruta', paragraphs: [
          'Un árbol de expansión de un grafo no dirigido conectado contiene todos los vértices, no tiene ciclos y usa V−1 aristas. Un árbol de expansión mínima minimiza la suma de sus pesos. No necesariamente contiene caminos mínimos desde un origen: optimizar el costo total de construir una red es un problema diferente de optimizar cada viaje.',
          'Si el grafo está desconectado no existe un árbol que conecte todo usando sus aristas. Podemos construir un bosque de expansión mínima, un árbol por componente. Los pesos negativos no perjudican este problema: nunca repetimos aristas ni buscamos reducir costos dando vueltas por un ciclo. Con pesos empatados pueden existir varias soluciones óptimas.',
        ] },
        { title: 'Conjuntos disjuntos representan componentes', paragraphs: [
          'Union–Find mantiene una partición de elementos en conjuntos sin solapamiento. find devuelve el representante del conjunto de un elemento; union combina dos conjuntos si eran distintos. Una representación por árboles guarda padre[x] y una raíz que se apunta a sí misma. No son necesariamente aristas del grafo: representan pertenencia a componentes.',
          'La unión por tamaño conecta la raíz del conjunto menor bajo la del mayor. La compresión de caminos acorta futuros recorridos; la variante por mitades hace que un nodo apunte a su abuelo mientras buscamos. Combinadas, estas técnicas ofrecen costo amortizado O(α(V)) por operación en secuencias, donde α es la inversa de Ackermann, extremadamente lenta en crecer. No lo llamamos tiempo constante garantizado por operación individual.',
        ] },
        { title: 'Kruskal procesa aristas por peso', paragraphs: [
          'Ordenamos todas las aristas de menor a mayor peso. Al examinar u–v, si sus representantes difieren, agregamos la arista y unimos los conjuntos. Si ya coinciden, agregarla cerraría un ciclo y la descartamos. El conjunto elegido es siempre un bosque; sus componentes coinciden con las que mantiene Union–Find.',
          'La propiedad del corte justifica una elección: una arista de peso mínimo que cruza entre una componente actual y el resto es segura para alguna solución óptima que contiene el bosque ya elegido. Un argumento de intercambio reemplaza una arista que cruza el mismo corte en un óptimo sin aumentar costo. Kruskal aplica esa propiedad siguiendo el orden global.',
        ] },
        { title: 'Correctitud y cuenta de recursos', paragraphs: [
          'Al terminar, cada componente conectable del grafo queda expandida por el bosque. Si el número de componentes finales es uno y V>0, hay V−1 aristas elegidas. Si es mayor, comunicar bosque o error de desconexión depende del contrato. El ejemplo devuelve ambos, con costo total y cantidad de componentes, para no fingir conectividad.',
          'Ordenar cuesta O(E log(E+1)); las consultas y uniones agregan O(E·α(V)) amortizado. La inicialización cuesta Θ(V), importante cuando hay muchos aislados. Clonamos el arreglo externo de aristas antes de ordenarlo para no cambiar el orden recibido. Las aristas elegidas se copian para que la salida no comparta sus pequeños arreglos con la entrada.',
          'Los casos de prueba incluyen paralelas de pesos distintos, lazos, pesos negativos y un aislado. Los lazos se descartan porque sus extremos ya tienen el mismo representante. La cantidad de componentes y la ausencia de ciclos verifican la estructura; para verificar minimalidad en ejemplos pequeños podemos enumerar árboles candidatos y comparar costos. Este control independiente resulta especialmente útil cuando distintas selecciones empatan en peso.',
        ] },
      ],
      complexity: { time: 'O(V + E log(E+1))', space: 'O(V+E)', explanation: 'Ordenamiento domina las operaciones amortizadas de Union–Find. Se guardan padres, tamaños, copia de aristas y el bosque de salida.' },
      pitfalls: ['Confundir el árbol de Union–Find con el árbol de expansión elegido.', 'Aceptar una arista entre vértices del mismo conjunto.', 'Anunciar un árbol completo cuando el resultado tiene varias componentes.'],
      solved: { title: 'Bosque mínimo con Union–Find propio', explanation: 'Los triples son aristas no dirigidas. Se devuelve el costo, las aristas elegidas y el número de componentes, admitiendo un grafo desconectado.', code: `static final class UnionFind {
    final int[] padre,tamano; int componentes;
    UnionFind(int n) { padre=new int[n];tamano=new int[n];componentes=n;for(int i=0;i<n;i++){padre[i]=i;tamano[i]=1;} }
    int find(int x) { while(x!=padre[x]){padre[x]=padre[padre[x]];x=padre[x];}return x; }
    boolean unir(int a,int b) {
        a=find(a);b=find(b);if(a==b)return false;
        if(tamano[a]<tamano[b]){int t=a;a=b;b=t;}
        padre[b]=a;tamano[a]+=tamano[b];componentes--;return true;
    }
}
static final class Bosque {
    final java.util.List<int[]> aristas; final long costo; final int componentes;
    Bosque(java.util.List<int[]> a,long c,int k){aristas=a;costo=c;componentes=k;}
}
static Bosque kruskal(int vertices,int[][] aristas) {
    if(vertices<0 || aristas==null)throw new IllegalArgumentException();
    for(int[] e:aristas)if(e==null || e.length!=3 || e[0]<0 || e[0]>=vertices || e[1]<0 || e[1]>=vertices)throw new IllegalArgumentException();
    int[][] orden=aristas.clone();java.util.Arrays.sort(orden,(a,b)->Integer.compare(a[2],b[2]));
    UnionFind uf=new UnionFind(vertices);java.util.List<int[]> elegidas=new java.util.ArrayList<>();long costo=0;
    for(int[] e:orden)if(uf.unir(e[0],e[1])){elegidas.add(e.clone());costo=Math.addExact(costo,(long)e[2]);}
    return new Bosque(elegidas,costo,uf.componentes);
}` },
      practice: { title: 'Construir una red económica', prompt: 'Conectá ciudades con enlaces bidireccionales y costos de construcción usando Kruskal. Incluí dos enlaces paralelos y un aislado. Explicá por qué elegir el enlace directo más barato para cada ciudad no basta. Devolvé un bosque con componentes y compará su objetivo con rutas mínimas desde la capital.' },
      takeaways: ['Union–Find detecta si una arista conectaría componentes diferentes.', 'Kruskal conserva un bosque y usa aristas seguras por peso.', 'Una expansión mínima y un árbol de caminos mínimos optimizan objetivos distintos.'], lab: 'graph',
    },
    {
      id: 'm11-prim-rutas', moduleId: 11, title: 'Prim y selección de algoritmos de rutas', duration: 29,
      summary: 'Expandí una componente por su arista más barata y elegí el algoritmo según el objetivo, los pesos y la representación.',
      objectives: ['Implementar Prim sobre matriz.', 'Distinguir frontera de aristas y distancia desde origen.', 'Seleccionar BFS, Dijkstra, Bellman–Ford, Prim o Kruskal.'], prerequisites: ['Caminos mínimos y expansión mínima.'],
      sections: [
        { title: 'Hacer crecer un árbol', paragraphs: [
          'Prim empieza con un vértice y mantiene un conjunto conectado de vértices incorporados. En cada paso elige la arista de menor peso que cruza desde ese conjunto hacia afuera. Agrega su extremo externo y actualiza las mejores conexiones de los demás. La propiedad del corte vuelve a justificar que la arista elegida es segura para una expansión mínima.',
          'Para cada vértice externo guardamos el menor peso de una arista que lo conecta directamente con el conjunto. Esa clave no es la distancia acumulada desde el origen. Aunque Prim y Dijkstra puedan usar colas de prioridad similares, actualizan magnitudes distintas y resuelven objetivos distintos. Confundir ambas relajaciones produce una solución que puede ser correcta para otro problema.',
        ] },
        { title: 'La versión densa usa una matriz', paragraphs: [
          'Con una matriz de pesos, seleccionamos por barrido el vértice externo de menor clave y después revisamos su fila para mejorar conexiones. Hacemos V selecciones y V revisiones de hasta V posiciones, por lo que el tiempo es Θ(V²). La memoria auxiliar es Θ(V); la matriz de entrada ya ocupa Θ(V²).',
          'Usamos Integer[][] con null para ausencia y admitimos peso cero o negativo. El grafo debe ser no dirigido, de modo que la matriz sea simétrica. Si no existe una conexión finita hacia los vértices restantes, el grafo está desconectado y esta versión rechaza. Otra API podría reiniciar desde otro vértice y construir un bosque como Kruskal.',
        ] },
        { title: 'Comparar Prim y Kruskal', paragraphs: [
          'Prim crece desde un conjunto conectado y elige la mejor arista de su frontera. Kruskal permite varias componentes simultáneas y toma la siguiente arista global que no forme ciclo. Ambos pueden devolver árboles diferentes con el mismo costo óptimo si hay empates. Verificar igualdad exacta de aristas no es una prueba adecuada en ese escenario.',
          'Para grafos dispersos, Prim con listas y un heap evita examinar una matriz completa; para grafos densos, la versión cuadrática puede ser sencilla y competitiva. Kruskal encaja naturalmente con una lista de aristas y ordenamiento. Los requisitos de representación y preparación forman parte del costo total, especialmente si necesitamos convertir un formato recibido.',
        ] },
        { title: 'Elegir según la pregunta de ciudades', paragraphs: [
          'Si todas las conexiones cuestan un paso, BFS minimiza cantidad de aristas. Si los costos son no negativos y queremos rutas desde un origen, Dijkstra. Si existen pesos negativos, Bellman–Ford permite calcular distancias y detectar ciclos negativos alcanzables. En un DAG también puede usarse relajación en orden topológico, incluso con pesos negativos, porque no hay ciclos.',
          'Si queremos construir una red bidireccional con costo total mínimo, usamos expansión mínima mediante Prim o Kruskal. Una ruta óptima entre dos ciudades no exige conectar todas las demás; una red económica no asegura trayectos individuales mínimos. La salida debe indicar su objetivo para que un mapa visual no confunda resultados distintos.',
          'La práctica integradora separa modelo, cálculo y presentación: nombres de ciudades se convierten en índices, las aristas guardan una magnitud definida y el algoritmo devuelve distancias, padres o enlaces según corresponda. Luego verificamos la salida sobre el grafo original. Inalcanzabilidad, desconexión y ciclo negativo son estados diferentes que deben mostrarse con significado, sin sustituirlos por un cero engañoso en la interfaz del programa.',
        ] },
      ],
      complexity: { time: 'Θ(V²)', space: 'Θ(V) auxiliar', explanation: 'Prim sobre matriz realiza barridos completos y valida simetría. Esta versión exige conectividad para V>0 y define costo cero para el grafo vacío.' },
      pitfalls: ['Actualizar clave de Prim con distancia acumulada como en Dijkstra.', 'Tratar una matriz asimétrica como grafo no dirigido.', 'Comparar árboles óptimos empatados exigiendo las mismas aristas.'],
      solved: { title: 'Costo de Prim sobre matriz', explanation: 'null significa ausencia. Los pesos negativos son válidos. El método verifica forma y simetría, rechaza desconexión y devuelve cero para el caso vacío.', code: `static long prim(Integer[][] peso) {
    if(peso==null)throw new IllegalArgumentException();int n=peso.length;
    for(Integer[] fila:peso)if(fila==null || fila.length!=n)throw new IllegalArgumentException();
    for(int i=0;i<n;i++)for(int j=0;j<n;j++)if(!java.util.Objects.equals(peso[i][j],peso[j][i]))throw new IllegalArgumentException("Matriz asimétrica");
    if(n==0)return 0;
    long[] clave=new long[n];boolean[] dentro=new boolean[n];java.util.Arrays.fill(clave,Long.MAX_VALUE);clave[0]=0;long costo=0;
    for(int paso=0;paso<n;paso++) {
        int u=-1;for(int v=0;v<n;v++)if(!dentro[v] && (u==-1 || clave[v]<clave[u]))u=v;
        if(clave[u]==Long.MAX_VALUE)throw new IllegalArgumentException("Grafo desconectado");
        dentro[u]=true;costo=Math.addExact(costo,clave[u]);
        for(int v=0;v<n;v++)if(!dentro[v] && peso[u][v]!=null && peso[u][v]<clave[v])clave[v]=peso[u][v];
    }
    return costo;
}` },
      practice: { title: 'Un informe de rutas y de infraestructura', prompt: 'Para una misma red de seis ciudades, calculá una ruta mínima desde una capital y una expansión mínima de infraestructura. Presentá costos separados y un ejemplo donde los árboles difieran. Elegí representación y algoritmo, justificá complejidad y tratá explícitamente una ciudad sin conexión. Si hay pesos negativos, explicá qué objetivo sigue siendo válido y qué algoritmos deben cambiar.' },
      takeaways: ['Prim minimiza una conexión de frontera, no una distancia acumulada.', 'La representación influye en el algoritmo y su costo.', 'Seleccionar correctamente exige formular primero la pregunta.'], lab: 'graph',
    },
  ],
  exercises: [
    { id: 'm11-e-bfs', moduleId: 11, title: 'Distancia por capas', kind: 'prediction', difficulty: 'Inicial', prompt: '¿Cuál es la distancia no ponderada de 0 a 3?', input: 'Aristas dirigidas 0→1, 0→2, 1→3, 2→3', expected: '2', constraints: ['Cada arista cuesta un paso.'], starter: '', answer: '2', accepted: [], hints: ['Los vértices 1 y 2 están en la primera capa.', '3 se descubre desde uno de ellos: agregá un paso más.'], solution: '2 aristas: 0→1→3 o 0→2→3.', explanation: 'BFS visita capas de distancia creciente; hay dos caminos mínimos empatados.', lessonId: 'm11-recorridos' },
    { id: 'm11-e-costo', moduleId: 11, title: 'Lista frente a matriz', kind: 'complexity', difficulty: 'Inicial', prompt: 'Clasificá un BFS completo usando listas de adyacencia.', input: 'V vértices; E aristas; marcar al encolar', expected: 'Theta(V+E)', constraints: ['Incluir inicialización y componentes.'], starter: '', answer: 'Theta(V+E)', accepted: ['Θ(V+E)', 'O(V+E)'], hints: ['Cada vértice se descubre una vez.', 'Cada entrada de adyacencia se examina al expandir su origen.'], solution: 'Θ(V+E)', explanation: 'Las listas permiten examinar solo aristas existentes; una matriz exigiría revisar filas completas.', lessonId: 'm11-recorridos' },
    { id: 'm11-e-negativo', moduleId: 11, title: 'La elección prematura', kind: 'debug', difficulty: 'Intermedio', prompt: 'Dijkstra fija B con costo 2 usando A→B=2 y A→C=5, pero existe C→B=−4. ¿Cuál es la distancia real de A a B?', input: 'Grafo dirigido sin otras aristas', expected: '1', constraints: ['No hay ciclos.'], starter: 'fijar B antes de expandir C;', answer: '1', accepted: [], hints: ['Revisá también el camino indirecto A→C→B.', 'Su costo es 5 + (−4), menor que el arco directo.'], solution: '1 mediante A→C→B; usar Bellman–Ford o relajación topológica.', explanation: 'El peso negativo rompe la justificación de fijar B aunque no exista un ciclo negativo.', lessonId: 'm11-dijkstra' },
    { id: 'm11-e-rutas', moduleId: 11, title: 'Rutas entre ciudades', kind: 'implementation', difficulty: 'Intermedio', prompt: 'Este espacio no compila ni ejecuta código: la revisión es manual. Implementá Dijkstra para ciudades con tiempos no negativos y reconstruí una ruta al destino usando predecesores.', input: 'Listas ponderadas, origen y destino', expected: 'Código, ruta, distancia y tratamiento de ausencia.', constraints: ['Descartar prioridades obsoletas.', 'No sumar infinito.', 'No aplicar con pesos negativos.'], starter: '// Distancias, cola de prioridad, relajación y reconstrucción', answer: '', accepted: [], hints: ['Guardá el predecesor solo cuando una distancia mejora.', 'Reconstruí desde destino hacia origen y luego invertí; comprobá primero alcanzabilidad.'], solution: 'Inicializar origen a cero; extraer mínimo válido; relajar; al final seguir previo desde el destino y verificar cada arista y suma.', explanation: 'La revisión comprueba costos, empates, inalcanzabilidad y que la ruta reconstruida pertenezca al grafo.', lessonId: 'm11-dijkstra' },
    { id: 'm11-e-bosque', moduleId: 11, title: 'Red mínima y componentes', kind: 'implementation', difficulty: 'Intermedio', prompt: 'Este espacio no compila ni ejecuta código: la revisión es manual. Implementá Kruskal y Union–Find con compresión y unión por tamaño. Devolvé bosque, costo y cantidad de componentes.', input: 'Grafo no dirigido; admite negativos y paralelas', expected: 'Código y justificación por propiedad del corte.', constraints: ['No modificar el orden de entrada.', 'Rechazar ciclos con representantes.', 'No afirmar conectividad si quedan componentes.'], starter: '// UnionFind, ordenar copia y seleccionar aristas seguras', answer: '', accepted: [], hints: ['Una arista se acepta solo si find(u) y find(v) difieren.', 'En un bosque con k componentes se eligen V−k aristas.'], solution: 'Ordenar por peso; unir extremos de componentes distintas y acumular esas aristas; contar componentes y describir desconexión.', explanation: 'La solución debe distinguir expansión mínima y rutas mínimas, además de preservar la partición de Union–Find.', lessonId: 'm11-kruskal' },
  ],
  questions: [
    { id: 'm11-q1', moduleId: 11, type: 'choice', prompt: '¿Cómo representar ausencia sin perder pesos cero?', options: ['Con una señal distinta como null o una matriz de existencia.', 'Usando siempre cero como ausencia.', 'Eliminando todas las aristas de peso cero.'], answer: 0, explanation: 'Una arista de costo cero es una relación válida y no debe confundirse con inexistencia.', lessonId: 'm11-representacion' },
    { id: 'm11-q2', moduleId: 11, type: 'complexity', prompt: '¿Qué espacio requieren las listas de adyacencia?', options: ['Θ(V+E).', 'Θ(V²) obligatoriamente.', 'Θ(E²).'], answer: 0, explanation: 'Hay una lista por vértice y una cantidad constante de entradas por arista.', lessonId: 'm11-representacion' },
    { id: 'm11-q3', moduleId: 11, type: 'truefalse', prompt: 'BFS minimiza suma de pesos arbitrarios no negativos.', options: ['Falso.', 'Verdadero.'], answer: 0, explanation: 'BFS minimiza cantidad de aristas; distintos pesos requieren otro razonamiento como Dijkstra.', lessonId: 'm11-recorridos' },
    { id: 'm11-q4', moduleId: 11, type: 'order', prompt: 'Ordená los pasos de Kahn.', options: ['Calcular entradas → encolar grado cero → emitir y descontar salidas → comprobar cantidad emitida.', 'Ordenar etiquetas → ignorar grados → emitir.', 'Ejecutar Dijkstra → borrar pesos → invertir distancias.'], answer: 0, explanation: 'Los grados representan requisitos pendientes y la cuenta final permite detectar un ciclo.', lessonId: 'm11-topologico' },
    { id: 'm11-q5', moduleId: 11, type: 'prediction', prompt: 'A→B=7, A→C=2, C→B=1. ¿Cuál es distancia A→B?', options: ['3.', '7.', '2.'], answer: 0, explanation: 'El camino A→C→B suma 2+1 y mejora el enlace directo de costo 7.', lessonId: 'm11-dijkstra' },
    { id: 'm11-q6', moduleId: 11, type: 'choice', prompt: '¿Qué requiere la prueba de Dijkstra?', options: ['Todos los pesos no negativos.', 'Grafo necesariamente sin ciclos.', 'Grafo completo.'], answer: 0, explanation: 'La no negatividad impide que un camino pendiente mejore un vértice ya fijado.', lessonId: 'm11-dijkstra' },
    { id: 'm11-q7', moduleId: 11, type: 'truefalse', prompt: 'Un ciclo negativo inalcanzable desde el origen no altera sus distancias.', options: ['Verdadero.', 'Falso.'], answer: 0, explanation: 'No puede formar parte de ningún camino que comience en ese origen.', lessonId: 'm11-bellman' },
    { id: 'm11-q8', moduleId: 11, type: 'complexity', prompt: '¿Cuál es el peor tiempo de Bellman–Ford?', options: ['O(VE).', 'O(log V).', 'O(V) para cualquier grafo.'], answer: 0, explanation: 'Hasta V−1 pasadas examinan todas las aristas, además de la comprobación de ciclo.', lessonId: 'm11-bellman' },
    { id: 'm11-q9', moduleId: 11, type: 'prediction', prompt: 'Un bosque de V=8 vértices termina con k=3 componentes. ¿Cuántas aristas tiene?', options: ['5.', '7.', '11.'], answer: 0, explanation: 'Cada árbol de una componente tiene vértices menos uno; sumar da V−k=5.', lessonId: 'm11-kruskal' },
    { id: 'm11-q10', moduleId: 11, type: 'order', prompt: 'Elegí la secuencia de selección de una herramienta.', options: ['Definir objetivo → revisar dirección y pesos → elegir representación → justificar algoritmo.', 'Elegir Dijkstra → convertir todo peso negativo en cero → dibujar.', 'Medir un ejemplo → declarar óptimo → definir el problema.'], answer: 0, explanation: 'Las hipótesis y el objetivo determinan qué garantía es válida para la red.', lessonId: 'm11-prim-rutas' },
    { id: 'm11-q11', moduleId: 11, type: 'choice', prompt: '¿Qué guarda la clave de Prim para un vértice externo?', options: ['La arista más barata que lo une al conjunto incorporado.', 'La distancia total desde el origen.', 'Su grado de entrada.'], answer: 0, explanation: 'Prim optimiza la conexión de frontera para una expansión, no rutas acumuladas.', lessonId: 'm11-prim-rutas' },
    { id: 'm11-q12', moduleId: 11, type: 'choice', prompt: '¿Qué combinación mejora Union–Find?', options: ['Unión por tamaño y compresión de caminos.', 'Ordenar los padres por etiqueta en cada consulta.', 'Copiar todos los conjuntos en cada find.'], answer: 0, explanation: 'Equilibrar y acortar caminos produce la garantía amortizada de inversa de Ackermann.', lessonId: 'm11-kruskal' },
  ],
  glossary: [
    { term: 'Lista de adyacencia', definition: 'Representación que guarda por vértice sus aristas salientes y usa espacio Θ(V+E).', lessonId: 'm11-representacion' },
    { term: 'Componente conexa', definition: 'Conjunto máximo de vértices mutuamente conectados en un grafo no dirigido.', lessonId: 'm11-recorridos' },
    { term: 'DAG', definition: 'Grafo dirigido sin ciclos, que admite orden topológico.', lessonId: 'm11-topologico' },
    { term: 'Relajación', definition: 'Actualización de una distancia al encontrar un camino más barato mediante una arista.', lessonId: 'm11-dijkstra' },
    { term: 'Ciclo negativo', definition: 'Recorrido cerrado de suma de pesos negativa que puede impedir mínimos finitos en destinos afectados.', lessonId: 'm11-bellman' },
    { term: 'Union–Find', definition: 'Estructura de conjuntos disjuntos con consulta de representante y unión de conjuntos.', lessonId: 'm11-kruskal' },
    { term: 'Expansión mínima', definition: 'Conexión sin ciclos de todos los vértices de una componente con suma total de pesos mínima.', lessonId: 'm11-kruskal' },
    { term: 'Propiedad del corte', definition: 'Garantía de que una arista mínima que cruza un corte compatible puede agregarse de manera segura a una expansión óptima.', lessonId: 'm11-prim-rutas' },
  ],
};
