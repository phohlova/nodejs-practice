const handleTaskError = (taskName, error) => {
    console.error(`Error in task "${taskName}":`, error.message);
};

modile.exports = { handleTaskError };