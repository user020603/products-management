// [GET] /admin/products

const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    // console.log(req.query.status);
    let filterStatus = [
        {
            name: "Tat ca", 
            status: "", 
            class: ""
        }, 
        {
            name: "Hoat dong", 
            status: "active", 
            class: ""
        }, 
        {
            name: "Dung hoat dong", 
            status: "inactive", 
            class: ""
        }
    ]
    
    if (req.query.status) {
        const index = filterStatus.findIndex(item => item.status == req.query.status);
        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active";
    }

    let find = {
        deleted: false,
    }
    if (req.query.status) {
        find.status = req.query.status;
    }

    const products = await Product.find(find);

    // console.log(products);

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sach san pham",
        products: products,
        filterStatus: filterStatus
    });
}