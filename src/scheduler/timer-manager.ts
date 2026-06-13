export const createRepeatingTimer = (
    interval: number,
    callback: () => void
): NodeJS.Timeout => {
    return setInterval(callback, interval);
};

export const cancelTimer = (timerId: NodeJS.Timeout): void => {
    clearInterval(timerId);
};

module.exports = { createRepeatingTimer, cancelTimer };