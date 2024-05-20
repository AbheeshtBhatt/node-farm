const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');

//blocking,sync way

{
    // const text=fs.readFileSync('./txt/input.txt','utf-8');
    // console.log(text);
    // const textOut=`This is what we know about avacados: ${text}.\n Created on ${Date.now()}.`
    // fs.writeFileSync('./txt/output.txt',textOut);
    // console.log('Written successfully');
}

//non blocking,async way

// fs.readFile('./txt/inp.txt','utf-8',(err,data1)=>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         fs.writeFile('./txt/final.txt',`${data1}\n${data2}`,err=>{
//             console.log('Written done..');
//         })
//     })
// })
// console.log('Reading file...');
// console.log('still loading..');

///////////////////////////////////
//SERVERS

const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
);
const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
);
const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
// console.log(slugs);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    //overview
    if (pathname === '/overview' || pathname === '/') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj
            .map((el) => replaceTemplate(tempCard, el))
            .join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }

    //api
    else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);
    }

    //product
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }

    //error
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
        });
        res.end('<h2>Error</h2>');
    }
});

server.listen(8000, () => {
    console.log('Listening to requests on 8000');
});
