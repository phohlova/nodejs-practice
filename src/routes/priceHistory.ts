import express, { Router, Request, Response, NextFunction } from 'express';
import { PriceHistoryRepository } from '../repositories/PriceHistoryRepository';
const logger = require('../logger');

export function createPriceHistoryRoutes(
	priceHistoryRepo: PriceHistoryRepository
): Router {
	const router: Router = express.Router();

	/**
	 * @openapi
	 * /history/{pair}:
	 *   get:
	 *     summary: Получить историю цен по валютной паре
	 *     tags: [Price History]
	 *     parameters:
	 *       - in: path
	 *         name: pair
	 *         required: true
	 *         schema: { type: string }
	 *         example: BTCUSDT
	 *       - in: query
	 *         name: from
	 *         schema: { type: string, format: date-time }
	 *         description: Начальная дата (ISO 8601)
	 *         example: "2026-01-01T00:00:00Z"
	 *       - in: query
	 *         name: to
	 *         schema: { type: string, format: date-time }
	 *         description: Конечная дата (ISO 8601)
	 *         example: "2026-06-14T00:00:00Z"
	 *       - in: query
	 *         name: limit
	 *         schema: { type: integer, minimum: 1, maximum: 1000 }
	 *         description: Максимальное количество записей
	 *         example: 100
	 *     responses:
	 *       200:
	 *         description: История цен
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 pair: { type: string }
	 *                 count: { type: integer }
	 *                 data:
	 *                   type: array
	 *                   items:
	 *                     type: object
	 *                     properties:
	 *                       id: { type: integer }
	 *                       pair: { type: string }
	 *                       price: { type: number }
	 *                       recorded_at: { type: string, format: date-time }
	 *       400: { description: Ошибка валидации параметров }
	 *       404: { description: История не найдена }
	 */
	router.get('/:pair', (req: Request, res: Response, next: NextFunction) => {
		try {
			const { pair } = req.params;
			const { from, to, limit } = req.query;

			if (!pair || typeof pair !== 'string' || !pair.trim()) {
				return res.status(400).json({ error: 'Currency pair is required' });
			}

			if (limit !== undefined) {
				const limitNum = Number(limit);
				if (isNaN(limitNum) || limitNum < 1 || limitNum > 1000) {
					return res.status(400).json({
						error: 'Limit must be a number between 1 and 1000'
				});
				}
			}

			if (from !== undefined && isNaN(Date.parse(from as string))) {
				return res.status(400).json({ error: 'Invalid "from" date format' });
			}
			if (to !== undefined && isNaN(Date.parse(to as string))) {
				return res.status(400).json({ error: 'Invalid "to" date format' });
			}

			const history = priceHistoryRepo.findByPair({
				pair: pair.toUpperCase(),
				from: from as string | undefined,
				to: to as string | undefined,
				limit: limit ? Number(limit) : undefined
			});

			if (history.length === 0) {
				return res.status(404).json({
					error: `No price history found for pair "${pair.toUpperCase()}"`
				});
			}

			logger.debug(
				`Serving ${history.length} history records for ${pair.toUpperCase()}`
			);

			res.json({
				pair: pair.toUpperCase(),
				count: history.length,
				data: history
			});
		} catch (err) {
			next(err);
		}
	});
	return router;
}

module.exports = { createPriceHistoryRoutes };