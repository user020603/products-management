const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/product.controller");

router.get("/", controller.index); 

router.get("/edit", (req, res) => {
    res.send("<h1> Day la trang chinh sua </h1>");
});

module.exports = router;