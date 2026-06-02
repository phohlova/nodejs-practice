const express = require('express');
const { getAllTickers, filterByCurrency } = require('../services/binanceService');
const logger = require('../logger');
const binanceService = require('../services/binanceService');

function createPriceRoutes(currencyRepo) {
	const router = express.Router();

	/**
	 * @openapi
	 * /price:
	 *   get:
	 *     summary: Получить курсы валют с Binance
	 *     tags: [Prices]
	 *     parameters:
	 *       - in: query
	 *         name: currency
	 *         required: true
	 *         schema: { type: string }
	 *         example: USD
	 *     responses:
	 *       200:
	 *         description: Список курсов
	 *       400:
	 *         description: Параметр currency не передан
	 *       404:
	 *         description: Валюта не найдена в базе
	 *       502:
	 *         description: Ошибка Binance API
	 */
	router.get('/', async (req, res, next) => {
		try {
			const { currency } = req.query;

			if (!currency) {
				return res.status(400).json({ error: 'Query parameter "currency" is required' });
			}

			const localCurrencies = currencyRepo.findAll();
			const exists = localCurrencies.some(c => 
				c.ticker.toUpperCase() === currency.toUpperCase()
			);

			if (!exists) {
				logger.warn(`Currency "${currency}" not found in local database`);
				return res.status(404).json({
					error: `Currency "${currency}" not found in database`,
					available: localCurrencies.map(c => c.ticker)
				});
			}

			logger.info(`Fetching prices for ${currency} from Binance`);
			const allTickers = await binanceService.getAllTickers();
			const result = binanceService.filterByCurrency(currency, allTickers);

			logger.info(`Found ${result.length} pairs for ${currency}`);
			res.json({
				currency: currency.toUpperCase(),
				count: result.length,
				data: result
			});
		} catch (error) {
			logger.error('Failed to fetch Binance prices:', error.message);
			res.status(502).json({
				error: 'Failed to fetch data from external service',
				message: error.message
			});
		}
	});

	return router;
}

module.exports = { createPriceRoutes };