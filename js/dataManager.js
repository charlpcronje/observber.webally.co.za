// js/dataManager.js
import logger from './logger.js';

class DataManager {
    constructor() {
        this.events = [];
        this.storageKey = 'charlSurvivalEvents';
        this.eventsFilePath = 'data/events.json';
    }

    async loadEvents() {
        try {
            // First try to load from localStorage
            const storedEvents = localStorage.getItem(this.storageKey);
            if (storedEvents) {
                this.events = JSON.parse(storedEvents);
                logger.info('Events loaded from localStorage', { count: this.events.length });
                return this.events;
            } else {
                // If no stored events, fetch from the JSON file
                return await this.fetchEventsFromFile();
            }
        } catch (error) {
            logger.handleError(error, 'loadEvents');
            // Fallback to fetching from file on error
            return await this.fetchEventsFromFile();
        }
    }
    
    async fetchEventsFromFile() {
        try {
            const response = await fetch(this.eventsFilePath);
            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
            }
            
            this.events = await response.json();
            
            // Save the fetched events to localStorage for future use
            await this.saveEvents();
            
            logger.info('Events loaded from file', { count: this.events.length });
            return this.events;
        } catch (error) {
            logger.handleError(error, 'fetchEventsFromFile');
            // Return empty array if fetch fails
            this.events = [];
            return this.events;
        }
    }

    async saveEvents() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.events));
            logger.info('Events saved to localStorage', { count: this.events.length });
            return true;
        } catch (error) {
            logger.handleError(error, 'saveEvents');
            return false;
        }
    }

    async addEvent(event) {
        try {
            // Generate a unique ID if not provided
            if (!event.id) {
                event.id = this.generateUniqueId();
            }
            this.events.push(event);
            await this.saveEvents();
            logger.info('New event added', { title: event.title });
            return event;
        } catch (error) {
            logger.handleError(error, 'addEvent');
            return null;
        }
    }

    async updateEvent(eventId, updatedEvent) {
        try {
            const index = this.events.findIndex(e => e.id === eventId);
            if (index !== -1) {
                this.events[index] = { ...this.events[index], ...updatedEvent };
                await this.saveEvents();
                logger.info('Event updated', { id: eventId });
                return this.events[index];
            }
            return null;
        } catch (error) {
            logger.handleError(error, 'updateEvent');
            return null;
        }
    }

    async deleteEvent(eventId) {
        try {
            const index = this.events.findIndex(e => e.id === eventId);
            if (index !== -1) {
                const removedEvent = this.events.splice(index, 1)[0];
                await this.saveEvents();
                logger.info('Event deleted', { id: eventId });
                return removedEvent;
            }
            return null;
        } catch (error) {
            logger.handleError(error, 'deleteEvent');
            return null;
        }
    }

    getEvents() {
        return [...this.events];
    }

    exportData() {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.events, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "charl_survival_events.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            logger.info('Events exported to file');
            return true;
        } catch (error) {
            logger.handleError(error, 'exportData');
            return false;
        }
    }
    
    importFromFile(jsonData) {
        try {
            const parsedData = JSON.parse(jsonData);
            if (Array.isArray(parsedData)) {
                this.events = parsedData;
                this.saveEvents();
                logger.info('Events imported from file', { count: this.events.length });
                return true;
            } else {
                logger.error('Invalid JSON format, expected an array');
                return false;
            }
        } catch (error) {
            logger.handleError(error, 'importFromFile');
            return false;
        }
    }

    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
}

// Export as global for non-module scripts
window.DataManager = DataManager;

export default DataManager;:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.events, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "charl_survival_events.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            logger.info('Events exported to file');
            return true;
        } catch (error) {
            logger.handleError(error, 'exportData');
            return false;
        }
    }
    
    importFromFile(jsonData) {
        try {
            const parsedData = JSON.parse(jsonData);
            if (Array.isArray(parsedData)) {
                this.events = parsedData;
                this.saveEvents();
                logger.info('Events imported from file', { count: this.events.length });
                return true;
            } else {
                logger.error('Invalid JSON format, expected an array');
                return false;
            }
        } catch (error) {
            logger.handleError(error, 'importFromFile');
            return false;
        }
    }

    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
}