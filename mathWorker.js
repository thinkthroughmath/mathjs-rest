var math       = require('mathjs'),
    options    = require('./options');

/**
 * Evaluate an expression
 * @param {{expr: string | string[], precision: number | null}} params
 * @return {string | string[]} result
 */
function evaluate(params) {
  var scope, result;

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
    var r = math.eval(params.expr);
    result = math.format(r, options.filter(params));
  }

  return result;
}

module.exports = {
  evaluate: evaluate
};
