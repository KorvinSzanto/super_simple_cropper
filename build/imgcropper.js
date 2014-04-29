(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright (c) 2014 Korvin Szanto

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function ImageCropperIIFE(global, $) {
  'use strict';

  if (typeof $ !== 'undefined') {
    $.fn.imagecropper = require('./lib/jQuery.js');
  }

  global.Imagecropper = require('./lib/main.js');

}(window, jQuery));


},{"./lib/jQuery.js":6,"./lib/main.js":7}],2:[function(require,module,exports){
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

},{"./extend.js":5}],3:[function(require,module,exports){
module.exports = (function CropArea(global, $, undefined) {
  'use strict';

  var CropImage = require('./CropImage.js');

  return require('./Class.js').extend({

    init: function CropAreaInit(area, width, height) {
      if (!(area instanceof $)) {
        area = $(area);
      }
      console.log(area);
      this.set('size', { width: width, height: height })
          .set('element', area)
          .set('image', new CropImage(area.children('img')))
          .set('drag_start', { x: 0, y: 0 })
          .set('drag_offset_start', { x: 0, y: 0 })
          .set('dragging', false)
          .set('scale', 1);

      return this.initializeDOM().initializeEvents().render();
    },

    setScale: function CropAreaSetScale(scale) {
      this.getAttributes().image_scale = scale;
      this.getImage().setScale(scale);
      return this;
    },

    initializeDOM: function CropAreaInitializeDOM() {
      this.getElement().css({
        overflow: 'hidden',
        position: 'relative',
        width:  this.getSize().width,
        height: this.getSize().height,
        border: 'solid 1px #ccc',
        background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAL0lEQVQ4T2P88OHDfwY8gJ' +
          '+fH580A+OoAcMiDP4DAb6I/vjxI/50MGoAA+PQDwMAyeVWaRyHJs4AAAAASUVORK5CYII=)'
      });

      return this;
    },

    normalizeEvent: function CropAreaNormalizeEvent(e) {
      if (typeof e.touches !== 'undefined') {
        e._offsetX = e.touches[0].pageX;
        e._offsetY = e.touches[0].pageY;
      } else {
        if (typeof e.pageX === 'undefined') {
          e._offsetX = e.clientX + window.document.body.scrollLeft + window.document.documentElement.scrollLeft;
          e._offsetY = e.clientY + window.document.body.scrollTop + window.document.documentElement.scrollTop;
        } else {
          e._offsetX = e.pageX;
          e._offsetY = e.pageY;
        }
      }
      return e;
    },

    fixImagePosition: function CropAreaFixImagePosition() {
      var offset_padding = 10,
          offset = this.getImage().getOffset();


      offset.x = Math.max(offset.x, -this.getImage().getSize().width + offset_padding);
      offset.x = Math.min(offset.x, this.getSize().width - offset_padding);

      offset.y = Math.max(offset.y, -this.getImage().getSize().height + offset_padding);
      offset.y = Math.min(offset.y, this.getSize().height - offset_padding);

      return this;
    },

    sizeImageUp: function CropAreaSizeImageUp() {
      this.getImage().sizeUp.apply(this.getImage(), Array.prototype.slice.call(arguments));
      return this.fixImagePosition();
    },
    sizeImageDown: function CropAreaSizeImageDown() {
      this.getImage().sizeDown.apply(this.getImage(), Array.prototype.slice.call(arguments));
      return this.fixImagePosition();
    },

    initializeEvents: function CropAreaInitializeEvents() {
      var me = this;
      $(global.document).on('mousemove touchmove', function(event) {
        if (me.isDragging()) {
          var e = me.normalizeEvent(event.originalEvent);
          (function(me, e) {
            var offset = me.getImage().getOffset(),
                offset_start = me.getDragOffsetStart(),
                start = me.getDragStart();

            offset.x = offset_start.x - (start.x - e._offsetX);
            offset.y = offset_start.y - (start.y - e._offsetY);

            me.fixImagePosition().render();
          }(me, e));
        }
        event.preventDefault();
        return false;
      }).on('mouseup touchend touchcancel touchleave', function(e) {
        if (me.isDragging()) {
          me.setDragging(false);
        }
        e.preventDefault();
        return false;
      });

      this.getElement().on('mousedown touchstart', function(event) {
        var e = me.normalizeEvent(event.originalEvent);
        (function(me, e) {
          var img = me.getImage();

          me.setDragOffsetStart({ x: img.getOffset().x, y: img.getOffset().y })
            .setDragStart({ x: e._offsetX, y: e._offsetY })
            .setDragging(true);
        }(me, e));
        event.preventDefault();
        return false;
      });

      return this;
    },

    render: function CropAreaRender() {
      this.getElement().css({
        width:  this.getSize().width,
        height: this.getSize().height
      });

      this.getImage().render();

      return this;
    },

    exportSettings: function CropAreaExportSettings(){
      return {
        image: this.getImage().exportSettings(),
        width: this.getSize().width,
        height: this.getSize().height
      };
    }

  });

}(window, jQuery));

},{"./Class.js":2,"./CropImage.js":4}],4:[function(require,module,exports){
module.exports = (function CropImage(global, $, undefined) {
  'use strict';

  return require('./Class.js').extend({

    init: function CropImageInit(img) {
      this.set('element', img)
          .set('size', { width: 1, height: 1 })
          .set('offset', { x: 0, y: 0 })
          .set('scale', 1);


      var load_image = new Image(), me = this;
      load_image.onload = function loadImage() {
        me.getSize().width = this.width;
        me.getSize().height = this.height;
        me.render();
      };
      load_image.src = img.attr('src');

      return this.initialize();
    },

    initialize: function CropImageInitialize() {
      this.getElement().stop().css({
        position: 'absolute',
        top:    0,
        left:   0,
        width:  1,
        height: 1,
      });

      return this.render();
    },

    sizeUp: function CropImageSizeUp(by, multiplier) {
      var width = this.getSize().width,
          height = this.getSize().height;

      this.getSize().width = Math.max(1, width + ((multiplier || 1) * (by || width * 0.10)));
      this.getSize().height = (this.getSize().width / width) * height;

      this.getOffset().x -= (this.getSize().width - width) / 2;
      this.getOffset().y -= (this.getSize().height - height) / 2;

      return this.render();
    },

    sizeDown: function CropImageSizeDown(by) {
      return this.sizeUp.call(this, by, -1);
    },

    render: function CropImageRender() {
      this.getElement().stop().css(this.exportSettings());

      return this;
    },

    exportSettings: function CropImageExportObject() {
      return {
        width:  Math.round(this.getSize().width) * 1 / this.getScale(),
        height: Math.round(this.getSize().height) * 1 / this.getScale(),
        top:    Math.round(this.getOffset().y),
        left:   Math.round(this.getOffset().x)
      };
    }

  });

}(window, jQuery));

},{"./Class.js":2}],5:[function(require,module,exports){
module.exports = function Extend(protoProps, staticProps) {
  var parent = this, child;

  function getKeys(obj) {
    if (obj === Object(obj)) {
      return [];
    }
    if (Object.keys) {
      return Object.keys(obj);
    }
    var keys = [];
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        keys.push(key);
      }
    }
    return keys;
  }
  function each(obj, iterator, context) {
    if (obj === null) {
      return obj;
    }
    if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        iterator.call(context, obj[i], i, obj);
      }
    } else {
      var keys = getKeys(obj);
      for (var e = 0, len = keys.length; e < len; e++) {
        iterator.call(context, obj[keys[e]], keys[e], obj);
      }
    }
    return obj;
  }

  function extend(obj) {
    each(Array.prototype.slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  }

  if (protoProps && Object.prototype.hasOwnProperty.call(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  extend(child, parent, staticProps);

  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();

  if (protoProps) {
    extend(child.prototype, protoProps);
  }

  child.__super__ = parent.prototype;

  return child;
};

},{}],6:[function(require,module,exports){
module.exports = (function() {
  var Cropper = require('./main.js');

  return function(settings) {
    var me = $(this),
        cropper;
    if (!me.data('_imagecropper')) {
      cropper = new Cropper(this, settings.width, settings.height);
      this.data('_imagecropper', cropper);

      $.fn.each.call(settings, function(key, val) {
        cropper.set(key, val);
      });

      cropper.render();
    } else {

      cropper = this.data('_imagecropper');
      if (typeof cropper[settings] === 'function') {
        var return_value = cropper[settings].apply(cropper, Array.prototype.slice.call(arguments, 1));

        if (return_value === cropper) {
          return this;
        } else {
          return return_value;
        }
      }
    }

    return this;

  };
}());

},{"./main.js":7}],7:[function(require,module,exports){
module.exports = function Imgcropper(container, width, height) {

  var CropArea = require('./CropArea.js');

  return new CropArea(container, width, height);
};

},{"./CropArea.js":3}]},{},[1])