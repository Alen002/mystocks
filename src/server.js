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

// Serving static files in the src folder
app.use(express.static('src'));

app.use(cors());

app.listen(5000, () => {
    console.log('Example app listening on port 5000!');
});

app.get('/', (req, res) => {    
    res.sendFile('/client/views/index.html', { root: __dirname});  
});

app.get('/test', (req, res) => {    
    res.send('Routes are working');
});

// Fetch stock data from the Finnnhub API
app.get('/stock', (req, res) => {
    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = process.env.API // Replace this
    const finnhubClient = new finnhub.DefaultApi()
    
    // Stock candles
    finnhubClient.stockCandles("MSFT", "D", 1590988249, 1591852249, {}, (error, data, response) => {
        console.log(data)
    });
});

 

