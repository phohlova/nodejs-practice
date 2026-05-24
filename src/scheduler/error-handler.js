const handleTaskError = (taskName, error) => {
    console.error(`Error in task "${taskName}":`, error.message);
};

module.exports = { handleTaskError };