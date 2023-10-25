
const bannerBase = require('../model/bannerModel')
const mongoose = require('mongoose')


const loadBannerPage = async (req,res) => {
    try {
        res.render('add-Banner')
    } catch (error) {
        console.log(error);
        res.render('error')
    }
}

const addBanner = async (req,res) => {
    try {
        const data = new bannerBase ({
            banner :req.body.banner,
            banner_Logo : req.file.filename
        })
        await data.save()
        res.redirect('/admin')

    } catch (error) {
        console.log(error);
        res.render('error')

    }
}

const bannerList = async (req,res) => {
    try {
        const banner = await bannerBase.find()
        res.render('banner-List' , {banner})
    } catch (error) {
        res.render('error')
        
    }
}

const editBanner = async ( req , res ) => {
    try {
        id = new mongoose.Types.ObjectId(req.query.id)
        const banner = await bannerBase.findById(id)
        res.render('edit-Banner',{banner})

    } catch (error) {
        console.log(error);
    }
}

const editSubmiting = async ( req , res ) => {
    try {
        const id = req.query.id
        const banner = await bannerBase.findById(id)
        console.log(id);
        console.log(typeof(req.file));
        if (typeof(req.file) != "undefined") {
            const data = {
                banner : req.body.banner,
                banner_Logo : req.file.filename
            }
        await bannerBase.findByIdAndUpdate({_id : id} , {$set:data})

        }
        else {
            const data = {
                banner : req.body.banner,
                banner_Logo : banner.banner_Logo
            }
        await bannerBase.findByIdAndUpdate({_id : id} , {$set:data})

      
    }
        res.redirect('/admin/bannerlist')
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    loadBannerPage,
    addBanner,
    bannerList,
    editBanner,
    editSubmiting
}