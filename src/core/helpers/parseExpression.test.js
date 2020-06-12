import parseExpression from "./parseExpression";

test('should correctly evaluate basic expression', () => {
  expect(parseExpression('x', 1)).toBe(1);
});

test('should correctly work with kx functions', () => {
  expect(parseExpression('2x', 1)).toBe(2);
});

test('should prevent "xx" constructions', () => {
  expect(parseExpression('xx', 1)).toBe(null);
});

test('should prevent forbidden characters', () => {
  expect(parseExpression('ax', 1)).toBe(null);
});

test('Correctly counts strong expressions', () => {
  expect(parseExpression('x*x/x*1+3*5-5', 5)).toBe(15);
});

test('Prevents dividing by zero', () => {
  expect(parseExpression('1/0', 1)).toBe(null);
});
