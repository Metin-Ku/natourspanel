const mongoose = require('mongoose');

const difficultySchema = new mongoose.Schema({
  level: {
    type: String,
    unique: true,
    required: [true, 'Difficulty can not be empty!'],
  },
});

const Difficulty = mongoose.model('Difficulty', difficultySchema);

module.exports = Difficulty;
