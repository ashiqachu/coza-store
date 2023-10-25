
const coupunBase = require('../model/coupunModel')


const loadAddCoupun = (req,res) => {
    try {
        res.render('add-coupun')
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}

const addCoupun = async (req,res) => {
    try {
        console.log(req.body);
        const data = new coupunBase ({
            code : req.body.code,
            start : req.body.start_date,
            expire : req.body.expire_date,
            discount : req.body.discount,
            is_Listed : true
        })
        await data.save()

    } catch (error) {
        console.log(error);
        res.render('error')

    }
}

const listCoupun = async (req,res) => {
    try {
        const coupun = await coupunBase.find()
        res.render('coupun-LIst' ,{coupun})
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}


const editCoupun = async (req,res) => {
    try {
        const id = req.query.id
        const coupun = await coupunBase.findById(id)
        res.render('add-coupun',{coupun})
    } catch (error) {
        res.render('error')
        
    }
}


const editSubmiting = async (req , res) => {
    try {
        const id = req.query.id
        const data = {
            code : req.body.code,
            start : req.body.start,
            expire : req.body.expire,
        }
        await coupunBase.findByIdAndUpdate ({_id:id},{$set:data})
        const coupun = await coupunBase.find()

        res.render('coupun-LIst',{coupun})
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}

const listUnlist = async (req,res) => {
    try {
        const id = req.query.id
       const coupun = await coupunBase.findById(id)
      if (coupun.is_Listed == true) {
        await coupunBase.findByIdAndUpdate({_id:id},{$set:{is_Listed:false}})
      }
      else {
        await coupunBase.findByIdAndUpdate({_id:id},{$set:{is_Listed:true}})
      }
      res.redirect('/admin/coupunlist')

    } catch (error) {
        console.log(error);
        res.render('error')

    }
}

module.exports = {
    loadAddCoupun,
    addCoupun,
    listCoupun,
    editCoupun,
    editSubmiting,
    listUnlist
}