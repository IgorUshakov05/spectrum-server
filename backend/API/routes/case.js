const { Router } = require("express");
const router = Router();

const { get_all_case } = require("../../database/Request/Case");
router.get("/case/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Некорректный ID" });
    }

    return res.status(200).send(`../../storage/${id}`);
  } catch (error) {
    console.error(`Ошибка при получении кейса с ID ${id}:`, error.message);
    return res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});
router.get("/case", async (req, res) => {
  try {
    let limit = req.query.limit ? req.query.limit : 6;
    const cases = await get_all_case(limit);
    return res.status(200).json({ success: true, data: cases.all_case });
  } catch (error) {
    console.error("Ошибка при получении всех кейсов:", error.message);
    return res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

module.exports = router;
