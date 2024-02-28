const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: {
        type: Array,
        default: []
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      accountId: String,
      createdAt: Date
    },
    updatedBy: [
      {
        accountId: String,
        updatedAt: Date,
        fullName: String
      }
    ],
    deletedAt: Date,
    restoreAt: Date,
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;
