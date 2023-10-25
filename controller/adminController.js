const adminBase = require('../model/adminModel')
const userBase = require('../model/userModel')
const orderBase = require('../model/orderModel')
const productBase = require('../model/productModel')
const categoryBase = require('../model/categoryModel')

const loadadmin = (req,res) => {
   try {
    if(req.session.admin) {
        res.redirect('/admin/dashboard')
    }
    res.render('adminlogin')
   }
   catch (error) {
    console.log(error);
    res.render('error')

   }
}
const authentication = async (req,res) => {
    try {
    console.log(req.body.adminname)
    const user = await adminBase.findOne({name:req.body.adminname})
    // console.log(user.name);
    if(user.name == req.body.adminname) {
        if(user.password == req.body.password) {
            req.session.admin = user
            res.redirect('/admin/dashboard')
        }
        else{ 
            res.render('adminlogin',{msg:"password Incorrect"})
        }
    }
    else {
        res.render('adminlogin',{msg:"Invalid User"})

    }
}
catch(error) {
    res.render('error')

}
}

const loadAdminHome = async (req,res) => {
    try {
        if (req.session.admin) {
            const product = []
            const user = []
            const order = []
            const fullorder = []
            let total = 0
            const category = await categoryBase.find()
            const orderbase = await orderBase.find()
            const products = await productBase.find()
            for (let i = 0; i < orderbase.length; i++) {
                user.push(await userBase.findById(orderbase[i].user))
                for (let j = 0; j < orderbase[i].productDetails.length; j++) {
                    order.push(orderbase[i].productDetails[j])
                    fullorder.push(orderbase[i])
                    total = total + orderbase[i].total
                    product.push(await productBase.findById(orderbase[i].productDetails[j].product))
                }
            }



            // const orderlength = await orderBase.find()
        // const product = await Product.find()
        // const order = await Order.find({
        //     $or: [
        //       { payment_type: 'Wallet' },
        //       { payment_type: 'Razorpay' },
        //       {delivery_status: 'Delivered'}
        //     ]
        //   });

        //   console.log(orderlength.length,"orderlength");

          //chart report
          const monthlySales = await orderBase.aggregate([
            {
              $unwind: "$productDetails"
            },
            {
              $match: {
                "productDetails.status": "Delivered"
              }
            },
            {
              $group: {
                _id: {
                  $month: '$productDetails.date'
                },
                count: { $sum: 1 }
              }
            },
            {
              $sort: {
                '_id': 1
              }
            }
          ]);
          
        const monthlySalesArray = Array.from({ length: 12 }, (_, index) => {
            const monthData = monthlySales.find((item) => item._id === index + 1);
            return monthData ? monthData.count : 0;
        });
        console.log(monthlySalesArray,">>>>>");




        res.render('index',{order,product,user,fullorder,products,total,category,monthlySalesArray})
        }
        else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}

const adminLogout = async (req,res) => {
    try {
        if(req.session.admin) {
            req.session.destroy()
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}







module.exports = {
    loadadmin,
    loadAdminHome,
    authentication,
    adminLogout
    
   
}