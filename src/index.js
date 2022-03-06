const { Telegraf } = require("telegraf");
const urlRegex = require("url-regex");
const util = require("./util");
const watchList = require("./watchList");
const watcher = require("./watcher");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  console.log("Bot started");
  ctx.reply("TODO: Bot instructions");
});

// Add url to watch list
bot.hears(urlRegex({ exact: true }), (ctx) => {
  const url = ctx.match[0];

  if (!util.isValidProudctUrl(url)) {
    ctx.reply("Please send valid verkkokauppa.com product url");
    return;
  }

  watchList.add(url, ctx);
});

const checkAllUrls = async () => {
  const urls = watchList.getUrlArray();

  for (const url of urls) {
    if (await watcher.checkAvailability(url)) {
      const productTitle = util.getProductTitle(url);

      const chatsToNotify = watchList.getProductWatchers(url);
      chatsToNotify.forEach((chatId) => {
        bot.telegram.sendMessage(
          chatId,
          `Product ${productTitle} is in stock!`
        );
      });

      // TODO: Delete url from list
    }
  }
};

setInterval(checkAllUrls, 60 * 1000);

//////////////////////////////////////////////

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
