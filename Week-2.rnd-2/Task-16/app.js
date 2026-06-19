const http = require('http');



const getSales = () => new Promise(resolve => setTimeout(() => resolve(85000), 200));
const getExpenses = () => new Promise(resolve => setTimeout(() => resolve(32000), 300));
const getRefunds = () => new Promise(resolve => setTimeout(() => resolve(2000), 250));

const calcProfit = (sales, expenses, refunds) => new Promise(resolve => 
    setTimeout(() => resolve(sales - expenses - refunds), 200)
);

const calcTax = (profit) => new Promise(resolve => setTimeout(() => resolve(Math.round(profit * 0.18)), 150));

const formatReport = (profit, tax) => new Promise(resolve => 
    setTimeout(() => resolve({
        profit,
        tax,
        netAfterTax: profit - tax
    }), 100)
);


const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/aggregate') {
        console.time('aggregateTime');

        try {
      
            const [sales, expenses, refunds] = await Promise.all([
                getSales(),
                getExpenses(),
                getRefunds()
            ]);


            const profit = await calcProfit(sales, expenses, refunds);
            const tax = await calcTax(profit);
            const report = await formatReport(profit, tax);

            console.timeEnd('aggregateTime');

            const response = {
                sales,
                expenses,
                profit: report.profit,
                tax: report.tax,
                netAfterTax: report.netAfterTax,
                timeTaken: "approx " + Math.round(process.hrtime()[1]/1e6) + "ms" // optional approximate
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response, null, 2));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: err.message }));
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});


server.listen(3000, () => console.log('Server running at http://localhost:3000'));
