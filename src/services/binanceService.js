const axios = require('axios');
const logger = require('../logger');
const { response } = require('express');

const binanceClient = axios.create({
    baseURL: 'https://api.binance.com',
    timeout: 10000,
    headers: { 'User-Agent': 'nodejs-practice/1.0' }
});

const getAllTickers = async () => {
    try {
        comst response = await binanceClient.get('/api/v3/ticker/price');
        return response.data;
    } catch (error) {
        logger.error('Binance API error: ', {
            message: error.message,
            code: error.code,
            status: error.response?.status
        });
        throw new Error('Failed to fetch data from Binance');
    }
};

const filterByCurrency = (currency, allTickers) => {
  const upperCurrency = currency.toUpperCase();
  
  return allTickers
    .filter(ticker => 
      ticker.symbol.includes(upperCurrency)
    )
    .map(ticker => {
      const symbol = ticker.symbol;
      const quote = symbol.endsWith('USDT') ? 'USDT' : 
                   symbol.endsWith('BUSD') ? 'BUSD' :
                   symbol.slice(-3);
      const base = symbol.slice(0, -quote.length);
      
      return {
        pair: symbol,
        price: parseFloat(ticker.price),
        base,
        quote
      };
    })
    .sort((a, b) => b.price - a.price);
};

module.exports = { getAllTickers, filterByCurrency };