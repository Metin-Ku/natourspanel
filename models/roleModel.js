const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    unique: true,
    required: [true, 'Role can not be empty!'],
  },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
