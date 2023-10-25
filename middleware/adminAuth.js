const isLogin = (req,res,next) => {
    if(req.session.admin) {
        next()
    }
    else {
        res.redirect('/admin')
    }
} 


const isLogout = (req,res,next) => {
    if(req.session.admin) {
        req.session.destroy()
        res.redirect('/admin')
    }
    else {
        next()
    }
}


module.exports = {
    isLogin,
    isLogout
}