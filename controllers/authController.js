const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/generateToken');
const productModel = require('../models/product-model');

module.exports.registerUser = async (req, res) => {
    try{
        let {email, password, fullname} = req.body;

        let user = await userModel.findOne({email: email});

        if(user) return res.send("User already exists");

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                if(err) return res.send(err.message);
                else {
                    let user = await userModel.create({
                    email,
                    password: hash,
                    fullname
                    });
                    
                    let token = generateToken(user);

                    res.cookie("token", token);
                    res.send("User registered successfully");
                }
            });
        });
    }
    catch(err){
        res.send(err.message);
    };
}

module.exports.loginUser = async (req, res) => {
    let {email, password} = req.body;

    let user = await userModel.findOne({email: email});

    if(!user) return res.send("User not found");

    bcrypt.compare(password, user.password, async function(err, result) {
        if(err) return res.send(err.message);
        else if(result) {
            let token = generateToken(user);
            res.cookie("token", token);
            let products = await productModel.find();
            res.render('shop',{products});
        }
        else return res.send("Invalid password");
    });
}

module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect('/');
}