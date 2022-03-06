const util = require("./util");

let urls = {};

const getUrlArray = () => Object.keys(urls);

const add = (url, ctx) => {
  const chatId = util.getChatId(ctx);

  if (!(url in urls)) {
    console.debug(`Adding url ${url} to watch list`);
    urls = { ...urls, [url]: [] };
  }

  if (urls[url].includes(chatId)) {
    console.debug(`Chat ${chatId} is already in the watch list`);
    return;
  }

  console.debug(`Adding chat ${chatId} to ${url} watchers`);
  urls = { ...urls, [url]: [...urls[url], chatId] };
  console.log(urls);
};

const getProductWatchers = (url) => urls[url];

module.exports = { add, getUrlArray, getProductWatchers };
