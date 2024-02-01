// [GET] /admin/products

const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

module.exports.index = async (req, res) => {
    // console.log(req.query.status);

    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    }

    const objectSearch = searchHelper(req.query);
    // console.log(objectSearch);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    // Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        }, 
        req.query, 
        countProducts
    )
    // End pagination
    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
    // console.log(products);

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sach san pham",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({_id : id}, {status: status});
    res.redirect(`back`);
}