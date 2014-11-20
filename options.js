var strongParams = require('params');

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
      return this.mergeOptions(opts, scale);
    }

    return opts;
  },

  mergeOptions: function(obj1, obj2) {
    for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
    return obj1;
  }
};
