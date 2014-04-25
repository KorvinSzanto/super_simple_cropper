module.exports = (function() {
  var Cropper = require('./main.js');

  return function(settings) {
    var me = $(this),
        cropper;
    if (!me.data('imagecropper')) {
      cropper = new Cropper(this, settings.width, settings.height);
      this.data('imagecropper', cropper);

      $.fn.each.call(settings, function(key, val) {
        cropper.set(key, val);
      });

      cropper.render();
    } else {
      cropper = this.data('imagecropper');
      if (typeof cropper[settings] === 'function') {

        return cropper[settings].apply(cropper, Array.prototype.slice.call(arguments, 1));
      }
    }

    return this;

  };
}());
