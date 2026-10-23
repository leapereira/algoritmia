const KEY = 'algoritmia.progress.v1';
const record = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const strings = (v) => Array.isArray(v) ? [...new Set(v.filter(x => typeof x === 'string'))] : [];
const stringMap = (v) => record(v) ? Object.fromEntries(Object.entries(v).filter(([, x]) => typeof x === 'string')) : {};
export function sanitizeProgress(value, questionBank) {
    const v = record(value) ? value : {};
    const exerciseAttempts = {};
    if (record(v.exerciseAttempts))
        for (const [id, attempts] of Object.entries(v.exerciseAttempts)) {
            if (!Array.isArray(attempts))
                continue;
            exerciseAttempts[id] = attempts.filter(a => record(a) && typeof a.at === 'string' && typeof a.response === 'string' && (a.correct === null || typeof a.correct === 'boolean') && typeof a.manual === 'boolean');
        }
    let assessments = Array.isArray(v.assessments) ? v.assessments.filter(a => record(a) && typeof a.at === 'string' && typeof a.score === 'number' && a.score >= 0 && a.score <= 100 && Array.isArray(a.answers) && a.answers.every((n) => Number.isInteger(n)) && Array.isArray(a.mistakes) && a.mistakes.every((s) => typeof s === 'string')) : [];
    if (questionBank?.length)
        assessments = assessments.filter(a => a.answers.length === questionBank.length && a.answers.every((answer, i) => answer >= 0 && answer < questionBank[i].options.length)).map(a => {
            const mistakes = questionBank.filter((q, i) => a.answers[i] !== q.answer).map(q => q.id);
            return { ...a, mistakes, score: Math.round((questionBank.length - mistakes.length) / questionBank.length * 100) };
        });
    return { version: 1, completed: strings(v.completed), bookmarks: strings(v.bookmarks), notes: stringMap(v.notes), drafts: stringMap(v.drafts), exerciseAttempts, assessments, lastLesson: typeof v.lastLesson === 'string' ? v.lastLesson : 'algoritmos', studySeconds: typeof v.studySeconds === 'number' && Number.isFinite(v.studySeconds) ? Math.max(0, Math.floor(v.studySeconds)) : 0 };
}
export function loadProgress(questionBank) {
    try {
        return sanitizeProgress(JSON.parse(localStorage.getItem(KEY) || '{}'), questionBank);
    }
    catch {
        return sanitizeProgress({});
    }
}
export function saveProgress(progress) {
    try {
        localStorage.setItem(KEY, JSON.stringify(progress));
        return true;
    }
    catch {
        return false;
    }
}
