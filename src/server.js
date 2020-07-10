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
    let data = {name: "", country: "", ipo: "", finnhubindustry: "", weburl: ""};
    res.render('index.ejs', {data});
});

// Get stock data from the Finnnhub API based on user stock ticker input
app.post('/', (req, res) => {
    const stock_ticker = req.body.stock_id.toUpperCase();
    console.log('User input is ', stock_ticker);
     
// Finnhub API
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API; 
const finnhubClient = new finnhub.DefaultApi();

// Stock candles
/*   let timeframe = ['1', '5', '15', '30', '60', 'D', 'W', 'M'];
finnhubClient.stockCandles(stock_ticker, timeframe[6], 1590988249, 1591852249, {}, (error, data, response) => {
    res.send(data);
}); */  

// Store all data received from finnhub API in an array
let finalResult = [];

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

let stockQuote = () => {
    let promise = new Promise((res, rej) => {
        finnhubClient.quote("AAPL", (error, data, response) => {
            res(finalResult.push(data));
        }); 
    });
    return promise;
};    

let sendToClient = () => {
    res.send(finalResult);
};  
 
companyProfile()
    .then(stockQuote)
    .then(sendToClient);
   
}); 

