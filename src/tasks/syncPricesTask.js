const logger = require('../logger');

async function syncPrices(binanceService, rateRepo) {
    try {
        logger.info('Starting price sync from Binance...');

        const tickers = await binanceService.getAllTickers();
        let updatedCount = 0;

        const stmt = rateRepo.db.prepare(`
            INSERT INTO exchange_rates (pair, price, updated_at) 
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(pair) DO UPDATE SET price = excluded.price, updated_at = CURRENT_TIMESTAMP
        `);

        const insertMany = rateRepo.db.transaction((rows) => {
            for (const row of rows) stmt.run(row.pair, row.price);
        });

        const rows = tickers.map(t => ({ pair: t.symbol, price: parseFloat(t.price) }));
        insertMany(rows);
        updatedCount = rows.length;

        logger.info(`Price sync completed. Updated ${updatedCount} pairs.`); 
    } catch (error) {
        logger.error('Price sync failed: ', { message: error.message, code: error.code });
    }
}

module.exports = { syncPrices };