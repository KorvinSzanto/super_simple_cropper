module.exports = function Imgcropper(container, width, height) {

  var CropArea = require('./CropArea.js');

  return new CropArea(container, width, height);
};
