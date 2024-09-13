const mongoose = require('mongoose');

const imageSizesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  folder: {
    type: String,
    required: true,
  },
  thumb: {
    type: String,
  },
  small: {
    type: String,
  },
  medium: {
    type: String,
  },
  large: {
    type: String,
  },
  original: {
    type: String,
  },
});

const ImageSizes = mongoose.model('image_sizes', imageSizesSchema);

module.exports = ImageSizes;
