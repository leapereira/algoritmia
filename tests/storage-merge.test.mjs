import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeProgress, sanitizeProgress, PROGRESS_STORAGE_KEY } from '../src/storage.ts';

const empty = () => sanitizeProgress({});
const clone = value => structuredClone(value);
const attempt = (response, at = '2026-10-23T10:00:00.000Z') => ({ at, response, correct: true, manual: false });
const assessment = (moduleId, at = '2026-10-23T10:00:00.000Z') => ({ moduleId, at, score: 100, answers: [1, 0], mistakes: [] });

test('dos pestañas conservan avances, marcadores y tiempo nuevos de ambas', () => {
  const base = empty(), local = clone(base), remote = clone(base);
  local.completed.push('m03-contratos'); local.bookmarks.push('m03-formas'); local.studySeconds = 10;
  remote.completed.push('m06-modelo'); remote.bookmarks.push('m06-bst'); remote.studySeconds = 15;
  const merged = mergeProgress(base, local, remote);
  assert.deepEqual(new Set(merged.completed), new Set(['m03-contratos', 'm06-modelo']));
  assert.deepEqual(new Set(merged.bookmarks), new Set(['m03-formas', 'm06-bst']));
  assert.equal(merged.studySeconds, 25);
  assert.equal(PROGRESS_STORAGE_KEY, 'algoritmia.progress.v1');
});

test('desmarcar aplica un borrado local sin recuperar lo que otra pestaña ya desmarcó', () => {
  const base = { ...empty(), completed: ['a', 'b'], bookmarks: ['x', 'y'] };
  const local = { ...clone(base), completed: ['b', 'c'], bookmarks: ['y', 'z'] };
  const remote = { ...clone(base), completed: ['a', 'd'], bookmarks: ['x', 'w'] };
  const merged = mergeProgress(base, local, remote);
  assert.deepEqual(new Set(merged.completed), new Set(['c', 'd']));
  assert.deepEqual(new Set(merged.bookmarks), new Set(['z', 'w']));
});

test('apuntes y borradores usan deltas por clave con borrados y conflicto local explícito', () => {
  const base = { ...empty(), notes: { a: 'antes', borrar: 'quitar', intacta: 'base' }, drafts: { a: 'código inicial' } };
  const local = { ...clone(base), notes: { a: 'edición local', intacta: 'base', nueva: '' }, drafts: { a: 'código local' } };
  const remote = { ...clone(base), notes: { a: 'edición remota', borrar: 'viejo', intacta: 'remoto', otra: 'independiente' }, drafts: { a: 'inicial', b: 'código remoto' } };
  const merged = mergeProgress(base, local, remote);
  assert.deepEqual(merged.notes, { a: 'edición local', intacta: 'remoto', otra: 'independiente', nueva: '' });
  assert.deepEqual(merged.drafts, { a: 'código local', b: 'código remoto' });
  const untouched = mergeProgress(base, clone(base), remote);
  assert.deepEqual(untouched.notes, remote.notes);
});

test('los historiales preservan intentos nuevos de ambos y deduplican por contenido completo', () => {
  const old = attempt('previo', '2026-10-23T09:00:00.000Z');
  const shared = attempt('misma respuesta');
  const independent = attempt('otra respuesta', '2026-10-23T11:00:00.000Z');
  const base = { ...empty(), exerciseAttempts: { e: [old] }, assessments: [assessment(1, old.at)] };
  const local = clone(base), remote = clone(base);
  local.exerciseAttempts.e.push(shared); local.exerciseAttempts.nueva = [attempt('local')]; local.assessments.push(assessment(3));
  remote.exerciseAttempts.e.push(clone(shared), independent); remote.exerciseAttempts.remota = [attempt('remoto')]; remote.assessments.push(assessment(6, independent.at), assessment(3));
  const merged = mergeProgress(base, local, remote);
  assert.deepEqual(merged.exerciseAttempts.e, [old, shared, independent]);
  assert.equal(merged.exerciseAttempts.nueva.length, 1);
  assert.equal(merged.exerciseAttempts.remota.length, 1);
  assert.deepEqual(merged.assessments.map(a => a.moduleId), [1, 3, 6]);
  const changed = attempt('misma respuesta'); changed.correct = false;
  local.exerciseAttempts.e.push(changed);
  assert.equal(mergeProgress(base, local, remote).exerciseAttempts.e.length, 4, 'Un resultado distinto no es duplicado exacto');
});

