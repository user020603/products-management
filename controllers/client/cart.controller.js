const Cart = require("../../models/cart.model");

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  // res.send("OK");
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

  // console.log(cartId);

  try {
    const cart = await Cart.findOne({
      _id: cartId,
    });

    const existProductInCart = cart.products.find(
      (item) => item.product_id == productId
    );

    if (existProductInCart) {
      const newQuantity = quantity + existProductInCart.quantity;
      await Cart.updateOne(
        {
          _id: cartId,
          "products.product_id": productId,
        },
        {
          "products.$.quantity": newQuantity,
        }
      );
      req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!");
    } else {
      const objectCart = {
        product_id: productId,
        quantity: quantity,
      };

      await Cart.updateOne(
        {
          _id: cartId,
        },
        {
          $push: { products: objectCart },
        }
      );

      req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!");
    }
    res.redirect("back");
  } catch (error) {
    res.redirect("back");
  }
};
