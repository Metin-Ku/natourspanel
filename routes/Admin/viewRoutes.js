const express = require('express');
const baseController = require('../../controllers/Admin/baseController');
const tourController = require('../../controllers/Admin/tourController');
const userController = require('../../controllers/Admin/userController');
const sliderController = require('../../controllers/Admin/sliderController');
const authController = require('../../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.use(authController.restrictTo('admin'));

router.get('/', baseController.getOverview);

router.get('/product', tourController.getAllTours);
router.get('/product/add', tourController.getTourAdd);
router.get('/product/edit/:id', tourController.getTourEdit);

// const apiTourController = require('../../controllers/tourController');

// router
//   .get('/product/add', tourController.getTourAdd)
//   .post(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide'),
//     apiTourController.uploadTourImages,
//     apiTourController.resizeTourImages,
//     apiTourController.createTour,
//   );

router.get('/user', userController.getAllUsers);
router.get('/user/add', userController.getUserAdd);
router.get('/user/edit/:id', userController.getUserEdit);

router.get('/slider', sliderController.getAllSliders);
router.get('/slider/add', sliderController.getSliderAdd);
router.get('/slider/edit/:id', sliderController.getSliderEdit);

module.exports = router;
