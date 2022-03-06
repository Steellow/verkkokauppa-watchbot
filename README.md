# verkkokauppa-watchdog

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
