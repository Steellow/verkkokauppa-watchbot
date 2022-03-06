const isVerkkokauppaUrl = (url) =>
  url.includes("verkkokauppa.com") && url.includes("/product/");

const isGiganttiUrl = (url) => url.includes("gigantti.fi/product");

const isValidProudctUrl = (url) => isVerkkokauppaUrl(url) || isGiganttiUrl(url);

// First one is for regular message, second is for inline button answer
const getUserId = (ctx) =>
  ctx?.update?.message?.from?.id || ctx?.update?.callback_query?.from?.id || 0;

const getChatId = (ctx) => ctx?.update?.message?.chat?.id;

const getVerkkokauppaProductTitle = (url) =>
  url.split("/").pop().replaceAll("-", " ");

const getGiganttiProductTitle = (url) =>
  url.split("/").slice(-2, -1)[0].replaceAll("-", " ");

const getProductTitle = (url) =>
  isVerkkokauppaUrl(url)
    ? getVerkkokauppaProductTitle(url)
    : getGiganttiProductTitle(url);

module.exports = {
  isValidProudctUrl,
  getUserId,
  getChatId,
  getProductTitle,
  isGiganttiUrl,
  isVerkkokauppaUrl,
};
