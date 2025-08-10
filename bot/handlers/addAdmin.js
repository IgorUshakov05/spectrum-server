const { create_manager_code } = require("../../database/Request/Code");

module.exports = (bot) => {
  bot.hears("➕ Добавить админа", async (ctx) => {
    try {
      if (ctx.from.username !== process.env.DIRECTOR)
        return await ctx.reply(
          "🚫 У вас недостаточно прав для выполнения этого действия. Нажмите /start"
        );
      const new_code = await create_manager_code("admin");

      if (!new_code.success) {
        throw new Error(new_code.message);
      }

      const payload = Buffer.from(`code=${new_code.code}&role=admin`).toString(
        "base64"
      );

      return await ctx.reply(
        `🔐 *Ссылка для регистрации администратора*\n\n` +
          `📩 *Перешлите это сообщение тому, кого хотите назначить администратором.*\n\n` +
          `📌 *Инструкция для администратора:*\n` +
          `1️⃣ Перейдите по [ссылке](https://t.me/spectrum_srm_bot?start=${payload}).\n` +
          `2️⃣ Следуйте инструкциям бота и завершите регистрацию.\n`,
        { parse_mode: "Markdown" }
      );
    } catch (e) {
      const errorMessage = e.message.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");

      await ctx.reply(`Отправьте ошибку:\n\`\`\`js\n${errorMessage}\n\`\`\``, {
        parse_mode: "MarkdownV2",
      });
    }
  });
};
