const Product = require("../../models/product.model");

const productHelper = require("../../helpers/products");

// [GET] /search/
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");

    const products = await Product.find({
        title: keywordRegex,
        status: "active", 
        deleted: false
    })

    const newProducts = productHelper.priceNewProducts(products);

    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts
      });
  }
  else res.redirect("back");

};
