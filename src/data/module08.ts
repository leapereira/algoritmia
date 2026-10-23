import type { ModuleContent } from './types.js';

export const module08: ModuleContent = {
  moduleId: 8,
  lessons: [
    {
      id: 'm08-hash', moduleId: 8, title: 'De una clave a una posición', duration: 26,
      summary: 'Construí el contrato de una función hash y distinguí igualdad, código hash e índice de tabla.',
      objectives: ['Relacionar claves iguales con hashes iguales.', 'Explicar por qué las colisiones son inevitables.', 'Separar costo de calcular hash y costo de consultar tabla.'], prerequisites: ['Arreglos, igualdad de objetos y complejidad.'],
      sections: [
        { title: 'Una clave identifica una asociación', paragraphs: [
          'Un mapa almacena asociaciones entre claves y valores. Buscar una clave devuelve su valor asociado; agregar una clave existente reemplaza la asociación según el contrato elegido. Un conjunto guarda pertenencia sin un valor independiente. En ambos casos necesitamos decidir qué significa que dos claves sean iguales: para int es igualdad numérica y para objetos suele ser igualdad lógica mediante equals.',
          'Una tabla hash usa una función para convertir una clave en un código entero y luego comprime ese código al rango de posiciones del arreglo. Son dos pasos conceptuales distintos. El código hash no es necesariamente un índice válido: puede ser negativo o mayor que la capacidad. Tampoco es una identificación única de la clave.',
        ] },
        { title: 'El contrato de igualdad es una dirección', paragraphs: [
          'Si dos claves son iguales, deben producir el mismo hash. La condición inversa no se exige: dos claves diferentes pueden compartir código. Después de llegar a una posición candidata, la tabla todavía debe comprobar igualdad para decidir si encontró la asociación buscada. Comparar solamente hashes confunde claves distintas que colisionan.',
          'En Java, al redefinir equals normalmente debemos redefinir hashCode de manera coherente. Una clave almacenada no debe cambiar de forma que altere su igualdad o su hash: podría quedar en una posición incompatible con las futuras búsquedas. Que el objeto siga existiendo no evita que la tabla pierda su camino para encontrarlo. Las claves inmutables simplifican ese contrato.',
        ] },
        { title: 'Colisiones y dispersión', paragraphs: [
          'Si el universo de claves tiene más elementos que la cantidad de casillas, el principio del palomar obliga a que algunas claves compartan posición. A esa coincidencia la llamamos colisión. Una función útil intenta distribuir las claves de trabajo de manera equilibrada; no elimina matemáticamente todas las colisiones ni asegura una buena distribución para cualquier conjunto adversarial.',
          'Para comprimir usamos Math.floorMod(hash, capacidad) con capacidad positiva. Math.abs(hash) % capacidad falla con Integer.MIN_VALUE, cuyo valor absoluto no es representable como int. El operador % de Java puede dejar un resto negativo, por lo que tampoco debemos usar directamente hash % capacidad sin corregir su rango.',
          'El ejemplo de cadenas acumula h = 31h + carácter. El desbordamiento de int forma parte de este cálculo de hash y Java lo define con aritmética modular de 32 bits. Eso es distinto de un contador matemático que accidentalmente desborda. Las cadenas Aa y BB producen el mismo código en esta regla y permiten probar la resolución de colisiones.',
        ] },
        { title: 'Costo y límites de la promesa', paragraphs: [
          'Calcular el hash de una cadena nueva de longitud L puede requerir Θ(L); comparar dos cadenas también puede inspeccionar muchos caracteres. Decir que consultar una tabla es esperado constante suele abstraer esos costos o suponer claves de tamaño acotado y hashes disponibles. Para analizar una aplicación con claves largas debemos volver a incorporarlos.',
          'Un hash para tablas busca dispersión y rapidez. No debemos atribuirle propiedades criptográficas: este ejemplo no protege contraseñas ni demuestra resistencia frente a entradas elegidas para colisionar. Lo que necesitamos aquí es corrección de igualdad y una hipótesis explícita sobre distribución para estudiar rendimiento.',
          'La tabla completa necesita una estrategia de colisiones. En las próximas lecciones veremos listas por casilla y búsqueda de otra posición en el mismo arreglo. La función hash y esa estrategia colaboran: una distribución razonable no corrige un algoritmo que deja de buscar antes de tiempo, y una estrategia correcta no garantiza rapidez si todas las claves terminan juntas.',
        ] },
      ],
      complexity: { time: 'Θ(L) para calcular el hash de una cadena', space: 'Θ(1) auxiliar', explanation: 'Se procesa cada unidad char de la cadena y se conserva un acumulador int. La posición final está entre 0 y capacidad − 1 mediante floorMod.' },
      pitfalls: ['Suponer que hashes iguales implican claves iguales.', 'Usar Math.abs con Integer.MIN_VALUE para indexar.', 'Mutar campos de igualdad de una clave ya insertada.'],
      solved: { title: 'Hash de cadena y compresión segura', explanation: 'El método no implementa una tabla: solo obtiene una posición. El resultado de Aa y BB coincide, demostrando por qué otra etapa debe resolver colisiones.', code: `static int indiceCadena(String clave, int capacidad) {
    if (clave == null || capacidad <= 0) throw new IllegalArgumentException();
    int hash = 0;
    for (int i = 0; i < clave.length(); i++) {
        hash = 31 * hash + clave.charAt(i);
    }
    return Math.floorMod(hash, capacidad);
}` },
      practice: { title: 'Claves de estudiante', prompt: 'Diseñá una clave inmutable EstudianteId cuyo equals compare país y número. Escribí un hashCode coherente, explicá por qué el nombre visible no debería intervenir y construí una prueba de claves iguales creadas como objetos distintos. Buscá además dos claves distintas que caigan en la misma casilla de una capacidad pequeña.' },
      takeaways: ['Igualdad implica mismo hash; mismo hash no implica igualdad.', 'Las colisiones necesitan una resolución explícita.', 'Tiempo esperado constante puede ocultar el costo de procesar una clave larga.'], lab: 'hash',
    },
    {
      id: 'm08-encadenamiento', moduleId: 8, title: 'Encadenamiento separado desde cero', duration: 29,
      summary: 'Implementá búsqueda, actualización y eliminación con un arreglo de listas enlazadas.',
      objectives: ['Conservar todas las claves que comparten casilla.', 'Actualizar sin duplicar claves.', 'Relacionar factor de carga y longitud de cadenas.'], prerequisites: ['Funciones hash y listas simplemente enlazadas.'],
      sections: [
        { title: 'Una lista por casilla', paragraphs: [
          'El encadenamiento separado guarda en cada posición del arreglo una referencia al primer nodo de una lista. Cada nodo contiene clave, valor y siguiente. Todas las claves de esa lista tienen el mismo índice comprimido, pero pueden tener códigos hash distintos. Una casilla vacía se representa con null.',
          'La invariante exige que cada asociación esté en la lista indicada por su clave, que ninguna clave lógica aparezca dos veces y que cantidad coincida con el total de nodos. Buscar calcula el índice y recorre esa lista comparando claves. Nunca necesita revisar las demás listas si las invariantes y el contrato de hash se mantienen.',
        ] },
        { title: 'Insertar no siempre agrega', paragraphs: [
          'put debe recorrer primero la cadena para comprobar si la clave existe. Si la encuentra, cambia el valor y conserva la cantidad de asociaciones. Si no existe, crea un nodo, por ejemplo al principio. Ese recorrido es necesario incluso si insertar un nodo en la cabeza cuesta tiempo constante: el TAD mapa exige una única asociación por clave.',
          'Elegimos claves int y valores String no nulos. get devuelve null si la clave está ausente, así que prohibir valores nulos elimina la ambigüedad entre ausencia y una asociación cuyo valor sea null. Es una decisión de esta implementación; otras API permiten null y ofrecen containsKey para distinguir los estados.',
        ] },
        { title: 'Eliminar conserva el resto de la cadena', paragraphs: [
          'Al eliminar necesitamos el nodo actual y el anterior. Si la coincidencia está en la cabeza, cambiamos la referencia de la casilla; si está después, enlazamos anterior.siguiente con actual.siguiente. Al encontrarla decrementamos cantidad una sola vez. Si la clave no aparece, no cambiamos la tabla.',
          'Eliminar la cabeza, un nodo interior, el último y el único nodo son pruebas distintas de la misma operación. En cada caso, las asociaciones que no retiramos deben seguir alcanzables. En Java el nodo desconectado podrá ser recolectado si no quedan referencias externas; mantenerlo privado evita que otro código altere los enlaces. También probamos eliminar dos veces la misma clave: la segunda operación debe indicar ausencia y conservar tanto la cantidad como las asociaciones restantes.',
        ] },
        { title: 'Costo según distribución y carga', paragraphs: [
          'Con n asociaciones y m casillas, el factor de carga es α = n/m. Bajo una distribución suficientemente uniforme, la longitud esperada de una cadena es proporcional a α y las operaciones tienen tiempo esperado O(1 + α), además de calcular el hash y comparar claves. Si mantenemos α acotado, esta parte del costo es esperada constante.',
          'El peor caso sigue siendo Θ(n): todas las claves pueden caer en una misma cadena. En encadenamiento α puede superar uno porque una casilla admite varios nodos. Eso no significa que resulte conveniente dejarlo crecer sin límite; aumentar las casillas permite controlar la longitud esperada a cambio de memoria.',
          'La tabla resuelta mantiene capacidad fija para aislar la estrategia de colisión. Elegí capacidad 3 e insertá 1, 4 y 7: las tres claves comparten casilla. Actualizá 4 y comprobá que cantidad no crece. Después retiralas en diferentes órdenes y verificá búsquedas de las restantes. Estas colisiones deliberadas son más informativas que una prueba donde cada clave cae en una posición distinta.',
        ] },
      ],
      complexity: { time: 'O(1 + α) esperado; Θ(n) peor caso', space: 'Θ(m + n)', explanation: 'm referencias de casilla y n nodos almacenan la tabla. Las garantías esperadas requieren hipótesis de dispersión; esta versión no redimensiona.' },
      pitfalls: ['Agregar otro nodo al actualizar una clave existente.', 'Perder el resto de la cadena al eliminar su cabeza.', 'Creer que encadenamiento exige α < 1.'],
      solved: { title: 'Mapa int → String con cadenas', explanation: 'La clase utiliza únicamente arreglos y nodos propios. null significa clave ausente; por eso los valores nulos se rechazan. El índice admite claves negativas.', code: `static final class TablaCadenas {
    private static final class Nodo {
        final int clave; String valor; Nodo siguiente;
        Nodo(int c, String v, Nodo s) { clave=c; valor=v; siguiente=s; }
    }
    private final Nodo[] tabla;
    private int cantidad;
    TablaCadenas(int capacidad) {
        if (capacidad <= 0) throw new IllegalArgumentException();
        tabla = new Nodo[capacidad];
    }
    int cantidad() { return cantidad; }
    String get(int clave) {
        for (Nodo n=tabla[Math.floorMod(clave,tabla.length)]; n!=null; n=n.siguiente)
            if (n.clave==clave) return n.valor;
        return null;
    }
    void put(int clave, String valor) {
        if (valor==null) throw new IllegalArgumentException("Valor nulo");
        int i=Math.floorMod(clave,tabla.length);
        for (Nodo n=tabla[i]; n!=null; n=n.siguiente)
            if (n.clave==clave) { n.valor=valor; return; }
        tabla[i]=new Nodo(clave,valor,tabla[i]); cantidad++;
    }
    String remove(int clave) {
        int i=Math.floorMod(clave,tabla.length); Nodo anterior=null;
        for (Nodo n=tabla[i]; n!=null; n=n.siguiente) {
            if (n.clave==clave) {
                if (anterior==null) tabla[i]=n.siguiente; else anterior.siguiente=n.siguiente;
                cantidad--; return n.valor;
            }
            anterior=n;
        }
        return null;
    }
}` },
      practice: { title: 'Tabla sin colecciones predefinidas', prompt: 'Extendé TablaCadenas con containsKey y keys, donde keys devuelve un int[] de tamaño exacto. No utilices Map, List ni Set. Conservá las invariantes con colisiones forzadas y claves negativas. Documentá qué orden de claves garantiza tu API y verificá que actualizar no cambia cantidad.' },
      takeaways: ['Las listas separadas conservan todas las claves de una casilla.', 'put debe distinguir actualización e inserción.', 'La carga y la distribución explican la longitud esperada de las cadenas.'], lab: 'hash',
    },
    {
      id: 'm08-sondeos', moduleId: 8, title: 'Direccionamiento abierto y secuencias de sondeo', duration: 32,
      summary: 'Guardá las asociaciones dentro del arreglo y diseñá búsquedas y eliminaciones que no rompan las secuencias de colisión.',
      objectives: ['Comparar sondeo lineal, cuadrático y doble hashing.', 'Usar estados vacío, ocupado y borrado.', 'Garantizar que un sondeo termina.'], prerequisites: ['Hashing y factor de carga.'],
      sections: [
        { title: 'Las colisiones buscan otra posición', paragraphs: [
          'En direccionamiento abierto cada asociación ocupa una casilla del propio arreglo. Cuando la posición inicial está ocupada por otra clave, seguimos una secuencia de sondeo. Búsqueda, inserción y eliminación deben reproducir la misma secuencia para esa clave. Una tabla con m casillas no puede almacenar más de m asociaciones simultáneas.',
          'El sondeo lineal prueba h, h+1, h+2… módulo m. Visita todas las posiciones si dejamos hasta m intentos, pero tiende a formar bloques contiguos de ocupación, llamados agrupamiento primario. A medida que la carga se aproxima a uno, una búsqueda ausente puede atravesar bloques largos. Mantener espacio libre ayuda tanto a insertar como a decidir ausencia.',
        ] },
        { title: 'Cuadrático y doble hashing', paragraphs: [
          'El sondeo cuadrático usa una expresión como h + c₁i + c₂i² módulo m. Separa más los primeros intentos y reduce el agrupamiento primario, pero las claves con el mismo inicio siguen la misma secuencia: existe agrupamiento secundario. No cualquier elección de capacidad y coeficientes visita toda la tabla. Debemos usar una política con condiciones conocidas o limitar la carga y verificar cobertura.',
          'El doble hashing usa h₁ + i·h₂ módulo m. El paso h₂ debe ser distinto de cero y coprimo con m para visitar todas las posiciones. Si m es primo, podemos elegir un paso entre 1 y m−1. Para una capacidad potencia de dos, un paso impar es coprimo. Al calcular i·h₂ con int podemos desbordar; usar long en la expresión evita confundir el modelo con ese error.',
        ] },
        { title: 'Borrar no equivale a vaciar', paragraphs: [
          'Supongamos que 1 y 6 colisionan en capacidad 5. Si 1 ocupa la posición inicial y 6 la siguiente, borrar 1 convirtiendo su casilla en vacía haría que una búsqueda de 6 se detuviera antes de encontrarlo. Necesitamos una marca de borrado que permita continuar el sondeo.',
          'Una posición nunca utilizada permite concluir ausencia; una posición borrada no. Al insertar podemos recordar la primera marca borrada, pero debemos seguir buscando una clave existente antes de reutilizarla. De lo contrario podríamos crear dos asociaciones con la misma clave. Limitamos el recorrido a m intentos para terminar incluso si no queda ninguna posición nunca utilizada.',
        ] },
        { title: 'Invariantes y costo real de las marcas', paragraphs: [
          'La invariante principal dice que buscar una clave almacenada nunca encuentra una casilla nunca usada antes de su posición. Las marcas de borrado preservan ese camino. Aunque cantidad disminuya, muchas marcas pueden alargar las búsquedas; por eso algunas políticas reconstruyen la tabla también por acumulación de borrados, y no solamente por la carga de asociaciones vivas.',
          'La implementación siguiente utiliza sondeo lineal y capacidad fija para mostrar todos los estados. Guardamos las claves, los valores y los estados en arreglos paralelos. Un valor null representa ausencia para el llamador y no se permite como asociación. Una tabla llena rechaza una clave nueva, pero todavía permite actualizar una existente.',
          'El tiempo esperado constante requiere una carga alejada de uno y supuestos sobre la distribución. El peor caso es lineal en m, incluso para una búsqueda ausente. El ahorro de nodos no elimina esa posibilidad: cambiar la representación cambia los compromisos de memoria y localidad, no la necesidad de analizar cuidadosamente las colisiones.',
        ] },
      ],
      complexity: { time: 'O(m) peor caso por operación', space: 'Θ(m)', explanation: 'Cada operación realiza como máximo m sondeos. Con carga controlada y dispersión adecuada, el costo esperado puede ser constante; las marcas de borrado también influyen.' },
      pitfalls: ['Convertir una casilla borrada en nunca usada y cortar búsquedas futuras.', 'Insertar inmediatamente en la primera marca sin buscar una clave existente.', 'Usar un paso de doble hashing que no sea coprimo con la capacidad.'],
      solved: { title: 'Sondeo lineal con marcas de borrado', explanation: 'Los estados son 0 nunca usada, 1 ocupada y 2 borrada. El recorrido acotado evita ciclos infinitos en una tabla llena o cubierta de marcas.', code: `static final class TablaSondeo {
    private final int[] claves; private final String[] valores; private final byte[] estado;
    TablaSondeo(int m) {
        if (m<=0) throw new IllegalArgumentException();
        claves=new int[m]; valores=new String[m]; estado=new byte[m];
    }
    private int siguiente(int i) { return i+1==claves.length ? 0 : i+1; }
    String get(int clave) {
        int i=Math.floorMod(clave,claves.length);
        for (int pasos=0; pasos<claves.length; pasos++,i=siguiente(i)) {
            if (estado[i]==0) return null;
            if (estado[i]==1 && claves[i]==clave) return valores[i];
        }
        return null;
    }
    void put(int clave,String valor) {
        if (valor==null) throw new IllegalArgumentException();
        int i=Math.floorMod(clave,claves.length), borrada=-1;
        for (int pasos=0; pasos<claves.length; pasos++,i=siguiente(i)) {
            if (estado[i]==1 && claves[i]==clave) { valores[i]=valor; return; }
            if (estado[i]==2 && borrada<0) borrada=i;
            if (estado[i]==0) { guardar(borrada<0 ? i : borrada,clave,valor); return; }
        }
        if (borrada>=0) { guardar(borrada,clave,valor); return; }
        throw new IllegalStateException("Tabla llena");
    }
    private void guardar(int i,int clave,String valor) {
        claves[i]=clave; valores[i]=valor; estado[i]=1;
    }
    String remove(int clave) {
        int i=Math.floorMod(clave,claves.length);
        for (int pasos=0; pasos<claves.length; pasos++,i=siguiente(i)) {
            if (estado[i]==0) return null;
            if (estado[i]==1 && claves[i]==clave) {
                String anterior=valores[i]; valores[i]=null; estado[i]=2; return anterior;
            }
        }
        return null;
    }
}` },
      practice: { title: 'Comparar tres sondeos', prompt: 'Para capacidad prima 7 y claves 0, 7, 14 y 21, trazá sondeo lineal, cuadrático h+i² y doble hashing con h₁=floorMod(clave,7), h₂=1+floorMod(clave,6). Limitá cada recorrido a 7 intentos y explicá por qué no debés generalizar la cobertura del caso cuadrático sin condiciones. Luego probá borrado y reinserción con la implementación lineal.' },
      takeaways: ['El sondeo reproduce una secuencia determinista por clave.', 'Una marca borrada mantiene el camino de búsqueda.', 'Cubrir la tabla y controlar la carga son requisitos diferentes.'], lab: 'hash',
    },
    {
      id: 'm08-rehash', moduleId: 8, title: 'Carga, rehashing y amortización', duration: 28,
      summary: 'Redimensioná una tabla reconstruyendo sus posiciones y separá la expectativa por colisiones de la amortización de copias.',
      objectives: ['Calcular el factor de carga.', 'Reinsertar al cambiar capacidad.', 'Distinguir esperado, amortizado y peor caso.'], prerequisites: ['Análisis amortizado.', 'Direccionamiento abierto.'],
      sections: [
        { title: 'La carga mide ocupación relativa', paragraphs: [
          'El factor de carga α = n/m compara asociaciones y capacidad. En direccionamiento abierto debe ser como máximo uno y es conveniente crecer antes de acercarse demasiado a ese límite. El umbral concreto depende de la política y del costo que buscamos. Usaremos tres cuartos como una decisión didáctica, sin atribuirle una propiedad universal.',
          'La carga de elementos vivos puede ser pequeña y aun así haber muchos sondeos si existen marcas de borrado. Una política completa puede considerar ocupadas más borradas, reconstruir en igual capacidad para limpiar marcas o aumentar capacidad. En encadenamiento, en cambio, α puede superar uno y representa longitud media de cadena, no porcentaje literal de casillas ocupadas.',
        ] },
        { title: 'Cambiar capacidad cambia el índice', paragraphs: [
          'Si el índice se calcula módulo m, duplicar m puede cambiar la posición inicial de cada clave. Copiar el arreglo a otro mayor y dejar los elementos donde estaban no basta. Rehashing significa reconstruir la representación con la nueva capacidad, recalculando posiciones y resolviendo de nuevo las colisiones.',
          'La implementación conserva una referencia a los arreglos anteriores, crea los nuevos, reinicia cantidad y reinserta cada asociación. Usamos un auxiliar que no vuelve a disparar expansión durante la reconstrucción. Actualizar una clave existente no aumenta cantidad ni necesita crecer: por eso primero averiguamos si ya está almacenada.',
        ] },
        { title: 'Dos argumentos de rendimiento distintos', paragraphs: [
          'Con capacidad que se duplica, los tamaños de reconstrucción forman una serie geométrica. Si reinsertar cada asociación tiene costo esperado constante bajo las hipótesis de dispersión y carga, el trabajo esperado acumulado de reconstrucción en una secuencia de n inserciones es O(n). La inserción resulta esperada y amortizada O(1).',
          'La expectativa corresponde al comportamiento de las colisiones; la amortización corresponde a repartir las expansiones entre operaciones. No son sinónimos ni se sustituyen. Con claves adversariales que formen un bloque largo, una reconstrucción mediante sondeo puede costar Θ(n²), y una operación ordinaria puede costar Θ(n). No debemos prometer una cota lineal determinista de rehash para cualquier tabla implementada así.',
        ] },
        { title: 'Diseñar también las transiciones', paragraphs: [
          'Crecer y reducir con el mismo umbral puede producir oscilación: insertar dispara crecimiento y retirar dispara reducción repetidamente. Una política con histéresis separa umbrales, por ejemplo crecer con carga alta y reducir solo cuando es mucho menor. El análisis amortizado debe incluir la secuencia completa de operaciones que admite la estructura.',
          'Esta versión no implementa borrado para concentrarse en expansión y actualización. Las claves y valores son int; get usa Integer para representar ausencia con null. El arreglo booleano distingue una casilla no ocupada de una que almacena la clave cero. Reservar un número especial como clave vacía excluiría un dato legítimo del contrato.',
          'La duplicación comprueba el límite representable antes de calcular la nueva capacidad. Eso evita overflow aritmético, aunque una asignación puede fallar antes por falta de memoria. Durante la expansión coexisten almacenamiento viejo y nuevo, ambos lineales. La eficiencia asintótica no elimina esos límites de recursos ni hace invisible el costo de una inserción que reconstruye toda la tabla. Para una aplicación con latencia estricta, puede ser necesario reservar capacidad anticipadamente o distribuir la migración entre varias operaciones con invariantes más complejas.',
        ] },
      ],
      complexity: { time: 'O(1) esperado y amortizado por put', space: 'Θ(n) con crecimiento geométrico', explanation: 'La cota necesita dispersión adecuada y carga acotada. Una expansión tiene costo esperado Θ(n), pero puede ser cuadrática con colisiones patológicas en esta reinserción por sondeo.' },
      pitfalls: ['Copiar posiciones viejas sin recalcular sus índices.', 'Llamar amortización a una hipótesis probabilística de hash.', 'Expandir al actualizar una clave sin aumentar cantidad.'],
      solved: { title: 'Tabla dinámica sin colecciones', explanation: 'El sondeo lineal siempre dispone de una casilla libre con el umbral elegido. La reconstrucción inserta en arreglos nuevos y no usa Map ni List.', code: `static final class TablaRehash {
    private int[] claves=new int[4], valores=new int[4];
    private boolean[] usada=new boolean[4]; private int cantidad;
    private int posicion(int clave) {
        int i=Math.floorMod(clave,claves.length);
        while (usada[i] && claves[i]!=clave) i=(i+1)%claves.length;
        return i;
    }
    Integer get(int clave) { int i=posicion(clave); return usada[i] ? valores[i] : null; }
    void put(int clave,int valor) {
        int i=posicion(clave);
        if (usada[i]) { valores[i]=valor; return; }
        if ((cantidad+1L)*4 > claves.length*3L) expandir();
        insertar(clave,valor);
    }
    private void insertar(int clave,int valor) {
        int i=posicion(clave); usada[i]=true; claves[i]=clave; valores[i]=valor; cantidad++;
    }
    private void expandir() {
        if (claves.length>Integer.MAX_VALUE/2) throw new IllegalStateException("Capacidad máxima");
        int[] anteriores=claves, valoresAnteriores=valores; boolean[] ocupadas=usada;
        claves=new int[anteriores.length*2]; valores=new int[claves.length]; usada=new boolean[claves.length]; cantidad=0;
        for (int i=0;i<anteriores.length;i++) if (ocupadas[i]) insertar(anteriores[i],valoresAnteriores[i]);
    }
}` },
      practice: { title: 'Medir sondeos y reconstrucciones', prompt: 'Instrumentá TablaRehash con contadores separados de sondeos ordinarios, sondeos durante reconstrucción y cantidad de expansiones. Insertá claves consecutivas y luego múltiplos de una potencia de dos. Explicá qué evidencia aporta cada experimento y por qué no prueba una garantía de peor caso constante.' },
      takeaways: ['Rehashing reconstruye posiciones según la capacidad nueva.', 'Esperado describe colisiones; amortizado distribuye expansiones.', 'Los umbrales y la política de borrado forman parte de la garantía.'], lab: 'hash',
    },
    {
      id: 'm08-map-set', moduleId: 8, title: 'Map, Set y decisiones de uso', duration: 26,
      summary: 'Usá mapas y conjuntos con contratos claros y aplicá una tabla propia al conteo de frecuencias.',
      objectives: ['Distinguir interfaz y familia de implementación.', 'Usar presencia, actualización y pertenencia correctamente.', 'Construir frecuencias sin colecciones predefinidas.'], prerequisites: ['TAD, tablas y colisiones.', 'Genéricos de Java.'],
      sections: [
        { title: 'Una interfaz no promete un algoritmo', paragraphs: [
          'Map<K,V> define asociaciones y Set<E> define pertenencia sin duplicados lógicos. HashMap y HashSet son implementaciones basadas en hashing. El contrato de interfaz no obliga a usar una tabla hash ni promete consultas constantes: una implementación ordenada puede apoyarse en árboles y ofrecer otras operaciones y costos.',
          'HashSet puede entenderse conceptualmente como un mapa que conserva una marca de presencia por elemento. Agregar un elemento existente no crea otra copia lógica. En un mapa, put reemplaza el valor de una clave existente y puede devolver el anterior según su API. Elegir correctamente entre mapa y conjunto expresa qué información realmente necesita el algoritmo.',
        ] },
        { title: 'Ausencia, nulos y orden de iteración', paragraphs: [
          'Si una implementación admite valores null, get(clave)==null no distingue ausencia de una asociación con valor nulo. containsKey responde la pregunta de presencia. En cambio, nuestra tabla propia prohibió valores nulos y pudo usar null sin esa ambigüedad. Al cambiar de implementación debemos revisar estas decisiones, no trasladar mecánicamente condiciones.',
          'HashMap no promete un orden específico de iteración. Un algoritmo que necesita orden de inserción puede elegir una estructura cuyo contrato lo garantice, y uno que necesita orden por clave puede elegir un mapa ordenado. No debemos convertir el orden observado en una ejecución particular en una garantía. Las pruebas deben comparar asociaciones, salvo que el contrato incluya explícitamente una secuencia.',
        ] },
        { title: 'Frecuencias son una actualización por clave', paragraphs: [
          'Para contar apariciones recorremos los valores de entrada. Cada valor es una clave y su frecuencia es el dato asociado. Si no aparece en la tabla, creamos frecuencia uno; si aparece, incrementamos. La invariante afirma que después de procesar un prefijo, la tabla almacena exactamente las frecuencias de ese prefijo.',
          'La solución resuelta construye nodos y arreglos propios, sin Map, Set o List. Cada contador cabe en int porque no supera la longitud de un arreglo int[] de Java. La cantidad de claves distintas d puede ser mucho menor que n: la tabla de frecuencias ocupa Θ(m+d), no un nodo por cada aparición. Aun así, el recorrido debe inspeccionar las n posiciones, incluso cuando todos los números coinciden.',
        ] },
        { title: 'Garantías y elección responsable', paragraphs: [
          'Con carga controlada y dispersión razonable, una tabla permite una cantidad esperada constante de pasos por acceso. El peor caso abstracto puede ser lineal por operación y cuadrático para construir con n inserciones adversariales. Algunas bibliotecas aplican defensas adicionales frente a colisiones; sus detalles no deben convertirse en una garantía genérica de cualquier tabla ni de toda implementación de Map.',
          'Para claves largas sumamos además el costo de hash y de igualdad. Para claves mutables revisamos estabilidad. Para conjuntos pequeños, un arreglo y recorrido lineal pueden ser una opción simple; para muchos accesos de pertenencia, guardar información auxiliar puede compensar. Las necesidades de orden, memoria y actualización modifican la elección.',
          'Como práctica integradora, compará la tabla encadenada y la de sondeo usando el mismo contrato público. Deben responder igual ante claves negativas, actualizaciones y ausencias, aunque sus arreglos internos difieran. Probar ambas contra una implementación de referencia ayuda a detectar errores, pero la entrega de una tabla desde cero debe conservar sus propios nodos o arreglos para mostrar el mecanismo estudiado.',
        ] },
      ],
      complexity: { time: 'O(n·(1+d/m)) esperado para construir frecuencias', space: 'Θ(m+d)', explanation: 'n es la longitud, d las claves distintas y m las casillas fijas. La cota supone dispersión; si m crece con d, el tiempo esperado es O(n). El peor caso con cadenas largas puede ser O(nd).' },
      pitfalls: ['Usar get == null como prueba de ausencia cuando null es un valor admitido.', 'Depender del orden observado de HashMap.', 'Confundir número de apariciones n con claves distintas d.'],
      solved: { title: 'Frecuencias con tabla propia', explanation: 'La clase representa claves enteras y sus contadores. No usa colecciones predefinidas y consulta 0 cuando una clave nunca fue agregada.', code: `static final class Frecuencias {
    private static final class Nodo {
        final int clave; int cuenta=1; Nodo siguiente;
        Nodo(int clave,Nodo siguiente) { this.clave=clave; this.siguiente=siguiente; }
    }
    private final Nodo[] tabla;
    Frecuencias(int casillas) {
        if (casillas<=0) throw new IllegalArgumentException();
        tabla=new Nodo[casillas];
    }
    void agregar(int clave) {
        int i=Math.floorMod(clave,tabla.length);
        for (Nodo n=tabla[i];n!=null;n=n.siguiente) if (n.clave==clave) { n.cuenta=Math.incrementExact(n.cuenta); return; }
        tabla[i]=new Nodo(clave,tabla[i]);
    }
    int cantidad(int clave) {
        for (Nodo n=tabla[Math.floorMod(clave,tabla.length)];n!=null;n=n.siguiente) if(n.clave==clave)return n.cuenta;
        return 0;
    }
}` },
      practice: { title: 'Dos implementaciones, un contrato', prompt: 'Definí un contrato int → String sin valores nulos y verificá tus tablas de cadenas y sondeo con la misma secuencia de operaciones. Incluí actualización tras una marca borrada, tabla llena, claves negativas y eliminación ausente. Después implementá frecuencias con HashMap y compará asociaciones con la tabla propia, sin depender del orden de iteración.' },
      takeaways: ['Map y Set expresan contratos diferentes de asociación y pertenencia.', 'HashMap es una implementación, no una promesa de toda la interfaz.', 'Ausencia, igualdad y orden deben figurar en el diseño.'], lab: 'hash',
    },
  ],
  exercises: [
    { id: 'm08-e-indice', moduleId: 8, title: 'Índice negativo seguro', kind: 'prediction', difficulty: 'Inicial', prompt: '¿Qué índice devuelve Math.floorMod(−8, 5)?', input: 'hash = −8; capacidad = 5', expected: '2', constraints: ['La capacidad es positiva.'], starter: '', answer: '2', accepted: [], hints: ['El índice nunca puede ser negativo.', 'Buscá r entre 0 y 4 tal que −8 = 5q + r.'], solution: '−8 = (−2)·5 + 2', explanation: 'El índice final pertenece al rango del arreglo aunque el código hash sea negativo.', lessonId: 'm08-hash' },
    { id: 'm08-e-peor', moduleId: 8, title: 'Una sola cadena', kind: 'complexity', difficulty: 'Inicial', prompt: 'n claves distintas colisionan en una misma lista. ¿Cuánto cuesta buscar una clave ausente en esa lista?', input: 'Encadenamiento; igualdad y hash de costo constante', expected: 'Theta(n)', constraints: ['Dar cota ajustada.'], starter: '', answer: 'Theta(n)', accepted: ['Θ(n)', 'lineal'], hints: ['Todas las claves candidatas quedaron en la misma lista.', 'La ausencia exige revisar todos los nodos.'], solution: 'Θ(n)', explanation: 'La buena distribución es una hipótesis de rendimiento esperado, no una garantía de este peor caso.', lessonId: 'm08-encadenamiento' },
    { id: 'm08-e-borrado', moduleId: 8, title: 'Un borrado corta la búsqueda', kind: 'debug', difficulty: 'Intermedio', prompt: 'Con capacidad 5 y sondeo lineal, 1 ocupa la posición 1 y 6 la posición 2. Se elimina 1. ¿Qué estado debe quedar en la posición 1 para conservar la búsqueda de 6?', input: 'Estados posibles: nunca usada, ocupada, borrada', expected: 'borrada', constraints: ['No reconstruir el bloque.'], starter: 'estado[1] = 0; // error', answer: 'borrada', accepted: ['2', 'marca borrada'], hints: ['6 sigue estando después de la casilla que ocupaba 1.', 'Una búsqueda no debe detenerse allí: elegí un estado que permita continuar.'], solution: 'estado[1] = 2; valores[1] = null;', explanation: 'Nunca usada permite concluir ausencia, pero borrada obliga a continuar la secuencia de sondeo.', lessonId: 'm08-sondeos' },
    { id: 'm08-e-tabla', moduleId: 8, title: 'Mapa desde cero', kind: 'implementation', difficulty: 'Intermedio', prompt: 'Este espacio no compila ni ejecuta código: la revisión es manual. Construí una tabla int → String con arreglos y nodos propios, put, get, remove y cantidad. No utilices colecciones predefinidas.', input: 'Claves int; valores String no nulos; capacidad positiva', expected: 'Implementación y pruebas de colisiones.', constraints: ['Actualizar no agrega una clave.', 'Admitir Integer.MIN_VALUE.', 'Definir ausencia.'], starter: 'static final class MiTabla {\n    // Representación y operaciones\n}', answer: '', accepted: [], hints: ['Una asociación debe quedar en la lista indicada por su clave.', 'Usá floorMod y recorré la cadena antes de insertar para evitar duplicados.'], solution: 'Arreglo de cabezas; nodos clave/valor/siguiente; buscar y actualizar en una sola lista; eliminar con referencia al anterior.', explanation: 'La revisión comprueba unicidad, preservación de enlaces, cantidad y casos de cabeza/medio/último. El mecanismo debe ser propio.', lessonId: 'm08-encadenamiento' },
    { id: 'm08-e-rehash', moduleId: 8, title: 'Expandir con invariantes', kind: 'implementation', difficulty: 'Intermedio', prompt: 'Este espacio no compila ni ejecuta código: la revisión es manual. Agregá expansión geométrica a tu tabla y explicá cómo se reconstruyen las posiciones. Separá en el análisis colisiones esperadas y costo amortizado.', input: 'Crecer cuando la nueva carga supera 3/4', expected: 'Código y justificación de la secuencia.', constraints: ['No copiar índices sin reinsertar.', 'No expandir por actualizar una clave.', 'Controlar desbordamiento de capacidad.'], starter: 'private void rehash(int nuevaCapacidad) {\n    // Tu solución\n}', answer: '', accepted: [], hints: ['La nueva capacidad cambia el módulo y por eso las posiciones.', 'Guardá arreglos viejos y usá un auxiliar sin expansión recursiva.'], solution: 'Crear almacenamiento nuevo, reiniciar cantidad y reinsertar cada asociación con el módulo nuevo. Las capacidades geométricas acotan el trabajo esperado total de reconstrucciones.', explanation: 'La amortización no elimina el peor caso patológico de colisiones. La memoria simultánea incluye almacenamiento viejo y nuevo.', lessonId: 'm08-rehash' },
  ],
  questions: [
    { id: 'm08-q1', moduleId: 8, type: 'choice', prompt: '¿Qué implica equals(a,b) verdadero?', options: ['Sus hashes deben coincidir.', 'Sus referencias deben ser idénticas.', 'Ninguna otra clave puede tener ese hash.'], answer: 0, explanation: 'La igualdad exige coherencia de hash, pero no unicidad.', lessonId: 'm08-hash' },
    { id: 'm08-q2', moduleId: 8, type: 'truefalse', prompt: 'Dos claves distintas pueden compartir código hash.', options: ['Verdadero.', 'Falso.'], answer: 0, explanation: 'Las colisiones son posibles e inevitables en universos mayores que el rango.', lessonId: 'm08-hash' },
    { id: 'm08-q3', moduleId: 8, type: 'prediction', prompt: 'Una tabla tiene 12 asociaciones y 8 casillas. ¿Cuál es α?', options: ['1,5.', '0,666…', '4.'], answer: 0, explanation: 'α=n/m=12/8. Es válido para encadenamiento.', lessonId: 'm08-encadenamiento' },
    { id: 'm08-q4', moduleId: 8, type: 'complexity', prompt: 'Bajo dispersión uniforme, una operación de encadenamiento cuesta…', options: ['O(1+α) esperado.', 'Θ(log n) garantizado.', 'Θ(1) para cualquier α y claves.'], answer: 0, explanation: 'La longitud esperada de la cadena depende de carga y distribución.', lessonId: 'm08-encadenamiento' },
    { id: 'm08-q5', moduleId: 8, type: 'order', prompt: 'Ordená una inserción con marcas borradas.', options: ['Recordar primera borrada → seguir buscando clave existente → reutilizar hueco si no existe.', 'Insertar en primera borrada → dejar de comparar claves.', 'Vaciar toda marca → buscar desde cero.'], answer: 0, explanation: 'Parar en la primera marca puede crear una asociación duplicada.', lessonId: 'm08-sondeos' },
    { id: 'm08-q6', moduleId: 8, type: 'choice', prompt: '¿Qué condición permite cubrir todas las posiciones en doble hashing?', options: ['Paso no nulo y coprimo con la capacidad.', 'Paso igual a la capacidad.', 'Paso par con cualquier capacidad.'], answer: 0, explanation: 'La coprimalidad evita quedar atrapado en un subconjunto de posiciones.', lessonId: 'm08-sondeos' },
    { id: 'm08-q7', moduleId: 8, type: 'truefalse', prompt: 'Al cambiar capacidad deben recalcularse las posiciones de las asociaciones.', options: ['Verdadero.', 'Falso.'], answer: 0, explanation: 'El módulo y las colisiones dependen de la capacidad.', lessonId: 'm08-rehash' },
    { id: 'm08-q8', moduleId: 8, type: 'complexity', prompt: '¿Qué describe la duplicación geométrica cuando las reinserciones son esperadas constantes?', options: ['Costo esperado y amortizado O(1) por inserción.', 'Costo real garantizado O(1) en cada inserción.', 'Ausencia total de colisiones.'], answer: 0, explanation: 'La expectativa modela colisiones y la amortización distribuye reconstrucciones.', lessonId: 'm08-rehash' },
    { id: 'm08-q9', moduleId: 8, type: 'prediction', prompt: 'Después de put(4,"a") y put(4,"b"), ¿cuántas asociaciones hay si la tabla estaba vacía?', options: ['1.', '2.', '0.'], answer: 0, explanation: 'La segunda operación reemplaza el valor de la misma clave.', lessonId: 'm08-map-set' },
    { id: 'm08-q10', moduleId: 8, type: 'order', prompt: 'Elegí los pasos correctos para contar frecuencias.', options: ['Buscar clave → incrementar si existe o crear con uno → continuar recorrido.', 'Crear siempre otro nodo → ordenar hashes → descartar colisiones.', 'Elegir un orden de HashMap → contar posiciones físicas.'], answer: 0, explanation: 'El mapa guarda una sola asociación por clave y acumula sus apariciones.', lessonId: 'm08-map-set' },
  ],
  glossary: [
    { term: 'Colisión hash', definition: 'Coincidencia de código o de índice entre claves distintas que exige comprobar igualdad y conservar ambas asociaciones.', lessonId: 'm08-hash' },
    { term: 'Encadenamiento separado', definition: 'Resolución de colisiones mediante una lista de asociaciones por casilla.', lessonId: 'm08-encadenamiento' },
    { term: 'Direccionamiento abierto', definition: 'Almacenamiento dentro del arreglo con una secuencia de sondeo para buscar posiciones alternativas.', lessonId: 'm08-sondeos' },
    { term: 'Marca de borrado', definition: 'Estado que permite reutilizar una casilla sin cortar el camino de búsquedas que la atraviesan.', lessonId: 'm08-sondeos' },
    { term: 'Factor de carga', definition: 'Cociente entre asociaciones almacenadas y capacidad de casillas.', lessonId: 'm08-rehash' },
    { term: 'Rehashing', definition: 'Reconstrucción de asociaciones calculando posiciones y colisiones de nuevo, normalmente tras cambiar capacidad.', lessonId: 'm08-rehash' },
    { term: 'Map', definition: 'TAD de asociaciones únicas por clave, con búsqueda y actualización de valores.', lessonId: 'm08-map-set' },
    { term: 'Set', definition: 'TAD de pertenencia donde no hay elementos duplicados según la igualdad elegida.', lessonId: 'm08-map-set' },
  ],
};
