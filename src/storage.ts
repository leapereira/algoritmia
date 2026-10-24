export type AssessmentAttempt = { moduleId?: number; at: string; score: number; answers: number[]; mistakes: string[] };
export type ExerciseAttempt = { at: string; response: string; correct: boolean | null; manual: boolean };
export type Progress = {
  version: 1; completed: string[]; bookmarks: string[]; notes: Record<string, string>;
  drafts: Record<string, string>; exerciseAttempts: Record<string, ExerciseAttempt[]>;
  assessments: AssessmentAttempt[]; lastLesson: string; studySeconds: number;
};
export const PROGRESS_STORAGE_KEY = 'algoritmia.progress.v1';
const KEY = PROGRESS_STORAGE_KEY;
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const strings = (v: unknown): string[] => Array.isArray(v) ? [...new Set(v.filter(x => typeof x === 'string'))] : [];
const stringMap = (v: unknown): Record<string, string> => record(v) ? Object.fromEntries(Object.entries(v).filter(([, x]) => typeof x === 'string')) as Record<string, string> : {};
export type QuestionSchema = { id: string; answer: number; options: readonly string[]; moduleId?: number };
export function sanitizeProgress(value: unknown, questionBank?: readonly QuestionSchema[]): Progress {
  const v = record(value) ? value : {};
  const exerciseAttempts: Record<string, ExerciseAttempt[]> = {};
  if (record(v.exerciseAttempts)) for (const [id, attempts] of Object.entries(v.exerciseAttempts)) {
    if (!Array.isArray(attempts)) continue;
    exerciseAttempts[id] = attempts.filter(a => record(a) && typeof a.at === 'string' && typeof a.response === 'string' && (a.correct === null || typeof a.correct === 'boolean') && typeof a.manual === 'boolean') as ExerciseAttempt[];
  }
  let assessments = Array.isArray(v.assessments) ? v.assessments.filter(a => record(a) && typeof a.at === 'string' && typeof a.score === 'number' && a.score >= 0 && a.score <= 100 && Array.isArray(a.answers) && a.answers.every((n: unknown) => Number.isInteger(n)) && Array.isArray(a.mistakes) && a.mistakes.every((s: unknown) => typeof s === 'string')) as AssessmentAttempt[] : [];
  if (questionBank?.length) assessments = assessments.filter(a => {
    const id = a.moduleId ?? 1;
    if (!Number.isInteger(id) || id < 1) return false;
    const bank = questionBank.filter(q => (q.moduleId ?? 1) === id);
    return bank.length > 0 && a.answers.length === bank.length && a.answers.every((answer, i) => answer >= 0 && answer < bank[i].options.length);
  }).map(a => {
    const bank = questionBank.filter(q => (q.moduleId ?? 1) === (a.moduleId ?? 1));
    const mistakes = bank.filter((q, i) => a.answers[i] !== q.answer).map(q => q.id);
    return { ...a, mistakes, score: Math.round((bank.length - mistakes.length) / bank.length * 100) };
  });
  return { version: 1, completed: strings(v.completed), bookmarks: strings(v.bookmarks), notes: stringMap(v.notes), drafts: stringMap(v.drafts), exerciseAttempts, assessments, lastLesson: typeof v.lastLesson === 'string' ? v.lastLesson : 'algoritmos', studySeconds: typeof v.studySeconds === 'number' && Number.isFinite(v.studySeconds) ? Math.max(0, Math.floor(v.studySeconds)) : 0 };
}
export function loadProgress(questionBank?: readonly QuestionSchema[]): Progress {
  try { return sanitizeProgress(JSON.parse(localStorage.getItem(KEY) || '{}'), questionBank); } catch { return sanitizeProgress({}); }
}
export function saveProgress(progress: Progress): boolean {
  try { localStorage.setItem(KEY, JSON.stringify(progress)); return true; } catch { return false; }
}

function mergeMembership(base: readonly string[], local: readonly string[], remote: readonly string[]): string[] {
  const original = new Set(base), current = new Set(local), merged = new Set(remote);
  for (const id of original) if (!current.has(id)) merged.delete(id);
  for (const id of current) if (!original.has(id)) merged.add(id);
  return [...merged];
}

function mergeTextMap(base: Record<string, string>, local: Record<string, string>, remote: Record<string, string>): Record<string, string> {
  const original = new Map(Object.entries(base)), current = new Map(Object.entries(local));
  const merged = new Map(Object.entries(remote));
  for (const key of new Set([...original.keys(), ...current.keys()])) {
    if (original.has(key) === current.has(key) && original.get(key) === current.get(key)) continue;
    if (current.has(key)) merged.set(key, current.get(key)!);
    else merged.delete(key);
  }
  return Object.fromEntries(merged);
}

function mergeHistory<T extends { at: string }>(base: readonly T[], local: readonly T[], remote: readonly T[], key: (attempt: T) => string, copy: (attempt: T) => T): T[] {
  const original = new Set(base.map(key)), seen = new Set<string>(), result: T[] = [];
  const append = (attempt: T) => {
    const identity = key(attempt);
    if (!seen.has(identity)) { seen.add(identity); result.push(copy(attempt)); }
  };
  remote.forEach(append);
  for (const attempt of local) if (!original.has(key(attempt))) append(attempt);
  const timestamp = (attempt: T) => {
    const value = Date.parse(attempt.at);
    return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
  };
  // Mantiene el significado de «último intento» aunque un cambio local llegue tarde.
  return result.sort((a, b) => {
    const left = timestamp(a), right = timestamp(b);
    return left === right ? 0 : left < right ? -1 : 1;
  });
}

/**
 * Aplica los cambios locales desde base sobre el último estado remoto.
 * Los conflictos de una misma membresía o clave modificada se resuelven a favor
 * del cambio local. Los historiales son append-only. Tras guardar, el llamador
 * debe adoptar el resultado como estado local y nueva base.
 */
export function mergeProgress(base: Progress, local: Progress, remote: Progress): Progress {
  const originalExercises = new Map(Object.entries(base.exerciseAttempts));
  const localExercises = new Map(Object.entries(local.exerciseAttempts));
  const remoteExercises = new Map(Object.entries(remote.exerciseAttempts));
  const exerciseKey = (a: ExerciseAttempt) => JSON.stringify([a.at, a.response, a.correct, a.manual]);
  const exerciseAttempts = Object.fromEntries(
    [...new Set([...remoteExercises.keys(), ...localExercises.keys()])].map(id => [id,
      mergeHistory(originalExercises.get(id) ?? [], localExercises.get(id) ?? [], remoteExercises.get(id) ?? [], exerciseKey, a => ({ ...a })),
    ]),
  );
  const assessmentKey = (a: AssessmentAttempt) => JSON.stringify([a.moduleId, a.at, a.score, a.answers, a.mistakes]);
  return {
    version: 1,
    completed: mergeMembership(base.completed, local.completed, remote.completed),
    bookmarks: mergeMembership(base.bookmarks, local.bookmarks, remote.bookmarks),
    notes: mergeTextMap(base.notes, local.notes, remote.notes),
    drafts: mergeTextMap(base.drafts, local.drafts, remote.drafts),
    exerciseAttempts,
    assessments: mergeHistory(base.assessments, local.assessments, remote.assessments, assessmentKey, a => ({ ...a, answers: [...a.answers], mistakes: [...a.mistakes] })),
    lastLesson: local.lastLesson !== base.lastLesson ? local.lastLesson : remote.lastLesson,
    studySeconds: remote.studySeconds + Math.max(0, local.studySeconds - base.studySeconds),
  };
}
