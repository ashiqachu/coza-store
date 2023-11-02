const categoryBase = require('../model/categoryModel')
const productBase = require('../model/productModel')
const userBase = require('../model/userModel')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../model/userModel')
const bannerBase = require('../model/bannerModel')
const orderBase = require('../model/orderModel')
const whishListBase = require('../model/whishListModel')



const accountSid = "AC878fb142754211e8ca8725e740b14636";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VAe6f1d843c0f443981c86d3811cc2b68f";
const client = require("twilio")(accountSid, authToken);



const profile = async ( req , res ) => {
    try {
        const id = new mongoose.Types.ObjectId(req.session.userid)
        const user = await userBase.findById(id)
        // console.log(user);
        res.render('profile',{user})
    } catch (error) {
        console.log(error);
    }
}

const changeUserPassword = async ( req , res ) => {
    try {
        const id = new mongoose.Types.ObjectId(req.session.userid)
        const user = await userBase.findById(id)
        res.render('changeUserPassword',{user})
    } catch (error) {
        console.log(error);
        res.render('error')
    }
}

const submittingUserPassword = async ( req , res ) => {
    try {
       
        const id = req.session.userid
        const oldpassword = req.body.oldpassword
        console.log(oldpassword,"1111111111111");
        const password = req.body.newpassword
        console.log(password,"22222222221");

        const repassword = req.body.repassword
        const spassword = await securePassword(password)


        const user = await userBase.findById(id)
        const passwordMatch = await bcrypt.compare(oldpassword,user.password)

        if(passwordMatch){
            if(password === repassword){
                await userBase.findByIdAndUpdate({_id:id},{$set:{password:spassword}})
                res.render('changeUserPassword',{message : "Password changed Successfully....",user})
            }else{
                res.render('changeUserPassword',{message : "Re-enter valid password",user})
            }
        }else{
            res.render('changeUserPassword',{message : "Current  password is Incorrect",user})
        }

    } catch (error) {
        console.log(error);
        res.render('error')
    }
}


const logout = async (req,res) => {
    try {
        if(req.session.userid) {
            req.session.destroy()
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error);
        res.render('error')
    }
}

const loadTempHome = async (req,res) => {
    try {
        const category = await categoryBase.find()
        const product = await productBase.find({is_Listed:true}).limit(4)
        const banner = await bannerBase.find()
     //    console.log(category)
    
     // console.log(product,'ooo');
    
         res.render('tempHome',{category,product,banner})
    } catch (error) {
        res.render('error')
        
    }
}


// ==============secure=============================
const securePassword = async (password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
        res.render('error')

    }
}
// =============================================================================

const loadForgot = async (req,res) => {
    try {
        res.render('forgotpassword')
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}

const checkingMobileNo = async (req,res) => {
    try {
       const mobile = req.body.mobile
       const exist = await userBase.findOne({mobile:mobile});
    //    console.log(exist);
       if(exist) {
        client.verify.v2
        .services(verifySid)
        .verifications.create({ to: `+91${mobile}`, channel: "sms", })
        .then((verification) => {
            console.log(verification.status)
            req.session.userData = req.body;
    
    
            res.render('verifyOTP')
        })
        .catch((error) => {
            console.log(error.message)
        })
       }
       else {
        console.log("incorrect");
       }
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}




const verifyOtpForgot = async (req,res) => {
    try {
        let {otp}  = req.body;
        const userData = req.session.userData;
        client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: `+91${userData.mobile}`, code: otp })
        .then(async (verification_check) => { // Mark the callback function as async
            console.log(verification_check.status);
            if(verification_check.status==='approved'){
                res.render('settingNewPassword')
            }
            else {
                res.render('verifyOtpForPassword',{msg:"invalid otp"})
            }
           }).catch((error) => {
                console.log(error.message);
            });
    } catch (error) {
        console.log(error.message);
        res.render('error')

    }
}


const changePassword = async(req,res) => {
    try {
        const password = req.body.password
        const spassword = await securePassword(password)
        // console.log(password,"aaaaaaaa");
        const userData = req.session.userData
        await userBase.updateOne({mobile:userData.mobile},{$set:{password:spassword}})
        res.redirect('/login')
        
    } catch (error) {
     console.log(error.message); 
     res.render('error')

    }
}




