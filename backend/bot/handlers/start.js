const { Markup } = require("telegraf");
const { set_chat_id } = require("../../database/Request/Director");
const { find_user } = require("../../database/Request/User");
module.exports = (bot) => {
  bot.start(async (ctx) => {
    try {
      const userId = ctx.from.username;
      let userInDB = await find_user(ctx.chat.id);
      if (userInDB.user?.role === "admin") {
        return await ctx.reply(
          `Чем займемся сегодня?`,
          Markup.keyboard([["➕ Добавить кейс"], ["➖ Удалить кейс"]])
            .resize()
            .oneTime(),
          { parse_mode: "Markdown" }
        );
      }
      console.log(userInDB);
      const payload = ctx?.startPayload;
      console.log(payload);
      if (userId === process.env.DIRECTOR) {
        await set_chat_id(ctx.chat.id);
        return await ctx.reply(
          "👋 Добро пожаловать!\n\nВыберите одно из доступных действий:",
          Markup.keyboard([
            ["➕ Добавить менеджера"],
            ["➕ Добавить админа"],
            ["➖ Удалить сотрудника"],
          ])
            .resize()
            .oneTime()
        );
      }
      if (payload) {
        const decoded = Buffer.from(payload, "base64").toString("utf8");
        const params = new URLSearchParams(decoded);
        const code = params.get("code");
        const role = params.get("role");

        ctx.session.step = "waiting_fullname";
        ctx.session.code = code;
        ctx.session.role = role;
        return ctx.reply(
          "👤 Пожалуйста, введите *имя и фамилию* в одном сообщении:",
          { parse_mode: "Markdown" }
        );
      }
    } catch (e) {
      const errorMessage = e.message.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
      await ctx.reply(`Отправьте ошибку:\n\`\`\`js\n${errorMessage}\n\`\`\``, {
        parse_mode: "MarkdownV2",
      });
    }
  });
};
