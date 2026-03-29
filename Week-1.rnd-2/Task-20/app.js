const { readFileSync } = require('fs');
const path = require('path');


const filePath = path.join(__dirname, 'products.json');


const data = readFileSync(filePath, 'utf8');


const products = JSON.parse(data);

console.log("Product List");


for (let i = 0; i < products.length; i++) {
    console.log(`${products[i].name} - $${products[i].price}`);
}