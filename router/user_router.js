    const express = require('express')
    const multer = require('multer')
    const session = require('express-session');
    const path = require('path');

    const user_router = express()


    user_router.set('view engine','ejs')
    user_router.set('views','./view/user')

// user_router.use(express.static(path.join(__dirname, 'public/user-assets')));

user_router.use(express.static('public/user-assets'))
user_router.use(express.static('public'))

user_router.use(session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
  }));
  


const userController = require('../controller/userController')
const userProductController = require('../controller/userProductController')
const userCartController = require('../controller/userCartController')
const userWhishlistController = require('../controller/userWhishlistController')
const authentication = require ('../middleware/userAuth')



user_router.get('/',userController.loadTempHome)

user_router.get('/login',userController.loadlogin)
user_router.post('/verifyvalidation',userController.verifyValidation)
user_router.post('/verifyOtp',userController.verifyOtp)
user_router.get('/resend',userController.resendOTP)

user_router.get('/forgotpassword',userController.loadForgot)
user_router.post('/verifynumber',userController.checkingMobileNo)
user_router.post('/verifyOtpforgotpassword',userController.verifyOtpForgot)
user_router.post('/changePassword',userController.changePassword)


user_router.post('/login',userController.verifyLogin)
user_router.get('/home',authentication.isLogin,userController.loadHome)
user_router.post('/search',userController.searchProduct)


user_router.get('/orderDetails',userController.loadOrderDetails)
user_router.get('/orderDetail',authentication.isLogin,userCartController.orderDetails)
user_router.get('/invoice',authentication.isLogin,userCartController.downloadInvoice)


user_router.get('/shop',userProductController.loadShop)
user_router.post('/searchshop',userProductController.searchProduct)
user_router.get('/product-detail',userProductController.product_Details)
user_router.get('/tempdetails',userProductController.tempDetails)
user_router.get('/lowTOHigh',userProductController.lowTOHigh)
user_router.get('/hightToLow',userProductController.highTOLow)


user_router.post('/add_To_Cart',authentication.isLogin,userCartController.addToCart)
user_router.get('/shoping-cart',authentication.isLogin,userCartController.loadCart)
user_router.get('/deleteCart',authentication.isLogin,userCartController.deleteCart)
user_router.post('/changeQuantity',authentication.isLogin,userCartController.changeQuantity)



user_router.post('/addwhishlist',authentication.isLogin,userWhishlistController.addWhishlist)
user_router.post('/deleteWishlist',authentication.isLogin,userWhishlistController.deleteWhishlist)
user_router.get('/addToCartFromWhishlist',authentication.isLogin,userWhishlistController.addToCart)


user_router.post('/checkOut',authentication.isLogin,userCartController.loadCheckout)
user_router.post('/proccedToShip',authentication.isLogin,userCartController.confirmCheckout)
user_router.post('/applyingCoupun',authentication.isLogin,userCartController.coupunApply)


user_router.get('/COD',authentication.isLogin,userCartController.COD)
user_router.post('/onlinePayment',authentication.isLogin,userCartController.onlinePayment)


user_router.get('/cancelOrder',authentication.isLogin,userCartController.cancelOrder)
user_router.get('/returnOrder',authentication.isLogin,userCartController.returnOrder)

user_router.post('/verifyPayment' ,authentication.isLogin, userCartController.verify)

user_router.get('/logout',userController.logout)




module.exports = user_router