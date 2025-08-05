const Application = require("../Schema/Application");

async function create_application({
  name_client,
  phone,
  message = null,
  file = null,
}) {
  try {
    let newApplication = new Application({
      name_client,
      phone,
      message,
      file,
    });

    await newApplication.save();
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}

module.exports = { create_application };