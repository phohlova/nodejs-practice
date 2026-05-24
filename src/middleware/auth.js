require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../logger');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.warn('No token provided', req.ip);

        return res.status(401).json({ error: 'Auth header required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.AUTH_SECRET);

        req.user = decoded;

        logger.debug('Token verified successfully', req.ip);
        next();
    } catch (err) {
        logger.warn(`Invalid token: ${err.message}`, req.ip);
        return res.status(403).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateToken;