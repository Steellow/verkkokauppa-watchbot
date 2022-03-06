const { Telegraf } = require("telegraf");
const urlRegex = require("url-regex");
const util = require("./util");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("TODO: Bot instructions");
});

// Add url to watch list
bot.hears(urlRegex({ exact: true }), (ctx) => {
  console.log(ctx);
  if (!util.isValidProudctUrl(ctx.match[0])) {
    ctx.reply("Please send valid verkkokauppa.com product url");
    return;
  }
});

//////////////////////////////////////////////

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
