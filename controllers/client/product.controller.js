const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);

  // console.log(newProducts);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sach san pham",
    products: newProducts,
  });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;

    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active"
    });

    console.log(product);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    res.redirect("/");
  }
}