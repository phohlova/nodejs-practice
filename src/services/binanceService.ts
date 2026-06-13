import axios, { AxiosInstance, AxiosError } from 'axios';
const logger = require('../logger');

interface BinanceTicker {
	symbol: string;
	price: string;
}

interface ProcessedTicker {
	pair: string;
	price: number;
	base: string;
	quote: string;
}

const binanceClient: AxiosInstance = axios.create({
	baseURL: 'https://api.binance.com',
	timeout: 10000,
	headers: { 'User-Agent': 'nodejs-practice/1.0' }
});

export const getAllTickers = async (): Promise<BinanceTicker[]> => {
	try {
		const response = await binanceClient.get('/api/v3/ticker/price');
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError;
		logger.error(`Binance API error: ${axiosError.message}`, {
			code: axiosError.code,
			status: axiosError.response?.status,
			data: axiosError.response?.data
		});
		throw new Error('Failed to fetch data from Binance');
	}
};

export const filterByCurrency = (
	currency: string,
	allTickers: BinanceTicker[]
): ProcessedTicker[] => {
	const upperCurrency = currency.toUpperCase();

	return allTickers
		.filter(ticker => ticker.symbol.includes(upperCurrency))
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