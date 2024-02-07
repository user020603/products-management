const express = require('express');
const router = express.Router();
const multer = require("multer");
const storageMulter = require(`../../helpers/storageMulter`);
const upload = multer({ storage: storageMulter() });
const validate = require(`../../validates/admin/product.validate`);

const controller = require("../../controllers/admin/product.controller");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post("/create", upload.single("thumbnail"), validate.createPost, controller.createPost);

router.get("/bin", controller.bin);

router.patch("/bin/restore/:id", controller.restoreItem);

router.delete("/bin/delete-permanent/:id", controller.deletePermanent);

module.exports = router;