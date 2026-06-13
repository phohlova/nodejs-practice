const logger = require('../logger');

function createPriceRoutes(rateRepo) {
	const express = require('express');
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

			const rates = rateRepo.findByCurrency(currency.toUpperCase());

			if (rates.length === 0) {
				return res.status(404).json({
					error: `No exchange rates found for "${currency}"`
				});
			}

			logger.debug(`Serving ${rates.length} rates for ${currency} from DB cache`);

			res.json({
				currency: currency.toUpperCase(),
				count: rates.length,
				data: rates,
				source: 'database_cache'
			});

		} catch (error) {
			next(error);
		}
	});

	return router;
}

module.exports = { createPriceRoutes };