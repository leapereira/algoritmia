import test from 'node:test';
import assert from 'node:assert/strict';
import { algorithms, makeTrace } from '../src/algorithms.ts';

const last = trace => trace.at(-1);

function assertTrace(id, values, trace) {
  assert.ok(trace.length > 0);
  assert.ok(last(trace).result);
  for (let i = 0; i < trace.length; i++) {
    const step = trace[i];
    assert.equal(step.values.length, values.length);
    assert.ok(step.line >= 1 && step.line <= algorithms[id].pseudocode.length);
    assert.ok(step.active.every(index => index >= 0 && index < values.length));
    assert.ok((step.sorted ?? []).every(index => index >= 0 && index < values.length));
    if (i) {
      assert.ok(step.comparisons >= trace[i - 1].comparisons);
      assert.ok(step.swaps >= trace[i - 1].swaps);
      assert.ok(step.comparisons - trace[i - 1].comparisons <= 1);
      assert.ok(step.swaps - trace[i - 1].swaps <= 1);
    }
  }
}

function allArrays(maxLength = 5) {
  const arrays = [[]];
  let previous = [[]];
  for (let length = 1; length <= maxLength; length++) {
    previous = previous.flatMap(array => [-1, 0, 1].map(value => [...array, value]));
    arrays.push(...previous);
  }
  return arrays;
}

test('máximo, inversión y burbuja producen resultados reales para 364 entradas', () => {
  for (const values of allArrays()) {
    const original = [...values];
    const max = makeTrace('max', values);
    assertTrace('max', values, max);
    assert.equal(last(max).comparisons, Math.max(0, values.length - 1));
    if (values.length) assert.ok(last(max).result.startsWith(`Máximo: ${Math.max(...values)} ·`));
    const reverse = makeTrace('reverse', values);
    assertTrace('reverse', values, reverse);
    assert.deepEqual(last(reverse).values, values.toReversed());
    assert.equal(last(reverse).swaps, Math.floor(values.length / 2));
    assert.equal(last(reverse).comparisons, 0);
    const bubble = makeTrace('bubble', values);
    assertTrace('bubble', values, bubble);
    assert.deepEqual(last(bubble).values, values.toSorted((a, b) => a - b));
    const inversions = values.reduce((sum, value, index) => sum + values.slice(index + 1).filter(other => other < value).length, 0);
    assert.equal(last(bubble).swaps, inversions);
    assert.deepEqual(values, original, 'El motor no debe modificar la entrada');
  }
});

test('duplicados y búsqueda lineal se detienen en el primer hallazgo', () => {
  for (const values of allArrays()) {
    let expectedComparisons = 0;
    let found;
    outer: for (let i = 0; i < values.length - 1; i++) {
      for (let j = i + 1; j < values.length; j++) {
        expectedComparisons++;
        if (values[i] === values[j]) {
          found = [i, j];
          break outer;
        }
      }
    }
    const duplicates = makeTrace('duplicates', values);
    assertTrace('duplicates', values, duplicates);
    assert.equal(last(duplicates).comparisons, expectedComparisons);
    assert.deepEqual(last(duplicates).sorted, found ?? []);
    for (const target of [-1, 0, 1, 2]) {
      const linear = makeTrace('linear', values, target);
      const expectedIndex = values.indexOf(target);
      assertTrace('linear', values, linear);
      assert.equal(last(linear).comparisons, expectedIndex < 0 ? values.length : expectedIndex + 1);
      assert.deepEqual(last(linear).sorted, expectedIndex < 0 ? [] : [expectedIndex]);
    }
  }
});

test('binaria encuentra valores y cuenta igualdad y orden por separado', () => {
  const values = [1, 3, 5, 7, 9, 11, 13];
  const middle = makeTrace('binary', values, 7);
  assert.equal(last(middle).comparisons, 1);
  assert.deepEqual(last(middle).sorted, [3]);
  const right = makeTrace('binary', values, 13);
  assert.equal(last(right).comparisons, 5);
  assert.deepEqual(last(right).sorted, [6]);
  const absent = makeTrace('binary', values, 14);
  assert.equal(last(absent).comparisons, 6);
  assert.equal(last(absent).result, 'No encontrado');
  assert.throws(() => makeTrace('binary', [3, 1, 2], 1), /ordenados/);
  for (const input of allArrays()) {
    const sorted = input.toSorted((a, b) => a - b);
    for (const target of [-2, -1, 0, 1, 2]) {
      const trace = makeTrace('binary', sorted, target);
      assertTrace('binary', sorted, trace);
      const position = last(trace).sorted[0];
      if (sorted.includes(target)) assert.equal(sorted[position], target);
      else assert.equal(last(trace).result, 'No encontrado');
    }
  }
});

