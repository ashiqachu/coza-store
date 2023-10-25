const userBase = require('../model/userModel')

const loadUser = async (req,res) => {
    try {
        const users = await userBase.find()
        if(req.session.admin) {

        res.render('page-users-list',{users})
        }
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}

const blockUser = async (req,res) => {
    try {
        const id = req.query.id
        const user = await userBase.findById(id)
        if(user.is_Listed === true) {
            await userBase.findByIdAndUpdate({_id:id},{$set:{is_Listed : false}})
            if(req.session.userid) {
                req.session.destroy()
                res.redirect('/admin/userlist')
            }
        }
        else {
            await userBase.findByIdAndUpdate({_id:id},{$set:{is_Listed : true}})

        }
        res.redirect('/admin/userlist')
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}



module.exports = {
    loadUser,
    blockUser
}