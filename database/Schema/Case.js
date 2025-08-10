const mongoose = require("mongoose");
const { v4 } = require("uuid");

const CaseSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => v4(),
    unique: true,
  },
  photo: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Case", CaseSchema);
