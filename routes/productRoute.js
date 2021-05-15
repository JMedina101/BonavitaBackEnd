const express = require('express');
const productController      = require('./../controllers/productController');
const authController         = require('./../controllers/authController');

const userController         = require('./../controllers/userController')
const router = express.Router();



// user side
router.delete('/bonavita/deleteMe',authController.protectRoutes,userController.deleteMe)
router.post('/bonavita/updateMyPassword', authController.protectRoutes,authController.updatePassword);

router.patch('/bonavita/updateMe',authController.protectRoutes,userController.updateMe);

router.route('/bonavita/support').post(authController.protectRoutes,userController.showAllUser);
router.route('/bonavita/signUp').post(authController.customerSignUp)
router.post('/bonavita/login',authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
 router.route('/resetPassword/:token').patch(authController.resetPassword);
// admin side
router.route('/admin/signUp').get(authController.protectRoutes,authController.restrictTo('master','customer'));

module.exports = router;
