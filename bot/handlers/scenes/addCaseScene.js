const { Scenes, Markup } = require("telegraf");
const { create_case } = require("../../../database/Request/Case");
const { is_admin } = require("../../../database/Request/User");
const { downloadFile } = require("./download");

const cancelKeyboard = Markup.keyboard([["❌ Отмена"]])
  .resize()
  .oneTime();

const addCaseWizard = new Scenes.WizardScene(
  "add-case-wizard",

  // 1. Проверка прав и запрос фото
  async (ctx) => {
    let chatId = ctx.from.id;
    let isAdmin = await is_admin(chatId);
    if (!isAdmin.success) {
      ctx.reply("⛔️ У вас нет прав!");
      return ctx.scene.leave();
    }

    await ctx.reply("📷 Пожалуйста, отправьте фото кейса:", cancelKeyboard);
    return ctx.wizard.next();
  },

  // 2. Получить фото и скачать
  async (ctx) => {
    if (ctx.message.text === "❌ Отмена") {
      await ctx.reply(
        "❗️ Добавление кейса отменено.",
        Markup.keyboard([["➕ Добавить кейс"], ["➖ Удалить кейс"]])
          .resize()
          .oneTime()
      );
      return ctx.scene.leave();
    }

    const photo = ctx.message?.photo?.pop();
    if (!photo) {
      await ctx.reply(
        "❌ Пожалуйста, отправьте изображение или нажмите ❌ Отмена."
      );
      return;
    }

    ctx.wizard.state.photo = photo.file_id;
    try {
      const filePath = await downloadFile(photo.file_id, ctx.telegram);
      console.log(filePath);
      ctx.wizard.state.photo = filePath;
    } catch (err) {
      await ctx.reply("❌ Не удалось сохранить фото.");
      return ctx.scene.leave();
    }

    await ctx.reply("✏️ Введите заголовок кейса:", cancelKeyboard);
    return ctx.wizard.next();
  },

  // 3. Заголовок
  async (ctx) => {
    if (ctx.message.text === "❌ Отмена") {
      await ctx.reply(
        "❗️ Добавление кейса отменено.",
        Markup.keyboard([["➕ Добавить кейс"], ["➖ Удалить кейс"]])
          .resize()
          .oneTime()
      );
      return ctx.scene.leave();
    }
    if (!ctx.message || typeof ctx.message.text !== "string") {
      await ctx.reply("❗️ Пожалуйста, введите текстовое название кейса.");
      return;
    }
    ctx.wizard.state.title = ctx.message.text;
    await ctx.reply("📝 Введите описание кейса:", cancelKeyboard);
    return ctx.wizard.next();
  },

  // 4. Сохранение
  async (ctx) => {
    if (ctx.message.text === "❌ Отмена") {
      await ctx.reply(
        "❗️ Добавление кейса отменено.",
        Markup.keyboard([["➕ Добавить кейс"], ["➖ Удалить кейс"]])
          .resize()
          .oneTime()
      );
      return ctx.scene.leave();
    }
    if (!ctx.message || typeof ctx.message.text !== "string") {
      await ctx.reply("❗️ Пожалуйста, введите текстовое описание кейса.");
      return;
    }
    ctx.wizard.state.description = ctx.message.text;

    const save = await create_case(ctx.wizard.state);
    console.log("✅ Кейс сохранён:", save);

    await ctx.reply(
      "✅ Кейс успешно добавлен!",
      Markup.keyboard([["➕ Добавить кейс"], ["➖ Удалить кейс"]])
        .resize()
        .oneTime()
    );
    return ctx.scene.leave();
  }
);

module.exports = addCaseWizard;
