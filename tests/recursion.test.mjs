import test from 'node:test';
import assert from 'node:assert/strict';
import { makeRecursionTrace, recursionPseudocode } from '../src/recursion.ts';

test('la suma recursiva crece hasta el caso base y retorna por cada marco', () => {
  const values = [4, 2, 7, 3];
  const trace = makeRecursionTrace(values);
  assert.deepEqual(trace.filter(step => step.phase === 'call').map(step => step.stack.at(-1).index), [0, 1, 2, 3, 4]);
  assert.deepEqual(trace.filter(step => step.phase === 'return').map(step => step.returnValue), [3, 10, 12, 16]);
  assert.equal(trace.filter(step => step.phase === 'base').length, 1);
  const base = trace.find(step => step.phase === 'base');
  assert.equal(base.returnValue, 0);
  assert.equal(base.stack.length, 5);
  assert.equal(base.stack.at(-1).index, values.length);
  assert.equal(trace.at(-1).result, 16);
  assert.equal(trace.at(-1).callCount, 5);
  assert.equal(trace.at(-1).maxDepth, 5);
  assert.deepEqual(trace.at(-1).stack, []);
});

test('los retornos conservan las sumas parciales con ceros y negativos', () => {
  for (const values of [[], [0], [-4], [-99, 99], [0, -2, 5, -7, 8, 0, -1, 3]]) {
    const trace = makeRecursionTrace(values);
    assert.equal(trace.at(-1).result, values.reduce((sum, value) => sum + value, 0));
    assert.equal(trace.at(-1).callCount, values.length + 1);
    assert.equal(trace.at(-1).maxDepth, values.length + 1);
    for (const step of trace) {
      assert.ok(step.line >= 1 && step.line <= recursionPseudocode.length);
      assert.ok(step.maxDepth >= step.stack.length);
      assert.deepEqual(step.values, values);
      step.stack.forEach((frame, position) => assert.equal(frame.index, position));
      if (step.phase === 'resume') {
        const frame = step.stack.at(-1);
        assert.equal(frame.partial, values.slice(frame.index + 1).reduce((sum, value) => sum + value, 0));
      }
      if (step.phase === 'return') {
        const frame = step.stack.at(-1);
        assert.equal(frame.result, values.slice(frame.index).reduce((sum, value) => sum + value, 0));
      }
    }
  }
});

test('las instantáneas y la entrada no comparten marcos ni arreglos mutables', () => {
  const values = [1, 2];
  const trace = makeRecursionTrace(values);
  values[0] = 88;
  assert.deepEqual(trace[0].values, [1, 2]);
  const firstCall = trace.find(step => step.phase === 'call');
  firstCall.stack[0].index = 99;
  const nextCheck = trace.find(step => step.phase === 'check');
  assert.equal(nextCheck.stack[0].index, 0);
  firstCall.values[0] = 99;
  assert.equal(nextCheck.values[0], 1);
});

test('el motor acota entradas para mantener la pila visible', () => {
  assert.throws(() => makeRecursionTrace([100]), /8 enteros/);
  assert.throws(() => makeRecursionTrace([-100]), /8 enteros/);
  assert.throws(() => makeRecursionTrace([NaN]), /8 enteros/);
  assert.throws(() => makeRecursionTrace([0.5]), /8 enteros/);
  assert.throws(() => makeRecursionTrace(Array(9).fill(1)), /8 enteros/);
});
