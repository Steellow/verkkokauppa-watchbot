const randomUseragent = require("random-useragent");
const parser = require("node-html-parser");
const axios = require("axios");
const util = require("./util");
const puppeteer = require("puppeteer");
const asdf = require("util");

// Returns true if class is found
// Checks for class in every node '_rawText' field
const findRawText = (node, text) => {
  if (node?._rawText && node?._rawText.includes(text)) {
    console.log(`Found text ${text}!`);
    return true;
  }

  if (node?.childNodes.length > 0) {
    return node.childNodes.find((childNode) => findRawText(childNode, text));
  }

  return false;
};

const isProductInStock_static = (url, rawBody) => {
  const body = parser.parse(rawBody);
  let inStock = false;

  // console.log("--- RAW BODY ---");
  // console.log(rawBody);

  // console.log("--- BODY ---");
  // console.log(console.log(asdf.inspect(body, false, null, true)));

  if (util.isVerkkokauppaUrl(url)) {
    const element = body.querySelector(
      ".shipment-details .shipment-details__ready-for-shipment"
    );
    inStock = element.childNodes.length > 0;
  } else if (util.isGiganttiUrl(url)) {
    // Gigantti page loads content asyncrhonously, so we can't look for element with .unavailable--content which you can see in browser
    // Instead we need to loop through every element and look for 'Julkaisupäivää ei ole vahvistettu' text which seems to be the only thing which loads immediately
    const unavailable = findRawText(body, "Julkaisupäivää ei ole vahvistettu");
    inStock = !unavailable;
  }

  console.log(inStock ? "Product is in stock!" : "Product not in stock");
  return inStock;
};

const isProductInStock_SPA = async (url, page) => {
  let inStock = false;

  if (util.isPowerUrl(url)) {
    // Returns true if .stock-available element can be found
    inStock = await page
      .$eval(".stock-available", () => true)
      .catch(() => false);
  }

  console.log(inStock ? "Product is in stock!" : "Product not in stock");
  return false;
};

const getHeaders = () => ({
  headers: {
    "User-Agent": randomUseragent.getRandom(),
    Referer: "https://www.google.com/",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
  },
  timeout: 10 * 1000,
});

const isSPAPage = (url) => util.isPowerUrl(url);

const checkAvailability = async (url) => {
  console.log(`Checking product availability for ${url}`);

  try {
    if (isSPAPage(url)) {
      // User puppeteer when dealing with SPA page
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      const inStock = await isProductInStock_SPA(url, page);
      await page.close();
      await browser.close();
      return inStock;
    } else {
      // Use axios with static pages
      const response = await axios.get(url, getHeaders());
      if (response.status !== 200) {
        console.log(`Axios response ${response.status}, returning false`);
      }
      return isProductInStock_static(url, response.data);
    }
  } catch (e) {
    console.error(e);
  }

  console.log("Something went wrong in checkAvailability, returning false");
  return false;
};

module.exports = { checkAvailability };
