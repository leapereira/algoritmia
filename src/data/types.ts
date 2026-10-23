export type LessonSection = { title: string; paragraphs: string[]; code?: string; language?: 'java' | 'text'; bullets?: string[] };
export type Lesson = {
  id: string; moduleId: number; title: string; duration: number; summary: string;
  objectives: string[]; prerequisites: string[]; sections: LessonSection[];
  complexity: { time: string; space: string; explanation: string };
  pitfalls: string[]; solved: { title: string; explanation: string; code: string };
  practice: { title: string; prompt: string }; takeaways: string[];
  visualization?: 'max' | 'reverse' | 'duplicates' | 'linear' | 'binary' | 'bubble';
  lab?: 'recursion' | 'complexity' | 'linked-list' | 'stack' | 'queue' | 'bst' | 'avl' | 'heap' | 'hash' | 'trie' | 'graph' | 'greedy' | 'dp' | 'backtracking' | 'advanced' | 'design';
};
export type Exercise = {
  id: string; moduleId?: number; title: string; kind: 'prediction' | 'complexity' | 'debug' | 'implementation';
  difficulty: 'Inicial' | 'Intermedio'; prompt: string; input: string; expected: string;
  constraints: string[]; starter: string; answer: string; accepted: string[];
  hints: string[]; solution: string; explanation: string; lessonId: string;
};
export type Question = { id: string; moduleId?: number; type: 'choice' | 'truefalse' | 'prediction' | 'complexity' | 'order'; prompt: string; options: string[]; answer: number; explanation: string; lessonId: string };
export type GlossaryEntry = { term: string; definition: string; lessonId?: string };
export type ModuleContent = { moduleId: number; lessons: Lesson[]; exercises: Exercise[]; questions: Question[]; glossary: GlossaryEntry[] };
