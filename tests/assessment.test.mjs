import test from 'node:test';import assert from 'node:assert/strict';import {optionOrder} from '../src/assessment.ts';import {gradeAssessment} from '../src/learning.ts';
test('el orden de presentación cambia sin perder la correspondencia con respuestas canónicas',()=>{
 const order=optionOrder(4,()=>0);assert.deepEqual([...order].sort(),[0,1,2,3]);assert.notEqual(order[0],0);
 const bank=[{id:'q',moduleId:2,options:['correcta','otra','otra2','otra3'],answer:0}];
 const selectedVisualIndex=order.indexOf(0);assert.equal(gradeAssessment(2,bank,[order[selectedVisualIndex]]).score,100);
 assert.deepEqual(optionOrder(0),[]);assert.deepEqual(optionOrder(1),[0]);assert.throws(()=>optionOrder(2,()=>1));
});
