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
