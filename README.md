# Algoritmia

Aula interactiva de algoritmos y estructuras de datos en español, con Java como lenguaje didáctico. Los cuatro bloques y los dieciséis módulos están disponibles: **84 lecciones, 83 ejercicios, 166 preguntas y 122 términos de glosario**. El programa conserva sus 135 temas y 16 prácticas en `docs/TEMARIO.md`.

## Iniciar

Requiere Node.js 24 o superior. La aplicación publicada es estática y no tiene dependencias de ejecución; TypeScript se utiliza durante el desarrollo.

```sh
npm ci
npm run build
npm run dev
```

Abrir http://127.0.0.1:4173. Para comprobar tipos, generar la aplicación y ejecutar las pruebas:

```sh
npm test
```

El paso `pretest` ejecuta el build, que verifica TypeScript en modo estricto y genera `dist/`. También se puede ejecutar `npm run typecheck` por separado. Las rutas usan fragmentos de URL, por lo que `dist/` puede alojarse en un servidor estático sin reglas especiales de navegación.

## Curso y herramientas

- Dieciséis módulos con objetivos, prerrequisitos, teoría, ejemplos Java, correctitud, complejidad, casos límite, ejercicios resueltos y práctica independiente.
- Ochenta y tres ejercicios de predicción, complejidad, depuración e implementación, con pistas progresivas, explicación e historial. Las respuestas textuales se comprueban automáticamente; las implementaciones se revisan manualmente.
- Una evaluación independiente por módulo, con preguntas de varios tipos, opciones barajadas, explicaciones, resultados históricos y temas para repasar.
- Editor Java con borradores locales, resaltado de sintaxis y descarga de archivos. **No compila ni ejecuta Java en el navegador ni en un servidor.** Los resultados de revisión personal están identificados como tales.
- Dashboard, progreso por módulo y bloque, reanudación, apuntes, marcadores, búsqueda, glosario y comparador Big O.
- Tema claro/oscuro, diseño adaptable, controles de teclado e impresión de lecciones.

El avance global asigna igual peso a los dieciséis módulos: mitad lecciones y mitad evaluación. Cada módulo se completa al marcar sus propias lecciones y alcanzar al menos 70 % en su evaluación. Aprobar uno no acredita otro. Los ejercicios revisados personalmente se incluyen en la métrica de ejercicios, con la distinción visible de revisión manual.

La duración mostrada junto a una lección es una estimación de estudio. El contador de tiempo registra actividad con la ventana visible, foco e interacción reciente; se pausa tras dos minutos sin interacción.

## Laboratorios disponibles

- Máximo, inversión, duplicados y búsquedas lineal/binaria.
- Bubble, Selection, Insertion, Merge, Quick, Heap, Counting y Radix Sort.
- Pila de llamadas de una suma recursiva: caso base, marcos activos y retornos.
- Lista enlazada, pila, cola, ABB, AVL con rotaciones, Min-Heap, tabla hash y Trie con autocompletado.
- Grafos: BFS, DFS, Dijkstra, Bellman-Ford, Prim, Kruskal y ordenamiento topológico, con validación de sus precondiciones.
- Selección voraz de actividades, tabla LCS y backtracking de N reinas.
- Caché LRU, consultas y actualizaciones con Segment Tree/Fenwick, y conteos de complejidad y amortización.

Las trazas de algoritmos permiten avanzar, retroceder, reproducir y cambiar velocidad y datos. Los widgets de estructuras permiten realizar operaciones y observar el estado resultante. Las demostraciones ejecutan lógica JavaScript real; no son una ejecución de los fragmentos Java del curso. Cada laboratorio limita tamaños y entradas para mantener la visualización legible. Las simulaciones cubren una selección del temario; otros temas se trabajan mediante teoría, ejemplos y prácticas.

## Datos y persistencia

El progreso usa `localStorage` del origen actual. Cambiar de localhost al sitio publicado inicia otro registro; borrar los datos del navegador elimina el progreso de ese origen. No hay cuentas, sincronización entre dispositivos ni almacenamiento de apuntes en un servidor de la aplicación.

La aplicación combina cambios de pestañas del mismo origen mediante una fusión de tres vías. Conserva adiciones y eliminaciones locales, cambios de apuntes por clave e intentos de ambos lados; utiliza Web Locks para serializar guardados cuando el navegador lo ofrece. La exportación JSON permite conservar una copia; la interfaz no incluye importación.

Las calificaciones guardadas se reconstruyen desde las respuestas y el banco del módulo al cargar los datos. Los errores de almacenamiento se notifican para que se puedan copiar los apuntes o descargar el código antes de cerrar.

## Referencias y verificación

Las lecciones enlazan material académico y documentación primaria de MIT OpenCourseWare, Princeton, Stanford y Oracle. Las referencias se seleccionan por módulo en `src/data/references.ts`; algunas usan lenguajes distintos de Java.

La ejecución registrada de `npm test` completa **60 pruebas**, además de verificar tipos y construir la aplicación. Su alcance y las comprobaciones manuales registradas se detallan en `docs/VERIFICACION.md`.

## Arquitectura y publicación

- `src/data/`: temario, contenido de los dieciséis módulos, agregación del curso y referencias.
- `src/algorithms.ts`, `structures.ts`, `graph.ts`, `techniques.ts`, `ranges.ts` y `recursion.ts`: motores y estados de las demostraciones.
- `src/lab.ts` y `src/playgrounds.ts`: visualización y controles interactivos.
- `src/learning.ts`, `assessment.ts` y `answers.ts`: progreso, evaluación y comprobación de respuestas.
- `src/storage.ts`: validación, fusión y persistencia local.
- `src/app.ts`: navegación y flujos de aprendizaje.
- `tests/`: pruebas de motores, integridad académica, calificaciones y recuperación/fusión de datos.

`.openai/hosting.json` configura `dist/` como contenido estático para Sites. El acceso al sitio se administra en el alojamiento. Los apuntes y el progreso permanecen en el navegador. Google Fonts proporciona las fuentes web; sin conexión se usan fuentes del sistema.
