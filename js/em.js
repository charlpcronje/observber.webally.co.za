// js/eventManager.js
import logger from './logger.js';

class EventManager {
    constructor(dataManager, singularitySystem, uiManager) {
        this.dataManager = dataManager;
        this.singularitySystem = singularitySystem;
        this.uiManager = uiManager;
        
        this.setupCallbacks();
    }
    
    async initialize() {
        try {
            // Load events from data manager
            const events = await this.dataManager.loadEvents();
            
            // Load events into singularity system
            this.singularitySystem.loadEvents(events);
            
            logger.info('Event manager initialized');
            return true;
        } catch (error) {
            logger.handleError(error, 'EventManager.initialize');
            return false;
        }
    }
    
    setupCallbacks() {
        // Set up singularity system callbacks
        this.singularitySystem.setCallbacks({
            onShowTooltip: (event) => this.uiManager.showTooltip(event),
            onHideTooltip: () => this.uiManager.hideTooltip(),
            onUpdateTooltipPosition: (position) => this.uiManager.updateTooltipPosition(position),
            onEventSelected: (event) => this.uiManager.showDetailPanel(event),
            onEventDeselected: () => this.uiManager.hideDetailPanel()
        });
        
        // Set up UI manager callbacks
        this.uiManager.setCallbacks({
            onAddEvent: (event) => this.addEvent(event),
            onExportData: () => this.exportData(),
            onImportData: (jsonData, mode) => this.importData(jsonData, mode),
            onEventDeselected: () => this.deselectEvent()
        });
        
        logger.info('Event manager callbacks set up');
    }
    
    async addEvent(event) {
        try {
            // Generate ID for new event
            event.id = this.generateEventId();
            
            // Add to data manager
            await this.dataManager.addEvent(event);
            
            // Add to singularity system
            this.singularitySystem.addEvent(event);
            
            logger.info('Event added successfully', { id: event.id, title: event.title });
            return event;
        } catch (error) {
            logger.handleError(error, 'addEvent');
            return null;
        }
    }
    
    async removeEvent(eventId) {
        try {
            // Remove from data manager
            const removedEvent = await this.dataManager.deleteEvent(eventId);
            
            if (removedEvent) {
                // Remove from singularity system
                this.singularitySystem.removeEvent(eventId);
                logger.info('Event removed successfully', { id: eventId });
                return true;
            }
            
            return false;
        } catch (error) {
            logger.handleError(error, 'removeEvent');
            return false;
        }
    }
    
    async updateEvent(updatedEvent) {
        try {
            // Update in data manager
            const event = await this.dataManager.updateEvent(updatedEvent.id, updatedEvent);
            
            if (event) {
                // Update in singularity system
                this.singularitySystem.updateEventData(updatedEvent);
                logger.info('Event updated successfully', { id: updatedEvent.id });
                return true;
            }
            
            return false;
        } catch (error) {
            logger.handleError(error, 'updateEvent');
            return false;
        }
    }
    
    async exportData() {
        try {
            // Use data manager to export data
            const success = this.dataManager.exportData();
            return success;
        } catch (error) {
            logger.handleError(error, 'exportData');
            return false;
        }
    }
    
    async importData(jsonData, mode) {
        try {
            // Parse JSON data
            const importedEvents = JSON.parse(jsonData);
            
            if (!Array.isArray(importedEvents)) {
                logger.error('Invalid JSON format, expected an array');
                return false;
            }
            
            // Add unique IDs to events if missing
            importedEvents.forEach(event => {
                if (!event.id) {
                    event.id = this.generateEventId();
                }
            });
            
            // Process based on import mode
            if (mode === 'replace') {
                // Replace all events
                this.dataManager.events = importedEvents;
                await this.dataManager.saveEvents();
                
                // Reload the visualization
                this.singularitySystem.loadEvents(importedEvents);
                
                logger.info('Events replaced with imported data', { count: importedEvents.length });
            } else if (mode === 'append') {
                // Append new events
                const currentIds = new Set(this.dataManager.events.map(e => e.id));
                
                // Add only events with non-duplicate IDs
                let addedCount = 0;
                for (const event of importedEvents) {
                    if (!currentIds.has(event.id)) {
                        this.dataManager.events.push(event);
                        addedCount++;
                    }
                }
                
                await this.dataManager.saveEvents();
                
                // Reload the visualization
                this.singularitySystem.loadEvents(this.dataManager.events);
                
                logger.info('Events appended from imported data', { 
                    added: addedCount,
                    total: this.dataManager.events.length
                });
            }
            
            return true;
        } catch (error) {
            logger.handleError(error, 'importData');
            return false;
        }
    }
    
    highlightEvent(eventId) {
        return this.singularitySystem.highlightEvent(eventId);
    }
    
    resetView() {
        this.singularitySystem.resetView();
    }
    
    deselectEvent() {
        // Clear selection in singularity system
        this.singularitySystem.selectedObject = null;
    }
    
    generateEventId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
}

// Export as global for non-module scripts
window.EventManager = EventManager;

export default EventManager;// js/eventManager.js