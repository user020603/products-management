const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
const productsCategoryHelper = require("../../helpers/products-category");
const ProductCategory = require("../../models/product-category.model");

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

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slugProduct;

    // console.log(slug);

    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });

    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        status: "active",
        deleted: "false",
      });
      product.category = category;
    }

    product.priceNew = productsHelper.priceNewProduct(product)

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect("/");
  }
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  // console.log(req.params)
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false,
  });
  if (category.id) {
    const allCategory = await productsCategoryHelper.getSubCategory(
      category.id
    );
    const allCategoryId = allCategory.map((item) => item.id);

    const products = await Product.find({
      product_category_id: {
        $in: [category.id, ...allCategoryId],
      },
      deleted: false,
    }).sort({ position: "desc" });

    // console.log(category)
    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: newProducts,
    });
  }
};
