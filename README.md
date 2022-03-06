# verkkokauppa-watchdog

Telegram bot to get alert when product is back in stock. Send product url to add it to watchlist

## Ideas (aka todo)

- Add link to the bot
- Clean code, hella ugly now
- Write proper documentation
- Add inline buttons to renew watcher or open website when in stock
- Ability to view & delete current items

## Stuff

- Using random useragent every time since 'request' agent is blocked
- Full product page URL is required, since verkkokauppa blogs requests if only the product ID is provided.

```
// robots.txt

# Disallow pages with only the product number

Disallow: /fi/product/_
Disallow: /fi/reviews/_

# Allow the ones with more than that

Allow: /fi/product/_/
Allow: /fi/reviews/_/

```
