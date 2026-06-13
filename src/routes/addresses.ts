import express, { Router, Request, Response, NextFunction } from 'express';
import { AddressRepository } from '../repositories/AddressRepository';
import { AppError } from '../errors/AppError';
const logger = require('../logger');

export function createAddressRoutes(addressRepo: AddressRepository): Router {
    const router: Router = express.Router();

    /**
     * @openapi
     * /addresses:
     *   get:
     *     summary: Получить список всех адресов
     *     tags: [Addresses]
     *     responses:
     *       200:
     *         description: Список адресов
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id: { type: integer, example: 1 }
     *                   address: { type: string, example: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" }
     *                   label: { type: string, example: "Satoshi Wallet" }
     *                   created_at: { type: string, format: date-time }
     */
    router.get('/', (req: Request, res: Response, next: NextFunction) => {
        try {
            const addresses = addressRepo.findAll();
            res.json(addresses);
        } catch (err) {
            next(err);
        }
    });

    /**
     * @openapi
     * /addresses:
     *   post:
     *     summary: Создать новый адрес
     *     tags: [Addresses]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [address, label]
     *             properties:
     *               address: { type: string, example: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" }
     *               label: { type: string, example: "My Wallet" }
     *     responses:
     *       201: { description: Адрес создан }
     *       400: { description: Ошибка валидации }
     *       409: { description: Адрес уже существует }
     */
    router.post('/', (req: Request, res: Response, next: NextFunction) => {
        try {
            const { address, label } = req.body;

            if (!address || typeof address !== 'string' || !address.trim()) {
                return res.status(400).json({ error: 'Field "address" is required and must be a non-empty string' });
            }
            if (!label || typeof label !== 'string' || !label.trim()) {
                return res.status(400).json({ error: 'Field "label" is required and must be a non-empty string' });
            }

            const created = addressRepo.create({
                address: address.trim(),
                label: label.trim()
            });

            logger.info(`Address created: ${created.address}`);
            res.status(201).json(created);
        } catch (err) {
            if (err instanceof AppError && err.statusCode === 409) {
                return res.status(409).json({ error: err.message });
            }
            next(err);
        }
    });

    /**
     * @openapi
     * /addresses/{id}:
     *   get:
     *     summary: Получить адрес по ID
     *     tags: [Addresses]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: integer }
     *     responses:
     *       200: { description: Найденный адрес }
     *       404: { description: Адрес не найден }
     */
    router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid id format' });
            }

            const address = addressRepo.findById(id);
            if (!address) {
                return res.status(404).json({ error: 'Address not found' });
            }
            res.json(address);
        } catch (err) {
            next(err);
        }
    });

    /**
     * @openapi
     * /addresses/{id}:
     *   put:
     *     summary: Обновить адрес
     *     tags: [Addresses]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: integer }
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               address: { type: string }
     *               label: { type: string }
     *     responses:
     *       200: { description: Адрес обновлён }
     *       404: { description: Адрес не найден }
     *       409: { description: Адрес уже занят }
     */
    router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid id format' });
            }

            const { address, label } = req.body;

            if (address !== undefined && (typeof address !== 'string' || !address.trim())) {
                return res.status(400).json({ error: 'Field "address" must be a non-empty string' });
            }
            if (label !== undefined && (typeof label !== 'string' || !label.trim())) {
                return res.status(400).json({ error: 'Field "label" must be a non-empty string' });
            }

            const updated = addressRepo.update(id, {
                address: address?.trim(),
                label: label?.trim()
            });

            if (!updated) {
                return res.status(404).json({ error: 'Address not found' });
            }

            res.json(updated);
        } catch (err) {
            if (err instanceof AppError && err.statusCode === 409) {
                return res.status(409).json({ error: err.message });
            }
            next(err);
        }
    });

    /**
     * @openapi
     * /addresses/{id}:
     *   delete:
     *     summary: Удалить адрес
     *     tags: [Addresses]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: integer }
     *     responses:
     *       204: { description: Адрес удалён }
     *       404: { description: Адрес не найден }
     */
    router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid id format' });
            }

            const removed = addressRepo.remove(id);
            if (!removed) {
                return res.status(404).json({ error: 'Address not found' });
            }
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    });
    return router;
}

module.exports = { createAddressRoutes };