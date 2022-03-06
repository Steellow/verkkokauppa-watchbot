const util = require("./util");

let urls = {};

const getUrlArray = () => Object.keys(urls);

const add = (url, ctx) => {
  const chatId = util.getChatId(ctx);

  if (!(url in urls)) {
    console.log(`Adding url ${url} to watch list`);
    urls = { ...urls, [url]: [] };
  }

  if (urls[url].includes(chatId)) {
    console.log(`Chat ${chatId} is already in the watch list`);
    return;
  }

  console.log(`Adding chat ${chatId} to ${url} watchers`);
  urls = { ...urls, [url]: [...urls[url], chatId] };
  console.log(urls);
};

const removeUrl = (url) => {
  console.log(`Removing ${url} from watch list`);
  urls = { url, ...urls };
};

const getProductWatchers = (url) => urls[url];

module.exports = { add, getUrlArray, getProductWatchers, removeUrl };
