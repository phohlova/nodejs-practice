const { TaskRegistry } = require('../../src/scheduler/task-registry');

describe('Task Registry', () => {
    let registry;

    beforeEach(() => {
        registry = new TaskRegistry();
    });

    test('empty in the beggining', () => {
        expect(registry.has('task1')).toBe(false);
        expect(registry.get('task1')).toBeUndefined();
    });

    test('register and return timerId', () => {
        registry.register('task1', 123);
        
        expect(registry.has('task1')).toBe(true);
        expect(registry.get('task1')).toBe(123);
    });

    test('unregister delete task and retirn timreId', () => {
        registry.register('task1', 456);
        const id = registry.unregister('task1');

        expect(id).toBe(456);
        expect(registry.has('task1')).toBe(false);
    });

    test('ungerister for non-existent task returns undefined', () => {
        expect(registry.unregister('missing')).toBeUndefined();
        expect(registry.has('missing')).toBe(false);
    });
});