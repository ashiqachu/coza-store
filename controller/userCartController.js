const productBase = require('../model/productModel')
const categoryBase = require('../model/categoryModel')
const userBase = require('../model/userModel')
const adrressBase = require('../model/adrressModel')
const coupunBase = require('../model/coupunModel')
const orderBase = require('../model/orderModel')
const whishListBase = require('../model/whishListModel')
const Razorpay = require('razorpay')
const easyinvoice = require('easyinvoice')
const {Readable} = require('stream')
const { default: mongoose } = require('mongoose')




const loadCart = async ( req, res ) => {
    try {
        let product = []
        let cart = await userBase.findById(req.session.userid,{cart:1,_id:0}) 
           
        for ( let i = 0; i < cart.cart.length; i++) {
        product.push(await productBase.findById(cart.cart[i].product))  
        }
        if(req.session.checkOut == true) {
            
            for( let i = 0; i < product.length; i++) {
           let result = await productBase.findByIdAndUpdate({_id:product[i]._id},{ $inc: { stock: cart.cart[i].count } })  
            }
            req.session.checkOut = false
           
        } 
        cart = cart.cart
        let total = 0
        for (let i = 0; i < cart.length; i++) {
            total = cart[i].total + total
        }
        const user = await userBase.findById(req.session.userid)
        const whishlists = await whishListBase.findOne({user:req.session.userid})
        const whishlist = []
           if (whishlists) {
            for (let i = 0; i < whishlists.product.length; i++) {
                whishlist.push(await productBase.findById(whishlists.product[i]))
            } 
        }
        res.render('shoping-cart',{product,cart,total,user,whishlist})
        
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}



const addToCart = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.body.productId);
        const count = parseInt(req.body.quantity);
        const product = await productBase.findById(id);
        const user = await userBase.findById(req.session.userid);

        // Use .equals for ObjectId comparison
        const exist = user.cart.find((item) => item.product.equals(product._id));

        if (exist) {
            console.log("Product already exists in the cart. You can't add it again.");
             await userBase.updateOne(
                {
                    _id: req.session.userid,
                    'cart.product': product._id // Match the specific cart item with the product ID
                },
                {
                    $inc: { 'cart.$.count': count ,'cart.$.total' : count * product.offer_price}, // Increment the count field of the matched cart item
                    // $set: { 'cart.$.total': count * product.offer_price }
                }
            );
        } else {
            const total = product.offer_price * count;

            // Update the user's cart by pushing the new item
            const data = await userBase.findByIdAndUpdate(
                { _id: req.session.userid },
                {
                    $push: {
                        cart: {
                            product: id,
                            count: count,
                            total: total
                        }
                    }
                }
            );
            res.json({status : true})

            console.log("Product added to cart successfully.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
        
        res.status(500).json({ error: "An error occurred while adding the product to the cart." });
    }
};




const deleteCart = async (req, res) => {
    try {
        const productid = new mongoose.Types.ObjectId(req.query.id);
        const userid = new mongoose.Types.ObjectId(req.session.userid);

        const updatedUser = await userBase.findOneAndUpdate(
            { _id: userid },
            { $pull: { cart: { product: productid } } },
            { new: true } 
        );
        res.redirect('/shoping-cart')

    
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "An error occurred while deleting the product from the cart." });
    }
};


const changeQuantity = async(req,res)=>{
    try {
      
        console.log(req.body,'kk');
        const id = new mongoose.Types.ObjectId(req.session.userid)
        const productId = new mongoose.Types.ObjectId(req.body.proId)
        const total = parseInt(req.body.total)
        const count = parseInt(req.body.quantity)

    
    await userBase.updateOne({_id:id,'cart.product':productId},{$set:{'cart.$.count':count,'cart.$.total':total}})

    res.json({status:true})
        
 
        
    } catch (error) {
        console.log(error.message);
        res.render('error')

    }
}


// ======================================================CHECKOUT===============================================


