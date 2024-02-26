const md5 = require("md5");
const User = require("../../models/user.model");
const generateHelper = require("../../helpers/generate");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existedEmail = await User.findOne({
    email: req.body.email,
  });

  if (existedEmail) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);

  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  req.flash("success", "Đăng ký tài khoản thành công!");

  res.redirect("/");
};

// [GET] user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập",
  });
};

// [POST] user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  if (md5(password) !== user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }

  if (user.status !== "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }

  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng nhập thành công!");
  res.redirect("/");
};

// [GET] user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};

// [GET] user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

// [POST] user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  const otp = generateHelper.generateRandomNumber(6);
  // Việc 1: Lưu thông tin vào database
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expiresAt: Date.now(),
  };

  const record = new ForgotPassword(objectForgotPassword);
  await record.save();

  // Việc 2: Gửi mã OTP qua email
  const subject = `Mã OTP lấy lại lại mật khẩu`;
  const gifUrl = 'https://pa1.narvii.com/6516/c79feb51a0018d53c926b6c5314b403353c0eb97_hq.gif';
  const content = `Mã OTP của bạn là <b>${otp}</b>. Vui lòng không chia sẻ với bất cứ ai.<br><br><img src="${gifUrl}" alt="Your GIF">`;
  sendMailHelper.sendMail(email, subject, content);
  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    })
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const find = {
        email: email,
        otp: otp
    }

    const result = await ForgotPassword.findOne(find);

    if (!result) {
        req.flash("error", "OTP không hợp lệ!");
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email
    })

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  try {
    await User.updateOne({
      tokenUser: tokenUser
    }, {
      password: md5(password)
    });
    res.redirect("/")
  } catch(error) {
    res.redirect("/");
  }
}