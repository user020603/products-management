const SettingGeneral = require("../../models/settings-general.model");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
    const settingsGeneral = await SettingGeneral.findOne({});
    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingsGeneral: settingsGeneral
    })
}

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
    const settingsGeneral = await SettingGeneral.findOne({});
    if (req.body.iframe) {
        let iframeCode = req.body.iframe;
        iframeCode = iframeCode.replace('<iframe ', '<iframe width="100%" height="450" ');
        req.body.iframe = iframeCode;
    }
    // console.log(req.body);
    if (settingsGeneral) {
        await SettingGeneral.updateOne({
            _id: settingsGeneral.id
        }, req.body)
    } else {
        const record = new SettingGeneral(req.body);
        await record.save();
    }
    res.redirect("back");
}