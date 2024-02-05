// [GET] /admin/products

const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require(`../../config/system`);

module.exports.index = async (req, res) => {
  // console.log(req.query.status);

  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  const objectSearch = searchHelper(req.query);
  // console.log(objectSearch);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );
  // End pagination
  const products = await Product.find(find)
    .sort({ position: "desc" })
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItems);
  // console.log(products);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sach san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cap nhat trang thai thanh cong!");

  res.redirect(`back`);
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  // console.log(req.body);
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: ids }, { status: "active" });
      req.flash("success", `Cap nhat thanh cong ${ids.length} san pham!`);

      break;
    case "inactive":
      await Product.updateMany({ _id: ids }, { status: "inactive" });
      req.flash("success", `Cap nhat thanh cong ${ids.length} san pham!`);
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: ids },
        { deleted: true, deletedAt: new Date() }
      );
      req.flash("success", `Xoa thanh cong ${ids.length} san pham!`);
      break;
    case "change-position":
      // console.log(ids);
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateOne(
          { _id: id },
          {
            position: position,
          }
        );
      }
      req.flash(
        "success",
        `Cap nhat vi tri thanh cong ${ids.length} san pham!`
      );
      break;
    default:
      break;
  }

  res.redirect(`back`);
};

// [DELETE] /admin/products/deleteItem/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id});
  await Product.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render(`admin/pages/products/create`, {
    pageTitle: "Tao moi san pham",
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  // console.log(req.file);
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  // console.log(req.body);

  req.body.thumbnail = `/uploads/${req.file.filename}`;
  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/bin
module.exports.bin = async (req, res) => {
  let findBin = {
    deleted: true,
  };

  const productsBin = await Product.find(findBin);

  res.render("admin/pages/products/bin", {
    pageTitle: "Thung rac",
    products: productsBin,
  });
};

// [PATCH] /admin/products/bin/restore
module.exports.restoreItem = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne(
    { _id: id },
    { deleted: false, restoreAt: new Date() }
  );
  res.redirect(`back`);
};

// [DELETE] /admin/products/bin/delete-permanent
module.exports.deletePermanent = async (req, res) => {
  const id = req.params.id;
  await Product.deleteOne({ _id: id });
  res.redirect(`back`);
};
