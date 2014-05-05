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

    sizeImageUp: function CropAreaSizeImageUp() {
      this.getImage().sizeUp.apply(this.getImage(), Array.prototype.slice.call(arguments));
      return this;
    },
    sizeImageDown: function CropAreaSizeImageDown() {
      this.getImage().sizeDown.apply(this.getImage(), Array.prototype.slice.call(arguments));
      return this;
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
