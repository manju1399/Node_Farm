const http = require("http");
const fs = require("fs");
const url = require("url");

//FUNCTIONS
replaceTemplate=(tempCard,el)=>{
  let output=tempCard.replace(/{%PRODUCTNAME%}/g,el.productName)
  output=output.replace(/{%IMAGE%}/g,el.image)
  output=output.replace(/{%QUANTITY%}/g,el.quantity)
  output=output.replace(/{%IMAGE%}/g,el.image)
  output=output.replace(/{%FROM%}/g,el.from)
  output=output.replace(/{%NUTRIENTS%}/g,el.nutrients)
  output=output.replace(/{%PRICE%}/g,el.price)
  output=output.replace(/{%DESCRIPTION%}/g,el.description)
  output=output.replace(/{%ID%}/g,el.id)

  if(!el.organic){
    output=output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
  }
  return output
}

//sever

const data=fs.readFileSync(`${__dirname}/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const tempOverview=fs.readFileSync(`./templates/template_overview.html`, "utf-8");
const tempProduct=fs.readFileSync(`./templates/template_product.html`, "utf-8");
const tempCard=fs.readFileSync(`./templates/template_card.html`, "utf-8");


let server = http.createServer((req, res) => {
  const { query , pathname } = url.parse(req.url,true);

  //OVERVIEW PAGE
  if (pathname == "/" || pathname == "/overview") {
    res.writeHead(200,{'Content-type':'text/html'})

    const cardsHtml=dataObj.map(el => replaceTemplate(tempCard,el)).join('')
    const result=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)

    res.end(result);
  } 

  //PRODUCT PAGE
  else if (pathname == "/product") {
    res.writeHead(200,{'Content-type':'text/html'})
    const product=dataObj[query.id]
    const output=replaceTemplate(tempProduct,product)
    res.end(output);
  } 

  //API
  else if (pathname == "/api") {
   
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(data);
    ;
  } 
  //ERROR PAGE
  else {
    res.writeHead(404,{'Content-type':'text/html','my-own-header':'hello world'})
    res.end("<h1> Page not found ! </h1>");
  }
});

server.listen(8080, "127.0.0.1", () => {
  console.log(`running on port: 127.0.0.1:8080`);
});
