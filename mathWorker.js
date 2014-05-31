var mathjs = require('mathjs'),
    workerpool = require('workerpool');

// create an instance of math.js
var math = mathjs();

// disable the import function so the math.js instance cannot be changed
math.import({
  'import': function () {
    throw new Error('function import is disabled.');
  }
}, {
  override: true
});

/**
 * Evaluate an expression
 * @param {{expr: string | string[], precision: number | null}} params
 * @return {string | string[]} result
 */
function evaluate (params) {
  var result;

  // TODO: validate params.expr
  // TODO: validate params.precision

  if (Array.isArray(params.expr)) {
    var scope = {};
    result = params.expr.map(function (expr) {
      var r = math.eval(expr, scope);
      return math.format(r, params.precision)
    });
  }
  else {
    var r = math.eval(params.expr);
    result = math.format(r, params.precision);
  }

  return result;
}

// create a worker and register public functions
workerpool.worker({
  evaluate: evaluate
});