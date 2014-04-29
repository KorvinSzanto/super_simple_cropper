module.exports = function Class() {
  var attr = {};
  this.is = function(key) {
    var camel = key.split('_').map(function(value) {
      return value.substr(0, 1).toUpperCase() + value.toLowerCase().substr(1);
    }).join('');
    var fn = 'is' + camel;
    if (typeof this[fn] === 'function') {
      return this[fn].call(this);
    }
    return !!this.get(key);
  };
  this.getAttributes = function() {
    return attr;
  };
  this.get = function(key) {
    var camel = key.split('_').map(function(value) {
      return value.substr(0, 1).toUpperCase() + value.toLowerCase().substr(1);
    }).join('');
    var fn = 'get' + camel;
    if (typeof this[fn] === 'function') {
      return this[fn].call(this);
    }
    return attr[key];
  };
  this.set = function(key, value) {
    var camel = key.split('_').map(function(value) {
      return value.substr(0, 1).toUpperCase() + value.toLowerCase().substr(1);
    }).join('');
    var fn = 'get' + camel;
    if (typeof this[fn] === 'undefined') {
      this[fn] = function() {
        return attr[key];
      };
    }
    fn = 'is' + camel;
    if (typeof this[fn] === 'undefined') {
      this[fn] = function() {
        return !!this.get(key);
      };
    }

    fn = 'set' +camel;
    if (typeof this[fn] === 'undefined') {
      this[fn] = function(value) {
        attr[key] = value;
        return this;
      };
    }
    return this[fn].call(this, value);
  };
  if (this.init) {
    return this.init.apply(this, arguments);
  }
  return this;
};
module.exports.extend = require('./extend.js');
