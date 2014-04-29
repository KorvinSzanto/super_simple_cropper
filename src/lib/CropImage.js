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