const loadlogin = async (req,res) => {
    try {
        if (req.session.userid) {
            res.redirect('/home')
            // res.send("hello")
        }   
        else {
        res.render('userLogin')
        }
    }
    catch (error) {
        console.log(error);
        res.render('error')

    }
}

const verifyValidation = async(req,res)=>{
    
    const email =req.body.email
    const mobile = req.body.mobile
    req.session.mobile = mobile
    console.log(req.session.mobile);

    const check = await User.findOne({email:req.body.email})
    if(check){
        return res.render('userLogin',{msg:"user already exist!.. please login"})
    }

    client.verify.v2
    .services(verifySid)
    .verifications.create({ to: `+91${mobile}`, channel: "sms", })
    .then((verification) => {
        console.log(verification.status)
        req.session.userData = req.body;
        console.log(req.session.userData);

        res.render('verifyOTP')
    })
    .catch((error) => {
        console.log(error.message)
    })
}


const resendOTP = async ( req , res ) => {
    try {
        const mobile = req.session.mobile
        console.log(mobile);
        client.verify.v2
        .services(verifySid)
        .verifications.create({ to: `+91${mobile}`, channel: "sms", })
        .then((verification) => {
            console.log(verification.status)
            
    
    
            res.render('verifyOTP')
        })
            .catch((error) => {
                console.log(error.message)
            })
    } catch (error) {
        console.log(error);
    }
}








const verifyOtp = async (req, res) => {
    let { otp } = req.body;
   
    try {
        const userData = req.session.userData;

        if (!userData) {
            res.render('verifyOTP', { msg: 'Invalid Session' });
        } else {
            // Define an expiration time (30 seconds from the current time)
            const expirationTime = new Date(userData.otpCreatedAt);
            expirationTime.setSeconds(expirationTime.getSeconds() + 30);

            // Check if the OTP is still valid
            if (new Date() > expirationTime) {
                res.render('verifyOTP', { msg: 'OTP has expired' });
                return; // Exit the function
            }

            client.verify.v2
                .services(verifySid)
                .verificationChecks.create({ to: `+91${userData.mobile}`, code: otp })
                .then(async (verification_check) => {
                    console.log(verification_check.status);
                    if (verification_check.status === 'approved') {
                        const spassword = await securePassword(userData.password);
                        const user = new User({
                            username: userData.username,
                            email: userData.email,
                            mobile: userData.mobile,
                            password: spassword,
                            wallet : 0,
                            is_Listed: true,
                        });

                        try {
                            const userDataSave = await user.save();
                            if (userDataSave) {
                                res.redirect('/login');
                            } else {
                                res.render('login', { msg: "Registration Failed" });
                            }
                        } catch (error) {
                            console.log(error.message);
                            res.render('login', { msg: "Registration Failed" });
                        }
                    } else {
                        res.render('verifyOTP', { msg: "Invalid OTP" });
                    }
                }).catch((error) => {
                    console.log(error.message);
                });
        }
    } catch (error) {
        console.log(error);
        res.render('error');
    }
};



const verifyLogin = async (req,res)=>{
    try {
        const email = req.body.email
        const password = req.body.password
        const userData = await User.findOne({email:email})

        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password)
            if(passwordMatch){
                if(userData.is_Listed===true){
                req.session.userid = userData._id
                res.redirect('/home')
                }else{
                    res.render('userLogin',{msg:"you are blocked by admin"})
                } 
                
            }else{
                res.render('userLogin',{msg:"password is incorrect"})
            }
        }else{
            res.render('userLogin',{msg:"Invalid User"})
        }
        
    } catch (error) {
        console.log(error);
        res.render('error')

    }

}



