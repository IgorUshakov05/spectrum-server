const { Markup } = require("telegraf");
const { delete_user_by_id } = require("../../../../database/Request/User");
const {
  get_chat_id_director,
} = require("../../../../database/Request/Director");
module.exports = async function removeUser(ctx) {
  try {
    const callbackData = ctx.callbackQuery.data;

    if (ctx.from.username !== process.env.DIRECTOR) {
      await ctx.reply(
        "🚫 *Доступ запрещён*\n\nУ вас недостаточно прав для выполнения этого действия.\n\nВернитесь в главное меню с помощью команды /start.",
        { parse_mode: "Markdown" }
      );
      return;
    }

    const user_id = await callbackData.split("_").reverse()[1];
    const message_id = await callbackData.split("_").reverse()[0];
    let chat_id_director = await get_chat_id_director();
    if (!user_id) {
      await ctx.reply(
        "⚠️ *Ошибка ID*\n\nНе удалось определить ID пользователя для удаления.",
        { parse_mode: "Markdown" }
      );
      throw new Error("У пользователя нет ID при удалении");
    }
    const result = await delete_user_by_id(user_id);

    if (result.success) {
      await ctx.answerCbQuery("✅ Пользователь удалён", { show_alert: false });

      await ctx.telegram.editMessageText(
        chat_id_director.chat_id,
        parseInt(message_id),
        null,
        "✅ *Пользователь успешно удалён*\n\nВы можете продолжить работу:",
        {
          parse_mode: "Markdown",
          reply_markup: Markup.keyboard([
            ["➕ Добавить менеджера"],
            ["➕ Добавить админа"],
            ["➖ Удалить сотрудника"],
          ])
            .resize()
            .oneTime(),
        }
      );
    } else {
      console.log(result);
      await ctx.answerCbQuery(`❌ Ошибка: ${result.message}`, {
        show_alert: true,
      });
    }
  } catch (e) {
    const errorMessage = e.message.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
    await ctx.reply(
      `⚠️ *Произошла ошибка*\n\nОтправьте разработчику следующую информацию:\n\n\`\`\`js\n${errorMessage}\n\`\`\``,
      { parse_mode: "MarkdownV2" }
    );
    console.error(e);
  }
};
