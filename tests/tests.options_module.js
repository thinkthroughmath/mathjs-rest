var should = require('should');
var options = require('../options');

describe('options module',function(){
  var simpleParams = {
    "expr": [
      "a = 1.2 * (2 + 4.5)",
    ],
    "precision": 14,
    "notation": "auto",
    "exponential": {"upper": 10, "lower": 12}
  };

  var scaleParams = {
    "expr": [
      "a = 1.2 * (2 + 4.5)"
    ],
    "scale": 14
  };

  var significantParams = {
    "expr": [
      "a = 1.2 * (2 + 4.5)",
    ],
    "significantDigits": 14
  };

  it('filters expr and ignores standard params',function(){
    var filtered = options.filter(simpleParams);
    filtered.should.eql({
      "precision": 14,
      "notation": "auto",
      "exponential": {"upper": 10, "lower": 12}
    });
  });

  it('converts scale to fixed decimal precision', function(){
    var filtered = options.filter(scaleParams);
    filtered.should.eql({"precision": 14, "notation": "fixed"});
  });

  it('converts significantDigits to digit precision', function(){
    var filtered = options.filter(significantParams);
    filtered.should.be.exactly(14);
  });
});
