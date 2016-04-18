'use strict';

// load new relic (for logging)
require('newrelic');

var express      = require('express'),
    options      = require('./options'),
    strongParams = require('params'),
    workerpool   = require('workerpool');

function startServer() {
  // express configuration
  var port = process.env.PORT || 5000;

  var app = express(),
      pool = workerpool.pool(__dirname + '/mathWorker.js');

  var TIMEOUT = 10000; // milliseconds

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

    var params = {
      expr: req.query.expr,
      precision: req.query.precision ? parseFloat(req.query.precision) : undefined
    };

    pool.exec('evaluate', [params])
      .timeout(TIMEOUT)
      .then(function (result) {
        res.send(result);
      })
      .catch(function (err) {
        res.send(400, formatError(err));
      });
  });

  // POST requests
  app.post('/v1/*', function (req, res) {
    var params = JSON.parse(req.rawBody);

    params = strongParams(params).only(['expr', 'significantDigits', 'scale', 'precision', 'notation', 'exponential']);
    params.exponential = strongParams(params.exponential || {}).only(['lower', 'upper']);

    if (params.expr === undefined) {
      res.send(400, 'Error: Required field "expr" missing in JSON body.');
      return;
    }

    pool.exec('evaluate', [params])
      .timeout(TIMEOUT)
      .then(function (result) {
        res.send({
          result: result,
          error: null
        });
      })
      .catch(function (err) {
        res.send(400, {
          result: null,
          error: formatError(err)
        });
      });
  });

  /**
   * Format error messages as string
   * @param {Error} err
   * @return {String} message
   */
  function formatError (err) {
    if (err instanceof workerpool.Promise.TimeoutError) {
      return 'TimeoutError: Evaluation exceeded maximum duration of ' + TIMEOUT / 1000 + ' seconds';
    }
    else {
      return err.toString();
    }
  }

  // handle uncaught exceptions so the application cannot crash
  process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    console.trace();
  });

  // start the server
  app.listen(port, function() {
    console.log('Listening on port ' + port);
  });
}

startServer();
