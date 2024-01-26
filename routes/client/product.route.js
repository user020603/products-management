const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("client/pages/products/index.pug");
});

router.get("/edit", (req, res) => {
    res.send("<h1> Day la trang chinh sua </h1>");
});

module.exports = router;