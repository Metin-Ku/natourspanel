const Role = require('../models/roleModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllRoles = factory.getAll(Role);
exports.getRole = factory.getOne(Role);
exports.createRole = factory.createOne(Role);
exports.updateRole = factory.updateOne(Role);
exports.deleteRole = factory.deleteOne(Role);
