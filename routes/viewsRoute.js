
const express = require('express');


const productController = require('./../controllers/productController');
const transactionController = require('./../controllers/transactionController')
const adminController = require('./../controllers/adminController');
const authController = require('./../controllers/authController');


const router = express.Router();


// about us
router.get('/aboutUs',adminController.getAboutUs);

router.get('/myAddress',authController.protectRoutes,adminController.myAddress);
// related to user authentication
router.get('/login',authController.showFormLogin);
router.get('/signUp',authController.showFormSignUp)
router.get('/forgotPassword',authController.showForgotPasswordForm);

router.get('/logout',authController.logout);
router.post('/saveChangesAddress',adminController.addressSave);

router.post("/secondaryAddress",authController.protectRoutes,adminController.secondaryAddress);

// router.get('/feedback',adminController.getFeedback);
// post request in the user authentication

// route for views
router.get('/faq',authController.protectRoutes,adminController.faq);

// for testimonials
router.get('/testimonials',authController.protectRoutes,adminController.getTestimonals);




// route for contact us
router.get('/contactUs',adminController.getContactUs);

router.post('/user/login',authController.login);
router.post('/user/signUp',authController.customerSignUp);
router.post('/user/forgotPassword',authController.forgotPassword);

router.post('/userProfile/updatePassword',authController.protectRoutes,authController.updateMyPassword);
router.post('/userProfile/saveChanges',authController.saveChangesUser);
// not working
router.route('/resetPassword/:token').get(authController.getResetPage).post(authController.resetPassword);
// router.patch('/resetPassword/:token',authController.resetPassword);

// User profile, the user profile should be a protected route
router.get('/userProfile',authController.protectRoutes,adminController.userProfile);
router.get('/myTransactions',authController.protectRoutes,adminController.userTransaction);

// related to cart and the checkout page and summary page

router.get('/',authController.isLoggedIn,productController.showAllProducts);
router.get('/cart',authController.isLoggedIn,transactionController.cart);
router.post('/checkout',authController.protectRoutes,transactionController.displayCheckout);


//!  mali pa yung part ng code na province, kapag hindi nagselect ng value si user namamali
// router.get('/checkout',authController.protectRoutes,transactionController.checkout);

router.get('/summary',transactionController.summary);
router.route('/orderSummary').get(transactionController.getOrderSummary).post(authController.protectRoutes,transactionController.postOrderSummary);

// mali pa yung modelling for products kinukuha mo lang yung single individual products hahahaha syempre resolved ko na to lmao
router.post('/acceptOrder',authController.protectRoutes,adminController.acceptOrder);

router.get('/accepted',authController.protectRoutes,adminController.Accept);
// feedback
//  router.get('/feedback',authController.protectRoutes,productController.feedback);

// related to admin page

// authentication of login and signup of admin

router.get('/welcome',authController.protectRoutes,adminController.onlyAdmin,adminController.welcome);
router.get('/adminLogin',authController.getAdminLogin);
router.get('/adminSignUp',authController.getAdminSignUp);
router.get('/adminLogout',adminController.adminLogout);


router.post('/admin/signUp',authController.adminSignUp);
router.post('/admin/login',authController.adminLogin);

router.get('/adminProfile',authController.protectRoutes,adminController.onlyAdmin,authController.getAdminProfile);
router.get('/adminCompanyProfile',authController.protectRoutes,adminController.restrictToMasterAeditor,adminController.getCompanyProfile);

router.post('/companyInfo/saveChanges',adminController.uploadCompanyInfos,adminController.comapanySaveChanges);

router.get('/acceptOrder',authController.protectRoutes,adminController.restrictToMasterAencoder,adminController.getAcceptOrder);
router.get('/transactionRecords',authController.protectRoutes,adminController.restrictToMasterAencoder,adminController.getTransactionRecord);

// faq page
router.get('/adminFaq',authController.protectRoutes,adminController.onlyAdmin,adminController.Faq);
router.get('/adminFaq/:category',adminController.Faq);
router.post('/postCategory',adminController.faqCategory);
router.post('/postFAQ',adminController.postFAQ);

router.get('/deleteCategory',adminController.deleteCategory);

// Modals ng admin Products sira pa
router.get('/adminProducts',authController.protectRoutes,adminController.restrictToMaster,adminController.products);
router.get('/getAddProductPage',authController.protectRoutes,adminController.addProductPage);
router.post('/postProduct',adminController.uploadProduct,adminController.postProduct);

// Modals ng edit shipping sira pa
router.route('/adminShipping').get(authController.protectRoutes,adminController.restrictToMasterAencoder,adminController.shipping).post(adminController.shippingPost);

// For admin Assigning of roles
router.route('/adminRoles').get(authController.protectRoutes,adminController.restrictToMaster,adminController.getadminRoles).post(adminController.postAdminRoles);

// For editing Page
router.route('/editPage').get(authController.protectRoutes,adminController.onlyAdmin,adminController.getEditPage);
router.post('/editPage',adminController.uploadProduct,adminController.updateEditPage);
// deleting pages
router.get('/delete',adminController.delete);

// testimonials
router.route('/adminTestimonials').get(authController.protectRoutes,adminController.restrictToMasterAeditor,adminController.getAdminTestimonial).post(adminController.postTestimonial);

router.get('/cancelOrder',adminController.cancelOrder);

// 1.) User auth medyo patapos na kulang na lang yung reset Password
// 2.) Shipping location done
// 3.) faq 
// 4.) Admin Product page edit button, and shipping location edit button
// 5.) Checkout page
// 6.) Summary page
// 7.) Model the transaction page models properly
// 7.) Accept order page with email na confirmed na yung order sa client
// 8.) Completed transaction page admin side
// 9.) Admin user roles
// 10.) Feedback page
// 11.) Error handling
// 12.) Showing the Faqs in the client side, Showing the feedback page client side
module.exports = router;