const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// bu satırdan sonraki bütun routerları protect hale getirir login olmadan işlemler yapılamaz
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

// aşağıdaki kod user login olduktan sonra kendisi hakkında verileri görmesini sağlıyor. id'yi post etmiyor. Token sayesinde güvenlii bir şekilde oluyor
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));
// getallusers admin olmayan kullanıcılar da ulaşabiliyor, sadece admin ulaşabilmeli. İlerde bunu düzelt. Udemy soru&cevap kısmında örnekleri var
router
  .route('/')
  .get(userController.getAllUsers)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.createUser,
  );

router
  .route('/:id')
  .get(userController.getUser)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateUser,
  )
  .delete(userController.deleteUser);

module.exports = router;
