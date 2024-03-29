const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    product_category_id: {
      type: String,
      default: "",
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    deletedBy: {
      accountId: String,
      deletedAt: Date
    },
    createdBy: {
      accountId: String,
      createdAt: Date,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    updatedBy: [
      {
        accountId: String,
        updatedAt: Date,
        fullName: String
      }
    ],
    featured: String,
    restoreAt: Date,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
