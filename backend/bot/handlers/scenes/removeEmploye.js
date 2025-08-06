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

    // Инициализируем массив для хранения message_id
    ctx.scene.session.employeeMessages = [];

    for (const user of users) {
      const text = `👤 <b>${user.fullname}</b>\n🛡 Роль: <i>${user.role}</i>`;
      const message = await ctx.reply(text, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🗑 Удалить",
                callback_data: `delete_user_${user.id}`,
              },
            ],
          ],
        },
        parse_mode: "HTML",
      });

      ctx.scene.session.employeeMessages.push(message.message_id);
    }
  }
);

// Обработка нажатия на кнопку "Удалить"
removeEmployeeWizard.action(/delete_user_(.+)/, async (ctx) => {
  const userId = ctx.match[1];
  await ctx.answerCbQuery();
  try {
    const result = await delete_user_by_id(userId);

    // Удаляем все сообщения со списком сотрудников
    if (ctx.scene.session.employeeMessages) {
      for (const msgId of ctx.scene.session.employeeMessages) {
        try {
          await ctx.deleteMessage(msgId);
        } catch (err) {
          // Игнорируем ошибку, если сообщение уже удалено
        }
      }
    }

    if (result.success) {
      await ctx.answerCbQuery("✅ Пользователь удалён", { show_alert: false });
      await ctx.reply("✅ Пользователь успешно удалён.", mainMenuKeyboard);
    } else {
      await ctx.answerCbQuery(`❌ Ошибка: ${result.message}`, {
        show_alert: true,
      });
    }
  } catch (e) {
    await ctx.answerCbQuery(`❌ Ошибка: ${e.message}`, { show_alert: true });
  }

  return ctx.scene.leave();
});

module.exports = removeEmployeeWizard;