const loadCheckout = async (req,res) => {
    try {
       
        let product = []
        let total = 0
      
        const userId = new mongoose.Types.ObjectId(req.session.userid)

        let cart = await userBase.findById(req.session.userid,{cart:1,_id:0})

        let checkOut = await adrressBase.findOne({userId:userId})

    

        for ( let i = 0; i < cart.cart.length; i++) {
        product.push(await productBase.findById(cart.cart[i].product)) 
        total = cart.cart[i].total+total 
        }
        
        req.session.total = total
        let finalPrice = total


        
    for(let i = 0 ; i < cart.cart.length; i++) {
        let  balance = 0
          balance = product[i].stock - parseInt(cart.cart[i].count)
          await productBase.findByIdAndUpdate({_id:cart.cart[i].product},{$set:{stock:balance}})
      }
      let products = []
      for ( let i = 0; i < cart.cart.length; i++) {
      products.push(await productBase.findById(cart.cart[i].product))  
      }
     
      req.session.checkOut = true
        cart = cart.cart
        const user = await userBase.findById(userId)
        const whishlists = await whishListBase.findOne({user:req.session.userid})
        const whishlist = []
           if (whishlists) {
            for (let i = 0; i < whishlists.product.length; i++) {
                whishlist.push(await productBase.findById(whishlists.product[i]))
            } 
        } 
        res.render('checkout',{product,cart,total,checkOut,finalPrice,products,user,whishlist})
    } catch (error) {
        res.render('error')
        
    }
}


const coupunApply = async (req,res) => {
    try {
        console.log(req.body.coupon);
        const coupun = await coupunBase.findOne({code:req.body.coupon})
        console.log(coupun);
        if(coupun) {

      let lastTotal = req.session.total
      offer_price = (lastTotal * coupun.discount) / 100
      let finalPrice = lastTotal - offer_price
      req.session.total = finalPrice



      let product = []
      let products = []

      let total = 0
    
      const userId = new mongoose.Types.ObjectId(req.session.userid)

      let cart = await userBase.findById(req.session.userid,{cart:1,_id:0})

      let checkOut = await adrressBase.findOne({userId:userId}) 

      for ( let i = 0; i < cart.cart.length; i++) {
      product.push(await productBase.findById(cart.cart[i].product)) 
      total = cart.cart[i].total+total 
      }
      for ( let i = 0; i < cart.cart.length; i++) {
      products.push(await productBase.findById(cart.cart[i].product))  
      }
      cart = cart.cart
      

      res.render('checkout',{product,cart,total,checkOut,finalPrice,products})
    }
    else {
        console.log("else");
    }

    } catch (error) {
        console.log(error);
        res.render('error')

    }
}



const confirmCheckout = async (req , res) => {
    try {
    let cart = await userBase.findById(req.session.userid,{cart:1,_id:0})
   const userId = new mongoose.Types.ObjectId(req.session.userid)

    const exist = await adrressBase.findOne({userId:userId})
    const total = req.session.total
    // console.log(total,'>>>>>>>>>>>>>>>>>>>>..');

    if (!exist) {
        console.log(req.body);
    const data = new adrressBase ({
        userId:userId,
        country : req.body.country,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        adrress : req.body.adrress,
        mobile : req.body.mobile,
        PinCode : req.body.postcode
    })
    console.log(data);
    data.save()
}
else {
    const data = {
        userId:userId,
        country : req.body.country,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        adrress : req.body.adrress,
        mobile : req.body.mobile,
        PinCode : req.body.postcod
    }
    await adrressBase.updateOne({userId:userId},{$set:data})
}


    let product = []
    for(let i = 0; i < cart.cart.length; i++) {
        product.push(await productBase.findById(cart.cart[i].product))
    }
    const user = await userBase.findById(userId)
    

    res.render('payment',{total,user})
}
catch(error) {
    res.render('error')

}
}


const savingAdrress = async ( req, res ) => {
    try {
        console.log(req.body);
        const data = new adrressBase ({
            country : req.body.country,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            adress : req.body.adress,
            mobile : req.body.mobile,
            pinCode : req.body.postcode
        })
        await data.save()

    } catch (error) {
        console.log(error);
        res.render('error')

    }
}

// const proceedPayment = async (req,res)=>{
//     try {
//         console.log(req.body);
        
//     } catch (error) {
//         console.log(error.message);
//     }
// }


// ====================================ORDER===========

