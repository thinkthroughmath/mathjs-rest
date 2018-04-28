'use strict';

const express      = require('express'),
      strongParams = require('params'),
      mathWorker   = require('./mathWorker'),
      serverless   = require('serverless-http');

var app = express();

app.use(express.logger());
app.use(express.compress());
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
app.use(express.static(__dirname + '/public'));

// app.get('/v1/*', function (req, res) {
//   if (req.query.expr === undefined) {
//     res.send(400, 'Error: Required query parameter "expr" missing in url.');
//     return;
//   }
//
//   var params = {
//     expr: req.query.expr,
//     precision: req.query.precision ? parseFloat(req.query.precision) : undefined
//   };
//
//   try {
//     var result = mathWorker.evaluate(params);
//     res.send(result);
//   } catch(e) {
//     res.send(400, formatError(e));
//   }
// });

app.post('/v1/*', function (req, res) {
  var params = JSON.parse(req.rawBody);
  params = strongParams(params).only(['expr', 'significantDigits', 'scale', 'precision', 'notation', 'exponential']);
  params.exponential = strongParams(params.exponential || {}).only(['lower', 'upper']);

  if (params.expr === undefined) {
    res.send(400, 'Error: Required field "expr" missing in JSON body.');
    return;
  }

  try {
    var result = mathWorker.evaluate(params);
    res.send({
      result: result,
      error: null
    });
  } catch(e) {
    res.send(400, {
      result: null,
      error: formatError(e)
    });
  }
});

/**
 * Format error messages as string
 * @param {Error} err
 * @return {String} message
 */
function formatError (err) {
  return err.toString();
}

module.exports.handler = serverless(app);
