'use strict';

require('newrelic');
var express = require('express'),
    options = require('./options'),
    math = require('mathjs')(),
    strongParams = require('params');

// express configuration
var port = process.env.PORT || 5000;

// library instances
var app = express();

// disable the import function so the math.js instance cannot be changed
math.import({
  'import': function () {
    throw new Error('function import is disabled.');
  }
}, {
  override: true
});

// use logger and enable compression
app.use(express.logger());
app.use(express.compress());

// parse raw request body
app.use(function(req, res, next) {
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    req.rawBody = data;
    next();
  });
});

// route static files
app.use(express.static(__dirname + '/public'));

// GET requests
app.get('/v1/*', function (req, res) {
  if (req.query.expr === undefined) {
    res.send(400, 'Error: Required query parameter "expr" missing in url.');
    return;
  }

  try {
    var result = evaluate({
      expr: req.query.expr,
      precision: req.query.precision ? parseFloat(req.query.precision) : undefined
    });

    res.send(result);
  }
  catch (err) {
    res.send(400, err.toString());
  }
});

// POST requests
app.post('/v1/*', function (req, res) {
  try {
    var params = JSON.parse(req.rawBody);
    var result;

    params = strongParams(params).only(['expr', 'significantDigits', 'scale', 'precision', 'notation', 'exponential']);
    params.exponential = strongParams(params.exponential || {}).only(['lower', 'upper']);

    if (params.expr === undefined) {
      res.send(400, 'Error: Required field "expr" missing in JSON body.');
      return;
    }

    result = evaluate(params);

    res.send( {
      result: result,
      error: null
    });
  }
  catch (err) {
    res.send({
      result: null,
      error: err.toString()
    });
  }
});

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

// handle uncached exceptions so the application cannot crash
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  console.trace();
});

// start the server
app.listen(port, function() {
  console.log('Listening on port ' + port);
});
