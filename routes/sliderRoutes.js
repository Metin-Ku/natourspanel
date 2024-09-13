const express = require('express');
const sliderController = require('../controllers/sliderController');
const authController = require('../controllers/authController');

const router = express.Router();

// bu satırdan sonraki bütun routerları protect hale getirir login olmadan işlemler yapılamaz
router.use(authController.protect);
router.use(authController.restrictTo('admin'));
// getAllSliders admin olmayan kullanıcılar da ulaşabiliyor, sadece admin ulaşabilmeli. İlerde bunu düzelt. Udemy soru&cevap kısmında örnekleri var
router
  .route('/')
  .get(sliderController.getAllSliders)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    sliderController.uploadSliderImages,
    sliderController.resizeSliderImages,
    sliderController.createSlider,
  );

router
  .route('/:id')
  .get(sliderController.getSlider)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    sliderController.uploadSliderImages,
    sliderController.resizeSliderImages,
    sliderController.updateSlider,
  )
  .delete(sliderController.deleteSlider);

module.exports = router;
