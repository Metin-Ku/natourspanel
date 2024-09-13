const Difficulty = require('../models/difficultyModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllDifficulties = factory.getAll(Difficulty);
exports.getDifficulty = factory.getOne(Difficulty);
exports.createDifficulty = factory.createOne(Difficulty);
exports.updateDifficulty = factory.updateOne(Difficulty);
exports.deleteDifficulty = factory.deleteOne(Difficulty);
