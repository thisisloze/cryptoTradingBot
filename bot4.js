var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');
var math = require('mathjs');
var moment = require('moment');
var colors = require('colors');
var SMA = require('technicalindicators').SMA;
var RSI = require('technicalindicators').RSI;
var ROC = require('technicalindicators').ROC;
var BB = require('technicalindicators').BollingerBands;
var bullish = require('technicalindicators').bullish;
var bearish = require('technicalindicators').bearish;
var asyncData = require("./asyncData.js");
var mongoose = require('mongoose');
var Data15m = require('./models/data15m.js');
var BalanceHist = require('./models/balanceHist.js');
var Data15mLast500 = require('./models/data15mLast500.js');
var numeral = require('numeral');

//===============================================================================================================================
//      MLAB DATABASE CONFIG 
//===============================================================================================================================


const dbRoute = process.env.MLAB;
mongoose.connect(dbRoute, { useNewUrlParser: true});
let db = mongoose.connection;

db.once('open', () => console.log('db connected'));
db.on('error', console.error.bind(console, 'monogdb connection error:'));



//===============================================================================================================================
//      Cobinhood CONFIG
//===============================================================================================================================


const cobinhood = require('node-cobinhood-api');
 
cobinhood.options({
    'apiKey': process.env.Cobinhood, 
    'verbose': true
});

//===============================================================================================================================
//      BodyParser + MethodOverride + EJS CONFIG
//===============================================================================================================================


app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));


//===============================================================================================================================
//      Binance API - IOTA ETH BOT
//===============================================================================================================================

let tradePair = 'COB-BTC';
let tradeQty = 5;
let timeFrame = '15m'; // Trading Period: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
let decimalPlaces = 0.00000001; // Number of decimal places on tradingPair
let tradeInterval = 10000; // Interval of milliseconds bot will analyse price changes. Needs to be > 5000, due to Exchange API limits.
let totalETHInvested = 0.43; // ETH invested

setInterval(() => {
    
    cobinhood.lastPrice(tradePair, (error, lastPrice) => {
        if (!error) {
            console.log("COB-BTC last price:", lastPrice);
            // COB-BTC last price: 0.00001687
        }
    });

}, tradeInterval);


//===============================================================================================================================
//      COLLECT DATA
//===============================================================================================================================



//===============================================================================================================================
//      SERVER START
//===============================================================================================================================


app.listen(8082, process.env.IP, function() {
    console.log('server start...' + process.env.IP + ":" + 8082);
});