const COD = async ( req , res ) => {
    try {
      let cart = await userBase.findById(req.session.userid,{cart:1,_id:0})
      const id = new mongoose.Types.ObjectId(req.session.userid)
      cart = cart.cart
      console.log(cart);
      const address = await adrressBase.find({userId : id})
      const orderlist = await orderBase.findOne({user:id})
      const date = Date.now()
      const currentDate = new Date(date)
      console.log(address);


  
    let array = []
    for ( let i = 0; i < cart.length; i++) {
        array.push({...cart[i],status : "Pending", date : currentDate, method : "COD"})
    }
      data = new orderBase({
        user : id,
        productDetails : array,
        total : req.session.total,
        address : address
        
      })
      await data.save()
    
      await userBase.updateOne({ _id: id }, { $unset: { cart: 1 } });
      req.session.checkOut = false
      res.json({status : true})
    //   res.redirect('/home')
        
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}



const onlinePayment = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.session.userid)
        let cart = await userBase.findById(req.session.userid,{cart:1,_id:0})
        const address = await adrressBase.find({userId : id})

        cart = cart.cart
        const date = Date.now()
      const currentDate = new Date(date)
        let array = []
        for ( let i = 0; i < cart.length; i++) {
            array.push({...cart[i], status : "Pending", date : currentDate, method:"OnlinePayment" })
        }
          data = new orderBase({
            user : id,
            productDetails : array,
            total : req.session.total,
            address : address
            
          })
          await data.save()
      await userBase.updateOne({ _id: id }, { $unset: { cart: 1 } });

        const order = await orderBase.findOne({ user: id })

        var instance = new Razorpay({ key_id: 'rzp_test_eLOQJttQ4jsy2A', key_secret: 'zGKgcdGkMAYwZJUegszIkHOc' })

        // const razorpayOrder = await instance.orders.create({
        //     amount: order.total,
        //     currency: "INR",
        //     receipt: order._id,
        // });
        console.log(order,'oo')
        // console.log(req.body.total);
        console.log(order.id);
        let total = req.body.total*100
        let dollar = total * 70
        instance.orders.create({
            amount: dollar,
                currency: "INR",
               receipt: order._id,
          }).then((response)=>{ 
            console.log(response,'response');
            res.json({status:'razorpay',order:response,id:order._id,total:req.body.total})
            }).catch((error) => {
                console.log(error);
            })

        // console.log(razorpayOrder);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};


const cancelOrder = async ( req , res ) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.session.userid)
        const productId = new mongoose.Types.ObjectId(req.query.id)
        const status = "Cancel"
        const orderDetails = await orderBase.aggregate([
            {
              $match: {
                user: userId
              }
            },
            {
              $unwind: "$productDetails"
            },
            {
              $match: {
                "productDetails.product": productId
              }
            }
          ]);
          console.log(orderDetails);
          value = orderDetails[0].productDetails.count
          console.log(value);

          await productBase.findByIdAndUpdate(
            { _id: productId },
            { $inc: { stock: value } }
          )          
        await orderBase.updateOne(
            {
              user: userId, // Match the user ID
              'productDetails.product': productId // Match the specific product ID within the array
            },
            {
              $set: {
                'productDetails.$.status': status // Update the status field within the matched array element
              }
            }
          );
          res.redirect('/orderDetails')
    } catch (error) {
        console.log(error);
        res.render('error')
    }
}


const returnOrder = async ( req, res ) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.session.userid)
        const productId = new mongoose.Types.ObjectId(req.query.id)
        const status = "Return"
        const userr = await userBase.findById(userId)
        const order = await orderBase.aggregate([
            {
                $match: {
                    user: userId
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $match: {
                    "productDetails.product": productId
                }
            }
        ]);
        const value = order[0].productDetails.total + userr.wallet
        const user = await userBase.findByIdAndUpdate(userId, { $set: { wallet: value } });
        
        await orderBase.updateOne(
            {
              user: userId, // Match the user ID
              'productDetails.product': productId // Match the specific product ID within the array
            },
            {
              $set: {
                'productDetails.$.status': status // Update the status field within the matched array element
              }
            }
          );

          res.redirect('/orderDetails')

    } catch (error) {
        console.log(error);
    }
}

