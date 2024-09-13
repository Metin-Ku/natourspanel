const express = require('express');
const roleController = require('../controllers/roleController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// login olamdan aşağıdaki işlemler yapılamaz
router.use(authController.protect);

router.route('/').get(roleController.getAllRoles);

module.exports = router;
