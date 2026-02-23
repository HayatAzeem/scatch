const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {genearteToken} = require('../utils/generateToken');


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
                    
                    let token = genearteToken(user);

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

    bcrypt.compare(password, user.password, function(err, result) {
        if(err) return res.send(err.message);
        else if(result) {
            let token = genearteToken(user);
            res.cookie("token", token);
            res.send("User logged in successfully");
        }
        else return res.send("Invalid password");
    });
}