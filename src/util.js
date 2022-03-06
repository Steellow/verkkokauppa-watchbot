const isValidProudctUrl = (url) =>
  url.includes("verkkokauppa.com") && url.includes("/product/");

module.exports = { isValidProudctUrl };
