class TaskRegistry {
    constructor() {
        this.tasks = new Map();
    }

    register(name, timerId) {
        this.tasks.set(name, timerId);
    }

    get(name) {
        return this.tasks.get(name);
    }

    unregister(name) {
        const timerId = this.tasks.get(name);
        this.tasks.delete(name);
        return timerId;
    }

    has(name) {
        return this.tasks.has(name);
    }
}

module.exports = { TaskRegistry };