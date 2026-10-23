import test from 'node:test';
import assert from 'node:assert/strict';
import { blocks, modules, exercises, questions, glossary } from '../src/data/curriculum.ts';
import { lessons } from '../src/data/lessons.ts';
import { sanitizeProgress, loadProgress, saveProgress } from '../src/storage.ts';

const lessonIds = new Set(lessons.map(lesson => lesson.id));
const allCorrect = questions.map(question => question.answer);
const allWrong = questions.map(question => (question.answer + 1) % question.options.length);
const assessment = (answers, at = '2026-10-23T15:00:00.000Z') => {
  const mistakes = questions.filter((question, index) => answers[index] !== question.answer).map(question => question.id);
  return { at, score: Math.round((questions.length - mistakes.length) / questions.length * 100), answers, mistakes };
};
const exerciseAttempt = (overrides = {}) => ({ at: '2026-10-23T15:00:00.000Z', response: '-2', correct: true, manual: false, ...overrides });
const unique = (items, label) => assert.equal(new Set(items).size, items.length, `${label}: hay identificadores repetidos`);

test('el programa mantiene cuatro bloques, dieciséis módulos y los 135 temas del temario', () => {
  assert.deepEqual(blocks.map(block => block.id), [1, 2, 3, 4]);
  assert.deepEqual(modules.map(module => module.id), Array.from({ length: 16 }, (_, index) => index + 1));
  assert.deepEqual(modules.map(module => module.topics.length), [6, 8, 9, 8, 8, 8, 9, 9, 7, 8, 10, 9, 9, 9, 8, 10]);
  assert.equal(modules.reduce((sum, module) => sum + module.topics.length, 0), 135);
  assert.deepEqual(blocks.map(block => modules.filter(module => module.blockId === block.id).length), [3, 6, 5, 2]);
  assert.deepEqual(modules.filter(module => module.available).map(module => module.id), [1]);
  for (const module of modules) {
    assert.ok(blocks.some(block => block.id === module.blockId));
    assert.ok(module.title.trim());
    assert.ok(module.practice.trim().length > 20, `Falta práctica en el módulo ${module.id}`);
    assert.ok(module.topics.every(topic => typeof topic === 'string' && topic.trim().length > 0));
    unique(module.topics, `Temas del módulo ${module.id}`);
  }
});

test('las lecciones y las referencias de ejercicios, preguntas y glosario apuntan a contenido disponible', () => {
  assert.deepEqual([...lessonIds], ['algoritmos', 'pseudocodigo', 'control', 'recursion', 'correctitud', 'eficiencia']);
  unique(lessons.map(lesson => lesson.id), 'Lecciones');
  unique(exercises.map(exercise => exercise.id), 'Ejercicios');
  unique(questions.map(question => question.id), 'Preguntas');
  unique(glossary.map(entry => entry.term), 'Glosario');
  for (const lesson of lessons) {
    assert.equal(lesson.moduleId, 1);
    assert.ok(modules.find(module => module.id === lesson.moduleId)?.available);
    assert.ok(lesson.duration > 0);
    assert.ok(lesson.sections.length > 0);
    assert.ok(lesson.sections.every(section => section.title && section.paragraphs.length));
    assert.ok(lesson.solved.code.trim());
    assert.ok(lesson.practice.prompt.trim());
  }
  for (const item of [...exercises, ...questions, ...glossary]) {
    if (item.lessonId !== undefined) assert.ok(lessonIds.has(item.lessonId), `Referencia inválida: ${item.lessonId}`);
  }
  for (const lessonId of lessonIds) {
    assert.ok(exercises.some(exercise => exercise.lessonId === lessonId), `La lección ${lessonId} no tiene ejercicio`);
    assert.ok(questions.some(question => question.lessonId === lessonId), `La lección ${lessonId} no tiene evaluación`);
  }
});

