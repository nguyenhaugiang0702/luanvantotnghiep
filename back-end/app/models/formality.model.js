const mongoose = require("mongoose");
const formalitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  createdAt: Date,
  updatedAt: Date,
});

const Formality = mongoose.model("Formality", formalitySchema);
module.exports = Formality;
