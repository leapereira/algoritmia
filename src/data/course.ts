import { blocks, modules as syllabus, exercises as firstExercises, questions as firstQuestions, glossary as firstGlossary } from './curriculum.js';
import { lessons as firstLessons } from './lessons.js';
import type { ModuleContent } from './types.js';

import { module02 } from './module02.js';

import { module03 } from './module03.js';

import { module04 } from './module04.js';

import { module05 } from './module05.js';

import { module06 } from './module06.js';

import { module07 } from './module07.js';

import { module08 } from './module08.js';

import { module09 } from './module09.js';

import { module10 } from './module10.js';

import { module11 } from './module11.js';

import { module12 } from './module12.js';

export const moduleContents: ModuleContent[] = [
  { moduleId: 1, lessons: firstLessons, exercises: firstExercises, questions: firstQuestions, glossary: firstGlossary },
  module02,
  module03,
  module04,
  module05,
  module06,
  module07,
  module08,
  module09,
  module10,
  module11,
  module12,
];
export { blocks };
export const lessons = moduleContents.flatMap(content => content.lessons);
export const exercises = moduleContents.flatMap(content => content.exercises.map(exercise => ({ ...exercise, moduleId: content.moduleId })));
export const questions = moduleContents.flatMap(content => content.questions.map(question => ({ ...question, moduleId: content.moduleId })));
export const glossary = [...new Map(moduleContents.flatMap(content => content.glossary).map(entry => [entry.term.toLocaleLowerCase('es'), entry])).values()];
export const modules = syllabus.map(module => ({ ...module, available: moduleContents.some(content => content.moduleId === module.id && content.lessons.length > 0 && content.questions.length > 0 && content.exercises.length > 0) }));
export const moduleLessons = (id: number) => lessons.filter(lesson => lesson.moduleId === id);
export const moduleQuestions = (id: number) => questions.filter(question => question.moduleId === id);
export const moduleExercises = (id: number) => exercises.filter(exercise => exercise.moduleId === id);
