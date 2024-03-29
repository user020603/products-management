const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
const Order = require("../../models/order.model");

// [GET] /checkout/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId,
  });
  cart.totalPrice = 0;

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const product = await Product.findOne({
        _id: item.product_id,
      }).select("thumbnail title slug price discountPercentage");

      product.priceNew = productsHelper.priceNewProduct(product);
      item.productInfo = product;
      item.totalPrice = item.quantity * product.priceNew;
      cart.totalPrice += item.totalPrice;
    }
  }

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};

// [POST] /checkout/order
module.exports.orderPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const infoUser = req.body;

  const orderInfo = {
    cart_id: cartId,
    userInfo: infoUser,
    products: [],
  };

  const cart = await Cart.findOne({
    _id: cartId,
  });

  for (const product of cart.products) {
    const infoProduct = await Product.findOne({
      _id: product.product_id,
    });
    const objectProduct = {
      product_id: product.product_id,
      price: infoProduct.price,
      discountPercentage: infoProduct.discountPercentage,
      quantity: product.quantity,
    };
    orderInfo.products.push(objectProduct);
  }
  const order = new Order(orderInfo);
  await order.save();

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      products: [],
    }
  );
  res.redirect(`/checkout/success/${order.id}`);
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  const orderId = req.params.orderId;

  const order = await Order.findOne({
    _id: orderId,
  });

  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");

    product.productInfo = productInfo;

    // console.log(product.productInfo);
    product.priceNew = productsHelper.priceNewProduct(product);

    product.totalPrice = product.priceNew * product.quantity;
  }

  order.totalPrice = order.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công!",
    order: order,
  });
};
