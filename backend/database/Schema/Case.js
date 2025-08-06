const mongoose = require("mongoose");
function generateFourDigitNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}

const CaseSchema = new mongoose.Schema({
  id: {
    type: String,
    default: generateFourDigitNumber(),
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
module.exports = model;
