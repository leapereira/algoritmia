# Verificación

Estado registrado el 24 de octubre de 2026. Este documento distingue las pruebas ejecutadas de la cobertura manual previamente registrada.

## Resultado automatizado actual

Se ejecutó `npm test`: el paso previo verificó TypeScript en modo estricto y generó `dist/`; las **60 pruebas finalizaron aprobadas, con 0 fallidas**.

El contenido agregado de `dist/data/course.js` confirmó:

| Elemento | Cantidad |
| --- | ---: |
| Bloques | 4 |
| Módulos disponibles | 16 |
| Temas del programa | 135 |
| Prácticas del programa | 16 |
| Lecciones | 84 |
| Ejercicios | 83 |
| Preguntas | 166 |
| Términos únicos del glosario | 122 |

La prueba de integridad comprueba contenido por módulo, identificadores únicos, referencias a lecciones, opciones y respuestas válidas, y aceptación de respuestas canónicas. Estas verificaciones detectan inconsistencias estructurales; no equivalen por sí solas a una demostración de todas las afirmaciones académicas.

## Motores y flujos cubiertos por pruebas

- Máximo, inversión y ordenamientos contrastados con resultados de referencia sobre 364 arreglos pequeños, incluyendo vacíos, negativos y duplicados. Contadores, corte temprano, rangos de Counting/Radix e independencia de instantáneas.
- Búsquedas lineal/binaria, rechazo de datos inválidos y precondición de orden para la búsqueda binaria.
- Recursión: caso base, sumas parciales, retornos, profundidad, cantidad de llamadas e instantáneas independientes.
- ABB y AVL: orden, altura, balance, inserciones, borrados y conservación del estado anterior. Lista enlazada, Min-Heap, sondeo y rehashing, Trie y recencia LRU.
- Grafos: distancias y caminos, pesos negativos, ciclos y precondiciones, bosques mínimos, orden topológico y exploración completa de una rama DFS antes de sus hermanos.
- LCS contra enumeración exhaustiva pequeña, N reinas y selección compatible de actividades. Segment Tree y Fenwick comparados con sumas directas después de actualizaciones.
- Evaluación: correspondencia de opciones barajadas con índices canónicos, bancos separados por módulo, validación de respuestas y conservación de evaluaciones antiguas del módulo 1.
- Respuestas de ejercicios: espacios y Unicode admitidos según el formato, rechazo de números mal formados, secuencias incorrectas y valores extra. Descarga Java: clases completas, clases anidadas y fragmentos con importaciones.
- Persistencia: JSON mal formado, almacenamiento inaccesible, calificaciones corruptas, reconstrucción desde respuestas y conservación de logros después de más de cien intentos.
- Fusión de tres vías: adiciones y eliminaciones de dos pestañas modeladas, apuntes/borradores por clave, intentos de ambos lados sin duplicados, tiempo incremental, persistencias sucesivas e independencia de copias.

Las pruebas de fusión se ejecutan en Node y modelan estados de pestañas. No constituyen una prueba de integración de Web Locks, eventos `storage`, cierre de pestañas ni todos los flujos asíncronos en un navegador.

## Comprobaciones Java ejecutadas durante el desarrollo

Se compilaron y ejecutaron los 25 ejemplos resueltos de los módulos 3, 6, 9, 12 y 15 con casos de comportamiento. Se incluyeron entradas límite y comprobaciones aleatorias para Merge Sort, Quick Sort, Segment Tree y Fenwick. La verificación de los seis ejemplos resueltos del módulo 1 ya estaba registrada en la edición inicial.

Esto describe esos ejemplos comprobados, no una ejecución exhaustiva de todos los fragmentos del curso. La aplicación no proporciona un compilador ni un servicio de ejecución Java al estudiante: las implementaciones se registran como intentos o revisión personal.

## Comprobación manual registrada

La revisión actual en navegador comprobó que completar una lección y cambiar su marcador desde otra pestaña actualiza los controles de la lección abierta sin reconstruir su laboratorio; el vector experimental mantuvo su estado. También comprobó que apuntes de dos lecciones guardados desde pestañas distintas sobreviven a la recarga.

También se completaron dos evaluaciones del módulo 16 en pestañas distintas (30/100 y 40/100). Al visitar el progreso y volver, la primera conservó su resultado y sus diez respuestas; el historial retuvo ambos intentos. En Segment Tree y Fenwick, la consulta [1,4) dio 5 en ambos, y después de asignar 10 al índice 2 dio 11 en ambos. Se comprobó la selección independiente de Heap Sort y Min-Heap, y Radix ordenó [3,−2,0,−2] como [−2,−2,0,3]. La consola de esa sesión no registró errores.

La edición inicial del módulo 1 registró lectura de lecciones; guardado y recuperación de apuntes, marcadores y lección completada; respuesta con espacios variables; rechazo de entrada binaria desordenada; evaluación completa de doce preguntas y recuperación de la calificación tras recargar; resultado y profundidad de la suma recursiva; menú móvil, tema oscuro y búsqueda.

También se observaron dashboard y lección a 390 píxeles de ancho sin desbordamiento horizontal. Ese registro corresponde a la edición inicial y no afirma una revisión manual completa de las 84 lecciones ni de todos los laboratorios incorporados después.

## Alcance del producto

Los dieciséis módulos tienen lecciones, ejercicios y evaluación; los módulos 2–16 ya no son contenido pendiente. Los laboratorios disponibles cubren algoritmos de búsqueda y ordenamiento, recursión, estructuras fundamentales, grafos, actividades voraces, LCS, N reinas, LRU, Segment Tree/Fenwick y análisis de costos. No cada tema del programa dispone de una simulación propia.

El progreso se guarda localmente por origen y no se sincroniza entre dispositivos. Las referencias enlazadas por módulo son material académico y documentación primaria de MIT, Princeton, Stanford y Oracle. La presencia de esos enlaces no implica que todas las páginas externas se hayan vuelto a comprobar en esta ejecución de pruebas.
