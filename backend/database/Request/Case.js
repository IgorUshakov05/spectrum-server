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

async function get_all_case(limit) {
  try {
    const all_case = await Case.find({}).limit(limit);
    return await { success: true, all_case };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = { create_case, get_all_case };
