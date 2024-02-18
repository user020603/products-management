const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const generateHelper = require("../../helpers/generate");
const systemConfig = require(`../../config/system`);

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find).select("-password -token");
  // console.log(records);
  for (const record of records) {
    const role = await Role.findOne({
      deleted: false,
      _id: record.role_id,
    });
    record.role = role;
  }
  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Tài khoản",
    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  // console.log(req.body);
  req.body.password = md5(req.body.password);
  const record = new Account(req.body);
  // console.log(record);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
};
