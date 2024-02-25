const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();
    // res.clearCookies("cartId");
    const expire = 365 * 24 * 60 * 60 * 1000;
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expire),
    });
  }
  else {
    const cart = await Cart.findOne({
      _id: req.cookies.cartId
    })

    cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

    res.locals.cart = cart;
  }
  next();
};
