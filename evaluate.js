var math = require('mathjs')();
var strongParams = require('params');

// disable the import function so the math.js instance cannot be changed
math.import({
  'import': function () {
    throw new Error('function import is disabled.');
  }
}, {
  override: true
});

module.exports = {
  /**
   * Evaluate an expression
   * @param {{expr: string | string[], precision: number | null}} params
   * @return {string | string[]} result
   */
  evaluate: function(params) {
    var _this = this;
    var scope,
        result,
        evaluatedResult;

    // TODO: validate params.expr
    // TODO: validate params.precision

    if (Array.isArray(params.expr)) {
      scope = {};
      result = params.expr.map(function (expr) {
        var r = math.eval(expr, scope);
        return math.format(r, _this.options(params));
      });
    }
    else {
      evaluatedResult = math.eval(params.expr);
      result = math.format(evaluatedResult, _this.options(params));
    }

    return result;
  },

  options: function(params) {
    var _this = this;
    var opts = strongParams(params).except('expr');
    var scale = {};

    if(opts.significantDigits){
      return opts.significantDigits;
    }

    if(opts.scale){
      scale = {
        precision: opts.scale,
        notation: opts.notation || 'fixed'
      };
      opts = strongParams(opts).except('scale');
      return _this.mergeOptions(opts, scale);
    }

    return opts;
  },

  mergeOptions: function(obj1, obj2) {
    for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
    return obj1;
  }
};