test('persistencias sucesivas no repiten intentos ni suman dos veces el tiempo ya adoptado', () => {
  const base = empty(), local = clone(base), remote = clone(base);
  local.studySeconds = 5; local.exerciseAttempts.e = [attempt('local')]; local.assessments = [assessment(3)];
  remote.studySeconds = 7;
  const first = mergeProgress(base, local, remote);
  assert.equal(first.studySeconds, 12);
  const second = mergeProgress(clone(first), clone(first), clone(first));
  assert.deepEqual(second, first);
  const pending = clone(second); pending.studySeconds += 3;
  const external = clone(second); external.studySeconds += 2; external.completed.push('otra');
  const third = mergeProgress(second, pending, external);
  assert.equal(third.studySeconds, 17);
  assert.equal(third.exerciseAttempts.e.length, 1);
  assert.equal(third.assessments.length, 1);
  // Un evento externo adopta remote como base y conserva el delta aún no guardado.
  const savedAfterEvent = mergeProgress(external, third, external);
  assert.deepEqual(savedAfterEvent, third);
});

test('el tiempo no retrocede y última lección local solo prevalece cuando cambió', () => {
  const base = { ...empty(), studySeconds: 20, lastLesson: 'a' };
  const remote = { ...clone(base), studySeconds: 35, lastLesson: 'b' };
  const local = { ...clone(base), studySeconds: 10 };
  assert.equal(mergeProgress(base, local, remote).studySeconds, 35);
  assert.equal(mergeProgress(base, local, remote).lastLesson, 'b');
  local.lastLesson = 'c';
  assert.equal(mergeProgress(base, local, remote).lastLesson, 'c');
});

test('la fusión no comparte objetos mutables con sus tres entradas', () => {
  const base = empty(), local = clone(base), remote = clone(base);
  local.notes.a = 'local'; local.exerciseAttempts.e = [attempt('x')]; local.assessments = [assessment(3)];
  remote.drafts.b = 'remoto'; remote.exerciseAttempts.r = [attempt('y')]; remote.assessments = [assessment(6)];
  const before = [clone(base), clone(local), clone(remote)];
  const merged = mergeProgress(base, local, remote);
  assert.deepEqual([base, local, remote], before);
  merged.completed.push('nuevo'); merged.notes.a = 'cambiado'; merged.drafts.b = 'cambiado';
  merged.exerciseAttempts.e[0].response = 'editado'; merged.exerciseAttempts.r[0].correct = false;
  merged.assessments[0].answers[0] = 999; merged.assessments[1].mistakes.push('nueva');
  assert.deepEqual([base, local, remote], before);
});

test('claves especiales se conservan como datos propios sin alterar prototipos', () => {
  const base = empty(), local = clone(base), remote = clone(base);
  local.notes = JSON.parse('{"__proto__":"apunte","constructor":"otra clave"}');
  local.exerciseAttempts = Object.fromEntries([['__proto__', [attempt('x')]]]);
  const merged = mergeProgress(base, local, remote);
  assert.equal(Object.getPrototypeOf(merged.notes), Object.prototype);
  assert.equal(merged.notes.__proto__, 'apunte');
  assert.equal(merged.notes.constructor, 'otra clave');
  assert.equal(Object.getPrototypeOf(merged.exerciseAttempts), Object.prototype);
  assert.equal(merged.exerciseAttempts.__proto__[0].response, 'x');
});
