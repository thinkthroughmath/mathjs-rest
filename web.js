var express = require('express'),
    mathjs = require('mathjs');

var app = express(),
    math = mathjs();

/**
 * Evaluate an expression
 * @param {{expr: string, precision: number | null}} params
 * @param {function} callback   Called with two parameters:
 *                              {string | null} err
 *                              {string | null} result
 */
function evaluate (params, callback) {
  try {
    var math = mathjs(),
        result = math.eval(params.expr),
        resultStr = math.format(result, params.precision);

    process.nextTick(function () {
      callback(null, resultStr);
    });
  }
  catch (err) {
    process.nextTick(function () {
      var errStr = err.toString();
      callback(errStr, null);
    });
  }
}

function handleEvaluate (req, res) {
  var params = {
    expr:      req.params.expression || req.rawBody,
    precision: req.query.precision ? parseFloat(req.query.precision) : undefined
  };

  evaluate(params, function (err, result) {
    if (!err) {
      res.send(result);
    }
    else {
      res.send(400, err);
    }
  });
}

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

// REST API
app.get('/v1/:expression', handleEvaluate);
app.post('/v1/', handleEvaluate);

// handle uncached exceptions so the application cannot crash
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  console.trace();
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});

