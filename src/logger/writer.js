const writeConsole = (level, message) => {
    switch (level) {
        case 'error':
            console.error(message);
            break;
        case 'warn':
            console.warn(message);
            break;
        default:
            console.log(message);
            break;
    }
}

module.exports = { writeConsole }; 