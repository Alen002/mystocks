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

/* Global Variables - Finnhub API */
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API; 
const finnhubClient = new finnhub.DefaultApi();

// Empty object defined to store the API data received with the post request
// This get request gets executed whenever the page gets refreshed
app.get('/', (req, res) => {  
    finalResult = [{}, {}];    
    res.render('index.ejs', {finalResult});
});

app.get('/news', (req, res) => { 
    // Store news data received from finnhub API in an array
    compNews = [[]];
     
    for (i = 0; i < 200; i++) {
        compNews[0].push({});
    }
    console.log(compNews);
    res.render('news.ejs', {compNews});
});

// Receive related news data for a stock based on the stock ticker entered by the user
app.post('/news', (req, res) => { 
    const stock_ticker = req.body.stock_id.toUpperCase();
    console.log('User input is ', stock_ticker);

    // Store all data received from finnhub API in an array
    let compNews = [];
    
    // convert date 
    let currentDate = new Date().toJSON().slice(0,10)
    console.log(currentDate);
  
    // News data from finnhub
    let companyNews = () => {
        let promise = new Promise((res, rej) => {
            finnhubClient.companyNews(stock_ticker, "2020-01-01", currentDate, (error, data, response) => {  
                console.log('server: ', data); 
                res(compNews.push(data));
            })
        });
        return promise;
    };
   
    let sendToClient = () => {
        console.log('The following news: ',compNews);
        /* res.send({compNews}); */
        res.render('news.ejs', {compNews});
    }; 

    companyNews()
        .then(sendToClient);    
});


// Get stock data from the Finnnhub API based on user stock ticker input
app.post('/', (req, res) => {
        const stock_ticker = req.body.stock_id.toUpperCase();
        console.log('User input is ', stock_ticker);

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

    // Stock price development at closing price over a timeframe DAY
    let stockCandlesDay = () => {
        // Convert current date to Unix Timestamp
        let currentDate = new Date();
        let dateTimestamp = Math.trunc(currentDate/1000);

        console.log(currentDate);
        console.log(dateTimestamp);
        let promise = new Promise((res, rej) => {
            //let timeframe = ['1', '5', '15', '30', '60', 'D', 'W', 'M'];
            finnhubClient.stockCandles(stock_ticker, 'D', 1577836800, dateTimestamp , {}, (error, data, response) => {
                res(finalResult.push(data.t, data.c)); 
            });
        });
        return promise;
    }; 

    // Stock price development at closing price over a timeframe WEEK
    let stockCandlesWeek = () => {
        // Convert current date to Unix Timestamp
        let currentDate = new Date();
        let dateTimestamp = Math.trunc(currentDate/1000);

        console.log(currentDate);
        console.log(dateTimestamp);
        let promise = new Promise((res, rej) => {
            //let timeframe = ['1', '5', '15', '30', '60', 'D', 'W', 'M'];
            finnhubClient.stockCandles(stock_ticker, 'W',1577836800, dateTimestamp , {}, (error, data, response) => {
                res(finalResult.push(data.t, data.c)); 
            });
        });
        return promise;
    }; 

    // Stock price development at closing price over a timeframe MONTH
    let stockCandlesMonth = () => {
        // Convert current date to Unix Timestamp
        let currentDate = new Date();
        let dateTimestamp = Math.trunc(currentDate/1000);

        console.log(currentDate);
        console.log(dateTimestamp);
        let promise = new Promise((res, rej) => {
            //let timeframe = ['1', '5', '15', '30', '60', 'D', 'W', 'M'];
            finnhubClient.stockCandles(stock_ticker, 'M',1577836800, dateTimestamp , {}, (error, data, response) => {
                res(finalResult.push(data.t, data.c)); 
            });
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
        console.log('client: ', finalResult);
        res.render('index.ejs', {finalResult})
        /* res.send(finalResult);  */
    };  
    
    companyProfile()
        .then(stockQuote)
        .then(stockPeers)
        .then(stockCandlesDay) // day
        .then(stockCandlesWeek) // week
        .then(stockCandlesMonth) // month
        /* .then(stockFinancials)
        .then(stockRecommendation)
        .then(stockTechnical)
        .then(stockEarnings) */
        .then(sendToClient); 
}); 


