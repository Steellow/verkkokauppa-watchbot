const randomUseragent = require("random-useragent");
const parser = require("node-html-parser");
const axios = require("axios");
const util = require("./util");

const isProductInStock = (url, rawBody) => {
  const body = parser.parse(rawBody);

  if (util.isVerkkokauppaUrl(url)) {
    const element = body.querySelector(
      ".shipment-details .shipment-details__ready-for-shipment"
    );
    return element.childNodes.length > 0;
  } else if (util.isGiganttiUrl(url)) {
    console.log("Includes");
    console.log(rawBody.includes("Tuote ei ole saatavilla juuri nyt"));

    const element = body.querySelector(".unavailable--content");
    console.log(element);
    return !element;
  }

  // TODO: Throw error here?
  return false;
};

const checkAvailability = async (url) => {
  console.log(`Checking product availability for url ${url}`);

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": randomUseragent.getRandom(),
        Referer: "https://www.google.com/",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
      },

      timeout: 10 * 1000,
    });

    if (response.status !== 200) {
      console.log("res not 200");
      // TODO: Handle errors
    } else {
      console.log("res 200");
    }

    const inStock = isProductInStock(url, response.data);
    console.log(inStock ? "Product is in stock!" : "Product not in stock");
    return inStock;
  } catch (e) {
    console.error(e);
  }
  return false;
};

module.exports = { checkAvailability };
