export const handleTaskError = (taskName: string, error: Error): void => {
    console.error(`Error in task "${taskName}":`, error.message);
};

module.exports = { handleTaskError };