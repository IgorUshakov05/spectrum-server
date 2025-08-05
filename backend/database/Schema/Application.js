const mongoose = require("mongoose");
const { v4 } = require("uuid");

const ApplicationSchema = new mongoose.Schema({
  id: {
    type: String,
    default: v4(),
    require: true,
  },
  name_client: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  message: {
    type: String,
  },
  file: {
    type: String,
  },
});

const model = mongoose.model("Application", ApplicationSchema);
module.exports = model;
