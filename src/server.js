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
app.get('/', (req, res) => {  
    let data = {name: "", country: "", ipo: ""};
    res.render('index.ejs', {data});
});

// Fetch stock data from the Finnnhub API based on user stock ticker input
app.post('/', (req, res) => {
    const stock_ticker = req.body.stock_id.toUpperCase();
    console.log('User input is ', stock_ticker);
    
    
    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = process.env.API; // Replace this
    const finnhubClient = new finnhub.DefaultApi();


    /* // Stock candles
    finnhubClient.stockCandles(stock_ticker, "D", 1590988249, 1591852249, {}, (error, data, response) => {
        res.send(data);
    }); */ 

    // API data is send back to the client
    finnhubClient.companyProfile2({'symbol': stock_ticker}, (error, data, response) => {  
        console.log(data); 
        res.render('index.ejs', {data});
    });  
    
    
   
});



 