test('las instantáneas son independientes y el corte temprano de burbuja funciona', () => {
  const values = [3, 2, 1];
  const trace = makeTrace('bubble', values);
  assert.deepEqual(trace[0].values, [3, 2, 1]);
  trace[0].values[0] = 999;
  assert.deepEqual(last(trace).values, [1, 2, 3]);
  assert.deepEqual(values, [3, 2, 1]);
  const sorted = makeTrace('bubble', [1, 2, 3, 4]);
  assert.equal(last(sorted).comparisons, 3);
  assert.equal(last(sorted).swaps, 0);
  const descending = makeTrace('bubble', [4, 3, 2, 1]);
  assert.equal(last(descending).comparisons, 6);
  assert.equal(last(descending).swaps, 6);
});

test('los algoritmos rechazan datos no finitos', () => {
  assert.throws(() => makeTrace('max', [NaN]), /finitos/);
  assert.throws(() => makeTrace('linear', [1], Infinity), /finitos/);
});

test('los siete ordenamientos nuevos ordenan 364 entradas sin modificar al llamador', () => {
  for (const id of ['selection', 'insertion', 'merge', 'quick', 'heap', 'counting', 'radix']) {
    for (const values of allArrays()) {
      const original = [...values];
      const trace = makeTrace(id, values);
      assertTrace(id, values, trace);
      assert.deepEqual(last(trace).values, values.toSorted((a, b) => a - b), `${id}: ${values}`);
      assert.deepEqual(values, original, `${id} modificó la entrada`);
      if (['insertion', 'merge', 'counting', 'radix'].includes(id)) {
        assert.equal(last(trace).swaps, 0, `${id} usa asignaciones y no intercambios`);
      }
      if (id === 'selection') assert.equal(last(trace).comparisons, Math.max(0, values.length * (values.length - 1) / 2));
      if (id === 'counting' || id === 'radix') assert.equal(last(trace).comparisons, 2 * Math.max(0, values.length - 1));
    }
  }
});

test('los contadores responden a decisiones concretas de inserción, mezcla, quick y heap', () => {
  assert.equal(last(makeTrace('insertion', [1, 2, 3, 4])).comparisons, 3);
  assert.equal(last(makeTrace('insertion', [4, 3, 2, 1])).comparisons, 6);
  assert.equal(last(makeTrace('selection', [1, 2, 3, 4])).swaps, 0);
  assert.equal(last(makeTrace('selection', [4, 3, 2, 1])).swaps, 2);
  assert.equal(last(makeTrace('merge', [2, 1])).comparisons, 1);
  assert.equal(last(makeTrace('quick', [1, 2, 3, 4])).comparisons, 6);
  assert.equal(last(makeTrace('quick', [1, 2, 3, 4])).swaps, 0, 'No hay intercambios consigo mismo');
  assert.equal(last(makeTrace('quick', [2, 1])).swaps, 1);
  assert.equal(last(makeTrace('heap', [2, 1])).comparisons, 1);
  assert.equal(last(makeTrace('heap', [2, 1])).swaps, 1);
});

test('Counting y Radix admiten negativos y extremos del rango visual', () => {
  for (const id of ['counting', 'radix']) {
    for (const input of [[], [0], [-999, 999, -999, 0, 15, -10], [999, 998, 990], [-1, -1, -1], [-14, -5, -999, 0], [-999, -998, -990, -900]]) {
      assert.deepEqual(last(makeTrace(id, input)).values, input.toSorted((a, b) => a - b));
    }
    assert.throws(() => makeTrace(id, [0.5]), /enteros/);
    assert.throws(() => makeTrace(id, [1000]), /999/);
    assert.throws(() => makeTrace(id, [-1000]), /999/);
  }
});

test('los búferes de los pasos son instantáneas independientes de memoria real', () => {
  for (const id of ['insertion', 'merge', 'counting', 'radix']) {
    const trace = makeTrace(id, [31, -2, 14, -2]);
    const withBuffer = trace.filter(step => step.auxiliary);
    assert.ok(withBuffer.length >= 2);
    const originalSecond = [...withBuffer[1].auxiliary.values];
    withBuffer[0].auxiliary.values[0] = 12345;
    assert.deepEqual(withBuffer[1].auxiliary.values, originalSecond);
    assert.deepEqual(last(trace).values, [-2, -2, 14, 31]);
  }
  const merge = makeTrace('merge', [2, 1]);
  const buffered = merge.find(step => step.line === 6 && step.auxiliary?.values.every(value => value !== null));
  assert.deepEqual(buffered.values, [2, 1], 'Se completa el búfer antes de sobrescribir el arreglo');
  assert.deepEqual(buffered.auxiliary.values, [1, 2]);
  const insertion = makeTrace('insertion', [2, 1]);
  const shifted = insertion.find(step => step.line === 4);
  assert.deepEqual(shifted.values, [2, 2], 'El desplazamiento no es un swap encubierto');
  assert.deepEqual(shifted.auxiliary.values, [1], 'El valor desplazado se conserva en la variable temporal');
});
