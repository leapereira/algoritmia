export type AssessmentAttempt = { moduleId?: number; at: string; score: number; answers: number[]; mistakes: string[] };
export type ExerciseAttempt = { at: string; response: string; correct: boolean | null; manual: boolean };
export type Progress = {
  version: 1; completed: string[]; bookmarks: string[]; notes: Record<string, string>;
  drafts: Record<string, string>; exerciseAttempts: Record<string, ExerciseAttempt[]>;
  assessments: AssessmentAttempt[]; lastLesson: string; studySeconds: number;
};
const KEY = 'algoritmia.progress.v1';
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
