const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// POST /reviews

// Yukardaki her iki route'da da aşağıdaki router'a gider
// Buna "POST /tour/234fad4/reviews" tourRoutes'dan ulaşıyor
// tourRoutes içinde bu kısım "router.use('/.tourId/reviews', reviewRouter);"

// login olamdan aşağıdaki işlemler yapılamaz
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(reviewController.deleteReview);
// router
//   .route('/:id')
//   .get(reviewController.getReview)
//   .patch(reviewController.updateReview)
//   .delete(reviewController.deleteReview);

module.exports = router;
