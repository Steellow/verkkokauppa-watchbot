const randomUseragent = require("random-useragent");
const parser = require("node-html-parser");
const axios = require("axios");

const isProductInStock = (rawBody) => {
  const body = parser.parse(rawBody);
  const availability = body.querySelector(
    ".shipment-details .shipment-details__ready-for-shipment"
  );
  return availability.childNodes.length > 0;
};

const checkAvailability = async (url) => {
  console.log(`Checking product availability for url ${url}`);

  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": randomUseragent.getRandom() },
    });

    if (response.status !== 200) {
      // TODO: Handle errors
    }

    const inStock = isProductInStock(response.data);
    console.log(inStock ? "Product is in stock!" : "Product not in sotck");
    return inStock;
  } catch (e) {
    console.error(e);
  }
  return false;
};

module.exports = { checkAvailability };
