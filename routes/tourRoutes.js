const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// GET /tour/234fad4/reviews/94887fda

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

// /tours-distance?distance=233,center=-40,45,unit=km
// İki türlüde yapılır ama aşağıdaki daha temiz
// /tours-distance/233/center/-40,45/unit/km

// tourları başka yerlere api olarak dağıtmak için protect kaldırıldı
// router
//   .route('/')
//   .get(tourController.getAllTours)
//   // .get(authController.protect, tourController.getAllTours)
//   .post(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide'),
//     tourController.createTour,
//   );

// aşağıdaki görsel eklemenin olduğu görsel eklemeyi kaldırdım
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.createTour,
  );

// !!! *** aşağıdaki /:id sayesinde req.params.id elde edilebiliyor
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteAllImages,
    tourController.deleteTour,
  );

router
  .route('/:id/image')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.deleteTourImage,
  );
// ilerde bu kısmı dinamik olarak veritabanından çek
// authController.restrictTo('admin', 'lead-guide'),
// lead-guide çıkarılabilsin ya da user eklenebilsin gibi

module.exports = router;
