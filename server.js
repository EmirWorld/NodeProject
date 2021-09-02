const http = require('http');
const fs = require('fs');
const url = require('url');

const replaceTemplate = require('./modules/replace-tamplate');

const slugify = require('slugify');


/*
* Catch JSON data
* */
const data = fs.readFileSync(
    `${__dirname}/public/data/MOCK_DATA.json`,
    'utf-8',
);
const dataObject = JSON.parse(data);

/*
* Call HTML templates
* */
const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8',
);
const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8',
);
const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8',
);

/*
* SLUGS
* */
// const slugs = dataObject.map((el) => slugify(el.productName, {lower: true}));
const slugs = dataObject.map((el) =>{
  return slugify(el.productName, {lower: true});
});
console.log(slugs);


/*
 * Server
 * */

// Replace Template with data
/**
 * @param {string} temp
 * @param {Object} product
 * @return {string} output
 */
// function replaceTemplate(temp, product) {
//
// }

const server = http.createServer((req, res) => {
  const {query, pathname} = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/home') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObject.map((el) => replaceTemplate(tempCard, el));
    const output = tempOverview.replace('{%PRODUCT_CARD%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page not Found!</h1>');
  }
});

const PORT = 8000;
server.listen(PORT, 'localhost', () => {
  console.log('server listening on port http://localhost:8000');
});
