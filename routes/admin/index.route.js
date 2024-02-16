const dashboardRouters = require("./dashboard.route");
const productRouters = require("./product.route");
const systemCofig = require("../../config/system");
const productCategoryRouters = require("./product-category.route");
const roleRouters = require("./role.route");

module.exports = (app) => {
    const PATH_ADMIN = systemCofig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard", dashboardRouters);
    app.use(PATH_ADMIN + "/products", productRouters);
    app.use(PATH_ADMIN + `/products-category`, productCategoryRouters);
    app.use(PATH_ADMIN + `/roles`, roleRouters);
}