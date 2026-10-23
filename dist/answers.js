function normalize(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/−/g, '-').toLowerCase().trim();
}
function integerSequence(value) {
    let text = normalize(value);
    if (text.startsWith('[') || text.endsWith(']')) {
        if (!text.startsWith('[') || !text.endsWith(']'))
            return null;
        text = text.slice(1, -1).trim();
    }
    if (!/^[+-]?\d+(?:(?:\s*,\s*|\s+)[+-]?\d+)*$/.test(text))
        return null;
    const values = text.split(/[\s,]+/).map(Number);
    return values.every(Number.isSafeInteger) ? values : null;
}
export function checkExerciseAnswer(exercise, response) {
    if (exercise.id === 'invertir-pseudocodigo') {
        const expected = integerSequence(exercise.answer);
        const actual = integerSequence(response);
        return !!expected && !!actual && expected.length === actual.length && expected.every((value, index) => value === actual[index]);
    }
    const actual = normalize(response);
    if (/^[+-]?\d+$/.test(normalize(exercise.answer))) {
        // Un espacio no puede convertir dos tokens en un único número.
        if (!/^[+-]?\d+$/.test(actual))
            return false;
        return exercise.accepted.some(answer => normalize(answer) === actual);
    }
    const expression = (value) => normalize(value).replace(/\s/g, '');
    return exercise.accepted.some(answer => expression(answer) === expression(response));
}
