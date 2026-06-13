export class TaskRegistry {
    private tasks: Map<string, NodeJS.Timeout>;

    constructor() {
        this.tasks = new Map();
    }

    register(name: string, timerId: NodeJS.Timeout): void {
        this.tasks.set(name, timerId);
    }

    get(name: string): NodeJS.Timeout | undefined {
        return this.tasks.get(name);
    }

    unregister(name: string): NodeJS.Timeout | undefined {
        const timerId = this.tasks.get(name);
        this.tasks.delete(name);
        return timerId;
    }

    has(name: string): boolean {
        return this.tasks.has(name);
    }
}

module.exports = { TaskRegistry };