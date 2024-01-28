const dashboardRouters = require("./dashboard.route");
const productRouters = require("./product.route");
const systemCofig = require("../../config/system");

module.exports = (app) => {
    const PATH_ADMIN = systemCofig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard", dashboardRouters);
    app.use(PATH_ADMIN + "/products", productRouters);
}