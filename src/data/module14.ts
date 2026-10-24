import type { ModuleContent } from './types.js';

export const module14: ModuleContent = {
  moduleId: 14,
  lessons: [
    {
      id: 'm14-espacio', moduleId: 14, title: 'Espacios de soluciones y árboles de decisiones', duration: 28,
      summary: 'Construí candidatos paso a paso y entendé las obligaciones de una búsqueda exhaustiva con retroceso.',
      objectives: ['Modelar estado, decisiones y solución.', 'Separar factibilidad parcial y completitud.', 'Generar combinaciones sin repetirlas.'], prerequisites: ['Recursión, correctitud y complejidad exponencial.'],
      sections: [
        { title: 'Explorar elecciones, no adivinar respuestas', paragraphs: [
          'Una búsqueda exhaustiva considera todos los candidatos relevantes de un espacio de soluciones. Backtracking construye una solución parcial, elige una decisión, explora sus continuaciones y deshace la decisión para probar otra. El árbol de decisiones representa ese proceso: la raíz no ha elegido nada, cada arista agrega una elección y cada nodo describe un estado parcial.',
          'No todo nodo es una solución. Algunos estados son incompletos pero todavía extensibles; otros ya violan una restricción y deben descartarse. La distinción evita aceptar una configuración que cumple restricciones locales pero deja parte del problema sin resolver. También evita seguir extendiendo una contradicción que ninguna decisión futura puede reparar.',
        ] },
        { title: 'Elegir, explorar y restaurar', paragraphs: [
          'El esquema general comprueba si el estado está completo, enumera decisiones permitidas, aplica una, llama recursivamente y restaura. La restauración debe dejar exactamente el estado anterior para que las ramas sean independientes. Si guardamos una solución mutable, debemos copiarla; almacenar repetidamente la misma referencia haría que todas las salidas cambien con las modificaciones posteriores.',
          'Para demostrar correctitud necesitamos seguridad y completitud. Seguridad significa que toda salida cumple el contrato. Completitud significa que ninguna solución válida queda excluida por las decisiones enumeradas o por una poda incorrecta. La terminación suele justificarse con una cantidad de decisiones pendientes que disminuye hasta un límite finito. Una traza útil muestra tanto la bajada como la vuelta: al regresar a un nodo, sus marcas y su prefijo deben coincidir con los que tenía antes de llamar. Comparar esas instantáneas permite detectar errores de restauración que una lista aparentemente correcta de las primeras respuestas puede ocultar.',
        ], code: 'BUSCAR(estado)\n  si completo: guardar una copia; retornar\n  para cada decisión permitida\n    aplicar decisión\n    si el estado puede tener solución: BUSCAR(estado)\n    deshacer decisión', language: 'text' },
        { title: 'Combinaciones como secuencias crecientes', paragraphs: [
          'Elegir k elementos de n sin importar el orden produce combinaciones. Representamos cada una mediante índices estrictamente crecientes. Después de elegir v, la siguiente elección empieza en v+1. Así no emitimos [1,3] y [3,1] como si fueran respuestas diferentes y nunca repetimos un elemento.',
          'Si faltan r posiciones y solo quedan menos de r elementos, la rama no puede completarse. El límite v ≤ n−r incorpora esa poda sin explorar estados imposibles. Para n=4 y k=2 emitimos seis pares: [0,1], [0,2], [0,3], [1,2], [1,3], [2,3]. La combinación vacía existe cuando k=0, incluso si n=0.',
        ] },
        { title: 'El tamaño de la salida también cuesta', paragraphs: [
          'Hay C(n,k)=n!/(k!(n−k)!) combinaciones. Si materializamos cada una como un arreglo de k posiciones, escribir la salida cuesta al menos Ω(k·C(n,k)) para k≥1. La pila de profundidad k y el arreglo de trabajo usan O(k) auxiliar; la colección de resultados es una memoria adicional que no debemos esconder bajo esa cota.',
          'Podemos emitir soluciones a un consumidor en vez de guardarlas todas, reduciendo almacenamiento simultáneo aunque no el número de respuestas. Detenernos después de la primera cambia el contrato y puede ahorrar tiempo, pero ya no enumera el conjunto completo. El objetivo —decidir existencia, contar o listar— determina qué trabajo es inevitable.',
          'Una elección ordenada evita duplicados estructuralmente y es preferible a generar permutaciones para luego eliminarlas con un conjunto. En otros problemas la simetría puede ser más difícil de reconocer. Antes de podar respuestas equivalentes, definí qué considera distinta la consigna: posiciones diferentes y valores diferentes no siempre representan la misma pregunta.',
        ] },
      ],
      complexity: { time: 'O(k·C(n,k)) para k≥1', space: 'O(k) auxiliar, más salida', explanation: 'La enumeración creciente visita prefijos extensibles y copia k posiciones por respuesta. Para k=0 realiza trabajo constante y devuelve una combinación vacía.' },
      pitfalls: ['Guardar varias veces la misma referencia al arreglo parcial.', 'Olvidar restaurar un cambio antes de pasar a otra rama.', 'Confundir combinaciones con permutaciones ordenadas.'],
      solved: { title: 'Combinaciones de índices sin repetición', explanation: 'El límite superior asegura que queden suficientes elecciones. La representación creciente hace única cada combinación sin recurrir a colecciones para deduplicar.', code: `static java.util.List<int[]> combinaciones(int n,int k) {
    if(n<0 || k<0 || k>n)throw new IllegalArgumentException();
    java.util.List<int[]> salida=new java.util.ArrayList<>();
    combinar(n,k,0,0,new int[k],salida);return salida;
}
private static void combinar(int n,int k,int inicio,int profundidad,int[] actual,java.util.List<int[]> salida) {
    if(profundidad==k){salida.add(actual.clone());return;}
    int faltan=k-profundidad;
    for(int v=inicio;v<=n-faltan;v++) {
        actual[profundidad]=v;
        combinar(n,k,v+1,profundidad+1,actual,salida);
    }
}` },
      practice: { title: 'Elegir un equipo con suma exacta', prompt: 'Generá combinaciones de k posiciones de un arreglo cuyo valor total sea un objetivo. Permití valores negativos y explicá por qué podar solo cuando la suma parcial supera el objetivo sería incorrecto. Mantené índices crecientes y distinguí equipos de posiciones distintas aunque tengan valores iguales.' },
      takeaways: ['El árbol representa decisiones parciales, no solamente soluciones completas.', 'Elegir, explorar y deshacer mantiene independientes las ramas.', 'Enumerar salidas tiene un costo que no desaparece con una implementación eficiente.'], lab: 'backtracking',
    },
    {
      id: 'm14-permutaciones', moduleId: 14, title: 'Permutaciones, duplicados y poda segura', duration: 28,
      summary: 'Generá ordenamientos únicos y justificá qué ramas pueden descartarse sin perder soluciones válidas.',
      objectives: ['Usar posiciones disponibles como decisiones.', 'Evitar permutaciones duplicadas por valores repetidos.', 'Justificar una condición de poda.'], prerequisites: ['Árboles de decisiones y combinaciones.'],
      sections: [
        { title: 'El orden ahora forma parte de la respuesta', paragraphs: [
          'Una permutación organiza todos los elementos en posiciones ordenadas. Para n elementos distintos hay n elecciones en la primera posición, n−1 en la segunda y así sucesivamente: n! respuestas. A diferencia de una combinación, [1,3] y [3,1] son resultados distintos. Una variable profundidad indica la próxima posición a completar.',
          'Guardamos qué posiciones originales ya fueron utilizadas. Elegir una posición libre coloca su valor en el resultado parcial y la marca; al volver, desmarcamos. La invariante dice que el prefijo construido usa exactamente las posiciones marcadas, cada una una sola vez. Al alcanzar profundidad n, el arreglo está completo y puede copiarse.',
        ] },
        { title: 'Valores repetidos crean simetrías', paragraphs: [
          'Si la entrada contiene [1,1,2], permutar posiciones produce seis recorridos, pero solo tres secuencias de valores distintas. Para emitir cada secuencia una vez, ordenamos una copia y omitimos un valor igual al anterior cuando esa posición anterior todavía no fue utilizada en la rama. Elegimos primero el representante disponible de cada grupo igual.',
          'La condición no es simplemente “si el anterior es igual, saltar”. Cuando el primer 1 ya está usado, necesitamos permitir el segundo para construir [1,1,2]. El chequeo !usado[i−1] distingue duplicación entre elecciones hermanas de la repetición necesaria dentro de una misma solución. El ordenamiento de la copia no debe modificar la entrada si el contrato promete conservarla.',
        ] },
        { title: 'Podar exige una prueba sobre el futuro', paragraphs: [
          'Una poda de factibilidad elimina un estado que no puede extenderse a ninguna solución. Si asignamos colores y dos vecinos ya tienen el mismo color prohibido, ninguna decisión sobre otros vértices repara esa pareja. En cambio, que una suma parcial supere el objetivo no basta si quedan valores negativos: una elección futura podría reducirla.',
          'Las podas por simetría eliminan representaciones equivalentes según el contrato. No se justifican por ser “parecidas”, sino por una correspondencia que conserva todas las respuestas distintas que pedimos. Cambiar el orden de explorar decisiones es otra herramienta: puede encontrar una respuesta antes, pero no elimina ramas por sí mismo ni cambia necesariamente el peor caso.',
        ] },
        { title: 'Contar nodos, no solo hojas', paragraphs: [
          'Con elementos distintos, copiar cada permutación de n posiciones impone Ω(n·n!). El árbol además contiene todos los prefijos, cuya cantidad queda del orden de n!. La implementación recorre candidatos y usa marcas, por lo que una cota O(n·n!) describe el tiempo total; la pila, el arreglo parcial y las marcas ocupan O(n), excluyendo la salida.',
          'Con repetidos, la cantidad de secuencias distintas es n! dividido por el producto de los factoriales de sus multiplicidades. La poda evita emitir duplicados, aunque el ordenamiento inicial y la revisión de candidatos siguen teniendo costo. No debemos afirmar que todos los casos cuestan exactamente n! ni que unas restricciones vuelven polinómico cualquier problema de permutaciones.',
          'Probá la entrada vacía: hay una permutación vacía, no cero. Probá todos iguales y tres distintos. Verificá además que cada salida tenga la misma frecuencia de valores que la entrada y que ninguna pareja de salidas sea idéntica. Esas propiedades distinguen preservación de elementos, completitud y ausencia de duplicados. Para entradas pequeñas, una enumeración independiente de posiciones seguida de deduplicación sirve como control del generador optimizado, sin reemplazar su demostración.',
        ] },
      ],
      complexity: { time: 'O(n·n!) peor caso, más ordenamiento', space: 'O(n) auxiliar, más salida', explanation: 'Con valores distintos se emiten n! arreglos de longitud n. Los valores repetidos reducen las hojas mediante una poda de simetría; ordenar la copia cuesta O(n log n).' },
      pitfalls: ['Saltar todos los valores iguales y perder soluciones con repeticiones legítimas.', 'Desmarcar una posición antes de explorar su llamada.', 'Podar por suma parcial sin revisar los signos de valores pendientes.'],
      solved: { title: 'Permutaciones únicas de valores', explanation: 'Se ordena una copia, se marcan posiciones y solo se elimina la elección duplicada entre hermanas. Las salidas son arreglos independientes.', code: `static java.util.List<int[]> permutaciones(int[] entrada) {
    if(entrada==null)throw new IllegalArgumentException();
    int[] a=entrada.clone();java.util.Arrays.sort(a);
    java.util.List<int[]> salida=new java.util.ArrayList<>();
    permutar(a,new boolean[a.length],new int[a.length],0,salida);return salida;
}
private static void permutar(int[] a,boolean[] usado,int[] actual,int profundidad,java.util.List<int[]> salida) {
    if(profundidad==a.length){salida.add(actual.clone());return;}
    for(int i=0;i<a.length;i++) {
        if(usado[i] || (i>0 && a[i]==a[i-1] && !usado[i-1]))continue;
        usado[i]=true;actual[profundidad]=a[i];
        permutar(a,usado,actual,profundidad+1,salida);
        usado[i]=false;
    }
}` },
      practice: { title: 'Una poda que pierde respuestas', prompt: 'Para el arreglo [5,−4,2] y objetivo 1, construí una búsqueda de subconjuntos. Mostrá el contraejemplo de podar cuando sumaParcial>objetivo. Proponé una cota segura usando una estimación de cuánto pueden reducir la suma los valores negativos restantes, y justificá por qué no elimina una solución.' },
      takeaways: ['Permutar posiciones y emitir secuencias distintas de valores son contratos diferentes.', 'La poda debe demostrar que la rama es imposible o equivalente.', 'Ordenar las decisiones puede ayudar sin mejorar la cota de peor caso.'], lab: 'backtracking',
    },
    {
      id: 'm14-reinas', moduleId: 14, title: 'N reinas: restricciones incrementales', duration: 29,
      summary: 'Colocá una reina por fila y mantené columnas y diagonales ocupadas para descartar conflictos temprano.',
      objectives: ['Modelar una solución con una decisión por fila.', 'Identificar diagonales por suma y diferencia.', 'Restaurar marcas sin interferir con otras reinas.'], prerequisites: ['Backtracking, arreglos booleanos y poda.'],
      sections: [
        { title: 'Reducir el espacio antes de recorrerlo', paragraphs: [
          'El problema de las N reinas pide colocar n reinas en un tablero n×n sin que dos compartan fila, columna o diagonal. En vez de elegir n casillas arbitrarias, colocamos exactamente una reina por fila. Esa representación satisface la restricción de filas desde el diseño y reduce las decisiones de cada nivel a una columna.',
          'El estado parcial contiene las primeras fila filas resueltas. Elegimos una columna permitida para la siguiente, marcamos sus restricciones y avanzamos una fila. Si ninguna columna sirve, retrocedemos. Al llegar a fila=n tenemos una configuración completa. Para n=0 adoptamos la convención combinatoria de una configuración vacía; n=2 y n=3 no tienen soluciones.',
        ] },
        { title: 'Reconocer diagonales con índices', paragraphs: [
          'Dos casillas (f,c) y (g,d) comparten una diagonal si f+c=g+d o si f−c=g−d. La suma va desde 0 hasta 2n−2. La diferencia puede ser negativa; sumarle n−1 la lleva al mismo rango de índices. Guardamos un arreglo de columnas y dos de diagonales para verificar una candidata en tiempo constante.',
          'Una candidata válida exige que las tres marcas estén libres. Al colocarla las activamos; al volver las desactivamos. Es seguro usar booleanos porque nunca colocamos otra reina que comparta esas restricciones con las anteriores. Si permitiéramos conflictos temporales, un simple false podría borrar una ocupación que todavía corresponde a otra reina y necesitaríamos contadores.',
        ] },
        { title: 'Seguridad, completitud y terminación', paragraphs: [
          'La invariante dice que las reinas de las filas anteriores no se atacan y que las marcas representan exactamente sus columnas y diagonales. Comprobar las tres marcas hace segura cada extensión. Deshacerlas restaura el estado del padre y permite explorar las demás columnas sin conservar restricciones de una hermana.',
          'Toda solución tiene una columna válida en su primera fila, otra en la segunda y así sucesivamente. Como enumeramos todas las columnas no conflictivas, su secuencia aparece en el árbol: no perdemos soluciones. La cantidad n−fila disminuye en cada llamada hasta cero, por lo que la profundidad está acotada. Esa prueba no asegura un tiempo pequeño, solamente que el espacio finito termina de explorarse.',
        ] },
        { title: 'Contar, encontrar y explotar simetría', paragraphs: [
          'El ejemplo cuenta todas las soluciones. Para devolver una sola, podemos retornar true en la primera hoja, conservando o copiando sus columnas. Para listar, copiamos la configuración en cada hoja. Son salidas diferentes con costos de almacenamiento diferentes. La versión de conteo mantiene un acumulado long y verifica sumas para no aceptar desbordamiento silencioso.',
          'La exclusión de columnas deja como referencia un espacio de permutaciones de tamaño n!. Las diagonales podan gran parte, pero una cota superior holgada para esta implementación que prueba n columnas por estado es O(n·n!). Memoria auxiliar O(n): columnas, diagonales y pila. No debemos describirla como O(n²) solo porque el dibujo sea un tablero cuadrado que nunca materializamos.',
          'Una simetría de reflexión permite explorar parte de la primera fila y duplicar conteos bajo condiciones precisas; cuando n es impar, la columna central necesita tratamiento separado. Aquí no aplicamos ese atajo para mantener visible la enumeración completa. Los conteos conocidos n=1→1 y n=4→2 sirven como controles pequeños, acompañados por la verificación directa de restricciones. Los límites del ejemplo ejecutable no sustituyen el análisis del esquema general.',
        ] },
      ],
      complexity: { time: 'O(n·n!) cota superior holgada', space: 'O(n) auxiliar', explanation: 'Las columnas evitan repeticiones y las diagonales reducen ramas. Se cuentan soluciones sin almacenar tableros. El límite didáctico n≤15 controla el dominio ejecutable del ejemplo.' },
      pitfalls: ['Indexar fila−columna sin desplazar el rango negativo.', 'Olvidar liberar una diagonal al retroceder.', 'Confundir encontrar una configuración con contar todas.'],
      solved: { title: 'Contar configuraciones con marcas', explanation: 'El caso vacío se resuelve antes de crear diagonales. Las restricciones se consultan en tiempo constante y se restauran después de explorar cada columna.', code: `static long contarReinas(int n) {
    if(n<0 || n>15)throw new IllegalArgumentException("Se admite 0..15");
    if(n==0)return 1;
    return reinas(0,n,new boolean[n],new boolean[2*n-1],new boolean[2*n-1]);
}
private static long reinas(int fila,int n,boolean[] columnas,boolean[] suma,boolean[] diferencia) {
    if(fila==n)return 1;
    long total=0;
    for(int c=0;c<n;c++) {
        int s=fila+c,d=fila-c+n-1;
        if(columnas[c] || suma[s] || diferencia[d])continue;
        columnas[c]=suma[s]=diferencia[d]=true;
        total=Math.addExact(total,reinas(fila+1,n,columnas,suma,diferencia));
        columnas[c]=suma[s]=diferencia[d]=false;
    }
    return total;
}` },
      practice: { title: 'Guardar una configuración', prompt: 'Adaptá el contador para devolver una sola solución mediante un arreglo columnaPorFila, o ausencia si no existe. Verificá pares de reinas usando diferencias absolutas y columnas. Probá n=0,1,2,3,4 y explicá qué marcas quedan activas al salir anticipadamente y por qué eso no debe contaminar otra invocación.' },
      takeaways: ['Una representación puede satisfacer restricciones antes de buscar.', 'Suma y diferencia identifican las dos familias de diagonales.', 'Las marcas deben corresponder exactamente al estado parcial.'], lab: 'backtracking',
    },
    {
      id: 'm14-laberintos', moduleId: 14, title: 'Laberintos y caminos simples', duration: 27,
      summary: 'Enumerá rutas sin repetir casillas y distinguí el objetivo exhaustivo de encontrar una ruta o la más corta.',
      objectives: ['Representar movimientos válidos en una grilla.', 'Restaurar visitados al explorar caminos alternativos.', 'Comparar backtracking con DFS y BFS.'], prerequisites: ['Grafos, recorridos y restauración de estado.'],
      sections: [
        { title: 'La grilla también es un grafo', paragraphs: [
          'Un laberinto rectangular puede representarse con casillas transitables y bloqueadas. Cada casilla libre es un vértice y cada movimiento permitido crea una arista. Aquí admitimos arriba, abajo, izquierda y derecha, sin diagonales. Una casilla fuera de los límites o bloqueada no puede formar parte de una ruta.',
          'La pregunta cambia el algoritmo. Para saber si existe alguna ruta, DFS con visitados globales alcanza en tiempo lineal respecto de la grilla. Para minimizar pasos con movimientos de igual costo, BFS. Para enumerar todos los caminos simples entre dos casillas, necesitamos considerar diferentes historiales y no podemos descartar una casilla para siempre después de verla en otra rama.',
        ] },
        { title: 'Visitado significa dentro del camino actual', paragraphs: [
          'En backtracking de caminos simples marcamos una casilla al entrar y la desmarcamos al salir. La marca no significa “alguna vez la vimos”, sino “ya pertenece a este camino”. Eso impide ciclos dentro de una ruta y permite que una ruta diferente utilice más tarde la misma casilla.',
          'La cadena de movimientos funciona como resultado parcial. Agregamos una letra antes de la llamada y restauramos su longitud después. Al llegar al destino guardamos una copia inmutable de la cadena. No seguimos explorando desde el destino porque el contrato considera que la ruta termina allí; de lo contrario generaríamos recorridos que pasan por él y vuelven a salir.',
        ] },
        { title: 'Una prueba por extensión del prefijo', paragraphs: [
          'La invariante exige que el camino parcial empiece en el origen, use solo movimientos permitidos y no repita casillas; las marcas son exactamente sus casillas activas. Antes de cada llamada revisamos límites, bloqueo y repetición. Una extensión aceptada conserva las tres propiedades. Al restaurar, recuperamos el prefijo anterior para explorar el siguiente movimiento.',
          'Cada camino simple tiene una próxima dirección concreta que el algoritmo enumera, por lo que existe una rama que lo reproduce. La profundidad no supera la cantidad de casillas libres: no repetimos ninguna en el mismo camino. Esto prueba terminación aunque existan ciclos en el grafo de la grilla. El conjunto de todos los caminos puede ser enorme incluso en tableros modestos.',
        ] },
        { title: 'Podas y objetivos que no deben mezclarse', paragraphs: [
          'Una casilla bloqueada o repetida permite podar por factibilidad. También podríamos comprobar si el destino sigue conectado en la región restante, pero ese análisis adicional tiene costo y debe compensar. Elegir primero un movimiento que se acerca geométricamente al destino solo cambia el orden de búsqueda; puede dirigirnos hacia una pared y no garantiza óptimo.',
          'La distancia Manhattan es una cota inferior de pasos cuando solo permitimos movimientos ortogonales: los obstáculos pueden alargar la ruta, no acortarla. Si buscamos la más corta por Branch and Bound podemos usarla junto con una mejor solución conocida. Si queremos listar todas las rutas, podar porque una es más larga que otra eliminaría respuestas requeridas.',
          'El ejemplo fija origen en la esquina superior izquierda y destino en la inferior derecha. Una grilla de una casilla libre tiene una ruta vacía. Si origen o destino están bloqueados, no hay rutas. Validar rectangularidad antes de recorrer evita que una fila corta produzca un acceso inválido y aclare el contrato geométrico. Si cambiamos las reglas para permitir diagonales, también debemos revisar movimientos, cotas y pruebas de caminos.',
        ] },
      ],
      complexity: { time: 'Exponencial en R·C en el peor caso', space: 'O(R·C) auxiliar, más salida', explanation: 'El árbol tiene como máximo cuatro continuaciones por nivel y profundidad R·C. O(R·C·4^(R·C)) es una cota superior holgada que incluye copiar movimientos; no es el costo de BFS.' },
      pitfalls: ['No desmarcar visitados y perder caminos alternativos.', 'Prometer ruta mínima por explorar primero cerca del destino.', 'Olvidar que una ruta vacía es válida cuando origen y destino coinciden.'],
      solved: { title: 'Todos los caminos simples de esquina a esquina', explanation: 'Cada letra representa un movimiento y cada resultado se copia como String. Las marcas se restauran para que otra rama pueda usar las mismas casillas en otro orden.', code: `static java.util.List<String> caminos(boolean[][] libre) {
    if(libre==null || libre.length==0 || libre[0]==null || libre[0].length==0)throw new IllegalArgumentException();
    int columnas=libre[0].length;for(boolean[] fila:libre)if(fila==null || fila.length!=columnas)throw new IllegalArgumentException();
    java.util.List<String> salida=new java.util.ArrayList<>();
    recorrer(libre,0,0,new boolean[libre.length][columnas],new StringBuilder(),salida);return salida;
}
private static void recorrer(boolean[][] libre,int f,int c,boolean[][] usado,StringBuilder ruta,java.util.List<String> salida) {
    if(f<0 || f>=libre.length || c<0 || c>=libre[0].length || !libre[f][c] || usado[f][c])return;
    if(f==libre.length-1 && c==libre[0].length-1){salida.add(ruta.toString());return;}
    usado[f][c]=true;
    int[] df={-1,1,0,0},dc={0,0,-1,1};char[] paso={'U','D','L','R'};
    for(int i=0;i<4;i++) {
        int longitud=ruta.length();ruta.append(paso[i]);
        recorrer(libre,f+df[i],c+dc[i],usado,ruta,salida);
        ruta.setLength(longitud);
    }
    usado[f][c]=false;
}` },
      practice: { title: 'Tres objetivos sobre el mismo laberinto', prompt: 'Para una grilla 3×3 con el centro bloqueado, resolvé existencia, camino mínimo y enumeración de caminos simples. Usá respectivamente DFS, BFS y backtracking. Explicá por qué el significado y la restauración de visitados cambian entre los objetivos y verificá cada cadena de movimientos sobre la grilla original.' },
      takeaways: ['El significado de visitado depende del objetivo del algoritmo.', 'Restaurar permite alternativas sin ciclos dentro de cada camino.', 'Acercarse al destino no demuestra optimalidad.'], lab: 'backtracking',
    },
    {
      id: 'm14-cotas', moduleId: 14, title: 'Branch and Bound: podar por costo', duration: 30,
      summary: 'Buscá una solución óptima comparando una cota optimista de cada rama con una solución factible ya conocida.',
      objectives: ['Distinguir poda de factibilidad y de optimalidad.', 'Construir una cota inferior válida para minimización.', 'Mantener una mejor solución factible como cota superior.'], prerequisites: ['Backtracking y problemas de optimización.'],
      sections: [
        { title: 'La búsqueda tiene un objetivo numérico', paragraphs: [
          'Backtracking puede decidir existencia o enumerar soluciones. Branch and Bound agrega un criterio de optimización y cotas para descartar ramas incapaces de mejorar la mejor respuesta conocida. En minimización, una solución completa factible da una cota superior: sabemos que el óptimo no puede ser mayor que ese costo.',
          'Para un estado parcial necesitamos una cota inferior del costo de cualquier solución que lo extienda. Debe ser optimista, nunca mayor que el mejor costo realmente alcanzable desde allí. Si esa cota ya es mayor o igual que nuestra mejor solución, no necesitamos explorar la rama cuando pedimos solamente un óptimo. Si queremos todos los óptimos, podar igualdad podría perder respuestas empatadas.',
        ] },
        { title: 'Asignar trabajos sin repetir tareas', paragraphs: [
          'El problema resuelto asigna una tarea distinta a cada persona usando una matriz cuadrada de costos. En la fila f elegimos una tarea todavía libre. Sin podas, el espacio de asignaciones tiene n! hojas. El estado conserva la próxima persona, las tareas utilizadas, el costo acumulado y la asignación parcial.',
          'Una cota inferior sencilla suma al costo actual el mínimo de cada fila pendiente entre tareas no utilizadas, permitiendo ficticiamente que varias personas elijan la misma tarea. Esa relajación amplía las posibilidades y nunca aumenta el mínimo. Por lo tanto, la suma es una estimación optimista válida, aunque no corresponda a una asignación realizable.',
        ] },
        { title: 'Una cota útil no puede inventar restricciones', paragraphs: [
          'Si una estimación sobrevalora el mejor costo residual, podríamos eliminar la rama que contiene el óptimo. Un criterio solo es correcto si su desigualdad está demostrada. Con costos negativos, podar simplemente porque el costo parcial supera la mejor solución es incorrecto: las filas restantes pueden reducirlo. La suma de mínimos sigue siendo válida incluso con negativos.',
          'Una solución inicial heurística puede mejorar mucho la poda al proporcionar una cota superior pequeña desde el comienzo. También podemos explorar primero tareas baratas para descubrir pronto un buen resultado. Ninguna de esas elecciones demuestra por sí sola optimalidad; la garantía proviene de conservar todas las ramas que todavía podrían mejorar y de evaluar correctamente sus cotas.',
        ] },
        { title: 'Orden de exploración y peor caso', paragraphs: [
          'Podemos recorrer en profundidad como el ejemplo o guardar estados en una cola de prioridad por su cota. La segunda estrategia busca primero las ramas más prometedoras, pero puede consumir mucha memoria al conservar una frontera grande. La técnica Branch and Bound no impone una única estructura de exploración ni vuelve polinómico el problema general.',
          'El cálculo de la cota del ejemplo revisa filas y tareas restantes: O(n²) por estado como cota holgada. Sin una poda eficaz, seguimos teniendo un árbol factorial, por lo que una cota superior es O(n²·n!). La profundidad y los arreglos de trabajo usan O(n) auxiliar, excluyendo la matriz de entrada y la asignación devuelta.',
          'Para verificar el algoritmo en tamaños pequeños, compará contra enumerar todas las permutaciones sin poda. Comprobá además que la asignación use todas las tareas una vez y que su suma coincida con el costo devuelto. Las estadísticas de ramas podadas muestran utilidad práctica de una cota, pero no sustituyen la prueba de que es segura. La mejora práctica y la garantía de optimalidad necesitan evidencias diferentes.',
        ] },
      ],
      complexity: { time: 'O(n²·n!) cota superior', space: 'O(n) auxiliar, además de entrada y salida', explanation: 'La poda puede reducir mucho la búsqueda, pero el peor caso conserva crecimiento factorial. La cota se recalcula en O(n²) por estado.' },
      pitfalls: ['Usar una cota inferior que sobreestima y perder el óptimo.', 'Podar por costo parcial sin considerar costos negativos futuros.', 'Podar igualdad cuando el contrato exige todos los óptimos.'],
      solved: { title: 'Asignación mínima con cota de relajación', explanation: 'El mínimo independiente por fila ignora conflictos entre tareas y por eso es una cota inferior. El código admite costos negativos y devuelve una asignación óptima; las sumas se comprueban en long.', code: `static final class Asignacion {
    final long costo; final int[] tarea;
    Asignacion(long c,int[] t){costo=c;tarea=t;}
}
static Asignacion asignar(int[][] costos) {
    if(costos==null)throw new IllegalArgumentException();
    for(int[] fila:costos)if(fila==null || fila.length!=costos.length)throw new IllegalArgumentException();
    Busqueda b=new Busqueda(costos);b.buscar(0,0);return new Asignacion(b.mejor,b.solucion);
}
private static final class Busqueda {
    final int[][] costo;final boolean[] usada;final int[] actual;int[] solucion;long mejor=Long.MAX_VALUE;
    Busqueda(int[][] c){costo=c;usada=new boolean[c.length];actual=new int[c.length];}
    void buscar(int fila,long acumulado) {
        int n=costo.length;
        if(fila==n){if(acumulado<mejor){mejor=acumulado;solucion=actual.clone();}return;}
        long cota=acumulado;
        for(int f=fila;f<n;f++) {
            long minimo=Long.MAX_VALUE;for(int t=0;t<n;t++)if(!usada[t])minimo=Math.min(minimo,costo[f][t]);
            cota=Math.addExact(cota,minimo);
        }
        if(cota>=mejor)return;
        for(int t=0;t<n;t++)if(!usada[t]) {
            usada[t]=true;actual[fila]=t;
            buscar(fila+1,Math.addExact(acumulado,(long)costo[fila][t]));
            usada[t]=false;
        }
    }
}` },
      practice: { title: 'Medir una poda sin confiarse', prompt: 'Implementá un contador de estados para asignación exhaustiva y para Branch and Bound. Compará matrices pequeñas con costos positivos y negativos; verificá el mismo óptimo por enumeración completa. Después ordená las decisiones por costo y explicá por qué puede mejorar la primera solución sin cambiar la corrección ni garantizar un peor caso polinómico.' },
      takeaways: ['Una solución factible y una cota optimista acotan el óptimo desde lados distintos.', 'La desigualdad de poda debe ser una garantía, no una intuición.', 'Una técnica efectiva en ejemplos puede conservar un peor caso factorial.'], lab: 'backtracking',
    },
    {
      id: 'm14-sudoku', moduleId: 14, title: 'Sudoku: un solucionador completo', duration: 34,
      summary: 'Validá pistas, calculá candidatos y elegí la casilla más restringida para resolver un Sudoku de 9×9.',
      objectives: ['Mantener restricciones de filas, columnas y bloques.', 'Aplicar la heurística MRV sin perder completitud.', 'Restaurar el tablero cuando no existe solución.'], prerequisites: ['Backtracking, bits y arreglos.', 'Poda segura y heurísticas de exploración.'],
      sections: [
        { title: 'Pistas válidas y solución son preguntas distintas', paragraphs: [
          'Un Sudoku de 9×9 usa dígitos del 1 al 9, sin repetir en cada fila, columna y bloque 3×3. Representamos una casilla vacía con cero. Antes de buscar verificamos forma, rango y ausencia de repeticiones entre las pistas. Un tablero sin conflictos inmediatos todavía puede ser imposible de completar; la validación inicial no garantiza solución.',
          'El contrato resuelto modifica el tablero recibido si encuentra una solución y devuelve true. Si no existe, devuelve false dejando el tablero como estaba. Las pistas inválidas lanzan una excepción antes de modificar la entrada. No se exige unicidad: encontrar una solución y demostrar que hay una sola requieren recorridos diferentes. Las filas deben ser arreglos independientes; compartir una fila haría que modificar una casilla alterara otra fila sin actualizar sus máscaras.',
        ] },
        { title: 'Máscaras representan dígitos usados', paragraphs: [
          'Cada fila, columna y bloque usa una máscara de nueve bits. El dígito d ocupa el bit d−1. La unión por OR de las tres máscaras contiene los dígitos prohibidos; ALL & ~(fila|columna|bloque) produce candidatos. ALL tiene sus nueve bits bajos en uno y elimina los bits altos introducidos por el complemento.',
          'El índice de bloque es (fila/3)*3 + columna/3. Al colocar un dígito activamos su bit en las tres máscaras; al retirarlo lo limpiamos. Como el candidato estaba libre, esa limpieza no borra la marca de otra casilla de la misma unidad. Las máscaras y el tablero deben describir siempre la misma asignación parcial.',
        ] },
        { title: 'Elegir primero la casilla más restringida', paragraphs: [
          'MRV, minimum remaining values, elige una casilla vacía con la menor cantidad de candidatos. Si una tiene cero, la rama ya es imposible y retrocedemos. Si no queda ninguna vacía, las restricciones mantenidas garantizan una solución completa. Una casilla con un candidato fuerza el siguiente paso, aunque eso no demuestra que toda la rama tenga solución.',
          'La heurística cambia el orden de decisiones, no elimina por sí misma candidatos válidos. Para la casilla elegida probamos cada candidato, actualizamos estado y buscamos. Si falla, restauramos antes de probar otro. La completitud se conserva porque cualquier solución que extienda el estado debe poner en esa casilla uno de los candidatos enumerados.',
        ] },
        { title: 'Costos, restauración y pruebas', paragraphs: [
          'Con e vacías, una cota combinatoria muy holgada tiene hasta 9ᵉ ramas, con un barrido de 81 casillas para elegir MRV por estado. La profundidad es como máximo e. Para el tablero fijo 9×9 el dominio es finito; estas expresiones describen el tamaño del árbol en función de vacías, no una familia ilimitada de tableros de dimensión fija. Las generalizaciones requieren declarar también su dimensión.',
          'No guardamos una copia completa del tablero por llamada: una casilla y sus tres máscaras se modifican y restauran. Si una llamada tiene éxito, conservamos el estado resuelto. Si todas sus opciones fallan, queda exactamente el estado previo. Esa propiedad recursiva implica que un false final deja intactas las pistas y los ceros originales.',
          'Las pruebas deben incluir un Sudoku conocido, uno ya resuelto, pistas duplicadas y un tablero sin conflictos locales pero sin solución. Verificá que las pistas originales no cambien y que cada fila, columna y bloque contenga los nueve dígitos. Para verificar unicidad, seguí buscando después de una solución y detenete al encontrar dos, copiando resultados si querés conservarlos.',
        ] },
      ],
      complexity: { time: 'O(81·9^e) cota combinatoria holgada', space: 'O(e+81) auxiliar', explanation: 'e es la cantidad inicial de vacías en un tablero fijo 9×9. MRV suele reducir drásticamente el árbol, pero no promete un tiempo pequeño para todas las instancias.' },
      pitfalls: ['Aceptar pistas duplicadas como una solución ya completa.', 'Usar complemento de bits sin limitar a nueve candidatos.', 'Retornar false sin restaurar la última casilla y sus máscaras.'],
      solved: { title: 'Sudoku con MRV y restauración', explanation: 'La validación construye máscaras sin alterar el tablero. Las llamadas solo asignan a ceros; un fracaso restaura tanto la casilla como sus tres unidades.', code: `static boolean resolverSudoku(int[][] tablero) {
    if(tablero==null || tablero.length!=9)throw new IllegalArgumentException();
    for(int[] fila:tablero)if(fila==null || fila.length!=9)throw new IllegalArgumentException();
    for(int i=0;i<9;i++)for(int j=0;j<i;j++)if(tablero[i]==tablero[j])throw new IllegalArgumentException("Filas compartidas");
    int[] filas=new int[9],columnas=new int[9],bloques=new int[9];
    for(int f=0;f<9;f++)for(int c=0;c<9;c++) {
        int d=tablero[f][c];if(d<0 || d>9)throw new IllegalArgumentException();if(d==0)continue;
        int bit=1<<(d-1),b=(f/3)*3+c/3;
        if(((filas[f]|columnas[c]|bloques[b])&bit)!=0)throw new IllegalArgumentException("Pistas repetidas");
        filas[f]|=bit;columnas[c]|=bit;bloques[b]|=bit;
    }
    return sudoku(tablero,filas,columnas,bloques);
}
private static boolean sudoku(int[][] t,int[] filas,int[] columnas,int[] bloques) {
    int mejorF=-1,mejorC=-1,mejorMascara=0,minimo=10;
    for(int f=0;f<9;f++)for(int c=0;c<9;c++)if(t[f][c]==0) {
        int mascara=511 & ~(filas[f]|columnas[c]|bloques[(f/3)*3+c/3]);
        int cantidad=Integer.bitCount(mascara);if(cantidad==0)return false;
        if(cantidad<minimo){minimo=cantidad;mejorF=f;mejorC=c;mejorMascara=mascara;}
    }
    if(mejorF==-1)return true;
    int f=mejorF,c=mejorC,b=(f/3)*3+c/3;
    for(int opciones=mejorMascara;opciones!=0;) {
        int bit=opciones & -opciones;opciones-=bit;
        t[f][c]=Integer.numberOfTrailingZeros(bit)+1;
        filas[f]|=bit;columnas[c]|=bit;bloques[b]|=bit;
        if(sudoku(t,filas,columnas,bloques))return true;
        filas[f]&=~bit;columnas[c]&=~bit;bloques[b]&=~bit;t[f][c]=0;
    }
    return false;
}` },
      practice: { title: 'De resolver a comprobar unicidad', prompt: 'Extendé el solucionador para contar hasta dos soluciones sin modificar permanentemente el tablero original. Guardá una copia de la primera si existe y continuá hasta confirmar ninguna, única o varias. Mostrá la diferencia entre pistas inválidas y tablero válido sin solución; verificá restauración incluso al detenerte temprano.' },
      takeaways: ['Validar pistas no demuestra resolubilidad ni unicidad.', 'MRV cambia el orden y conserva todas las opciones válidas.', 'La restauración es parte del contrato del solucionador, no solamente una comodidad interna.'], lab: 'backtracking',
    },
  ],
  exercises: [
    { id: 'm14-e-combinaciones', moduleId: 14, title: 'Combinación o permutación', kind: 'prediction', difficulty: 'Inicial', prompt: '¿Cuántos equipos distintos de dos posiciones se eligen entre cuatro, sin importar el orden?', input: 'n=4, k=2', expected: '6', constraints: ['Sin repetir posiciones.'], starter: '', answer: '6', accepted: [], hints: ['[0,1] y [1,0] representan el mismo equipo.', 'Usá C(4,2)=4·3/2.'], solution: '6 equipos.', explanation: 'Cada pareja aparece una sola vez al exigir índices crecientes; no se cuentan ordenamientos del mismo equipo.', lessonId: 'm14-espacio' },
    { id: 'm14-e-factorial', moduleId: 14, title: 'Costo de emitir permutaciones', kind: 'complexity', difficulty: 'Inicial', prompt: 'Con n valores distintos, ¿qué cota ajustada tiene escribir todas las permutaciones como arreglos independientes de n posiciones?', input: 'n! resultados de longitud n', expected: 'Theta(n*n!)', constraints: ['Contar la escritura de la salida.'], starter: '', answer: 'Theta(n*n!)', accepted: ['Θ(n·n!)', 'Θ(n*n!)', 'Theta(n n!)'], hints: ['No alcanza con contar hojas: cada salida debe copiar n posiciones.', 'Multiplicá cantidad de salidas por su tamaño.'], solution: 'Θ(n·n!) para materializar las salidas.', explanation: 'El tamaño total de salida ya impone ese costo, independientemente de mejoras internas del generador.', lessonId: 'm14-permutaciones' },
    { id: 'm14-e-poda', moduleId: 14, title: 'Poda con negativos', kind: 'debug', difficulty: 'Intermedio', prompt: 'Objetivo 1, suma parcial 5 y queda el valor −4 disponible. El código poda porque 5>1. ¿Qué suma válida pierde?', input: 'Prefijo elegido [5]; pendiente [−4]', expected: '1', constraints: ['Se permite incluir el valor pendiente.'], starter: 'if (suma > objetivo) return;', answer: '1', accepted: [], hints: ['Una decisión futura puede reducir la suma.', '5+(−4) alcanza exactamente el objetivo.'], solution: 'Pierde la solución de suma 1. La poda necesita una cota sobre valores pendientes, no solo el costo parcial.', explanation: 'El criterio no es seguro cuando quedan aportes negativos; una poda incorrecta destruye completitud.', lessonId: 'm14-permutaciones' },
    { id: 'm14-e-reinas', moduleId: 14, title: 'Una configuración de N reinas', kind: 'implementation', difficulty: 'Intermedio', prompt: 'Este espacio no compila ni ejecuta código: la revisión es manual. Implementá un buscador de una configuración de N reinas con columnas y diagonales y devolvé ausencia si no existe.', input: 'n entre 0 y 15', expected: 'Código, invariante y pruebas 0,1,2,3,4.', constraints: ['Una reina por fila.', 'Restaurar cada rama fallida.', 'No materializar un tablero si basta un arreglo.'], starter: '// columnaPorFila, marcas y búsqueda recursiva', answer: '', accepted: [], hints: ['Identificá diagonales con fila+columna y fila−columna+n−1.', 'Al llegar a fila=n, copiá o conservá una configuración completa.'], solution: 'Elegir por fila una columna con las tres marcas libres, activarlas, buscar y restaurar si falla; retornar al hallar la primera configuración.', explanation: 'La revisión comprueba restricciones entre todas las reinas y diferencia ausencia de la configuración vacía para n=0.', lessonId: 'm14-reinas' },
    { id: 'm14-e-sudoku', moduleId: 14, title: 'Solucionador de Sudoku', kind: 'implementation', difficulty: 'Intermedio', prompt: 'Este espacio no compila ni ejecuta código: la revisión es manual. Implementá un Sudoku 9×9 con validación de pistas, candidatos por fila/columna/bloque, MRV y restauración cuando no existe solución.', input: 'int[9][9]; 0 vacío; dígitos 1..9', expected: 'Código, contrato y verificación de salida.', constraints: ['No cambiar pistas.', 'Rechazar pistas duplicadas.', 'Un false debe conservar la entrada original.'], starter: 'static boolean resolverSudoku(int[][] tablero) {\n    // Validación y backtracking\n}', answer: '', accepted: [], hints: ['Las máscaras deben representar exactamente los dígitos presentes.', 'Elegí la vacía con menos candidatos y deshacé casilla y tres máscaras tras cada fallo.'], solution: 'Validar primero; seleccionar MRV; ante cero candidatos retornar false; probar cada dígito permitido, actualizar, buscar y restaurar. Sin vacías, retornar true.', explanation: 'La revisión distingue forma inválida, contradicción inicial, imposibilidad de completar y solución; también comprueba que MRV conserva completitud.', lessonId: 'm14-sudoku' },
    { id: 'm14-e-bound', moduleId: 14, title: 'Cota de asignación', kind: 'implementation', difficulty: 'Intermedio', prompt: 'Este espacio no compila ni ejecuta código: la revisión es manual. Agregá a una búsqueda de asignaciones una cota inferior por mínimos independientes de filas pendientes. Compará el resultado con enumeración completa para n pequeño.', input: 'Matriz cuadrada de costos int, incluidos negativos', expected: 'Código y prueba de seguridad de la cota.', constraints: ['No usar costo parcial solo como poda.', 'Pedir un único óptimo.', 'Separar cota inferior y solución factible.'], starter: '// acumulado + suma de mínimos entre tareas libres', answer: '', accepted: [], hints: ['Permitir ficticiamente repetir tareas relaja las restricciones.', 'El mínimo de esa relajación no puede superar el costo de una asignación residual válida.'], solution: 'Sumar al acumulado el mínimo de cada fila restante entre tareas libres y podar si esa cota es ≥ mejor costo factible.', explanation: 'La comparación segura no depende de signos; la relajación explica por qué no se pierde la rama óptima.', lessonId: 'm14-cotas' },
  ],
  questions: [
    { id: 'm14-q1', moduleId: 14, type: 'order', prompt: 'Ordená una rama de backtracking.', options: ['Elegir → aplicar → explorar → deshacer.', 'Elegir → deshacer → explorar sin estado.', 'Guardar siempre la misma referencia → cambiarla.'], answer: 0, explanation: 'Restaurar después de explorar deja el estado listo para una decisión hermana independiente.', lessonId: 'm14-espacio' },
    { id: 'm14-q2', moduleId: 14, type: 'truefalse', prompt: 'La combinación vacía es una respuesta cuando k=0.', options: ['Verdadero.', 'Falso.'], answer: 0, explanation: 'Hay una sola manera de elegir cero elementos; permite que el caso base sea coherente.', lessonId: 'm14-espacio' },
    { id: 'm14-q3', moduleId: 14, type: 'prediction', prompt: '¿Cuántas secuencias de valores distintas permutan [1,1,2]?', options: ['3.', '6.', '1.'], answer: 0, explanation: 'Son 112, 121 y 211; intercambiar los dos unos no crea una secuencia nueva.', lessonId: 'm14-permutaciones' },
    { id: 'm14-q4', moduleId: 14, type: 'choice', prompt: '¿Qué necesita una poda para conservar completitud?', options: ['Una justificación de imposibilidad o equivalencia segura.', 'Que funcione en un ejemplo.', 'Que reduzca mucho el contador de llamadas.'], answer: 0, explanation: 'Una poda rápida pero insegura puede eliminar precisamente la solución requerida.', lessonId: 'm14-permutaciones' },
    { id: 'm14-q5', moduleId: 14, type: 'choice', prompt: '¿Cómo se identifica una familia diagonal de reinas?', options: ['Por fila−columna constante, desplazada para indexar.', 'Por fila·columna constante.', 'Por la paridad de la fila solamente.'], answer: 0, explanation: 'Al avanzar una fila y una columna en el mismo sentido, su diferencia no cambia.', lessonId: 'm14-reinas' },
    { id: 'm14-q6', moduleId: 14, type: 'complexity', prompt: '¿Qué memoria auxiliar usa el contador de reinas con marcas y pila?', options: ['O(n).', 'Θ(n!) necesariamente.', 'Θ(n²) obligatoriamente.'], answer: 0, explanation: 'Hay arreglos lineales y una profundidad n; no se almacenan todos los tableros.', lessonId: 'm14-reinas' },
    { id: 'm14-q7', moduleId: 14, type: 'truefalse', prompt: 'Para enumerar caminos simples, visitado debe restaurarse al volver de una rama.', options: ['Verdadero.', 'Falso.'], answer: 0, explanation: 'La marca representa pertenencia al camino actual y no prohíbe usar la casilla en otro camino.', lessonId: 'm14-laberintos' },
    { id: 'm14-q8', moduleId: 14, type: 'choice', prompt: '¿Qué algoritmo encuentra menos pasos en un laberinto de movimientos de igual costo?', options: ['BFS.', 'Cualquier DFS sin comparar rutas.', 'Prim.'], answer: 0, explanation: 'BFS procesa capas por cantidad de aristas y garantiza la primera distancia mínima.', lessonId: 'm14-laberintos' },
    { id: 'm14-q9', moduleId: 14, type: 'order', prompt: 'Ordená el razonamiento de Branch and Bound para minimización.', options: ['Tener un costo factible → calcular cota inferior de rama → podar si no puede mejorar.', 'Usar cualquier estimación → descartar la mitad → suponer óptimo.', 'Podar todo costo parcial positivo → terminar.'], answer: 0, explanation: 'La cota inferior debe ser válida y se compara con una solución realmente realizable.', lessonId: 'm14-cotas' },
    { id: 'm14-q10', moduleId: 14, type: 'complexity', prompt: '¿La poda de Branch and Bound garantiza tiempo polinómico para asignación por permutaciones?', options: ['No; el árbol explorado puede conservar tamaño factorial.', 'Sí, siempre O(n²).', 'Sí, elimina todas las ramas menos una.'], answer: 0, explanation: 'La eficacia depende de la instancia y de las cotas; no desaparece la posibilidad de un árbol grande.', lessonId: 'm14-cotas' },
    { id: 'm14-q11', moduleId: 14, type: 'prediction', prompt: 'Una casilla Sudoku tiene cero candidatos. ¿Qué hace la búsqueda?', options: ['Rechaza la rama actual.', 'Borra una pista para continuar.', 'Acepta porque no hay decisiones.'], answer: 0, explanation: 'La casilla sigue vacía y ninguna extensión satisface las restricciones actuales.', lessonId: 'm14-sudoku' },
    { id: 'm14-q12', moduleId: 14, type: 'choice', prompt: '¿Qué garantiza encontrar una solución de Sudoku?', options: ['Existencia de al menos una solución, sin demostrar unicidad.', 'Que no hay otra solución.', 'Que todas las pistas iniciales eran necesarias.'], answer: 0, explanation: 'Para probar unicidad debemos continuar o aplicar un argumento que descarte cualquier segunda solución.', lessonId: 'm14-sudoku' },
  ],
  glossary: [
    { term: 'Backtracking', definition: 'Exploración de decisiones parciales con restauración del estado al regresar de cada rama.', lessonId: 'm14-espacio' },
    { term: 'Árbol de decisiones', definition: 'Representación de estados parciales y elecciones que los extienden.', lessonId: 'm14-espacio' },
    { term: 'Poda', definition: 'Descarte de una rama mediante una condición demostrada de imposibilidad, equivalencia u optimalidad.', lessonId: 'm14-permutaciones' },
    { term: 'Camino simple', definition: 'Camino que no repite vértices; en una grilla impide repetir casillas dentro de la misma ruta.', lessonId: 'm14-laberintos' },
    { term: 'Branch and Bound', definition: 'Búsqueda de óptimos que compara cotas de ramas con una solución factible conocida.', lessonId: 'm14-cotas' },
    { term: 'Cota inferior admisible', definition: 'Estimación que no supera el costo de ninguna solución factible de la rama en un problema de minimización.', lessonId: 'm14-cotas' },
    { term: 'MRV', definition: 'Heurística que elige la variable sin asignar con menos valores permitidos en el estado actual.', lessonId: 'm14-sudoku' },
    { term: 'Restauración', definition: 'Recuperación exacta del estado previo para mantener independientes las alternativas exploradas.', lessonId: 'm14-sudoku' },
  ],
};
