const isLogin = (req,res,next) => {
    if(req.session.userid) {
        next()
    }
    else {
        res.redirect('/login')
    }
} 


const isLogout = (req,res,next) => {
    if(req.session.userid) {
        res.redirect('/')
    }
    else {
        next()
    }
}

module.exports = {
    isLogin,
    isLogout
}
