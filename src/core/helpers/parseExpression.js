const kx = /\dx/;
const sqrtRegExp = /sqrt\(([^)(]*?)\)/g;
const sinRegExp = /sin\(([^)(]*?)\)/g;
const cosRegExp = /cos\(([^)(]*?)\)/g;
const tgRegExp = /tg\(([^)(]*?)\)/g;
const sqrRegExp = /(\d+?x?|x?)\^/g;
const invalidExpression = /[^\d\-/*+().e]/;

//TODO: MAKE PARSER WORK WITH RANDOM ORDER

const parseExpression = (expression, x) => {
  let parsedExpresion = expression;

  /* Prevent duplicated x */
  if (/x{2,}/.test(parsedExpresion)) return Error('Please, remove duplicates');
  /* Support to unary minus */
  if (/-x/.test(parsedExpresion)) parsedExpresion = parsedExpresion.replace(/-x/g, `-(${x * -1})`);
  if (kx.test(parsedExpresion)) Array.from(parsedExpresion.matchAll(/\dx/g)).forEach(item => parsedExpresion = parsedExpresion.replace(kx, `${parsedExpresion[item.index]}*${x}`));

  if (sqrtRegExp.test(parsedExpresion)) {
    const sqrtExpression = parsedExpresion.match(sqrtRegExp)[0].match(/\(([^)(]*?)\)/g)[0].slice(1, -1);
    console.log(sqrtExpression);
    const evaluatedSqrt = parseSqrt(sqrtExpression, x);
    if (isNaN(evaluatedSqrt)) return;
    parsedExpresion = parsedExpresion.replace(sqrtRegExp, `(${evaluatedSqrt})`)
  }

  if (cosRegExp.test(parsedExpresion)) {
    const cosExpression = parsedExpresion.match(cosRegExp)[0].match(/\(([^)(]*?)\)/g)[0].slice(1, -1);
    const evaluatedCos = parseCos(cosExpression, x);
    parsedExpresion = parsedExpresion.replace(cosRegExp,`(${evaluatedCos})`)
  }

  if (tgRegExp.test(parsedExpresion)) {
    const tgExpression = parsedExpresion.match(tgRegExp)[0].match(/\(([^)(]*?)\)/g)[0].slice(1, -1);
    const evaluatedTg = parseTg(tgExpression, x);
    parsedExpresion = parsedExpresion.replace(tgRegExp, `(${evaluatedTg})`)
  }

  if (sinRegExp.test(parsedExpresion)) {
    const sinExpression = parsedExpresion.match(sinRegExp)[0].match(/\(([^)(]*?)\)/g)[0].slice(1, -1);
    const evaluatedSin = parseSin(sinExpression, x);
    parsedExpresion = parsedExpresion.replace(sinRegExp, `(${evaluatedSin})`)
  }

  if (sqrRegExp.test(parsedExpresion)) {
    parsedExpresion.match(sqrRegExp).forEach((item) => {
      const replacedAndWrapped = item.replace(/.+/, `${item.slice(0, -1)}**`);
      parsedExpresion = parsedExpresion.replace(item, replacedAndWrapped)
    })
  }
  /* Replacing kx construction */
  parsedExpresion = replaceX(parsedExpresion, x);
  /* Replace x by current */

  /* Eval is unsafe, but let's test is it really mathematical expression by generated RegExp */
  if (invalidExpression.test(parsedExpresion)) return Error('Forbidden characters');
  /* window.Function() is faster than eval() */
  const evaluatedExpression = Function('', `return ${parsedExpresion}`)();

  if (isNaN(evaluatedExpression)) return;
  return evaluatedExpression;
};

const replaceX = (expression, x) => expression.replace(/x/g, x);

const parseSqrt = (expression, x) => {
  if (invalidExpression.test(expression)) {
    return parseSqrt(parseExpression(expression, x), x);
  }
  return Math.sqrt(expression);
};

const parseSin = (expression, x) => {
  if (invalidExpression.test(expression)) {
    return parseSin(parseExpression(expression, x), x);
  }
  return Math.sin(expression)
};

const parseCos = (expression, x) => {
  if (invalidExpression.test(expression)) {
    return parseCos(parseExpression(expression, x), x);
  }
  return Math.cos(expression)
};

const parseTg = (expression, x) => {
  if (invalidExpression.test(expression)) {
    return parseTg(parseExpression(expression, x), x);
  }
  return Math.tan(expression)
};

export default parseExpression;
