module.exports.createPost = (req, res) => {
  if (!req.body.title) {
    req.flash("error", `Vui long nhap tieu de!`);
    res.redirect(`back`);
    return;
  }

  if (req.body.title.length < 8) {
    req.flash("error", "Tiêu đề phải chứa ít nhất 5 ký tự!");
    res.redirect("back");
    return;
  }

  next();
};
