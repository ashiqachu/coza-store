    const express = require('express')
    const multer = require('multer')
    const session = require('express-session');
    const path = require('path');
    const admin_router = express()

    admin_router.set('view engine','ejs')
    admin_router.set('views','./view/admin')

    // admin_router.use(express.static(path.join(__dirname,'/public/admin')))

    admin_router.use(express.static('public'))
    

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/admin-assets/uploads') // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // File naming strategy
    }
});

admin_router.use(session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
  }));
  admin_router.use(express.json())

const upload = multer({ storage: storage });

const adminController = require('../controller/adminController')
const adminCategoryController = require('../controller/adminCategoryController')
const adminProductController = require('../controller/adminProductController')
const adminUserController = require('../controller/adminUserController')
const adminCoupunController = require('../controller/adminCoupunController')
const adminBannerController = require('../controller/adminBannerController')
const adminOrderController = require('../controller/adminOrderController')

const adminAuth = require ('../middleware/adminAuth.js')


admin_router.get('/',adminController.loadadmin)
admin_router.get('/dashboard',adminAuth.isLogin,adminController.loadAdminHome)
admin_router.post('/admin',adminController.authentication)
admin_router.get('/adminlogout',adminAuth.isLogout,adminController.adminLogout)


admin_router.get('/Category',adminAuth.isLogin,adminCategoryController.loadCategoryAdd)
admin_router.post('/category',adminAuth.isLogin,upload.single('category_logo'),adminCategoryController.addingNewCategory)
admin_router.get('/categorylist',adminAuth.isLogin,adminCategoryController.loadCategoryList)
admin_router.get('/editcategory',adminAuth.isLogin,adminCategoryController.editCategory)
admin_router.post('/editcategory',adminAuth.isLogin,upload.single('category_logo'),adminCategoryController.editCategorySubmiting)
admin_router.get('/listCategory',adminAuth.isLogin,adminCategoryController.listUnlist)



admin_router.get('/product',adminAuth.isLogin,adminProductController.loadAddProduct)
admin_router.post('/product',adminAuth.isLogin,upload.array("image"),adminProductController.submitingAddProduct)
admin_router.get('/productlist',adminAuth.isLogin,adminProductController.loadProductList)
admin_router.get('/editproduct',adminAuth.isLogin,adminProductController.loadEditProduct)
admin_router.post('/editproduct',adminAuth.isLogin,upload.array("image"),adminProductController.submitingEdit)
admin_router.get('/deleteimge',adminAuth.isLogin,adminProductController.deleteImage)
admin_router.get('/listproduct',adminAuth.isLogin,adminProductController.isListedUnListed)



admin_router.get('/userlist',adminAuth.isLogin,adminUserController.loadUser)
admin_router.get('/blockUser',adminAuth.isLogin,adminUserController.blockUser)


admin_router.get('/addCoupun',adminAuth.isLogin,adminCoupunController.loadAddCoupun)
admin_router.post('/addCoupun',adminAuth.isLogin,adminCoupunController.addCoupun)
admin_router.get('/coupunlist',adminAuth.isLogin,adminCoupunController.listCoupun)
admin_router.get('/editCoupun',adminAuth.isLogin,adminCoupunController.editCoupun)
admin_router.post('/editCoupun',adminAuth.isLogin,adminCoupunController.editSubmiting)
admin_router.get('/listUnlistCoupun',adminAuth.isLogin,adminCoupunController.listUnlist)


admin_router.get('/addBanner',adminAuth.isLogin,adminBannerController.loadBannerPage)
admin_router.post('/banner',adminAuth.isLogin,upload.single('banner_Logo'),adminBannerController.addBanner)
admin_router.get('/bannerlist',adminAuth.isLogin,adminBannerController.bannerList)
admin_router.get('/editbanner',adminAuth.isLogin,adminBannerController.editBanner)
admin_router.post('/editbanner',adminAuth.isLogin,upload.single('banner_Logo'),adminBannerController.editSubmiting)


admin_router.get('/Orderlist',adminAuth.isLogin,adminOrderController.loadOrderDetails)
admin_router.get('/orderDetails',adminAuth.isLogin,adminOrderController.orderDetails)
admin_router.post('/statusChanging',adminAuth.isLogin,adminOrderController.changingStatus)


admin_router.get('/loadsales-report',adminAuth.isLogin,adminOrderController.loadSalesReport)
admin_router.get('/sales-report',adminAuth.isLogin,adminOrderController.salesReport)
admin_router.get('/download',adminOrderController.downloadInvoice)

module.exports = admin_router