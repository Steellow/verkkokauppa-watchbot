//////////////////
// URL MATCHERS //
//////////////////

const isVerkkokauppaUrl = (url) =>
  url.includes("verkkokauppa.com") && url.includes("/product/");

const isGiganttiUrl = (url) => url.includes("gigantti.fi/product");

// Products siime to have id in the url which is 'p-' and 6 or 7 digits
// Since I'm not sure how many digits it can actually be, I'm just matching anything with 5+ digits
const isPowerUrl = (url) => url.includes("power.fi") && url.match(/p-[0-9]{5}/);

const isValidProudctUrl = (url) =>
  isVerkkokauppaUrl(url) || isGiganttiUrl(url) || isPowerUrl(url);

////////////////////
// TITLE SCRAPERS //
////////////////////

const getVerkkokauppaProductTitle = (url) =>
  url
    .split("/")
    .filter((s) => s)
    .pop()
    .replaceAll("-", " ");

const getGiganttiProductTitle = (url) =>
  url
    .split("/")
    .filter((s) => s)
    .slice(-2, -1)[0]
    .replaceAll("-", " ");

const getPowerProductTitle = (url) =>
  url
    .split("/")
    .filter((s) => s)
    .slice(-2, -1)[0]
    .replaceAll("-", " ");

const getProductTitle = (url) =>
  isVerkkokauppaUrl(url)
    ? getVerkkokauppaProductTitle(url)
    : isGiganttiUrl(url)
    ? getGiganttiProductTitle(url)
    : getPowerProductTitle(url);

////////////////////
// TELEGRAF STUFF //
////////////////////

// First one is for regular message, second is for inline button answer
const getUserId = (ctx) =>
  ctx?.update?.message?.from?.id || ctx?.update?.callback_query?.from?.id || 0;

const getChatId = (ctx) => ctx?.update?.message?.chat?.id;

module.exports = {
  isValidProudctUrl,
  getUserId,
  getChatId,
  getProductTitle,
  isGiganttiUrl,
  isVerkkokauppaUrl,
  isPowerUrl,
};
