// js/logger.js
class Logger {
    constructor(logLevel = 'info') {
        this.logLevels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3
        };
        this.setLogLevel(logLevel);
    }

    setLogLevel(level) {
        if (this.logLevels[level] !== undefined) {
            this.currentLogLevel = this.logLevels[level];
        } else {
            this.currentLogLevel = this.logLevels.info;
            this.warn(`Invalid log level: ${level}. Defaulting to 'info'`);
        }
    }

    formatMessage(level, message, data) {
        const timestamp = new Date().toISOString();
        let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        
        if (data) {
            try {
                if (typeof data === 'object') {
                    formattedMessage += ` ${JSON.stringify(data)}`;
                } else {
                    formattedMessage += ` ${data}`;
                }
            } catch (e) {
                formattedMessage += ' [Error stringifying data]';
            }
        }
        
        return formattedMessage;
    }

    error(message, data) {
        if (this.currentLogLevel >= this.logLevels.error) {
            console.error(this.formatMessage('error', message, data));
        }
    }

    warn(message, data) {
        if (this.currentLogLevel >= this.logLevels.warn) {
            console.warn(this.formatMessage('warn', message, data));
        }
    }

    info(message, data) {
        if (this.currentLogLevel >= this.logLevels.info) {
            console.info(this.formatMessage('info', message, data));
        }
    }

    debug(message, data) {
        if (this.currentLogLevel >= this.logLevels.debug) {
            console.debug(this.formatMessage('debug', message, data));
        }
    }

    // Utility method to handle errors consistently
    handleError(error, context = '') {
        const message = context ? `Error in ${context}: ${error.message}` : error.message;
        this.error(message, { stack: error.stack });
        return error; // Return for further handling if needed
    }
}

// Create a singleton instance
window.logger = new Logger(
    localStorage.getItem('logLevel') || (window.location.hostname === 'localhost' ? 'debug' : 'info')
);

export default window.logger;