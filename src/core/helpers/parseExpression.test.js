import parseExpression from "./parseExpression";

test('should correctly evaluate basic expression', () => {
  expect(parseExpression('x', 1)).toBe(1);
});

test('should correctly work with kx functions', () => {
  expect(parseExpression('2x', 1)).toBe(2);
});

test('should prevent "xx" constructions', () => {
  expect(parseExpression('xx', 1)).toStrictEqual(Error('Please, remove duplicates'));
});

test('should prevent forbidden characters and misses', () => {
  expect(parseExpression('ax', 1)).toStrictEqual(Error('Forbidden characters'));
  //still failed
  expect(parseExpression('sin(x))', 12)).toStrictEqual(Error('Forbidden characters'));
});

test('Correctly counts sin', () => {
  expect(parseExpression('sin(x)', 90)).toBe(0.8939966636005579);
});

test('Correctly counts cos', () => {
  expect(parseExpression('cos(x)', 45)).toBe(0.5253219888177297);
});

test('Correctly counts tg', () => {
  expect(parseExpression('tg(x)', 2)).toBe(-2.185039863261519);
});

test('Correctly counts sqrt', () => {
  expect(parseExpression('sqrt(x)', 4)).toBe(2);
});

test('Correctly counts sqr', () => {
  expect(parseExpression('x^2', 2)).toBe(4);
});

test('Correctly counts very hard expressions', () => {
  expect(parseExpression('tg(sin(x)^cos(x))', 5)).toBe(-0.27892389797590184);
});
