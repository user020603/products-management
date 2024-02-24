const productRouters = require("./product.route.js");
const homeRouters = require("./home.route.js");
const searchRouters = require("./search.route.js");

const categoryMiddleware = require("../../middlewares/client/category.middleware.js");

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use("/", homeRouters);
    app.use("/products", productRouters);
    app.use("/search", searchRouters);
}