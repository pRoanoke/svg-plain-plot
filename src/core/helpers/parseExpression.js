export const parseExpression = (expression, current) => {
  let replacedExpression = expression;
  /* Support to unary minus */
  if (/\(-x\)/.test(replacedExpression)) replacedExpression = replacedExpression.replace(/\(-x\)/g, '(x*-1)');
  /* Replacing kx construction */
  Array.from(replacedExpression.matchAll(/\dx/g)).forEach(item => replacedExpression = replacedExpression.replace(/\dx/g, `${replacedExpression[item.index]}*x`));
  return replacedExpression;
};
