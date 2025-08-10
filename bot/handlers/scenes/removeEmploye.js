const { Scenes, Markup } = require("telegraf");
const {
  get_all_users,
  delete_user_by_id,
} = require("../../../database/Request/User");

const mainMenuKeyboard = Markup.keyboard([
  ["➕ Добавить менеджера"],
  ["➕ Добавить админа"],
  ["➖ Удалить сотрудника"],
])
  .resize()
  .oneTime();

const removeEmployeeWizard = new Scenes.WizardScene(
  "remove-employee-wizard",

  // Шаг 1: показать список сотрудников с кнопками удаления
  async (ctx) => {
    if (ctx.from.username !== process.env.DIRECTOR) {
      await ctx.reply(
        "🚫 У вас недостаточно прав для выполнения этого действия. Нажмите /start"
      );
      return ctx.scene.leave();
    }
    const users = await get_all_users();

    if (!users.length) {
      await ctx.reply("📭 Список сотрудников пуст.", mainMenuKeyboard);
      return ctx.scene.leave();
    }

    for (const user of users) {
      const text = `👤 <b>${user.fullname}</b>\n🛡 Роль: <i>${user.role}</i>`;

      const message = await ctx.reply(text, {
        parse_mode: "HTML",
      });

      await ctx.telegram.editMessageReplyMarkup(
        ctx.chat.id,
        message.message_id,
        null,
        {
          inline_keyboard: [
            [
              {
                text: "🗑 Удалить",
                callback_data: `delete_user_${user.id}_${message.message_id}`,
              },
            ],
          ],
        }
      );
    }

    return ctx.scene.leave();
  }
);

module.exports = removeEmployeeWizard;
