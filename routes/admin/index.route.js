const dashboardRouters = require("./dashboard.route");
const productRouters = require("./product.route");
const systemCofig = require("../../config/system");
const productCategoryRouters = require("./product-category.route");
const roleRouters = require("./role.route");
const accountRouters = require("./account.route");
const authRouters = require("./auth.route");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const myAccountRouters = require("./my-account.route");;

module.exports = (app) => {
    const PATH_ADMIN = systemCofig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard", authMiddleware.requireAuth, dashboardRouters);
    app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRouters);
    app.use(PATH_ADMIN + `/products-category`, authMiddleware.requireAuth, productCategoryRouters);
    app.use(PATH_ADMIN + `/roles`, authMiddleware.requireAuth, roleRouters);
    app.use(PATH_ADMIN + `/accounts`, authMiddleware.requireAuth, accountRouters);
    app.use(PATH_ADMIN + `/auth`, authRouters);
    app.use(PATH_ADMIN + `/my-account`, authMiddleware.requireAuth, myAccountRouters);
}