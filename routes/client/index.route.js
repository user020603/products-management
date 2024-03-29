const productRouters = require("./product.route.js");
const homeRouters = require("./home.route.js");
const searchRouters = require("./search.route.js");
const cartRouters = require("./cart.route.js");
const checkoutRouters = require("./checkout.route.js");
const userRouters = require("./user.route.js");
const chatRouters = require("./chat.route.js");

const settingMiddleware = require("../../middlewares/admin/setting.middleware.js");
const categoryMiddleware = require("../../middlewares/client/category.middleware.js");
const cartMiddleware = require("../../middlewares/client/cart.middleware.js");
const userMiddleware = require("../../middlewares/client/user.middleware.js");
const authMiddleware = require("../../middlewares/client/auth.middleware.js");

module.exports = (app) => {
    app.use(settingMiddleware.settingsGeneral);
    app.use(userMiddleware.infoUser);
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use("/", homeRouters);
    app.use("/products", productRouters);
    app.use("/search", searchRouters);
    app.use("/cart", cartRouters);
    app.use("/checkout", checkoutRouters);
    app.use("/user", userRouters);
    app.use("/chat",authMiddleware.requireAuth, chatRouters);
}