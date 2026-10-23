# Proyecto: Plataforma interactiva de Algoritmos y Estructuras de Datos

## 1. Objetivo general

Desarrolla una plataforma web educativa, moderna, completa e interactiva, cuyo objetivo sea enseñar Algoritmos y Estructuras de Datos desde los fundamentos hasta conceptos avanzados, utilizando **Java como lenguaje principal**.

La plataforma debe funcionar como un curso autodidacta completo, permitiendo que una persona sin conocimientos previos de algoritmos pueda aprender progresivamente hasta alcanzar un nivel avanzado.

No debe ser simplemente una página que muestre información. Debe comportarse como un entorno de aprendizaje interactivo, con explicaciones detalladas, ejemplos, ejercicios, animaciones, evaluaciones y seguimiento del progreso.

El estudiante tiene conocimientos básicos de Java, incluyendo programación orientada a objetos, genéricos y colecciones.

## 2. Diseño e interfaz

Diseña una interfaz moderna, profesional, intuitiva y visualmente atractiva.

Características:

- Diseño responsive para computadoras, tablets y dispositivos móviles.
- Modo oscuro y claro.
- Barra lateral de navegación con los cuatro bloques y sus 16 módulos.
- Menú principal con acceso al dashboard, módulos, laboratorio, ejercicios, evaluaciones y progreso.
- Indicador de avance por módulo y del curso completo.
- Navegación clara entre lecciones.
- Tipografía legible y jerarquía visual consistente.
- Animaciones suaves que mejoren la experiencia.
- Código con resaltado de sintaxis.
- Diseño accesible, con controles utilizables mediante teclado.
- Componentes reutilizables y consistentes.

La estética debe transmitir la sensación de una plataforma educativa profesional, evitando diseños genéricos o excesivamente recargados.

## 3. Dashboard principal

Implementa un panel de inicio que incluya:

- Bienvenida al estudiante.
- Porcentaje de progreso general.
- Módulos completados y pendientes.
- Última lección visitada.
- Botón para continuar estudiando.
- Tiempo de estudio acumulado, medido mediante sesiones activas.
- Ejercicios y evaluaciones completados.
- Recomendaciones de próximos temas.
- Accesos rápidos al laboratorio interactivo.

El progreso debe persistir al cerrar y volver a abrir la aplicación.

## 4. Organización académica

El curso se dividirá en cuatro bloques y 16 módulos, siguiendo exactamente el temario proporcionado.

Cada módulo debe dividirse en lecciones individuales. No agrupes todo el contenido del módulo en una sola página extensa.

Cada lección debe incluir, cuando corresponda:

1. Título y objetivos de aprendizaje.
2. Requisitos previos.
3. Introducción contextual.
4. Explicación teórica detallada.
5. Ejemplos cotidianos que faciliten la comprensión.
6. Representaciones visuales.
7. Pseudocódigo explicado.
8. Implementación en Java.
9. Explicación del código paso a paso.
10. Análisis de complejidad temporal y espacial.
11. Casos especiales y errores frecuentes.
12. Ejercicios resueltos.
13. Ejercicios para realizar de forma independiente.
14. Resumen de conceptos clave.

El contenido debe ser académicamente riguroso, pero explicado mediante un lenguaje comprensible y progresivo.

No omitas conceptos, definiciones, demostraciones ni explicaciones importantes.

## 5. Metodología de enseñanza

La plataforma debe aplicar una metodología de aprendizaje progresiva.

Para cada concepto:

- Comienza explicando qué problema resuelve.
- Presenta una situación práctica.
- Introduce la teoría necesaria.
- Muestra un ejemplo sencillo.
- Desarrolla la solución paso a paso.
- Presenta el pseudocódigo.
- Implementa la solución en Java.
- Explica las decisiones de implementación.
- Analiza su complejidad.
- Presenta ejercicios de dificultad creciente.

Evita introducir conceptos avanzados sin explicar previamente los fundamentos necesarios.

No presupongas que el estudiante comprende un concepto únicamente por haber visto su definición.

Utiliza ejemplos concretos y explicaciones intuitivas antes de introducir formalismos matemáticos.

## 6. Visualizaciones interactivas

Implementa visualizaciones donde permitan comprender el funcionamiento interno de los algoritmos y estructuras de datos.

Las visualizaciones deberán permitir, cuando tenga sentido:

- Iniciar, detener y reiniciar.
- Avanzar y retroceder paso a paso.
- Ajustar la velocidad de ejecución.
- Introducir datos personalizados.
- Observar cambios de estado.
- Resaltar elementos activos.
- Mostrar la operación actual.
- Mostrar el pseudocódigo con la instrucción correspondiente resaltada.
- Consultar la cantidad de comparaciones, intercambios u operaciones realizadas.

Ejemplos de visualizaciones:

- Búsqueda lineal y binaria.
- Algoritmos de ordenamiento.
- Pila de llamadas recursivas.
- Listas enlazadas.
- Pilas y colas.
- Árboles binarios.
- Rotaciones AVL.
- Tablas hash y colisiones.
- Tries.
- BFS y DFS.
- Dijkstra.
- Prim y Kruskal.
- Programación dinámica.
- Backtracking.

Las visualizaciones deben reflejar correctamente el estado del algoritmo, no ser animaciones decorativas.

## 7. Laboratorio interactivo

Desarrolla un laboratorio donde el estudiante pueda experimentar directamente con las estructuras de datos.

Debe permitir crear estructuras, modificar sus elementos y ejecutar operaciones.

Por ejemplo:

**Árboles AVL:**
- Insertar valores.
- Eliminar valores.
- Buscar nodos.
- Visualizar factores de balance.
- Ejecutar rotaciones.
- Observar cómo cambia la altura.
- Comparar el árbol antes y después de cada operación.