test('las doce preguntas tienen una respuesta válida y cubren los cinco tipos de evaluación', () => {
  assert.equal(questions.length, 12);
  assert.deepEqual([...new Set(questions.map(question => question.type))].sort(), ['choice', 'complexity', 'order', 'prediction', 'truefalse']);
  for (const question of questions) {
    assert.ok(question.prompt.trim());
    assert.ok(question.options.length >= 2);
    unique(question.options, `Opciones de ${question.id}`);
    assert.ok(question.options.every(option => typeof option === 'string' && option.trim()));
    assert.ok(Number.isInteger(question.answer));
    assert.ok(question.answer >= 0 && question.answer < question.options.length, `Respuesta fuera de rango: ${question.id}`);
    assert.ok(question.explanation.trim());
    if (question.type === 'truefalse') assert.equal(question.options.length, 2);
  }
});

test('los seis ejercicios separan comprobación textual y revisión manual del código Java', () => {
  assert.equal(exercises.length, 6);
  for (const exercise of exercises) {
    assert.ok(exercise.prompt && exercise.starter && exercise.solution && exercise.explanation);
    assert.ok(exercise.constraints.length > 0);
    assert.ok(exercise.hints.length > 0);
    if (exercise.kind === 'implementation') {
      assert.deepEqual(exercise.accepted, []);
      assert.match(exercise.prompt, /no compila ni ejecuta/i);
    } else {
      assert.ok(exercise.accepted.includes(exercise.answer), `La respuesta canónica no se acepta en ${exercise.id}`);
    }
  }
});

test('la sanitización devuelve un estado inicial seguro ante raíces corruptas', () => {
  const initial = sanitizeProgress(undefined, questions);
  assert.deepEqual(initial, {
    version: 1, completed: [], bookmarks: [], notes: {}, drafts: {},
    exerciseAttempts: {}, assessments: [], lastLesson: 'algoritmos', studySeconds: 0,
  });
  for (const value of [null, false, 0, 'texto', [], ['algoritmos']]) {
    assert.deepEqual(sanitizeProgress(value, questions), initial);
  }
});

test('los campos de progreso filtran tipos incorrectos sin perder apuntes y borradores válidos', () => {
  const raw = {
    version: 999,
    completed: ['algoritmos', false, 'algoritmos', 42, 'control'],
    bookmarks: [null, 'recursion', 'recursion'],
    notes: { algoritmos: '<script>solo texto</script>', control: 42, recursion: null },
    drafts: { 'implementar-duplicados': 'return false;', bad: false },
    lastLesson: 4,
    studySeconds: 12.9,
  };
  const clean = sanitizeProgress(raw, questions);
  assert.equal(clean.version, 1);
  assert.deepEqual(clean.completed, ['algoritmos', 'control']);
  assert.deepEqual(clean.bookmarks, ['recursion']);
  assert.deepEqual(clean.notes, { algoritmos: '<script>solo texto</script>' });
  assert.deepEqual(clean.drafts, { 'implementar-duplicados': 'return false;' });
  assert.equal(clean.lastLesson, 'algoritmos');
  assert.equal(clean.studySeconds, 12);
  assert.deepEqual(raw.completed, ['algoritmos', false, 'algoritmos', 42, 'control'], 'La sanitización no debe modificar su entrada');
});

test('el reloj de estudio rechaza valores no finitos y limita tiempos negativos', () => {
  for (const studySeconds of [NaN, Infinity, -Infinity, '120', -12, null]) {
    assert.equal(sanitizeProgress({ studySeconds }, questions).studySeconds, 0);
  }
  assert.equal(sanitizeProgress({ studySeconds: 61.8 }, questions).studySeconds, 61);
});

test('el historial de ejercicios conserva respuestas válidas y descarta intentos mal formados', () => {
  const valid = exerciseAttempt();
  const manual = exerciseAttempt({ response: 'return false;', correct: null, manual: true });
  const clean = sanitizeProgress({ exerciseAttempts: {
    'maximo-negativos': [valid, null, {}, exerciseAttempt({ correct: 'true' }), exerciseAttempt({ manual: 1 }), exerciseAttempt({ at: 0 }), exerciseAttempt({ response: 6 })],
    'implementar-duplicados': [manual],
    invalid: 'no es un historial',
  } }, questions);
  assert.deepEqual(clean.exerciseAttempts['maximo-negativos'], [valid]);
  assert.deepEqual(clean.exerciseAttempts['implementar-duplicados'], [manual]);
  assert.equal(clean.exerciseAttempts.invalid, undefined);
});

