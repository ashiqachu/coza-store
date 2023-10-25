const categoryBase = require('../model/categoryModel')
const adminBase = require('../model/adminModel')
const productBase = require('../model/productModel')

const loadCategoryList = async (req,res) => {
    try {
        const category = await categoryBase.find()
        if(req.session.admin) {
        res.render('category-list',{category})
        }else{
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error)
        res.render('error')

    }
}

const loadCategoryAdd = (req,res) => {
    try {
        if(req.session.admin) {

        res.render('page-categories')
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        res.render('error')
        
    }
}

const addingNewCategory = async (req,res) => {
    try {
       const exist = await categoryBase.findOne({category_name:req.body.category_name})
       if(exist) {
        if(req.session.admin) {
        
        res.render('page-categories',{msg: "category is already exist"})
        }
       }
       else {
        const category = new categoryBase ({
            category_name: req.body.category_name,
            category_logo: req.file.filename,
            is_Listed:true
        })
        await category.save()
        res.redirect('/admin/category')
    }
    } catch (error) {
        console.log(error)
        res.render('error')

    }
}

const editCategory = async (req,res) => {
    try {
        const id = req.query.id
        const category = await categoryBase.findById(id)
        console.log(category);
        if(req.session.admin) {

        res.render('edit-category',{category})
        }
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}

const editCategorySubmiting = async (req,res) => {
    try {
    const id = req.query.id
    const exist = await categoryBase.findOne({category_name:req.body.category_name})
    if(exist) {
        const category = await categoryBase.findById(id)
        res.render('edit-category',{msg:"Already exist",category})
    }
    else {
    if(req.file) {
        const data = {
            category_name : req.body.category_name,
            category_logo : req.file.filename
        }
        console.log(data)
         await categoryBase.findByIdAndUpdate({_id:id},{$set:data})
         res.redirect('/admin/categorylist')
    }

    else {
       const category = await categoryBase.findById(id)
        const data = {
            category_name : req.body.category_name,
            category_logo : category.category_logo
        }
        await categoryBase.findByIdAndUpdate({_id:id},{$set:data})
        res.redirect('/admin/categorylist')
    }
}
}
catch(error) {
    console.log(error);
    res.render('error')

}
}

const listUnlist = async (req,res) => {
    try {
        const id = req.query.id
        const isList = await categoryBase.findById(id)
        console.log(isList.is_Listed)
        if (isList.is_Listed == true) {
           const category = await categoryBase.findByIdAndUpdate({_id:id},{$set:{is_Listed:false}})
            await productBase.updateMany({category:category._id},{$set:{is_Listed:false}})
        res.redirect('/admin/categorylist')

        }
        else {
           const category = await categoryBase.findByIdAndUpdate({_id:id},{$set:{is_Listed:true}})
            await productBase.updateMany({category:category._id},{$set:{is_Listed:true}})
        res.redirect('/admin/categorylist')


        }
        // res.redirect('/admin/categorylist')
       
    } catch (error) {
        res.render('error')
        
    }
}


module.exports = {
    loadCategoryAdd,
    addingNewCategory,
    loadCategoryList,
    editCategory,
    editCategorySubmiting,
    listUnlist
}