const express = require('express');
const difficultyController = require('../controllers/difficultyController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// login olamdan aşağıdaki işlemler yapılamaz
router.use(authController.protect);

// router
//   .route('/')
//   .get(difficultyController.getAllDifficulty)
//   .post(authController.restrictTo('user'), difficultyController.createDifficulty);
router.route('/').get(difficultyController.getAllDifficulties);

module.exports = router;
