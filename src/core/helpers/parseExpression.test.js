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
  expect(parseExpression('sinx(x)', 12)).toStrictEqual(Error('Forbidden characters'));
});

test('Correctly counts sin', () => {
  expect(parseExpression('sin(x)', 90)).toBeCloseTo(0.8939);
});

test('Correctly counts cos', () => {
  expect(parseExpression('cos(x)', 45)).toBeCloseTo(0.5253);
});

test('Correctly counts tg', () => {
  expect(parseExpression('tg(x)', 2)).toBeCloseTo(-2.1850);
});

test('Correctly counts sqrt', () => {
  expect(parseExpression('sqrt(x)', 4)).toBe(2);
});

test('Correctly counts sqr', () => {
  expect(parseExpression('x^2', 2)).toBe(4);
});

test('Correctly counts very hard expressions', () => {
  expect(parseExpression('cos(x)*sin(x)+2*sin(x)-sqrt(x)^2', 5)).toBeCloseTo(-7.189);
});

//Faily
test('Correctly counts very deep expressions', () => {
  expect(parseExpression('sqrt(cos(x))+sin(sqrt(x))+2', 5)).toBeCloseTo(-7.189);
});

