const { Scenes, Markup } = require("telegraf");
const { remove_case_on_id } = require("../../../database/Request/Case");
const { is_admin } = require("../../../database/Request/User");

const cancelKeyboard = Markup.keyboard([["❌ Отмена"]])
  .resize()
  .oneTime();

const addCaseWizard = new Scenes.WizardScene(
  "remove-case-wizard",

  // 1. Проверка прав и запрос фото
  async (ctx) => {
    let chatId = ctx.from.id;
    let isAdmin = await is_admin(chatId);
    if (!isAdmin.success) {
      ctx.reply("⛔️ У вас нет прав!");
      return  ctx.scene.leave();
    }

    await ctx.reply("Вставьте ID кейса:", cancelKeyboard);
    return ctx.wizard.next();
  },

  // 2. Удаление
  async (ctx) => {
    if (ctx.message.text === "❌ Отмена") {
      await ctx.reply(
        "❗️ Удаление кейса отменено",
        Markup.keyboard([["➕ Добавить кейс"], ["➖ Удалить кейс"]])
          .resize()
          .oneTime()
      );
      return ctx.scene.leave();
    }
    if (!ctx.message || typeof ctx.message.text !== "string") {
      await ctx.reply("❗️ Пожалуйста, введите ID кейса");
      return;
    }
    let remove = await remove_case_on_id(ctx.message.text.trim());
    if (!remove.success) {
      await ctx.reply(remove.message);
      return;
    }

    await ctx.reply(
      "✅ Кейс успешно удален!",
      Markup.keyboard([["➕ Добавить кейс"], ["➖ Удалить кейс"]])
        .resize()
        .oneTime()
    );
    return ctx.scene.leave();
  }
);

module.exports = addCaseWizard;
