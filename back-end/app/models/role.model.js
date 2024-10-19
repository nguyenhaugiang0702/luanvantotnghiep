const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name:{
    type: String,
    require: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
});

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
