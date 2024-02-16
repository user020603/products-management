const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/roles/
module.exports.index = async (req, res) => {
  const records = await Role.find({
    deleted: false
  });

  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records
  });
}

// [GET] /admin/roles/create
module.exports.create = (req, res) => {
    res.render("admin/pages/roles/create", {
      pageTitle: "Thêm mới Nhóm quyền"
    });
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  try {
    const record = new Role(req.body);
    await record.save();
  
    req.flash("success", "Thêm mới thành công!");
  
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
  catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
}