const jwt = require('jsonwebtoken');

module.exports = async (req,res,next) => {
    if(req.cookies.token) {
        req.flash("error", "You need to login first to access this page");
        res.redirect('/');
    }

    try{
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        let user = await userModel
        .findOne({email: decoded.email})
        .select("-password");//unselecting password field
        req.user = user;
        next();
    }
    catch(err){
        req.flash("error", "Invalid token, please login again");
        res.redirect('/login');
    }
}