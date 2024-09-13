const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A slider must have a name'],
    unique: true,
    trim: true,
  },
  link: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  imageOriginal: String,
  imageLarge: String,
  imageMedium: String,
  imageSmall: String,
  imageThumb: String,
  active: {
    type: Boolean,
    default: true,
  },
});

const Slider = mongoose.model('Slider', sliderSchema);

module.exports = Slider;
