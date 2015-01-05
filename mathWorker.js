var options = require('./options'),
    math    = require('mathjs')();

/**
* Evaluate an expression
* @param {{expr: string | string[], precision: number | null}} params
* @return {string | string[]} result
*/
function evaluate(params) {
  var scope,
      result,
      evaluatedResult;

  // TODO: validate params.expr
  // TODO: validate params.precision

  if (Array.isArray(params.expr)) {
    scope = {};
    result = params.expr.map(function (expr) {
      var r = math.eval(expr, scope);
      return math.format(r, options.filter(params));
    });
  }
  else {
    evaluatedResult = math.eval(params.expr);
    result = math.format(evaluatedResult, options.filter(params));
  }

  return result;
}