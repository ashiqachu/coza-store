const productBase = require('../model/productModel')
const categoryBase = require('../model/categoryModel')


const  loadAddProduct = async(req,res) => {
    try {
       const category = await categoryBase.find()
       if(req.session.admin) {

        res.render('add-product',{category})
       }
    } catch (error) {
        console.log(error)
        res.render('error')

    }
}

const loadProductList = async(req,res) =>{
    try {
        let category = []
        const product = await productBase.find()
        for (let i = 0; i < product.length; i++) {
         category.push(await categoryBase.findOne(product[i].category))
        }
        console.log(category[0].category_name);
        if(req.session.admin) {
        
        res.render('product-list',{product,category})
        }
    } catch (error) {
        console.log(error)
        res.render('error')

    }
}

const loadEditProduct = async (req,res) => {
    try {
        let image = []
        const id = req.query.id
       const product = await productBase.findById(id)
       for(let i = 0; i < product.image.length; i++) {
            image.push(product.image[i])
       }

       const category = await categoryBase.find()
       console.log(product)
       if(req.session.admin) {

       res.render('edit-product',{product,category,image}) 
       }
    } catch (error) {
        console.log(error );
        res.render('error')

        
    }
}

const submitingAddProduct = async (req,res) => {
    try {
       
        let image = []
        for(let i = 0; i < req.files.length; i++) {
        image.push(req.files[i].filename)
        }
        // console.log(image)
        const category = await categoryBase.findOne({category_name:req.body.category})
        // console.log(image)
        console.log(req.body.category) 
        
        const data = new productBase({
            product_name : req.body.product_name,
            price :req.body.price,
            offer_price : req.body.offer_price,
            stock : req.body.stock,
            description : req.body.description,
            image : image,
            category : category._id,
            is_Listed : true

        })
        await data.save()
        res.redirect('/admin/product')
      
    
    
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}

const submitingEdit = async (req,res) => {
    try {
    let image = []
    

    const id = req.query.id
    const product = await productBase.findById(id)

    for(let i = 0; i < product.image.length; i++) {
        image.push(product.image[i])
    }
    console.log(image);
    const category = await categoryBase.findOne({category_name:req.body.category})

   
    
    if(req.files) {
        
    for(let i = 0; i < req.files.length; i++) {
        image.push(req.files[i].filename)
        
    }
    const data = {
        product_name : req.body.product_name,
        price :req.body.og_price,
        offer_price : req.body.offer_price,
        stock : req.body.stock,
        description : req.body.description,
        image : image,
        category : category._id,
        is_Listed : true
    }
    console.log(data);
    await productBase.findByIdAndUpdate({_id:id},{$set:data})
    res.redirect('/admin/productlist')
}
    else {
       
        const data = {
            product_name : req.body.product_name,
            price :req.body.og_price,
            offer_price : req.body.offer_price,
            stock : req.body.stock,
            description : req.body.description,
            image : image,
            category : category._id,
            is_Listed : true
        }
        console.log(data);
    }
}
catch(error) {
    res.render('error')

}
}

const deleteImage = async (req,res) => {
    try {
    const id = req.query.id
    const i = req.query.i
    await productBase.findByIdAndUpdate(
        { _id:id }, // Find the document by its _id
        { $pull: { image: i} } // Remove all occurrences of the value 3 from myArray
      );
    //   res.redirect('/admin/editproduct')
    let image = []
    const id2 = req.query.id
   const product = await productBase.findById(id2)
   for(let i = 0; i < product.image.length; i++) {
        image.push(product.image[i])
   }

   const category = await categoryBase.find()
   console.log(product)
   if(req.session.admin) {

   res.render('edit-product',{product,category,image}) 
   }
}
catch (error) {
    res.render('error')

}
    
}


const isListedUnListed = async (req,res) => {
    try {
    const id = req.query.id
    // console.log(id)
    const product = await productBase.findById(id)
    // console.log(product);
    if(product.is_Listed == true) {
        console.log("if")
        await productBase.updateOne({_id:id},{$set:{is_Listed: false}})
    }
    else {
        console.log("else")
        await productBase.updateOne({_id:id},{$set:{is_Listed: true}})
    }
    res.redirect('/admin/productlist')
}
catch(error) {
    res.render('error')

}
}


module.exports = {
    loadAddProduct,
    submitingAddProduct,
    loadProductList,
    loadEditProduct,
    deleteImage,
    submitingEdit,
    isListedUnListed
}