const whishListBase = require('../model/whishListModel')
const userBase = require ('../model/userModel.js')
const productBase = require ('../model/productModel')
const mongoose = require ('mongoose')


const addWhishlist = async ( req , res ) => {
    try {
        // console.log("Hiiiiiiiii");
        const id = new mongoose.Types.ObjectId(req.body.id)
        const user = new mongoose.Types.ObjectId(req.session.userid)
        const exist = await whishListBase.aggregate([
            {
                $match: {
                    user: user
                }
            },
            {
                $unwind: "$product"
            },
            {
                $match: {
                    "product": id
                }
            }
        ]);
        console.log(exist);
        const hello = await whishListBase.findOne({user : user})
        if (exist.length != 0) {
            res.json({status : true})
        }
        
        else if(hello) {
           await whishListBase.updateOne(
                {
                    user: user, // Match the user
                    
                },
                {
                    $push: { "product": id } // Push the new ID to the "product" array
                }
            );
            res.json({status : true})
        }
        else {
        const data = new whishListBase ({
            user : user,
            product : id
        })
        console.log(data);
        await data.save()
        res.json({status : true})
    }
    } catch (error) {
        console.log(error);
    }
}

const deleteWhishlist = async ( req , res ) => {
    try {
        const user = new mongoose.Types.ObjectId(req.session.userid)
        const id = new mongoose.Types.ObjectId(req.body.id)
        await whishListBase.updateOne(
            {
                user: user, // Match the user
                
            },
            {
                $pull: { "product": id } // Push the new ID to the "product" array
            }
        );
        res.json({status : true})

    } catch (error) {
        console.log(error);
    }
}

const addToCart = async ( req , res ) => {
    try {
        const whishlist = await whishListBase.find()
        const product = []
        for (let i = 0 ; i < whishlist.length; i++) {
            product.push(await productBase.findById(whishlist[i].product))
        }
        for (let i = 0; i < whishlist.length; i++) {
        const data = await userBase.findByIdAndUpdate(
            { _id: req.session.userid },
            {
                $push: {
                    cart: {
                        product: whishlist[i].product,
                        count: 1,
                        total: product[i].offer_price
                    }
                }
            }
        )
        }
        await whishListBase.deleteMany({})
        res.redirect('/home')
    } catch (error) {
     console.log(error);   
    }
}





module.exports = {
    addWhishlist,
    deleteWhishlist,
    addToCart
}