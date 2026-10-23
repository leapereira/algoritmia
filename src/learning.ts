import type { Progress } from './storage.js';
import type { Lesson, Question } from './data/types.js';
export function moduleStats(id: number, lessons: readonly Lesson[], progress: Progress) {
  const list = lessons.filter(lesson => lesson.moduleId === id);
  const completed = list.filter(lesson => progress.completed.includes(lesson.id)).length;
  const attempts = progress.assessments.filter(attempt => (attempt.moduleId ?? 1) === id);
  const passed = attempts.some(attempt => attempt.score >= 70);
  const ratio = list.length ? completed / list.length : 0;
  return { completed, total: list.length, passed, attempts, percent: Math.round(ratio * 100), complete: list.length > 0 && completed === list.length && passed, weight: (ratio + (passed ? 1 : 0)) / 2 };
}
export function courseProgress(moduleIds: readonly number[], lessons: readonly Lesson[], progress: Progress): number {
  return moduleIds.length ? Math.round(moduleIds.reduce((sum,id) => sum + moduleStats(id,lessons,progress).weight,0) / moduleIds.length * 100) : 0;
}
export function gradeAssessment(moduleId: number, bank: readonly Question[], answers: readonly number[], at = new Date().toISOString()) {
  const questions = bank.filter(question => (question.moduleId ?? 1) === moduleId);
  if (!questions.length || answers.length !== questions.length || answers.some((answer,i) => !Number.isInteger(answer) || answer < 0 || answer >= questions[i].options.length)) throw new Error('La evaluación debe contener una respuesta válida por pregunta.');
  const mistakes = questions.filter((question,i) => answers[i] !== question.answer).map(question => question.id);
  return { moduleId, at, answers: [...answers], mistakes, score: Math.round((questions.length - mistakes.length) / questions.length * 100) };
}
