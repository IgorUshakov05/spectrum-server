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

async function remove_case_on_id(id) {
  try {
    let remove = await Case.findOneAndDelete({ id });
    if (!remove) return { success: false, message: "🔍 Кейс не найден" };
    return { success: true, case: remove };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function get_all_case(limit) {
  try {
    let all_case;
    if (!limit) {
      all_case = await Case.find({});
    } else {
      all_case = await Case.find({}).limit(limit);
    }
    return await { success: true, all_case };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = { create_case, get_all_case, remove_case_on_id };
