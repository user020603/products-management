const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/roles/
module.exports.index = async (req, res) => {
  const records = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records,
  });
};

// [GET] /admin/roles/create
module.exports.create = (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Thêm mới Nhóm quyền",
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  try {
    const record = new Role(req.body);
    await record.save();

    req.flash("success", "Thêm mới thành công!");

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };
    const data = await Role.findOne(find);
    // console.log(data);
    res.render("admin/pages/roles/edit", {
      pageTitle: "Sửa nhóm quyền",
      data: data,
    });
  } catch {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }
  res.redirect(`back`);
};

// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });

    req.flash("success", "Xóa quyền thành công!");
  } catch (error) {
    req.flash("error", "Xóa quyền thất bại!");
  }
  res.redirect(`back`);
};

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };
    const data = await Role.findOne(find);
    console.log(data);
    res.render("admin/pages/roles/detail", {
      pageTitle: "Sửa nhóm quyền",
      data: data,
    });
  } catch {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    const records = await Role.find(find);
    // console.log(records)
    res.render("admin/pages/roles/permissions", {
      pageTitle: "Phân quyền",
      records: records,
    });
  } catch {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);

    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }

    req.flash("success", "Cập nhật phân quyền thành công!");

    res.redirect("back");
  } catch (error) {
    req.flash("error", "Cập nhật phân quyền thất bại!");
  }
};
