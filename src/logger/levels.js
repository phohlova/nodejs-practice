const LEVELS = {
    trace: 0,
    debug: 1, 
    info: 2,
    warn: 3,
    error: 4,
};

const LEVEL_NAMES = Object.keys(LEVELS);

module.exports = { LEVELS, LEVEL_NAMES };