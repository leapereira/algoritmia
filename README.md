# Algoritmia

Aula de algoritmos y estructuras de datos en español, con Java como lenguaje didáctico. Primera edición funcional: estructura de los cuatro bloques y los dieciséis módulos, con el módulo 1 completamente desarrollado. El programa original se conserva en `docs/`.

## Iniciar

Requiere Node.js 24 o superior. Sin dependencias de ejecución; TypeScript se utiliza durante el desarrollo.

```sh
npm ci
npm run build
npm run dev
```

Abrir http://127.0.0.1:4173. Para verificar los algoritmos, datos y persistencia:

```sh
npm run build
npm test
```

El build verifica tipos en modo estricto con el compilador de TypeScript, genera los módulos JavaScript y copia los recursos estáticos. `dist/` puede servirse en cualquier servidor estático; las rutas usan fragmentos de URL.

## Incluido

- Dashboard con estadísticas derivadas de la actividad real y reanudación.
- Programa exacto: 4 bloques, 16 módulos, 135 temas y 16 prácticas.
- Seis lecciones completas del módulo 1, cada una con objetivos, teoría, ejemplos Java, complejidad, casos límite, resolución y práctica.
- Laboratorio de máximo, inversión, duplicados, búsquedas lineal/binaria y Bubble Sort, más una visualización de la pila recursiva. Trazas reales, pasos adelante/atrás, reproducción, velocidad, entrada personalizada, pseudocódigo y contadores.
- Seis ejercicios con respuestas comprobables o revisión manual explícita, pistas e historial.
- Editor Java, borradores persistentes, vista de sintaxis y descarga. **No compila ni ejecuta Java.** La revisión personal se distingue de la validación automática.
- Evaluación de doce preguntas, explicaciones inmediatas, repetición, notas históricas y recomendaciones de repaso.
- Apuntes por lección, marcadores, búsqueda, glosario y comparador Big O.
- Tema claro/oscuro, diseño responsive, controles de teclado e impresión de lecciones.

## Alcance pendiente

Los módulos 2–16 conservan todos los temas y prácticas, pero se identifican como «En preparación»: no se presentan como contenido ya desarrollado. Sus lecciones, ejercicios, evaluaciones y laboratorios de estructuras avanzadas son trabajo futuro. La lección de recursividad incluye un laboratorio propio que representa la pila de llamadas, el caso base y los retornos de una suma recursiva.

La ejecución de Java requiere incorporar un servicio aislado con límites de tiempo, memoria y recursos. No se simulan resultados. No hay autenticación ni sincronización entre dispositivos.

## Arquitectura

- `src/data/`: contenido académico independiente de la interfaz.
- `src/algorithms.ts`: motores de algoritmos puros y sus trazas.
- `src/lab.ts`: visualización y reproductor.
- `src/storage.ts`: repositorio local, validación y reconstrucción de calificaciones.
- `src/app.ts`: navegación, componentes y flujos de aprendizaje.
- `tests/`: pruebas de trazas, integridad de contenido y recuperación de datos.

El progreso usa localStorage del origen actual. Cambiar de localhost al sitio publicado inicia otro registro. Borrar los datos del navegador elimina el progreso de ese origen. La exportación JSON permite conservar una copia (sin importación desde la interfaz). El tiempo de estudio solo aumenta con ventana visible, foco y actividad reciente; se pausa tras dos minutos sin interacción.

El avance global asigna el mismo peso a cada uno de los dieciséis módulos, mitad lecciones y mitad evaluación. El módulo 1 se completa con sus seis lecciones marcadas y una evaluación de al menos 70 %. Los ejercicios Java revisados manualmente quedan identificados como tales.

## Publicación

`.openai/hosting.json` configura la publicación estática en Sites. El sitio comienza con acceso privado para su propietario. Los apuntes y el progreso permanecen en el navegador, no se envían a un servidor de la aplicación. Las fuentes web se solicitan a Google Fonts; si no hay conexión se usan fuentes del sistema.
