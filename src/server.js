require('dotenv').config();
var path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const finnhub = require('finnhub');

app.use(express.json());
app.use(morgan('short')); 

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

// Static files path for css and js files
app.use(express.static('src'));
// views path for finding the EJS templates
app.set('views', path.join(__dirname, '/client/views'));

app.use(cors());

app.listen(5000, () => {
    console.log('Example app listening on port 5000!');
});

/* app.get('/', (req, res) => {    
    res.sendFile('/client/views/index.html', { root: __dirname});  
}); */

// Empty object defined to store the API data received with the post request
// This get request gets executed whenever the page gets refreshed
app.get('/', (req, res) => {  
    /* let data = {name: "", country: "", ipo: "", finnhubindustry: "", weburl: ""};
    res.render('index.ejs', {data}); */
    let finalResult = [];
    finalResult.push({
        name: "", 
        country: "", 
        ipo: "", 
        finnhubindustry: "", 
        weburl: "", 
        ticker: "", 
        currency: ""
    },
    {
        c: ""    
    });

    res.render('index.ejs', {finalResult});

});

// Get stock data from the Finnnhub API based on user stock ticker input
app.post('/', (req, res) => {
    const stock_ticker = req.body.stock_id.toUpperCase();
    console.log('User input is ', stock_ticker);
     
// Finnhub API
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API; 
const finnhubClient = new finnhub.DefaultApi();

// Store all data received from finnhub API in an array
let finalResult = [];

// General data about the company
let companyProfile = () => {
    let promise = new Promise((res, rej) => {
        finnhubClient.companyProfile2({'symbol': stock_ticker}, (error, data, response) => {  
            console.log(data); 
            /* res.render('index.ejs', {data}); */
            res(finalResult.push(data));
        })
    });
    return promise;
};

// Actual stock price
let stockQuote = () => {
    let promise = new Promise((res, rej) => {
        finnhubClient.quote(stock_ticker, (error, data, response) => {
            res(finalResult.push(data));
        }); 
    });
    return promise;
};    

// Stock ticker of similar companies
let stockPeers = () => {
    let promise = new Promise((res, rej) => {
        finnhubClient.companyPeers(stock_ticker, (error, data, response) => {
            res(finalResult.push(data));
        }); 
    });
    return promise;
};  

// Stock price development at closing price over a timeframe
let stockCandles = () => {
    // Convert current date to Unix Timestamp
    let currentDate = new Date();
    let dateTimestamp = Math.trunc(currentDate/1000);
    
    console.log(currentDate);
    console.log(dateTimestamp);
    let promise = new Promise((res, rej) => {
        let timeframe = ['1', '5', '15', '30', '60', 'D', 'W', 'M'];
        finnhubClient.stockCandles(stock_ticker, timeframe[6],1577836800, dateTimestamp , {}, (error, data, response) => {
            res(finalResult.push(data.t, data.c));
        });
        //1594339200
    });
    return promise;
};  

// Basic financial data
let stockFinancials = () => {
    let promise = new Promise((res, rej) => {
        finnhubClient.companyBasicFinancials(stock_ticker, "margin", (error, data, response) => {
            res(finalResult.push(data));
        });
    });
    return promise;
};  
 
// Analyst stock recommendations
let stockRecommendation = () => {
    let promise = new Promise((res, rej) => {
        finnhubClient.recommendationTrends(stock_ticker, (error, data, response) => {
            res(finalResult.push(data[0]));
        });
    });
    return promise;
}; 

// Stock recommendation based on technical analysis
let stockTechnical = () => {
    let promise = new Promise((res, rej) => {
        finnhubClient.aggregateIndicator(stock_ticker, "D", (error, data, response) => {
        res(finalResult.push(data));
        });
    });
    return promise;
}; 

// Quarterly EPS
let stockEarnings= () => {
    let promise = new Promise((res, rej) => {
        finnhubClient.companyEarnings(stock_ticker, {'limit': 10}, (error, data, response) => {
        res(finalResult.push(data));
        });
    });
    return promise;
}; 

// Data send to the client after all promises are resolved
let sendToClient = () => {
    console.log(finalResult);
    test = 'hello'
    res.render('index.ejs', {finalResult})
    /* res.send(finalResult);  */
};  
 
companyProfile()
    .then(stockQuote)
    .then(stockPeers)
    .then(stockCandles)
    .then(stockFinancials)
    .then(stockRecommendation)
    .then(stockTechnical)
    .then(stockEarnings)
    .then(sendToClient); 
}); 

