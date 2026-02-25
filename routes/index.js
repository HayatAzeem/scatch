const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');

router.get('/', (req, res) => {
    let error = req.flash("error");
    res.render('index', { error, loggedIn: false });
});

// router.get("/", (req, res) => {
//   res.render("index", {
//     error: ""   // or null
//   });
// });

router.get('/shop', isLoggedIn, async function(req, res) {
    let product = await productModel.find();
    let success = req.flash("success");
    res.render('shop', {product, success});
});

router.get('/cart', isLoggedIn, async function(req, res) {
    let user = await userModel.findOne({ email : req.user.email }).populate('cart');
    const bill = (Number(user.cart[0].price)+20)-Number(user.cart[0].discount);
    res.render('cart', {user, bill});
});

router.get('/addtocart/:id', isLoggedIn, async function(req, res) {
    let user = await userModel.findOne({ email : req.user,email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Product added to cart");
    res.redirect('/shop');
});

module.exports = router;