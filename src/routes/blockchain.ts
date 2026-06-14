import express, { Router, Request, Response, NextFunction } from 'express';
import { getBlockchainHeight, getAddressBalance } from '../services/blockchainService';
import { validate } from '../middleware/validate';
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
    router.get(
        '/address/:address/balance',
        validate([{ field: 'address', required: true, type: 'string', minLength: 10 }]),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const address = req.params.address as string;

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