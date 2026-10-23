import test from 'node:test';
import assert from 'node:assert/strict';
import { checkExerciseAnswer } from '../src/answers.ts';
import { exercises } from '../src/data/curriculum.ts';

const exercise = id => {
  const result = exercises.find(item => item.id === id);
  assert.ok(result, `Falta ejercicio ${id}`);
  return result;
};

test('la inversión acepta secuencias completas con espacios y comas como separadores', () => {
  const reverse = exercise('invertir-pseudocodigo');
  for (const response of ['[12, 9,5,2]', '[ 12, 9, 5, 2 ]', '12 9 5 2', '12,9,5,2', ' 12, 9 5,2 ', '[12\n9\t5 2]']) {
    assert.equal(checkExerciseAnswer(reverse, response), true, response);
  }
});

test('la inversión rechaza números pegados, elementos extra, valores incorrectos y sintaxis rota', () => {
  const reverse = exercise('invertir-pseudocodigo');
  for (const response of ['12952', '[12952]', '[12,9,5,2,0]', '[12,9,5]', '[2,5,9,12]', '[12,,9,5,2]', '[12,9,5,2,]', '[12,9,5,2', '12,9,5,2]', '[[12,9,5,2]]', '[1 2,9,5,2]', '[12,9,5,2.0]', '[]', '']) {
    assert.equal(checkExerciseAnswer(reverse, response), false, response);
  }
});

test('las expresiones admiten espacios Unicode y diferencias de mayúsculas', () => {
  const complexity = exercise('costo-duplicados');
  for (const response of ['O( n^2 )', 'o(n²)', ' Θ ( n^2 ) ', 'O(\u00a0n ^ 2\u2003)', 'CUADRATICA', 'cuadrática']) {
    assert.equal(checkExerciseAnswer(complexity, response), true, response);
  }
  const debug = exercise('reparar-maximo');
  for (const response of ['a [ 0 ]', ' A[0] ', 'a\u00a0[\t0 ]']) assert.equal(checkExerciseAnswer(debug, response), true, response);
  for (const response of ['a[1]', 'a[00]', 'O(n)', 'O(n^3)']) {
    assert.equal(checkExerciseAnswer(complexity, response), false, response);
    assert.equal(checkExerciseAnswer(debug, response), false, response);
  }
});

test('las respuestas numéricas no unen signos ni dígitos separados', () => {
  const max = exercise('maximo-negativos');
  for (const response of ['-2', '−2', '  -2\u00a0']) assert.equal(checkExerciseAnswer(max, response), true, response);
  for (const response of ['- 2', '-\t2', '--2', '-2.0', '-2e0', '-02', '2', '0', '']) assert.equal(checkExerciseAnswer(max, response), false, response);
  const sum = exercise('seguir-recursion');
  for (const response of ['6', '+6', ' 6 ']) assert.equal(checkExerciseAnswer(sum, response), true, response);
  for (const response of ['+ 6', '6 0', '0 6', '6.0', '6e0', '06']) assert.equal(checkExerciseAnswer(sum, response), false, response);
});

test('la revisión manual no puede aprobarse mediante una respuesta textual', () => {
  const implementation = exercise('implementar-duplicados');
  assert.equal(checkExerciseAnswer(implementation, ''), false);
  assert.equal(checkExerciseAnswer(implementation, implementation.solution), false);
});
