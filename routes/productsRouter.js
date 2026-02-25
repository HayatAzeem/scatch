const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

router.post('/create',upload.single('image'), (req, res) => {
   try {
    let product = productModel.create({
        image: req.file.buffer,
        name: req.body.name,
        price: req.body.price,
        discount: req.body.discount,
        bgcolor: req.body.bgcolor,
        panelcolor: req.body.panelcolor,
        textcolor: req.body.textcolor
    });
    req.flash("success", "Product created successfully.");
    res.redirect('/owners/admin');
   }
    catch(err) {
        req.flash("error", err.message);
        res.redirect('/owners/admin');
    }
});

module.exports = router;