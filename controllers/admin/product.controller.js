const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require(`../../config/system`);
const createTreeHelper = require("../../helpers/createTree");
const Account = require("../../models/account.model");

// [GET] /admin/products
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

  // Sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = `desc`;
  }
  // End Sort

  const products = await Product.find(find)
    .sort(sort)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItems);
  // console.log(products);

    for (const product of products) {
      const account = await Account.findOne({
        _id: product.createdBy.accountId
      });

      if(account) {
        product.createdBy.fullName = account.fullName;
      }
    }

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
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

  req.flash("success", "Cập nhật trạng thái thành công!");

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
      req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm!`);

      break;
    case "inactive":
      await Product.updateMany({ _id: ids }, { status: "inactive" });
      req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm!`);
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: ids },
        { deleted: true, deletedAt: new Date() }
      );
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm!`);
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
        `Cập nhật vị trí thành công ${ids.length} sản phẩm!`
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
  const category = await ProductCategory.find({
    deleted: false,
  });

  const newCategory = createTreeHelper.tree(category);
  // console.log(newCategory)
  res.render(`admin/pages/products/create`, {
    pageTitle: "Tạo mới sản phẩm",
    category: newCategory,
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
  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  req.body.createdBy = {
    accountId: res.locals.user.id,
    createdAt: new Date()
  };
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
    pageTitle: "Thùng rác",
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

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false,
    });
    const category = await ProductCategory.find({
      deleted: false,
    });
  
    const newCategory = createTreeHelper.tree(category);
    console.log(product);
    res.render(`admin/pages/products/edit`, {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file && req.file.filename) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    await Product.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body
    );

    req.flash("success", "Cập nhật sản phẩm thành công!");

    res.redirect(`back`);
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false,
    });
    // console.log(product);
    res.render(`admin/pages/products/detail`, {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};
