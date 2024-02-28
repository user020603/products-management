const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require(`../../helpers/createTree`);
const Account = require("../../models/account.model");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const records = await ProductCategory.find({
    deleted: false,
  });

  for (const record of records) {
    const user = await Account.findOne({
      _id: record.createdBy.accountId,
    });

    if (user) {
      record.createdBy.fullName = user.fullName;
    }

    const updatedBy = record.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.accountId
      })
      if (userUpdated && userUpdated.fullName) {
        updatedBy.fullName = userUpdated.fullName;
      }
    }
  }

  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Thêm mới danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  const permissions = res.locals.role.permissions;

  if (permissions.includes("products-category_create")) {
    if (req.body.position == "") {
      const countRecords = await ProductCategory.countDocuments();
      req.body.position = countRecords + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
      accountId: res.locals.user.id,
      createdAt: new Date(),
    };

    const record = new ProductCategory(req.body);
    await record.save();

    req.flash("success", "Thêm mới danh mục sản phẩm thành công!");

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } else {
    res.send("403");
    return;
  }
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });

    const records = await ProductCategory.find({
      deleted: false,
    });

    const newRecords = createTreeHelper.tree(records);

    // console.log(data);
    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] /admin/products-category/editPatch/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.position = parseInt(req.body.position);

  const objectUpdatedBy = {
    accountId: res.locals.user.id,
    updatedAt: new Date()
  };

  await ProductCategory.updateOne(
    {
      _id: id,
      deleted: false,
    },
    {
      ...req.body,
      $push: {updatedBy: objectUpdatedBy}
    }
  );

  req.flash("success", "Cập nhật sản phẩm thành công!");



  res.redirect(`back`);
};

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteCategory = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id});
  await ProductCategory.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  res.redirect("back");
};

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;

  const category = await ProductCategory.findOne({
    _id: id,
    deleted: false,
  });

  // console.log(category)

  res.render("admin/pages/products-category/detail", {
    pageTitle: "Trang chi tiết danh mục",
    category: category,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const objectUpdatedBy = {
    accountId: res.locals.user.id,
    updatedAt: new Date()
  };
  const status = req.params.status;
  const id = req.params.id;
  await ProductCategory.updateOne({ _id: id }, { status: status, $push: { updatedBy: objectUpdatedBy } });

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect(`back`);
};
