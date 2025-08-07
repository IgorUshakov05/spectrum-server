const { Telegraf, session, Scenes } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const addCaseWizard = require("./handlers/scenes/addCaseScene");
const removeCaseWizard = require("./handlers/scenes/removeCaseScene");

const removeEmployeWizard = require("./handlers/scenes/removeEmploye");
const stage = new Scenes.Stage([
  addCaseWizard,
  removeEmployeWizard,
  removeCaseWizard,
]);

bot.use(session());

bot.use(stage.middleware());

require("./handlers/start")(bot);
require("./handlers/addAdmin")(bot);
require("./handlers/callBackQuery/index")(bot);
require("./handlers/addManager")(bot);

bot.hears("➕ Добавить кейс", (ctx) => ctx.scene.enter("add-case-wizard"));
bot.hears("➖ Удалить сотрудника", (ctx) =>
  ctx.scene.enter("remove-employee-wizard")
);
bot.hears("➖ Удалить кейс", (ctx) => ctx.scene.enter("remove-case-wizard"));

require("./handlers/text/index")(bot);

module.exports = bot;
