const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router
  .route('/updateMyPassword')
  .patch(authController.protect, authController.updatePassword);

router
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteUser);

router
  .route('/myData')
  .get(authController.protect, userController.getUserData)
  .patch(authController.protect, userController.updateUser);

router
  .route('/users')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  );

module.exports = router;
