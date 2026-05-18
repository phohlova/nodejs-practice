console.log("init scheduler");

const tasks = {};

function scheduleTask(name, interval, task) {
    if (typeof task != 'function') {
        throw new Error('Parameter task must be function');
    }

    const timerId = setInterval(() => {
        try {
            task();
        } catch (error) {
            console.error(` mistake in task "${name}":`, error.message);
        }
    }, interval);

    tasks[name] = timerId;
    console.log(` task "${name}" has been registered (interval: ${interval}ms)`);

    return timerId;
}

module.exports = { scheduleTask };