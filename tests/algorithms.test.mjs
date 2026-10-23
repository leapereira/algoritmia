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
