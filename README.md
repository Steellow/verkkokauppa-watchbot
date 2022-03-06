# verkkokauppa-watchdog

## Stuff

Full product page URL is required, since verkkokauppa blogs requests if only the product ID is provided.

```
// robots.txt

# Disallow pages with only the product number
Disallow: /fi/product/*
Disallow: /fi/reviews/*

# Allow the ones with more than that
Allow: /fi/product/*/
Allow: /fi/reviews/*/
```