const loadHome = async (req,res) => {
    try{
        const category = await categoryBase.find()
       const product = await productBase.find({is_Listed:true}).limit(4)
       const banner = await bannerBase.find()
       const user = await userBase.findById(req.session.userid)
       //    console.log(whishlists.product[0]);
    const whishlists = await whishListBase.findOne({user:req.session.userid})
    const whishlist = []
       if (whishlists) {
        for (let i = 0; i < whishlists.product.length; i++) {
            whishlist.push(await productBase.findById(whishlists.product[i]))
        } 
    }
        // console.log(whishlist);


    //    console.log(category)
    const id = new mongoose.Types.ObjectId(req.session.userid)
    let products = []
    let cart = await userBase.findById({_id:id},{cart:1,_id:0})       
    for ( let i = 0; i < cart.cart.length; i++) {
    products.push(await productBase.findById(cart.cart[i].product))  
    }
    // console.log(whishlist);
    // console.log(product,'ooo');
    // cart = cart.cart
    
   if (req.session) {
    if(req.session.checkOut == true) {
        
        for( let i = 0; i < products.length; i++) {
       let result = await productBase.findByIdAndUpdate({_id:products[i]._id},{ $inc: { stock: cart.cart[i].count } })  
        }
        req.session.checkOut = false
       
    } 
} 


        res.render('index',{category,product,products,banner,whishlist,user})
    }
    catch (error) {
        console.log(error)
        res.render('error')

    }
}



const searchProduct = async (req, res) => {
    try {
        const regexPattern = new RegExp(req.body['search-product'], 'i'); // 'i' flag for case-insensitive search
        const product = await productBase.find({ product_name: regexPattern });
        const category = await categoryBase.find()
        const user = await userBase.findById(req.session.userid)

        let products = []
        let cart = await userBase.findById(req.session.userid,{cart:1,_id:0})       
        for ( let i = 0; i < cart.cart.length; i++) {
        products.push(await productBase.findById(cart.cart[i].product))  
        }
       const banner = await bannerBase.find()
       const whishlists = await whishListBase.findOne({user:req.session.userid})
       const whishlist = []
       if (whishlists) {
        for (let i = 0; i < whishlists.product.length; i++) {
            whishlist.push(await productBase.findById(whishlists.product[i]))
        } 
    } 


        res.render('index', { product,category,products,banner,whishlist,user});
    } catch (error) {
        // Handle the error, e.g., log it or send an error response
        console.error(error);
        res.render('error')
       
    }
};


const loadOrderDetails = async (req , res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.session.userid)
        const order = await orderBase.find({user:id})
     
        let productDetailss = []
        let orderarr = []
        const fullorders = []
        const whishlists = await whishListBase.findOne({user:req.session.userid})
        const whishlist = []
           if (whishlists) {
            for (let i = 0; i < whishlists.product.length; i++) {
                whishlist.push(await productBase.findById(whishlists.product[i]))
            } 
        }

        for (let i = 0; i < order.length; i++) {
            for(let j = 0; j < order[i].productDetails.length; j++) {
                orderarr.push(order[i].productDetails[j])
                fullorders.push(order[i])
            productDetailss.push(await productBase.findById(order[i].productDetails[j].product))
            }

        }
    
        let products = []
        let cart = await userBase.findById({_id:id},{cart:1,_id:0})       
        for ( let i = 0; i < cart.cart.length; i++) {
        products.push(await productBase.findById(cart.cart[i].product))  
        }
        const user = await userBase.findById(req.session.userid)
        

      let  productDetails = productDetailss.reverse()
      let  orderar = orderarr.reverse()
      let fullorder = fullorders.reverse()
     



        // console.log(productDetails,"??????//");
        
        
        res.render('order-List',{productDetails,orderar,products,whishlist,user,fullorder})
        
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}

const verify = (req,res)=>{
    console.log(req.body);
   const crypto = require('crypto')
   let hmac = crypto.createHmac('sha256','FawYUz1dMjHVYWrf9ZEUjOXi')
   console.log(req.body['payment[razorpay_payment_id]'] ,'gggggggggggggg ');
   hmac.update(req.body['payment[razorpay_order_id]']+ '|'+ req.body['payment[razorpay_payment_id]']) 
   hmac = hmac.digest('hex')
   console.log(hmac);
   console.log(req.body['payment[razorpay_signature]']);
   
   if(hmac==req.body['payment[razorpay_signature]']){
    console.log('entrd');
    res.json({status:true})
   }else{
    console.log('elsee');
    res.json({status:false})
        }
    }


module.exports = {
    loadlogin,
    loadHome,
    searchProduct,
    verifyValidation,
    verifyOtp,
    verifyLogin ,
    logout,
    loadTempHome,
    loadForgot,
    checkingMobileNo,
    verifyOtpForgot,
    changePassword,
    loadOrderDetails,
    resendOTP,
    profile,
    changeUserPassword,
    submittingUserPassword
    


}