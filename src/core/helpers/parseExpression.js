const parseExpression = (expression, x) => {
  let replacedExpression = expression;
  /* Prevent duplicated x */
  if (/x{2,}/.test(replacedExpression)) return null;
  /* Support to unary minus */
  if (/\(-x\)/.test(replacedExpression)) replacedExpression = replacedExpression.replace(/\(-x\)/g, `${x * -1}`);
  /* Replacing kx construction */
  Array.from(replacedExpression.matchAll(/\dx/g)).forEach(item => replacedExpression = replacedExpression.replace(/\dx/g, `${replacedExpression[item.index]}*${x}`));
  /* Replace x by current */
  replacedExpression = replacedExpression.replace(/x/g, x);
  /* Eval is unsafe, so let's test if we really have an expression to proceed */
  if (/[^()\d*/+-.]/.test(replacedExpression)) return null;
  const evaluatedExpression = eval(replacedExpression);
  /* Check for zero dividing */
  if (evaluatedExpression === Infinity) return null;
  return evaluatedExpression;
};

export default parseExpression;
