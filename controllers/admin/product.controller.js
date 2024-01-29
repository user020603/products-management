// [GET] /admin/products

const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

module.exports.index = async (req, res) => {
    // console.log(req.query.status);

    const filterStatus = filterStatusHelper(req.query);


    let find = {
        deleted: false,
    }

    const objectSearch = searchHelper(req.query);
    // console.log(objectSearch);

    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    const products = await Product.find(find);

    // console.log(products);

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sach san pham",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    });
}