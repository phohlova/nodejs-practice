const createRepeatingTimer = (interval, callback) => {
    return setInterval(callback, interval);
};

const cancelTimer = (timerId) => {
    clearInterval(timerId);
};

module.exports = { createRepeatingTimer, cancelTimer };