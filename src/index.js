const { Telegraf } = require("telegraf");
const urlRegex = require("url-regex");
const util = require("./util");
const watchList = require("./watchList");
const watcher = require("./watcher");
const conzt = require("./constants");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  console.log(`User ${util.getUserId(ctx)} started the bot`);
  ctx.reply(conzt.message.welcome);
});

// Add url to watch list
bot.hears(urlRegex({ exact: true }), (ctx) => {
  const url = ctx.match[0];

  if (!util.isValidProudctUrl(url)) {
    ctx.reply("Please send valid product url");
    return;
  }

  watchList.add(url, ctx);
  ctx.reply(conzt.message.itemAdded);

  // Special message about Gigantti's 💩 website
  if (util.isGiganttiUrl(url)) {
    ctx.reply(conzt.message.itemAddedGigantti, { parse_mode: "HTML" });
  }
});

const checkAllUrls = async () => {
  const urls = watchList.getUrlArray();

  for (const url of urls) {
    if (await watcher.checkAvailability(url)) {
      const productTitle = util.getProductTitle(url);

      const chatsToNotify = watchList.getProductWatchers(url);
      if (!chatsToNotify) return;
      chatsToNotify.forEach((chatId) => {
        bot.telegram.sendMessage(
          chatId,
          `Product "${productTitle}" is in stock! I deleted it from the watchlist, if you want you can re-submit the link.`
        );
        bot.telegram.sendMessage(chatId, url);
      });

      watchList.removeUrl(url);
    }
  }
};

setInterval(checkAllUrls, 60 * 1000);

// For debugging purposes
bot.hears("/check", checkAllUrls);

//////////////////////////////////////////////

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