const  verify = (req,res)=>{
    console.log(req.body);
   const crypto = require('crypto')
   let hmac = crypto.createHmac('sha256','FawYUz1dMjHVYWrf9ZEUjOXi')
   console.log(req.body['payment[razorpay_payment_id]'] ,'gggggggggggggg ');
   hmac.update(req.body['payment[razorpay_order_id]']+ '|'+ req.body['payment[razorpay_payment_id]']) 
   hmac = hmac.digest('hex')
   console.log(hmac);
   console.log(req.body['payment[razorpay_signature]']);
   
  
    res.json({status:true})
  
}


    // =======================ORDER===================

    const orderDetails = async ( req , res ) => {
        try {
            const orderId = new mongoose.Types.ObjectId(req.query.orderId)
           const productId =new mongoose.Types.ObjectId(req.query.productId)
            const order = await orderBase.aggregate([
                {
                  $match: {
                    _id: orderId
                  }
                },
                {
                  $unwind: "$productDetails"
                },
                {
                  $match: {
                    "productDetails.product": productId // Use "productDetails.product" to match the product field within the productDetails array
                  }
                }
              ]);
              const product = await productBase.findById(order[0].productDetails.product)
              const user = await userBase.findById(order[0].user)
           
              res.render('user-Order-Details',{order,product,user})
              
        } catch (error) {
            console.log(error);
        }
    }


    const downloadInvoice = async (req, res) => {
        try {
                const id = new mongoose.Types.ObjectId(req.query.id)
                const productId = new mongoose.Types.ObjectId(req.query.proId)
                const userId = new mongoose.Types.ObjectId(req.session.userid)
                // console.log(id);
                // console.log(productId);
                // console.log(userId);
                const result = await orderBase.aggregate([
                    {
                      $match: {
                        _id: id
                      }
                    },
                    { 
                      $unwind: "$productDetails"
                    },
                    {
                      $match: {
                        "productDetails.product": productId
                      }
                    }
                  ]);
                   
                const user = await userBase.findById({ _id: userId }); 
                const orderProduct = await productBase.findById(productId)     
                const address = result[0].address[0]
                // console.log(result,"result");
                // console.log(user,"user");
                // console.log(result[0].address[0],"adress");
                const order = {
                  id: id,
                  total: result[0].total, 
                  date: result[0].productDetails.date, // Use the formatted date
                  paymentMethod: result[0].productDetails.method,
                  orderStatus: result[0].productDetails.status,
                  name: address.firstName,
                  number:address.mobile,
                  house:address.adrress,
                  pincode: address.PinCode,
                //   town: result.order_address.city,
                //   state: result.order_address.state,
                  product: result[0].productDetails,
                };
                // console.log(order,'||||||||||||||||||||||||');

                //set up the product
                let oid = new mongoose.Types.ObjectId(id)
                // let Pname =  result.product_details.product_name
                    
                const products =[{
                        quantity: parseInt(result[0].productDetails.count),
                        description: orderProduct.product_name,
                        price: orderProduct.offer_price,
                        total: parseInt(result[0].productDetails.total),
                        "tax-rate": 0,

                      }];

                    //   console.log(products,"-----------");
                
                
               
                      
                const isoDateString = order.date;
                const isoDate = new Date(isoDateString);
            
                const options = { year: "numeric", month: "long", day: "numeric" };
                const formattedDate = isoDate.toLocaleDateString("en-US", options);
                const data = {
                  customize: {
                    //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
                  },
                  images: {
                    // The invoice background
                    background: "",
                  },
                  // Your own data
                  sender: {
                    company: "COZA STORE",
                    address: "Feel Your Spirit",
                    city: "Bangalore",
                    country: "India"
                  },
                  client: {
                    company: "Customer Address",
                    "zip": order.name,
                    // "city": order.town,
                    "address": order.house,
                    // "custom1": "custom value 1",
                    // "custom2": "custom value 2",
                    // "custom3": "custom value 3"
                  },
                  information: {
                    number: "order" + order.id,
                    date: result[0].productDetails.date.toLocaleDateString(),
                  },
                  products: products,
                  "bottom-notice": "Happy shoping and visit COZASTORE",
                };
                // console.log(data,"2222222222222");

            let pdfResult = await easyinvoice.createInvoice(data);
                const pdfBuffer = Buffer.from(pdfResult.pdf, "base64");
                // console.log(pdfResult+"?????????");
            
                // Set HTTP headers for the PDF response
                res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
                res.setHeader("Content-Type", "application/pdf");
            
                // Create a readable stream from the PDF buffer and pipe it to the response
                const pdfStream = new Readable();
                pdfStream.push(pdfBuffer);
                pdfStream.push(null);
            
                pdfStream.pipe(res);
              } catch (error) {
                console.log(error);
                res.status(500).json({ error: error.message });
              }
      
    };



module.exports = {
    addToCart,
    loadCart,
    deleteCart,
    changeQuantity,
    loadCheckout,
    confirmCheckout,
    savingAdrress,
    coupunApply ,
    COD,
    onlinePayment,
    cancelOrder,
    returnOrder,
    verify,
    orderDetails,
    downloadInvoice
}