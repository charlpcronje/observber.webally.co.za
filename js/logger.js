// js/logger.js
/**
 * Logging utility for consistent logging and error handling
 */
class Logger {
    /**
     * Creates a new Logger instance
     * @param {string} logLevel - Initial log level (error, warn, info, debug)
     */
    constructor(logLevel = 'info') {
        this.logLevels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3
        };
        this.setLogLevel(logLevel);
    }

    /**
     * Sets the current log level
     * @param {string} level - Log level to set
     */
    setLogLevel(level) {
        if (this.logLevels[level] !== undefined) {
            this.currentLogLevel = this.logLevels[level];
        } else {
            this.currentLogLevel = this.logLevels.info;
            this.warn(`Invalid log level: ${level}. Defaulting to 'info'`);
        }
    }

    /**
     * Formats a log message with timestamp and optional data
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {*} data - Optional data to include
     * @returns {string} Formatted message
     */
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

    /**
     * Logs an error message
     * @param {string} message - Log message
     * @param {*} data - Optional data to include
     */
    error(message, data) {
        if (this.currentLogLevel >= this.logLevels.error) {
            console.error(this.formatMessage('error', message, data));
        }
    }

    /**
     * Logs a warning message
     * @param {string} message - Log message
     * @param {*} data - Optional data to include
     */
    warn(message, data) {
        if (this.currentLogLevel >= this.logLevels.warn) {
            console.warn(this.formatMessage('warn', message, data));
        }
    }

    /**
     * Logs an info message
     * @param {string} message - Log message
     * @param {*} data - Optional data to include
     */
    info(message, data) {
        if (this.currentLogLevel >= this.logLevels.info) {
            console.info(this.formatMessage('info', message, data));
        }
    }

    /**
     * Logs a debug message
     * @param {string} message - Log message
     * @param {*} data - Optional data to include
     */
    debug(message, data) {
        if (this.currentLogLevel >= this.logLevels.debug) {
            console.debug(this.formatMessage('debug', message, data));
        }
    }

    /**
     * Handles and logs errors consistently
     * @param {Error} error - Error object
     * @param {string} context - Context where error occurred
     * @returns {Error} The original error
     */
    handleError(error, context = '') {
        const message = context ? `Error in ${context}: ${error.message}` : error.message;
        this.error(message, { stack: error.stack });
        return error; // Return for further handling if needed
    }
}

// Create a singleton instance with appropriate log level
const logger = new Logger(
    localStorage.getItem('logLevel') || (window.location.hostname === 'localhost' ? 'debug' : 'info')
);

// Make available globally
window.logger = logger;

export default logger;