import { TaskRegistry } from '../../src/scheduler/task-registry';

describe('Task Registry', () => {
    let registry: TaskRegistry;

    beforeEach(() => {
        registry = new TaskRegistry();
    });

    test('empty in the beggining', () => {
        expect(registry.has('task1')).toBe(false);
        expect(registry.get('task1')).toBeUndefined();
    });

    test('register and return timerId', () => {
        registry.register('task1', 123 as any);

        expect(registry.has('task1')).toBe(true);
        expect(registry.get('task1')).toBe(123);
    });

    test('unregister delete task and return timerId', () => {
        registry.register('task1', 456 as any);
        const id = registry.unregister('task1');

        expect(id).toBe(456);
        expect(registry.has('task1')).toBe(false);
    });

    test('unregister for non-existent task returns undefined', () => {
        expect(registry.unregister('missing')).toBeUndefined();
        expect(registry.has('missing')).toBe(false);
    });
});