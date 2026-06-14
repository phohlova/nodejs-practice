import express, { Router, Request, Response, NextFunction } from 'express';
import { DuplicateError } from '../errors/DuplicateError';
import { validate } from '../middleware/validate';
const logger = require('../logger');

interface Currency {
	id: number;
	name: string;
	ticker: string;
}

interface CurrencyData {
	name: string;
	ticker: string;
}

interface ICurrencyRepository {
	create(data: CurrencyData): Currency;
	findAll(): Currency[];
	findById(id: number): Currency | undefined;
	update(id: number, data: Partial<CurrencyData>): Currency | undefined;
	remove(id: number): boolean;
	clear(): void;
}

export function createCurrencyRoutes(currencyRepo: ICurrencyRepository): Router {
	const router: Router = express.Router();

	/**
	 * @openapi
	 * /currencies:
	 *   get:
	 *     summary: Получить список всех валют
	 *     tags: [Currencies]
	 *     responses:
	 *       200:
	 *         description: Список валют
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 type: object
	 *                 properties:
	 *                   id:
	 *                     type: integer
	 *                     example: 1
	 *                   name:
	 *                     type: string
	 *                     example: US Dollar
	 *                   ticker:
	 *                     type: string
	 *                     example: USD
	*/
	router.get('/', (req: Request, res: Response, next: NextFunction) => {
		try {
			res.json(currencyRepo.findAll());
		} catch (err) {
			next(err);
		}
	});

	/**
	 * @openapi
	 * /currencies:
	 *   post:
	 *     summary: Создать новую валюту
	 *     tags: [Currencies]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - name
	 *               - ticker
	 *             properties:
	 *               name:
	 *                 type: string
	 *                 example: Euro
	 *               ticker:
	 *                 type: string
	 *                 example: EUR
	 *     responses:
	 *       201:
	 *         description: Валюта создана
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 id:
	 *                   type: integer
	 *                   example: 2
	 *                 name:
	 *                   type: string
	 *                 ticker:
	 *                   type: string
	 *       400:
	 *         description: Ошибка валидации
	 */
	router.post('/',
		validate([
			{ field: 'name', required: true, type: 'string', minLength: 1 },
			{ field: 'ticker', required: true, type: 'string', minLength: 1 }
		]),
		(req: Request, res: Response, next: NextFunction) => {
			try {
				const { name, ticker } = req.body;

				const currency = currencyRepo.create({ name, ticker });
				logger.info(`Currency created: ${currency.ticker}`);
				res.status(201).json(currency);
			} catch (err) {
				if (err instanceof DuplicateError) return res.status(409).json({ error: err.message });
				next(err);
			}
		}
	);

	/**
	 * @openapi
	 * /currencies/{id}:
	 *   get:
	 *     summary: Получить валюту по ID
	 *     tags: [Currencies]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       200:
	 *         description: Найденная валюта
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 id:
	 *                   type: integer
	 *                 name:
	 *                   type: string
	 *                 ticker:
	 *                   type: string
	 *       404:
	 *         description: Валюта не найдена
	 */
	router.get('/:id',
		validate([{ field: 'id', required: true, type: 'number', min: 1 }]),
		(req: Request, res: Response, next: NextFunction) => {
			try {
				const currency = currencyRepo.findById(Number(req.params.id));
				if (!currency) return res.status(404).json({ error: 'Currency not found' });
				res.json(currency);
			} catch (err) { next(err); }
		}
	);

	/**
	 * @openapi
	 * /currencies/{id}:
	 *   put:
	 *     summary: Обновить валюту
	 *     tags: [Currencies]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               name:
	 *                 type: string
	 *               ticker:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: Валюта обновлена
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 id:
	 *                   type: integer
	 *                 name:
	 *                   type: string
	 *                 ticker:
	 *                   type: string
	 *       404:
	 *         description: Валюта не найдена
	 */
	router.put('/:id',
		validate([
			{ field: 'id', required: true, type: 'number', min: 1 },
			{ field: 'name', type: 'string', minLength: 1 },
			{ field: 'ticker', type: 'string', minLength: 1 }
		]),
		(req: Request, res: Response, next: NextFunction) => {
			try {
				const updated = currencyRepo.update(Number(req.params.id), req.body);
				if (!updated) return res.status(404).json({ error: 'Currency not found' });
				res.json(updated);
			} catch (err) {
				if (err instanceof DuplicateError) return res.status(409).json({ error: err.message });
				next(err);
			}
		}
	);

	/**
	 * @openapi
	 * /currencies/{id}:
	 *   delete:
	 *     summary: Удалить валюту
	 *     tags: [Currencies]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       204:
	 *         description: Валюта удалена
	 *       404:
	 *         description: Валюта не найдена
	 */
	router.delete('/:id',
		validate([{ field: 'id', required: true, type: 'number', min: 1 }]),
		(req: Request, res: Response, next: NextFunction) => {
			try {
				const removed = currencyRepo.remove(Number(req.params.id));
				if (!removed) return res.status(404).json({ error: 'Currency not found' });
				res.status(204).send();
			} catch (err) { next(err); }
		}
	);

	return router;
}

module.exports = { createCurrencyRoutes };