test('las evaluaciones incompletas o con índices corruptos no pueden acreditar una aprobación', () => {
  const invalid = [
    null, {},
    { at: '2026-10-23', score: 100, answers: [], mistakes: [] },
    { at: '2026-10-23', score: 100, answers: allCorrect.slice(1), mistakes: [] },
    { at: '2026-10-23', score: 100, answers: allCorrect.map(() => 999), mistakes: [] },
    { at: '2026-10-23', score: 100, answers: allCorrect.map(() => -1), mistakes: [] },
    { at: '2026-10-23', score: 100, answers: allCorrect.map(() => 0.5), mistakes: [] },
    { at: '2026-10-23', score: 100, answers: allCorrect.map(String), mistakes: [] },
  ];
  assert.deepEqual(sanitizeProgress({ assessments: invalid }, questions).assessments, []);
});

test('la evaluación recalcula puntuación y errores desde las respuestas en lugar de confiar en métricas guardadas', () => {
  const corrupt = {
    at: '2026-10-23T15:00:00.000Z', score: 100,
    answers: allWrong, mistakes: [],
  };
  const [clean] = sanitizeProgress({ assessments: [corrupt] }, questions).assessments;
  assert.ok(clean);
  assert.equal(clean.score, 0);
  assert.deepEqual(clean.mistakes, questions.map(question => question.id));
  const [perfect] = sanitizeProgress({ assessments: [{ ...corrupt, score: 0, answers: allCorrect, mistakes: ['inventada'] }] }, questions).assessments;
  assert.equal(perfect.score, 100);
  assert.deepEqual(perfect.mistakes, []);
});

test('una recarga conserva logros anteriores después de más de cien intentos posteriores', () => {
  const pass = assessment(allCorrect);
  const fail = assessment(allWrong);
  const raw = {
    assessments: [pass, ...Array.from({ length: 110 }, () => structuredClone(fail))],
    exerciseAttempts: { 'maximo-negativos': [exerciseAttempt(), ...Array.from({ length: 110 }, () => exerciseAttempt({ response: '0', correct: false }))] },
  };
  const clean = sanitizeProgress(raw, questions);
  assert.equal(clean.assessments.length, 111);
  assert.equal(Math.max(...clean.assessments.map(attempt => attempt.score)), 100);
  assert.ok(clean.assessments.some(attempt => attempt.score >= 70));
  assert.equal(clean.exerciseAttempts['maximo-negativos'].length, 111);
  assert.ok(clean.exerciseAttempts['maximo-negativos'].some(attempt => attempt.correct === true));
});

test('cargar y guardar progreso maneja JSON roto y almacenamiento inaccesible sin un navegador', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const setStorage = value => Object.defineProperty(globalThis, 'localStorage', { configurable: true, value });
  const expected = sanitizeProgress({}, questions);
  try {
    setStorage({ getItem() { return '{JSON roto'; } });
    assert.deepEqual(loadProgress(questions), expected);
    setStorage({ getItem() { throw new Error('Acceso denegado'); }, setItem() { throw new Error('Cuota agotada'); } });
    assert.deepEqual(loadProgress(questions), expected);
    assert.equal(saveProgress(expected), false);
    let saved;
    setStorage({ getItem() { return saved ?? null; }, setItem(key, value) { assert.equal(key, 'algoritmia.progress.v1'); saved = value; } });
    const progress = sanitizeProgress({ completed: ['algoritmos'], notes: { algoritmos: 'Recordar caso vacío' }, assessments: [assessment(allCorrect)] }, questions);
    assert.equal(saveProgress(progress), true);
    assert.deepEqual(loadProgress(questions), progress);
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else delete globalThis.localStorage;
  }
});
