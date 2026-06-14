import Database from 'better-sqlite3';
const logger = require('../logger');

interface BinanceTicker {
    symbol: string;
    price: string;
}

interface ExchangeRateRow {
    pair: string;
    price: number;
}

interface IBinanceService {
    getAllTickers(): Promise<BinanceTicker[]>;
}

interface IExchangeRateRepository {
    db: Database.Database;
}

interface IPriceHistoryRepository {
    create(pair: string, price: number): void;
}

export async function syncPrices(
    binanceService: IBinanceService,
    rateRepo: IExchangeRateRepository,
    priceHistoryRepo: IPriceHistoryRepository
): Promise<void> {
    try {
        logger.info('Starting price sync from Binance...');

        const tickers = await binanceService.getAllTickers();

        const stmt = rateRepo.db.prepare(`
            INSERT INTO exchange_rates (pair, price, updated_at) 
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(pair) DO UPDATE SET price = excluded.price, updated_at = CURRENT_TIMESTAMP
        `);

        const insertMany = rateRepo.db.transaction((rows: ExchangeRateRow[]) => {
            for (const row of rows) {
                stmt.run(row.pair, row.price);

                if (priceHistoryRepo) {
                    priceHistoryRepo.create(row.pair, row.price);
                }
            }
        });

        const rows: ExchangeRateRow[] = tickers.map((t: BinanceTicker) => ({
            pair: t.symbol,
            price: parseFloat(t.price)
        }));

        insertMany(rows);

        logger.info(`Price sync completed. Updated ${rows.length} pairs.`);
    } catch (error) {
        const err = error as Error & { code?: string };
        logger.error(`Price sync failed: ${err.message}`, { code: err.code });
    }
}

module.exports = { syncPrices };