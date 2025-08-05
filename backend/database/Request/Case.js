const Case = require("../Schema/Case");
async function create_case({ photo, title, description }) {
  try {
    const newCase = new Case({
      photo,
      title,
      description,
    });
    await newCase.save();
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}

module.exports = { create_case };
