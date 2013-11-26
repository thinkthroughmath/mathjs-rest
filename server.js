var express = require('express'),
    mathjs = require('mathjs');

var app = express();

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

    if (params.expr === undefined) {
      res.send(400, 'Error: Required field "expr" missing in JSON body.');
      return;
    }

    var result = evaluate(params);

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

// handle uncached exceptions so the application cannot crash
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  console.trace();
});


/**
 * Evaluate an expression
 * @param {{expr: string | string[], precision: number | null}} params
 * @return {string | string[]} results
 */
function evaluate (params) {
  // TODO: validate params.expr
  // TODO: validate params.precision
  // TODO: improve performance. Right now we reload the mathjs library for every evaluation

  var math = mathjs();

  var results;

  if (Array.isArray(params.expr)) {
    var scope = {};
    results = params.expr.map(function (expr) {
      var result = math.eval(expr, scope);
      return math.format(result, params.precision)
    });
  }
  else {
    var result = math.eval(params.expr);
    results = math.format(result, params.precision);
  }

  return results;
}


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('Listening on port ' + port);
});

