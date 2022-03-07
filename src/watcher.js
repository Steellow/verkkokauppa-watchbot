const randomUseragent = require("random-useragent");
const parser = require("node-html-parser");
const axios = require("axios");
const util = require("./util");
const asdf = require("util");

// Returns true if class is found
// Checks for class in every node '_rawText' field
const findRawText = (node, className) => {
  if (node?._rawText && node?._rawText.includes(className)) {
    console.log(`Found class ${className}!`);
    return true;
  }

  if (node?.childNodes.length > 0) {
    return node.childNodes.find((childNode) =>
      findRawText(childNode, className)
    );
  }

  return false;
};

const isProductInStock = (url, rawBody) => {
  const body = parser.parse(rawBody);

  // console.log("--- RAW BODY ---");
  // console.log(rawBody);

  console.log("--- BODY ---");
  console.log(console.log(asdf.inspect(body, false, null, true)));

  if (util.isVerkkokauppaUrl(url)) {
    const element = body.querySelector(
      ".shipment-details .shipment-details__ready-for-shipment"
    );
    return element.childNodes.length > 0;
  } else if (util.isGiganttiUrl(url)) {
    // Gigantti page loads content asyncrhonously, so we can't look for element with .unavailable--content which you can see in browser
    // Instead we need to loop through every element and look for 'Julkaisupäivää ei ole vahvistettu' text which seems to be the only thing which loads immediately

    const unavailable = findRawText(body, "Julkaisupäivää ei ole vahvistettu");

    return !unavailable;
  }

  // TODO: Throw error here?
  return false;
};

const getHeaders = () => ({
  headers: {
    "User-Agent": randomUseragent.getRandom(),
    Referer: "https://www.google.com/",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
  },
  timeout: 10 * 1000,
});

const checkAvailability = async (url) => {
  console.log(`Checking product availability for url ${url}`);

  try {
    const response = await axios.get(url, getHeaders());

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
    // console.error("Axios request failed");
    console.error(e);
  }
  return false;
};

module.exports = { checkAvailability };
