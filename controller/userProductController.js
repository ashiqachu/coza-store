const productBase = require('../model/productModel')
const categoryBase = require('../model/categoryModel')
const userBase = require ('../model/userModel')
const whishListBase = require('../model/whishListModel')
const mongoose = require ('mongoose')



 
const loadShop = async (req,res) => {
    try {
    const id = new mongoose.Types.ObjectId(req.session.userid)
    let page = parseInt(req.query.page);
    let limit = 4;
    let skip = page * 4
    const product = await productBase.find({is_Listed:true}).skip(skip).limit(limit)
    const category = await categoryBase.find()
    let products = []
    let cart = await userBase.findById({_id:id},{cart:1,_id:0})       
    for ( let i = 0; i < cart.cart.length; i++) {
    products.push(await productBase.findById(cart.cart[i].product))  
    }
    const whishlists = await whishListBase.find()
       
    const whishlist = []
    for (let i = 0; i < whishlists.length; i++) {
        whishlist.push(await productBase.findById(whishlists[i].product))
    } 
    const user = await userBase.findById(req.session.userid)
    res.render('product',{product,category,page,products,whishlist,user})
    }
    catch (error) {
        console.log(error);
        res.render('error')

    }
}

const lowTOHigh = async ( req, res ) => {
    try {
        let page = 0
        const product = await productBase.find().sort({price:1})
        let products = []
        let id = new mongoose.Types.ObjectId(req.session.userid)
        let cart = await userBase.findById({_id:id},{cart:1,_id:0})
        const user = await userBase.findById(req.session.userid)
       
        for ( let i = 0; i < cart.cart.length; i++) {
        products.push(await productBase.findById(cart.cart[i].product))  
        }
        const whishlists = await whishListBase.find()
       
        const whishlist = []
        for (let i = 0; i < whishlists.length; i++) {
            whishlist.push(await productBase.findById(whishlists[i].product))
        } 
        res.render('product',{product,page,products,whishlist,user})
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}


const highTOLow = async ( req, res ) => {
    try {
        let page = 0
        const product = await productBase.find().sort({price:-1})
        let products = []
        let id = new mongoose.Types.ObjectId(req.session.userid)
        let cart = await userBase.findById({_id:id},{cart:1,_id:0})
        const user = await userBase.findById(req.session.userid)
       
        for ( let i = 0; i < cart.cart.length; i++) {
        products.push(await productBase.findById(cart.cart[i].product))  
        }
        const whishlists = await whishListBase.find()
       
        const whishlist = []
        for (let i = 0; i < whishlists.length; i++) {
            whishlist.push(await productBase.findById(whishlists[i].product))
        } 
        // console.log(product);
        res.render('product',{product,page,products,whishlist,user})
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}





const searchProduct = async (req, res) => {
    try {
        let page = req.query.page
        let skip = page * 4
        let limit = 4
        const regexPattern = new RegExp(req.body['search-product'], 'i'); // 'i' flag for case-insensitive search
        const product = await productBase.find({ product_name: regexPattern });
        const category = await categoryBase.find().skip(skip).limit(limit)
        let products = []
        let id = new mongoose.Types.ObjectId(req.session.userid)
        let cart = await userBase.findById({_id:id},{cart:1,_id:0})       
        for ( let i = 0; i < cart.cart.length; i++) {
        products.push(await productBase.findById(cart.cart[i].product))  
        }
        const whishlists = await whishListBase.find()
       
        const whishlist = []
        for (let i = 0; i < whishlists.length; i++) {
            whishlist.push(await productBase.findById(whishlists[i].product))
        } 
        const user = await userBase.findById(req.session.userid)


        res.render('product', { product,category,page,products,whishlist,user });
    } catch (error) {
        // Handle the error, e.g., log it or send an error response
        console.error(error);
        res.status(500).send('Internal Server Error');
        res.render('error')

    }
};

const product_Details = async ( req,res ) => {
    try {
    const id = new mongoose.Types.ObjectId(req.query.id)
    const userid = new mongoose.Types.ObjectId(req.session.userid)
    const product = await productBase.findById(id)
    const user = await userBase.findById(userid)
    const categoryId = product.category
    // console.log(categoryId,"aaaaaa");
    const products = await productBase.find({category:categoryId})
    const whishlists = await whishListBase.find()



    let productss = []
    let cart = await userBase.findById({_id:userid},{cart:1,_id:0})       
    for ( let i = 0; i < cart.cart.length; i++) {
    productss.push(await productBase.findById(cart.cart[i].product))  
    }


  
    
    // console.log(products);
    const category = await categoryBase.findById(product.category)
    res.render('product-detail', { product,category,products,user,productss,whishlists})
    }
    catch (error) {
        console.log(error);
        res.render('error')

    }
}

const tempDetails = async (req,res) => {
    try {
        const id = req.query.id
        const product = await productBase.findById(id)
        const categoryId = product.category
        // console.log(categoryId,"aaaaaa");
        const products = await productBase.find({category:categoryId})
        // console.log(products);
        const category = await categoryBase.findById(product.category)
        res.render('tempdetail', { product,category,products })
        }
        catch (error) {
            console.log(error);
        res.render('error')

        }
}






module.exports = {
    loadShop,
    searchProduct,
    product_Details,
    lowTOHigh,
    highTOLow,
    tempDetails
    
    
}