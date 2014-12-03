var strongParams = require('params'),
               _ = require('underscore');

module.exports = {
  filter: function(params) {
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
      return _.extend(opts, scale);
    }

    return opts;
  },
};
