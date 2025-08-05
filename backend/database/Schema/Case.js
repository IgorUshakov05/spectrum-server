const mongoose = require("mongoose");
const { v4 } = require("uuid");

const CaseSchema = new mongoose.Schema({
  id: {
    type: String,
    default: v4(),
    require: true,
  },
  photo: {
    type: String,
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
});

const model = mongoose.model("Case", CaseSchema);
module.exports = model
