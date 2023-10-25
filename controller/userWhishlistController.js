const whishListBase = require('../model/whishListModel')
const userBase = require ('../model/userModel.js')
const productBase = require ('../model/productModel')
const mongoose = require ('mongoose')


const addWhishlist = async ( req , res ) => {
    try {
        const id = new mongoose.Types.ObjectId(req.body.id)
        const exist = await whishListBase.findOne( {product : id} )
        if (exist) {

        }
        else {
        const data = new whishListBase ({
            product : id
        })
        await data.save()
        res.json({status : true})
    }
    } catch (error) {
        console.log(error);
    }
}

const deleteWhishlist = async ( req , res ) => {
    try {
        const id = new mongoose.Types.ObjectId(req.body.id)
        await whishListBase.findOneAndRemove({ product: id })
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