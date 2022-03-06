const isValidProudctUrl = (url) =>
  url.includes("verkkokauppa.com") && url.includes("/product/");

// First one is for regular message, second is for inline button answer
const getUserId = (ctx) =>
  ctx?.update?.message?.from?.id || ctx?.update?.callback_query?.from?.id || 0;

const getChatId = (ctx) => ctx?.update?.message?.chat?.id;

const getProductTitle = (url) => url.split("/").pop().replaceAll("-", " ");

module.exports = { isValidProudctUrl, getUserId, getChatId, getProductTitle };