**Grafos:**
- Agregar y eliminar vértices.
- Crear aristas dirigidas o no dirigidas.
- Asignar pesos.
- Ejecutar BFS, DFS y Dijkstra.
- Visualizar el recorrido y las distancias.
- Reconstruir caminos mínimos.

Cada laboratorio debe incluir instrucciones y explicaciones contextuales.

## 8. Código y ejercicios de programación

El lenguaje de programación utilizado será Java.

Incluye un editor de código integrado que permita:

- Escribir y modificar código.
- Resaltar sintaxis.
- Ejecutar soluciones cuando exista un entorno de ejecución configurado.
- Visualizar resultados.
- Ejecutar casos de prueba.
- Identificar errores de compilación y ejecución.
- Comparar los resultados obtenidos con los esperados.
- Consultar pistas progresivas.

Si se implementa ejecución real de Java, utiliza un entorno aislado y seguro, con límites de tiempo, memoria y recursos.

No simules una ejecución real ni presentes resultados ficticios como si el código hubiera sido ejecutado.

Cada ejercicio debe indicar:

- Enunciado.
- Objetivo.
- Datos de entrada.
- Salida esperada.
- Restricciones.
- Ejemplos.
- Nivel de dificultad.
- Pistas.
- Solución explicada, disponible después de intentarlo.

Incluye ejercicios de implementación, corrección de errores y análisis de complejidad.

## 9. Evaluaciones

Cada módulo debe contener una evaluación final.

Incorpora diferentes tipos de preguntas:

- Opción múltiple.
- Verdadero o falso.
- Predicción de resultados.
- Identificación de complejidades.
- Ordenamiento de pasos.
- Interpretación de pseudocódigo.
- Resolución de problemas.
- Implementación de algoritmos.

Después de cada respuesta, muestra una explicación clara que indique por qué es correcta o incorrecta.

Permite repetir las evaluaciones y consultar los errores anteriores.

La evaluación debe medir comprensión, no únicamente memorización.

## 10. Seguimiento del aprendizaje

Implementa un sistema de progreso que permita:

- Marcar lecciones como completadas.
- Guardar ejercicios resueltos.
- Registrar evaluaciones y calificaciones.
- Continuar desde la última sesión.
- Identificar temas que necesitan repaso.
- Consultar estadísticas generales.
- Visualizar avances por bloque y módulo.

Para una primera versión sin autenticación, utiliza almacenamiento local persistente. Diseña la aplicación de forma que posteriormente pueda incorporarse una base de datos y autenticación sin reescribir toda la lógica educativa.

## 11. Herramientas complementarias

Agrega:

- Buscador de conceptos y lecciones.
- Glosario de términos.
- Comparador de complejidades.
- Tabla de referencia Big O.
- Apuntes personales por lección.
- Marcadores para guardar contenido.
- Resúmenes descargables o imprimibles.
- Banco de ejercicios.
- Modo de repaso.
- Cuestionarios sobre temas estudiados.

## 12. Calidad del contenido

El contenido académico es una prioridad fundamental.

Requisitos:

- Explicaciones completas y verificables.
- Terminología correcta.
- Código Java válido y legible.
- Ejemplos coherentes.
- Casos límite contemplados.
- Complejidades justificadas.
- Diferenciación entre peor caso, caso promedio y mejor caso cuando corresponda.
- Ejercicios alineados con lo aprendido.
- Progresión lógica entre contenidos.
- Ausencia de contenido de relleno.

No utilices textos genéricos como "Aquí aprenderás sobre árboles" en lugar de desarrollar realmente el tema.

No inventes resultados de algoritmos, evaluaciones ni ejecuciones.

## 13. Arquitectura y calidad técnica

La aplicación deberá:

- Utilizar componentes reutilizables.
- Separar el contenido académico de la lógica de presentación.
- Separar la lógica de algoritmos de sus visualizaciones.
- Manejar errores y entradas inválidas.
- Mantener un estado consistente al navegar.
- Permitir agregar nuevas lecciones sin modificar componentes centrales.
- Evitar dependencias innecesarias.
- Ser mantenible, escalable y accesible.
- Utilizar TypeScript cuando el stack elegido lo permita.

## 14. Criterios de aceptación

Considera una funcionalidad terminada solamente cuando:

- Se pueda utilizar desde la interfaz.
- Tenga contenido real.
- Responda correctamente a las interacciones.
- Maneje entradas y casos límite.
- No dependa de datos ficticios presentados como reales.
- Mantenga el progreso cuando corresponda.
- Funcione en dispositivos móviles y computadoras.

Prioriza la calidad funcional y educativa.

Si no es posible desarrollar todo en una sola iteración, implementa primero una base sólida, junto con un módulo completo que demuestre el funcionamiento real de las lecciones, visualizaciones, ejercicios, evaluaciones y seguimiento del progreso.

Posteriormente extiende ese sistema al resto del temario sin sacrificar calidad.

## 15. Temario completo

[AQUÍ INSERTAR EL TEMARIO DE LOS 16 MÓDULOS PROPORCIONADO ANTERIORMENTE]

Respeta los cuatro bloques, los 16 módulos, los temas y las prácticas indicadas. Puedes subdividir los temas en lecciones adicionales cuando resulte pedagógicamente beneficioso, pero no eliminar contenido.

## 16. Resultado esperado

El resultado final debe ser una plataforma web educativa funcional, intuitiva e interactiva, que permita estudiar Algoritmos y Estructuras de Datos de forma autónoma.

El objetivo es que el estudiante no solamente memorice algoritmos, sino que comprenda cómo funcionan, por qué funcionan, cómo implementarlos y cuándo conviene utilizarlos.