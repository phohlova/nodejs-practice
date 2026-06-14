import express, { Router, Request, Response, NextFunction } from 'express';
import { getBlockchainHeight, getAddressBalance } from '../services/blockchainService';
const logger = require('../logger');

export function createBlockchainRoutes(): Router {
    const router: Router = express.Router();

    /**
     * @openapi
     * /blockchain/height:
     *   get:
     *     summary: Получить текущую высоту блокчейна Bitcoin
     *     tags: [Blockchain]
     *     responses:
     *       200:
     *         description: Высота блокчейна
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 height: { type: integer, example: 850000 }
     *                 timestamp: { type: string, format: date-time }
     *       502:
     *         description: Ошибка при запросе к блокчейну
     */
    router.get('/height', async (req: Request, res: Response, next: NextFunction) => {
        try {
        const height = await getBlockchainHeight();
        
        logger.debug(`Blockchain height: ${height}`);
        
        res.json({
            height,
            timestamp: new Date().toISOString()
        });
        } catch (error) {
        logger.error(`Failed to get blockchain height: ${(error as Error).message}`);
        res.status(502).json({
            error: 'Failed to fetch blockchain height',
            message: (error as Error).message
        });
        }
    });

    /**
     * @openapi
     * /blockchain/address/{address}/balance:
     *   get:
     *     summary: Получить баланс Bitcoin адреса
     *     tags: [Blockchain]
     *     parameters:
     *       - in: path
     *         name: address
     *         required: true
     *         schema: { type: string }
     *         description: Bitcoin адрес
     *         example: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
     *     responses:
     *       200:
     *         description: Баланс адреса
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 address: { type: string }
     *                 final_balance: { type: integer, description: "Баланс в сатоши" }
     *                 final_balance_btc: { type: number, description: "Баланс в BTC" }
     *                 n_tx: { type: integer, description: "Количество транзакций" }
     *                 total_received: { type: integer, description: "Всего получено (сатоши)" }
     *                 total_sent: { type: integer, description: "Всего отправлено (сатоши)" }
     *       400: { description: Некорректный адрес }
     *       502: { description: Ошибка при запросе к блокчейну }
     */
    router.get(
        '/address/:address/balance',
        async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { address } = req.params;

            if (!address || typeof address !== 'string' || !address.trim()) {
            return res.status(400).json({ error: 'Address is required' });
            }

            const validStart = address.startsWith('1') || 
                            address.startsWith('3') || 
                            address.startsWith('bc1');
            
            if (!validStart) {
                return res.status(400).json({ 
                    error: 'Invalid Bitcoin address format. Must start with 1, 3, or bc1' 
                });
            }

            const balance = await getAddressBalance(address.trim());

            logger.debug(`Balance for ${address}: ${balance.final_balance} satoshi`);

            res.json({
                address: address.trim(),
                final_balance: balance.final_balance,
                final_balance_btc: balance.final_balance / 100000000,
                n_tx: balance.n_tx,
                total_received: balance.total_received,
                total_sent: balance.total_sent
            });
        } catch (error) {
            logger.error(`Failed to get address balance: ${(error as Error).message}`);
            res.status(502).json({
                error: 'Failed to fetch address balance',
                message: (error as Error).message
            });
        }
        }
    );

    return router;
    }

module.exports = { createBlockchainRoutes };