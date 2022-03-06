const request = require("request");
const randomUseragent = require("random-useragent");
const parser = require("node-html-parser");

//////////////
// SETTINGS //
//////////////

const intervalTime = 2 * 1000;

const testUrl =
  //   "https://www.verkkokauppa.com/fi/product/635767/Sony-PlayStation-5-Digital-Edition-PS5-pelikonsoli";
  "https://www.verkkokauppa.com/fi/product/699752/LG-OLED65A1-65-4K-Ultra-HD-OLED-televisio";

//////////////

const getAvailability = (rawBody) => {
  const body = parser.parse(rawBody);
  const availability = body.querySelector(
    ".shipment-details .shipment-details__ready-for-shipment"
  );
  return availability.childNodes.length > 0;
};

const checkAvailability = (url) => {
  const options = {
    url: url,
    headers: {
      "User-Agent": randomUseragent.getRandom(),
    },
  };

  request(options, (err, res, body) => {
    if (err) {
      console.error("ERROR OCCURED");
      console.error(err);
      return;
    }

    if (res.statusCode !== 200) {
      console.debug("Status code: " + res.statusCode);
      console.debug("Status message: " + res.statusMessage);
      return;
    }

    console.log(getAvailability(body));
  });
};

// setInterval(checkAvailability, intervalTime);
