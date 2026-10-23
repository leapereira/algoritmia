import test from 'node:test';
import assert from 'node:assert/strict';
import { moduleStats, courseProgress, gradeAssessment } from '../src/learning.ts';
import { sanitizeProgress } from '../src/storage.ts';
const lessons=[{id:'first',moduleId:1},{id:'second',moduleId:2},{id:'third',moduleId:2}];
const bank=[{id:'q1',moduleId:1,answer:0,options:['A','B']},{id:'q2',moduleId:2,answer:1,options:['C','D']},{id:'q3',moduleId:2,answer:0,options:['E','F']}];
test('aprobar un módulo no acredita las lecciones ni la evaluación de otro',()=>{
 const progress=sanitizeProgress({completed:['first','second'],assessments:[gradeAssessment(1,bank,[0])] },bank);
 assert.equal(moduleStats(1,lessons,progress).complete,true);
 assert.equal(moduleStats(2,lessons,progress).passed,false);
 assert.equal(moduleStats(2,lessons,progress).percent,50);
 assert.equal(courseProgress([1,2],lessons,progress),63);
});
test('se conservan evaluaciones antiguas del módulo 1 al ampliar el banco de preguntas',()=>{
 const progress=sanitizeProgress({assessments:[{at:'2026-10-23',score:100,answers:[0],mistakes:[]},gradeAssessment(2,bank,[1,0])]},bank);
 assert.equal(progress.assessments.length,2);
 assert.equal(progress.assessments[0].moduleId,undefined);
 assert.equal(moduleStats(1,lessons,progress).passed,true);
 assert.equal(moduleStats(2,lessons,progress).passed,true);
});
test('la calificación valida y utiliza únicamente preguntas del módulo solicitado',()=>{
 assert.equal(gradeAssessment(2,bank,[1,0]).score,100);
 assert.equal(gradeAssessment(2,bank,[0,0]).score,50);
 assert.throws(()=>gradeAssessment(2,bank,[1]),/respuesta válida/);
 assert.throws(()=>gradeAssessment(2,bank,[1,99]),/respuesta válida/);
 assert.throws(()=>gradeAssessment(99,bank,[]),/respuesta válida/);
 const recovered=sanitizeProgress({assessments:[{moduleId:2,at:'today',score:100,answers:[0,0],mistakes:[]}]},bank);
 assert.equal(recovered.assessments[0].score,50);
 assert.deepEqual(recovered.assessments[0].mistakes,['q2']);
});
