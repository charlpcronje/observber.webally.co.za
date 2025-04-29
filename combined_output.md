# Combined Markdown Export

Generated: 2025-04-29T04:08:40.666234


## Index

- `.htaccess` — ~160 tokens
- `css\styles.css` — ~763 tokens
- `data\events.json` — ~603 tokens
- `docs\summary.md` — ~440 tokens
- `index.html` — ~376 tokens
- `js\app.js` — ~400 tokens
- `js\dataManager.js` — ~860 tokens
- `js\eventManager.js` — ~650 tokens
- `js\logger.js` — ~570 tokens
- `js\shapeFactory.js` — ~2316 tokens
- `js\singularitySystem.js` — ~2695 tokens
- `js\uiManager.js` — ~945 tokens

**Total tokens: ~10778**

---

### `.htaccess`

```
# .htaccess - Ensure proper MIME types for all files
<IfModule mod_mime.c>
  # Set JSON MIME type
  AddType application/json .json
  
  # Set correct MIME types for CSS and JavaScript
  AddType text/css .css
  AddType application/javascript .js
  
  # Allow cross-origin requests for local development
  <IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, OPTIONS"
    Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept"
  </IfModule>
</IfModule>

# Enable file caching but ensure JSON files are always fresh
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Set default cache time to 1 week
  ExpiresDefault "access plus 1 week"
  
  # JSON files should be checked more frequently
  ExpiresByType application/json "access plus 1 hour"
</IfModule>

# Prevent directory listing
Options -Indexes

# Redirect to index.html if directory is accessed
DirectoryIndex index.html
```

### `css\styles.css`

```css
/* css/styles.css */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background-color: #000;
    color: #fff;
    overflow: hidden;
}

#canvas-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

#ui-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
}

#title {
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 24px;
    color: rgba(0, 255, 255, 0.8);
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
    font-weight: bold;
}

#tooltip {
    position: absolute;
    padding: 8px 12px;
    background-color: rgba(10, 10, 20, 0.8);
    border: 1px solid rgba(0, 255, 255, 0.5);
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    pointer-events: none;
    transition: opacity 0.2s;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
}

#tooltip.hidden {
    opacity: 0;
}

#detail-panel {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    width: 380px;
    background-color: rgba(10, 10, 20, 0.85);
    border: 1px solid rgba(0, 255, 255, 0.5);
    border-radius: 8px;
    pointer-events: auto;
    transition: opacity 0.3s, transform 0.3s;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
}

#detail-panel.hidden {
    opacity: 0;
    transform: translateY(-50%) translateX(400px);
    pointer-events: none;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid rgba(0, 255, 255, 0.3);
    background-color: rgba(0, 50, 80, 0.6);
}

.panel-header h2 {
    margin: 0;
    font-size: 18px;
    color: rgba(0, 255, 255, 0.9);
}

.panel-content {
    padding: 20px;
}

.event-detail {
    margin-bottom: 15px;
}

.label {
    display: inline-block;
    width: 100px;
    font-weight: bold;
    color: rgba(255, 100, 255, 0.9);
}

#event-description {
    margin-top: 8px;
    line-height: 1.5;
}

#controls {
    position: absolute;
    bottom: 20px;
    left: 20px;
    pointer-events: auto;
}

button {
    background-color: rgba(0, 80, 120, 0.6);
    color: rgba(0, 255, 255, 0.9);
    border: 1px solid rgba(0, 255, 255, 0.5);
    border-radius: 4px;
    padding: 8px 16px;
    margin-right: 10px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    outline: none;
}

button:hover {
    background-color: rgba(0, 100, 150, 0.8);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
}

#close-panel, #close-form {
    background: none;
    border: none;
    color: rgba(0, 255, 255, 0.7);
    font-size: 24px;
    cursor: pointer;
    padding: 0 5px;
}

#close-panel:hover, #close-form:hover {
    color: rgba(0, 255, 255, 1);
    text-shadow: 0 0 8px rgba(0, 255, 255, 0.8);
}

#add-event-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    background-color: rgba(10, 10, 20, 0.9);
    border: 1px solid rgba(0, 255, 255, 0.5);
    border-radius: 8px;
    pointer-events: auto;
    transition: opacity 0.3s;
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
    z-index: 10;
}

#add-event-form.hidden, #import-dialog.hidden {
    opacity: 0;
    pointer-events: none;
}

.form-content {
    padding: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    color: rgba(0, 255, 255, 0.9);
}

.form-group input, .form-group textarea {
    width: 100%;
    padding: 8px 12px;
    background-color: rgba(30, 30, 50, 0.6);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.checkbox-group label {
    margin-right: 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.checkbox-group input {
    width: auto;
    margin-right: 5px;
}

#save-event-btn, #confirm-import-btn {
    margin-top: 10px;
    width: 100%;
    padding: 10px;
    background-color: rgba(0, 100, 150, 0.7);
}

/* Import dialog specific styles */
#import-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background-color: rgba(10, 10, 20, 0.9);
    border: 1px solid rgba(0, 255, 255, 0.5);
    border-radius: 8px;
    pointer-events: auto;
    transition: opacity 0.3s;
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
    z-index: 10;
}

.import-options {
    margin: 15px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.import-options label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.import-options input {
    margin-right: 10px;
}
```

### `data\events.json`

```json
[
    {
        "id": "event1",
        "title": "Fall from 4 Stories onto Cement",
        "age": 16,
        "year": null,
        "type": [
            "Trauma"
        ],
        "probability": 0.000001,
        "description": "Fell from 4 stories (12-15 meters) directly onto cement, landing flat on back. No fractures, no internal injuries. Walked away unharmed without hospitalization."
    },
    {
        "id": "event2",
        "title": "BMW X5 Crash at 160km/h",
        "age": 30,
        "year": null,
        "type": [
            "Trauma",
            "Impact"
        ],
        "probability": 0.000000001,
        "description": "Driving at 160+ km/h, lost control, rolled forward multiple times. No seatbelt. Went through front and side windows. Back broken in 7 places, walked away from crash. Full recovery after 5 weeks wearing a Velcro back brace."
    },
    {
        "id": "event3",
        "title": "Terminal Liver Failure Recovery",
        "age": 30,
        "year": null,
        "type": [
            "Biochemical"
        ],
        "probability": 0.000001,
        "description": "Diagnosed with liver enzyme counts around 2,000, indicating total liver shutdown. Prognosis: 2 weeks to live. Self-medicated with heavy doses of OTC liver supplements (approx. 40 pills/day). Fully recovered in 2 weeks without hospitalization."
    },
    {
        "id": "event4",
        "title": "Spider Bite Infection Averted",
        "age": 13,
        "year": null,
        "type": [
            "Micro-causal",
            "Biochemical"
        ],
        "probability": 0.00000001,
        "description": "Bitten by spider; infection forming. Randomly caught broken phone aerial that punctured the exact spot, ejecting infection. Friend with similar bite hospitalized with severe infection. Survival through improbable physical intervention."
    },
    {
        "id": "event5",
        "title": "Motorbike at 200km/h — Gate Opens",
        "age": 17,
        "year": null,
        "type": [
            "Impact",
            "Luck"
        ],
        "probability": 0.000000001,
        "description": "Reached 200 km/h on a 350cc 2-stroke motorbike. Approaching closed steel gate with no time to brake. Gate randomly opened within ~200 milliseconds, allowing safe passage through the open gap instead of fatal collision."
    },
    {
        "id": "event6",
        "title": "Footpeg Embedded in Knee",
        "age": "Teens",
        "year": null,
        "type": [
            "Trauma",
            "Biochemical"
        ],
        "probability": 0.001,
        "description": "Motorbike footpeg broke off and embedded into knee. Delayed treatment by one day. Manually extracted peg at hospital under minimal sedation. Avoided major infection or mobility loss."
    },
    {
        "id": "event7",
        "title": "Motorbike Scrambler Crashes (~100 times)",
        "age": "Teens",
        "year": null,
        "type": [
            "Trauma",
            "Impact"
        ],
        "probability": 0.01,
        "description": "Approximately 100 crashes while racing motorbikes off-road without proper gear. Sustained minor injuries (broken fingers, toes) but always recovered fully. No long-term consequences."
    },
    {
        "id": "event8",
        "title": "Holding Breath 6+ Minutes Despite Smoking",
        "age": "40s",
        "year": null,
        "type": [
            "Biochemical"
        ],
        "probability": 0.001,
        "description": "Able to hold breath over 6 minutes despite 30 years of smoking history. Matches elite freediver lung capacity without training. Normal lung damage from smoking absent."
    },
    {
        "id": "event9",
        "title": "4th Story Fall on Back at Drive-in",
        "age": "Teens",
        "year": null,
        "type": [
            "Trauma"
        ],
        "probability": 0.0001,
        "description": "Fell from the 4th story height onto solid cement while messing around. Landed on back. No fractures, no hospitalization, no long-term damage."
    }
]
```

### `docs\summary.md`

```md
# Charl's Survival Singularity Map - External Data Update

## Changes Made to Support External JSON Data:

1. **Created External Data File**:
   - Added `data/events.json` with all survival events
   - Each event now has a unique ID

2. **Updated DataManager**:
   - Removed hardcoded default events array
   - Added fetch functionality to load events from external JSON file
   - Added import/export methods for handling JSON data
   - Maintains localStorage caching for performance

3. **Added Import/Export UI**:
   - Added "Import Data" button in the UI
   - Created import dialog with options to replace or append events
   - Enhanced the export functionality to download current events

4. **Updated Event Management**:
   - Modified event handling to support loading from external source
   - Added proper ID generation and management
   - Enhanced error handling for JSON parsing

5. **Server Configuration**:
   - Added `.htaccess` file for proper MIME type handling
   - Configured caching rules for optimal performance
   - Added CORS headers for development environments

6. **Documentation**:
   - Created detailed README.md with instructions
   - Added comments throughout code for maintainability

## How to Manage Events:

### Edit Existing Events:
1. Export current events using the "Export Data" button
2. Modify the JSON file in any text editor
3. Import the modified file with "Replace all events" option

### Add New Events:
1. Option 1: Use the "Add Event" button in the UI
2. Option 2: Manually edit the `data/events.json` file and add new event objects
3. Option 3: Export current events, add new entries to the JSON, and import back

### Share Events:
- Export your event collection to share with others
- They can import your JSON file into their instance of the visualization

## File Structure:

```
├── index.html
├── .htaccess
├── README.md
├── css/
│   └── styles.css
├── data/
│   └── events.json
└── js/
    ├── app.js
    ├── dataManager.js
    ├── eventManager.js
    ├── logger.js
    ├── shapeFactory.js
    ├── singularitySystem.js
    └── uiManager.js
```

This update makes the system more flexible and maintainable by separating the data from the application code.
```

### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Charl's Survival Singularity</title>
    <link rel="stylesheet" href="css/styles.css">
    <!-- Import map for module resolution -->
    <script type="importmap">
    {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.174.0/examples/jsm/"
      }
    }
    </script>
</head>
<body>
    <div id="canvas-container"></div>
    <div id="ui-overlay">
        <div id="title">Charl's Survival Singularity</div>
        <div id="tooltip" class="hidden"></div>
        <div id="detail-panel" class="hidden">
            <div class="panel-header">
                <h2 id="event-title"></h2>
                <button id="close-panel">×</button>
            </div>
            <div class="panel-content">
                <div class="event-detail">
                    <span class="label">Age:</span>
                    <span id="event-age"></span>
                </div>
                <div class="event-detail">
                    <span class="label">Year:</span>
                    <span id="event-year"></span>
                </div>
                <div class="event-detail">
                    <span class="label">Type:</span>
                    <span id="event-type"></span>
                </div>
                <div class="event-detail">
                    <span class="label">Probability:</span>
                    <span id="event-probability"></span>
                </div>
                <div class="event-detail">
                    <span class="label">Description:</span>
                    <div id="event-description"></div>
                </div>
            </div>
        </div>
        <div id="controls">
            <button id="export-btn">Export Data</button>
            <button id="import-btn">Import Data</button>
            <button id="add-event-btn">Add Event</button>
        </div>
    </div>
    
    <!-- Add Event Form (initially hidden) -->
    <div id="add-event-form" class="hidden">
        <div class="panel-header">
            <h2>Add New Survival Event</h2>
            <button id="close-form">×</button>
        </div>
        <div class="form-content">
            <div class="form-group">
                <label for="input-title">Title:</label>
                <input type="text" id="input-title" required>
            </div>
            <div class="form-group">
                <label for="input-age">Age:</label>
                <input type="text" id="input-age" required>
            </div>
            <div class="form-group">
                <label for="input-year">Year (optional):</label>
                <input type="text" id="input-year">
            </div>
            <div class="form-group">
                <label>Type:</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" value="Trauma"> Trauma</label>
                    <label><input type="checkbox" value="Impact"> Impact</label>
                    <label><input type="checkbox" value="Biochemical"> Biochemical</label>
                    <label><input type="checkbox" value="Luck"> Luck</label>
                    <label><input type="checkbox" value="Micro-causal"> Micro-causal</label>
                </div>
            </div>
            <div class="form-group">
                <label for="input-probability">Probability (1 in X):</label>
                <input type="number" id="input-probability" required>
            </div>
            <div class="form-group">
                <label for="input-description">Description:</label>
                <textarea id="input-description" rows="4" required></textarea>
            </div>
            <button id="save-event-btn">Save Event</button>
        </div>
    </div>
    
    <!-- Import File Dialog (initially hidden) -->
    <div id="import-dialog" class="hidden">
        <div class="panel-header">
            <h2>Import Events</h2>
            <button id="close-import">×</button>
        </div>
        <div class="form-content">
            <div class="form-group">
                <label for="import-file">Select JSON File:</label>
                <input type="file" id="import-file" accept=".json">
            </div>
            <div class="import-options">
                <label>
                    <input type="radio" name="import-mode" value="replace" checked> Replace all events
                </label>
                <label>
                    <input type="radio" name="import-mode" value="append"> Append to existing events
                </label>
            </div>
            <button id="confirm-import-btn">Import</button>
        </div>
    </div>

    <!-- Main application script (loads all other modules) -->
    <script type="module" src="js/app.js"></script>
</body>
</html>
```

### `js\app.js`

```js
// js/app.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Make THREE available globally for backward compatibility
window.THREE = THREE;

// Import our modules after adding THREE to window
import logger from './logger.js';
import DataManager from './dataManager.js';
import ShapeFactory from './shapeFactory.js';
import SingularitySystem from './singularitySystem.js';
import UIManager from './uiManager.js';
import EventManager from './eventManager.js';

/**
 * Main application class
 */
class App {
    /**
     * Creates a new App instance
     */
    constructor() {
        this.container = document.getElementById('canvas-container');
        
        // Initialize system components
        this.initializeComponents();
    }
    
    /**
     * Initializes all system components
     */
    async initializeComponents() {
        try {
            // Create data manager
            this.dataManager = new DataManager();
            
            // Create singularity system
            this.singularitySystem = new SingularitySystem(this.container);
            
            // Create UI manager
            this.uiManager = new UIManager();
            
            // Create event manager to coordinate
            this.eventManager = new EventManager(
                this.dataManager,
                this.singularitySystem,
                this.uiManager
            );
            
            // Initialize event manager (loads data and sets up visualization)
            await this.eventManager.initialize();
            
            logger.info('Charl\'s Survival Singularity application initialized');
        } catch (error) {
            logger.handleError(error, 'initializeComponents');
            this.showErrorMessage('Failed to initialize application. Please check the console for details.');
        }
    }
    
    /**
     * Shows an error message to the user
     * @param {string} message - Error message to display
     */
    showErrorMessage(message) {
        const errorElement = document.createElement('div');
        errorElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(50, 0, 0, 0.9);
            color: #ff7777;
            padding: 20px;
            border-radius: 8px;
            font-size: 16px;
            max-width: 400px;
            text-align: center;
            z-index: 10000;
            border: 1px solid #ff5555;
        `;
        errorElement.textContent = message;
        document.body.appendChild(errorElement);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.app = new App();
    } catch (error) {
        console.error('Failed to start application:', error);
        alert('Failed to start application. Please check the console for details.');
    }
});
```

### `js\dataManager.js`

```js
// js/dataManager.js
import logger from './logger.js';

/**
 * Manages event data loading, saving, and manipulation
 */
class DataManager {
    /**
     * Creates a new DataManager instance
     */
    constructor() {
        this.events = [];
        this.storageKey = 'charlSurvivalEvents';
        this.eventsFilePath = 'data/events.json';
    }

    /**
     * Loads events from localStorage or falls back to JSON file
     * @returns {Promise<Array>} Array of event objects
     */
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
    
    /**
     * Fetches events from the JSON file
     * @returns {Promise<Array>} Array of event objects
     */
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

    /**
     * Saves events to localStorage
     * @returns {Promise<boolean>} Success status
     */
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

    /**
     * Adds a new event
     * @param {Object} event - Event object to add
     * @returns {Promise<Object|null>} Added event or null on failure
     */
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

    /**
     * Updates an existing event
     * @param {string} eventId - ID of event to update
     * @param {Object} updatedEvent - Updated event data
     * @returns {Promise<Object|null>} Updated event or null on failure
     */
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

    /**
     * Deletes an event
     * @param {string} eventId - ID of event to delete
     * @returns {Promise<Object|null>} Removed event or null on failure
     */
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

    /**
     * Gets a copy of all events
     * @returns {Array} Copy of events array
     */
    getEvents() {
        return [...this.events];
    }

    /**
     * Exports events to a downloadable JSON file
     * @returns {boolean} Success status
     */
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
    
    /**
     * Imports events from JSON data
     * @param {string} jsonData - JSON string to import
     * @returns {boolean} Success status
     */
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

    /**
     * Generates a unique ID for events
     * @returns {string} Unique ID
     */
    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
}

// Make available globally
window.DataManager = DataManager;

export default DataManager;
```

### `js\eventManager.js`

```js
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
```

### `js\logger.js`

```js
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
```

### `js\shapeFactory.js`

```js
// js/shapeFactory.js
import * as THREE from 'three';
import logger from './logger.js';

/**
 * Factory class for creating various 3D shapes representing events
 */
class ShapeFactory {
    /**
     * Creates a new ShapeFactory instance
     */
    constructor() {
        this.typeToShapeMap = {
            'Trauma': 'pyramid',
            'Impact': 'cube',
            'Biochemical': 'sphere',
            'Luck': 'bullseye',
            'Micro-causal': 'star'
        };
        
        this.typeToColorMap = {
            'Trauma': 0xff2a6d,    // Neon Magenta
            'Impact': 0x05d9e8,    // Neon Cyan
            'Biochemical': 0x01c716, // Laser Green
            'Luck': 0xf706cf,      // Bright Pink
            'Micro-causal': 0xfdff00 // Neon Yellow
        };
        
        // Cache for materials to avoid creating duplicates
        this.materials = {};
    }

    /**
     * Creates a 3D shape representing an event
     * @param {Object} event - Event object with type and probability
     * @returns {THREE.Object3D} 3D object representing the event
     */
    createEventShape(event) {
        try {
            const types = event.type;
            
            // Determine shape based on event types
            let shape;
            if (types.length === 1) {
                shape = this.createSingleShape(types[0], event.probability);
            } else {
                shape = this.createHybridShape(types, event.probability);
            }
            
            // Add metadata to the shape for interaction
            shape.userData = {
                event: event,
                originalScale: shape.scale.clone()
            };
            
            // Add subtle animation
            this.addPulseAnimation(shape);
            
            return shape;
        } catch (error) {
            logger.handleError(error, 'createEventShape');
            // Return a fallback shape on error
            return this.createFallbackShape(event);
        }
    }
    
    /**
     * Creates a single shape for events with one type
     * @param {string} type - Event type 
     * @param {number} probability - Event probability
     * @returns {THREE.Object3D} 3D object for the shape
     */
    createSingleShape(type, probability) {
        const shapeType = this.typeToShapeMap[type] || 'sphere';
        const color = this.typeToColorMap[type] || 0xffffff;
        
        const material = this.getMaterial(color);
        const glowIntensity = this.calculateGlowIntensity(probability);
        const size = this.calculateSize(probability);
        
        let geometry;
        let mesh;
        
        switch (shapeType) {
            case 'pyramid':
                geometry = new THREE.ConeGeometry(size, size * 1.5, 4);
                mesh = new THREE.Mesh(geometry, material);
                break;
                
            case 'cube':
                geometry = new THREE.BoxGeometry(size, size, size);
                mesh = new THREE.Mesh(geometry, material);
                break;
                
            case 'bullseye':
                mesh = new THREE.Group();
                
                // Outer ring
                const torusGeometry = new THREE.TorusGeometry(size * 0.8, size * 0.2, 16, 32);
                const torus = new THREE.Mesh(torusGeometry, material);
                
                // Center sphere
                const sphereGeometry = new THREE.SphereGeometry(size * 0.4, 16, 16);
                const sphere = new THREE.Mesh(sphereGeometry, material);
                
                mesh.add(torus);
                mesh.add(sphere);
                break;
                
            case 'star':
                mesh = this.createStarShape(size, color);
                break;
                
            case 'sphere':
            default:
                geometry = new THREE.SphereGeometry(size, 32, 32);
                mesh = new THREE.Mesh(geometry, material);
                break;
        }
        
        // Add glow effect based on probability
        this.addGlowEffect(mesh, color, glowIntensity);
        
        return mesh;
    }
    
    /**
     * Creates a hybrid shape for events with multiple types
     * @param {Array<string>} types - Array of event types
     * @param {number} probability - Event probability
     * @returns {THREE.Group} Group containing component shapes
     */
    createHybridShape(types, probability) {
        // Create a group to hold the hybrid shape
        const hybridShape = new THREE.Group();
        
        // Calculate main parameters
        const glowIntensity = this.calculateGlowIntensity(probability);
        const size = this.calculateSize(probability);
        
        // Add component shapes for each type
        types.forEach((type, index) => {
            const color = this.typeToColorMap[type] || 0xffffff;
            const material = this.getMaterial(color);
            let componentShape;
            
            // Calculate position offset for each component
            const angleOffset = (index / types.length) * Math.PI * 2;
            const distanceFromCenter = size * 0.5;
            const x = Math.cos(angleOffset) * distanceFromCenter;
            const y = Math.sin(angleOffset) * distanceFromCenter;
            
            switch (this.typeToShapeMap[type]) {
                case 'pyramid':
                    const coneGeometry = new THREE.ConeGeometry(size * 0.4, size * 0.6, 4);
                    componentShape = new THREE.Mesh(coneGeometry, material);
                    break;
                    
                case 'cube':
                    const boxGeometry = new THREE.BoxGeometry(size * 0.5, size * 0.5, size * 0.5);
                    componentShape = new THREE.Mesh(boxGeometry, material);
                    break;
                    
                case 'bullseye':
                    componentShape = new THREE.Group();
                    const torusGeometry = new THREE.TorusGeometry(size * 0.3, size * 0.1, 16, 32);
                    const torus = new THREE.Mesh(torusGeometry, material);
                    const sphereGeometry = new THREE.SphereGeometry(size * 0.15, 16, 16);
                    const sphere = new THREE.Mesh(sphereGeometry, material);
                    componentShape.add(torus);
                    componentShape.add(sphere);
                    break;
                    
                case 'star':
                    componentShape = this.createStarShape(size * 0.4, color);
                    break;
                    
                case 'sphere':
                default:
                    const geometry = new THREE.SphereGeometry(size * 0.4, 16, 16);
                    componentShape = new THREE.Mesh(geometry, material);
                    break;
            }
            
            // Position the component shape
            componentShape.position.set(x, y, 0);
            
            // Add glow effect to component
            this.addGlowEffect(componentShape, color, glowIntensity * 0.8);
            
            // Add component to hybrid shape
            hybridShape.add(componentShape);
        });
        
        // Add central connecting element
        const centralColor = this.blendColors(types);
        const centralMaterial = this.getMaterial(centralColor);
        const centralGeometry = new THREE.SphereGeometry(size * 0.3, 16, 16);
        const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
        
        // Add glow to central element
        this.addGlowEffect(centralSphere, centralColor, glowIntensity);
        
        hybridShape.add(centralSphere);
        return hybridShape;
    }
    
    /**
     * Creates a star-shaped object
     * @param {number} size - Size of the star
     * @param {number} color - Color of the star (hex)
     * @returns {THREE.Group} Group containing star components
     */
    createStarShape(size, color) {
        // Create a star-like shape with multiple spikes
        const group = new THREE.Group();
        const material = this.getMaterial(color);
        
        // Create 8 spikes
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            
            const coneGeometry = new THREE.ConeGeometry(size * 0.2, size, 8);
            const cone = new THREE.Mesh(coneGeometry, material);
            
            // Position and rotate the spike
            cone.position.x = Math.cos(angle) * size * 0.4;
            cone.position.y = Math.sin(angle) * size * 0.4;
            cone.rotation.z = angle - Math.PI / 2;
            
            group.add(cone);
        }
        
        // Add a central sphere
        const sphereGeometry = new THREE.SphereGeometry(size * 0.3, 16, 16);
        const sphere = new THREE.Mesh(sphereGeometry, material);
        group.add(sphere);
        
        return group;
    }
    
    /**
     * Creates a simple fallback shape for error cases
     * @param {Object} event - Event data
     * @returns {THREE.Mesh} Simple wireframe sphere
     */
    createFallbackShape(event) {
        // Simple fallback shape for error cases
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Add event data for interaction
        mesh.userData = { event: event };
        
        return mesh;
    }
    
    /**
     * Gets or creates a material with specified color
     * @param {number} color - Hex color
     * @returns {THREE.Material} Material instance
     */
    getMaterial(color) {
        // Cache materials to avoid duplicates
        const key = color.toString(16);
        if (!this.materials[key]) {
            this.materials[key] = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.7,
                wireframe: false
            });
        }
        return this.materials[key];
    }
    
    /**
     * Adds glow effect to a mesh or group
     * @param {THREE.Object3D} mesh - Object to add glow to
     * @param {number} color - Glow color
     * @param {number} intensity - Glow intensity
     */
    addGlowEffect(mesh, color, intensity) {
        // Add edge highlighting material
        if (mesh instanceof THREE.Group) {
            // Apply to all children if it's a group
            mesh.children.forEach(child => {
                if (child instanceof THREE.Mesh) {
                    this.addGlowToMesh(child, color, intensity);
                }
            });
        } else if (mesh instanceof THREE.Mesh) {
            this.addGlowToMesh(mesh, color, intensity);
        }
    }
    
    /**
     * Adds glow effect to a specific mesh
     * @param {THREE.Mesh} mesh - Mesh to add glow to
     * @param {number} color - Glow color
     * @param {number} intensity - Glow intensity
     */
    addGlowToMesh(mesh, color, intensity) {
        // Create edge highlight by adding a slightly larger wireframe version
        const edgeGeometry = mesh.geometry.clone();
        const edgeMaterial = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: Math.min(0.8, intensity * 0.5)
        });
        
        const edges = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edges.scale.multiplyScalar(1.05);
        mesh.add(edges);
        
        // Store original color for animations
        mesh.userData.originalColor = color;
        mesh.userData.glowIntensity = intensity;
    }
    
    /**
     * Adds pulsing animation to a shape
     * @param {THREE.Object3D} shape - Shape to animate
     */
    addPulseAnimation(shape) {
        // Add subtle pulsing animation to the shape
        const pulseSpeed = 0.0003 + Math.random() * 0.0005;
        const pulseRange = 0.05 + Math.random() * 0.1;
        
        shape.userData.animation = {
            pulse: {
                speed: pulseSpeed,
                range: pulseRange,
                phase: Math.random() * Math.PI * 2 // Random starting phase
            }
        };
    }
    
    /**
     * Calculates glow intensity based on probability
     * @param {number} probability - Event probability
     * @returns {number} Glow intensity (0.3-1.0)
     */
    calculateGlowIntensity(probability) {
        // Higher intensity for rarer events (lower probability)
        // Scale logarithmically to handle wide range of probabilities
        if (probability <= 0) return 1.0; // Max intensity for zero probability
        
        // Convert probability to log scale and normalize
        const logProb = Math.log10(probability);
        const maxLogProb = 0; // log10(1) = 0
        const minLogProb = -9; // Approximately log10(0.000000001)
        
        // Normalize to 0-1 range and invert (lower probability = higher intensity)
        const normalizedIntensity = 1 - ((logProb - minLogProb) / (maxLogProb - minLogProb));
        
        // Scale to appropriate range (0.3 to 1.0)
        return 0.3 + (normalizedIntensity * 0.7);
    }
    
    /**
     * Calculates size based on probability
     * @param {number} probability - Event probability
     * @returns {number} Size value
     */
    calculateSize(probability) {
        // Base size with slight variation based on probability
        const baseSize = 1.0;
        const variationRange = 0.5;
        
        // Similar calculation as glow intensity but with smaller effect
        if (probability <= 0) return baseSize + (variationRange * 0.8);
        
        const logProb = Math.log10(probability);
        const maxLogProb = 0;
        const minLogProb = -9;
        
        const normalizedValue = 1 - ((logProb - minLogProb) / (maxLogProb - minLogProb));
        
        // Scale to smaller range to avoid too much size variation
        return baseSize + (normalizedValue * variationRange * 0.5);
    }
    
    /**
     * Blends multiple colors for hybrid shapes
     * @param {Array<string>} types - Event types to blend colors from
     * @returns {number} Blended color (hex)
     */
    blendColors(types) {
        // Blend colors from multiple types
        if (types.length === 0) return 0xffffff;
        if (types.length === 1) return this.typeToColorMap[types[0]] || 0xffffff;
        
        let r = 0, g = 0, b = 0;
        
        types.forEach(type => {
            const color = this.typeToColorMap[type] || 0xffffff;
            r += (color >> 16) & 255;
            g += (color >> 8) & 255;
            b += color & 255;
        });
        
        r = Math.round(r / types.length);
        g = Math.round(g / types.length);
        b = Math.round(b / types.length);
        
        return (r << 16) + (g << 8) + b;
    }
    
    /**
     * Updates animation state for a shape
     * @param {THREE.Object3D} shape - Shape to update
     * @param {number} deltaTime - Time since last update
     */
    updateAnimation(shape, deltaTime) {
        try {
            if (!shape.userData.animation) return;
            
            const animation = shape.userData.animation;
            
            // Update pulse animation
            if (animation.pulse) {
                const { speed, range, phase } = animation.pulse;
                const time = performance.now() * speed;
                const pulseFactor = 1 + (Math.sin(time + phase) * range);
                
                // Pulse scale
                if (shape.userData.originalScale) {
                    shape.scale.copy(shape.userData.originalScale).multiplyScalar(pulseFactor);
                } else {
                    // Fallback if originalScale is not available
                    shape.scale.set(pulseFactor, pulseFactor, pulseFactor);
                }
                
                // Pulse glow intensity for edge effect
                if (shape instanceof THREE.Group) {
                    shape.children.forEach(child => this.updateChildMaterialOpacity(child, pulseFactor));
                } else {
                    this.updateChildMaterialOpacity(shape, pulseFactor);
                }
            }
        } catch (error) {
            logger.handleError(error, 'updateAnimation');
        }
    }
    
    /**
     * Updates material opacity for animation
     * @param {THREE.Object3D} object - Object to update
     * @param {number} pulseFactor - Animation pulse factor
     */
    updateChildMaterialOpacity(object, pulseFactor) {
        // Update opacity for mesh and its children recursively
        if (object instanceof THREE.Mesh) {
            // Update edge glow if it exists
            object.children.forEach(child => {
                if (child instanceof THREE.Mesh && child.material.wireframe) {
                    const baseOpacity = object.userData.glowIntensity ? 
                        object.userData.glowIntensity * 0.5 : 0.4;
                    child.material.opacity = baseOpacity * pulseFactor;
                }
            });
        }
        
        // Recursively process children
        object.children.forEach(child => this.updateChildMaterialOpacity(child, pulseFactor));
    }
}

// Make available globally
window.ShapeFactory = ShapeFactory;

export default ShapeFactory;
```

### `js\singularitySystem.js`

```js
// js/singularitySystem.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import ShapeFactory from './shapeFactory.js';
import logger from './logger.js';

class SingularitySystem {
    constructor(container) {
        this.container = container;
        this.events = [];
        this.eventObjects = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.intersectedObject = null;
        this.selectedObject = null;
        this.clock = new THREE.Clock();
        this.shapeFactory = new ShapeFactory();
        
        this.init();
    }
    
    init() {
        try {
            this.setupScene();
            this.setupCamera();
            this.setupLights();
            this.setupRenderer();
            this.setupControls();
            this.setupCentralSingularity();
            this.setupPostprocessing();
            this.setupEventListeners();
            
            // Start the animation loop
            this.animate();
            
            logger.info('Singularity system initialized');
        } catch (error) {
            logger.handleError(error, 'SingularitySystem.init');
        }
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000010);
        
        // Add subtle background nebula
        this.addBackgroundNebula();
    }
    
    setupCamera() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 30);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupLights() {
        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);
        
        // Add point light at central singularity
        const pointLight = new THREE.PointLight(0x7fbfff, 1, 50);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.rotateSpeed = 0.7;
        this.controls.zoomSpeed = 1.0;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 80;
    }
    
    setupCentralSingularity() {
        // Create central glowing sphere representing the singularity
        const geometry = new THREE.SphereGeometry(1.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        this.centralSingularity = new THREE.Mesh(geometry, material);
        this.scene.add(this.centralSingularity);
        
        // Add glow effect
        this.addSingularityGlow();
        
        // Add subtle rotation
        this.centralSingularity.userData.rotation = {
            speed: 0.0003,
            axis: new THREE.Vector3(0.2, 1.0, 0.3).normalize()
        };
    }
    
    addSingularityGlow() {
        // Add multiple layers of glow effects
        
        // Inner bright core
        const coreGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0xccffff,
            transparent: true,
            opacity: 0.9
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.centralSingularity.add(core);
        
        // Outer glow (will be enhanced by bloom effect)
        const glowGeometry = new THREE.SphereGeometry(2.0, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x7fbfff,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.centralSingularity.add(glow);
        
        // Halo effect with rings
        this.addSingularityHalo();
    }
    
    addSingularityHalo() {
        // Add rings around the singularity
        const ringGeometry = new THREE.TorusGeometry(3, 0.1, 16, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x3399ff,
            transparent: true,
            opacity: 0.4
        });
        
        // Add multiple rings at different angles
        for (let i = 0; i < 3; i++) {
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            
            // Rotate each ring to a different orientation
            ring.rotation.x = Math.PI / 2 * i;
            ring.rotation.y = Math.PI / 4 * i;
            
            // Add animation data
            ring.userData.animation = {
                rotationSpeed: 0.0002 * (i + 1)
            };
            
            this.centralSingularity.add(ring);
        }
    }
    
    setupPostprocessing() {
        this.composer = new THREE.EffectComposer(this.renderer);
        
        // Add render pass
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Add bloom pass for glow effects
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,    // strength
            0.4,    // radius
            0.85    // threshold
        );
        this.composer.addPass(bloomPass);
    }
    
    addBackgroundNebula() {
        // Create a subtle nebula background
        const textureSize = 1024;
        const canvas = document.createElement('canvas');
        canvas.width = textureSize;
        canvas.height = textureSize;
        const ctx = canvas.getContext('2d');
        
        // Fill with dark background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, textureSize, textureSize);
        
        // Generate nebula-like effect
        this.generateNebulaEffect(ctx, textureSize);
        
        // Create a sphere geometry to show the nebula
        const geometry = new THREE.SphereGeometry(100, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(canvas),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.5
        });
        
        const nebula = new THREE.Mesh(geometry, material);
        this.scene.add(nebula);
        
        // Add slow rotation
        nebula.userData.rotation = {
            speed: 0.00005,
            axis: new THREE.Vector3(0.1, 1.0, 0.1).normalize()
        };
    }
    
    generateNebulaEffect(ctx, size) {
        // Generate a simple nebula-like effect using gradients and noise
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const radius = 50 + Math.random() * 150;
            
            // Create radial gradient
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            
            // Select a random color for the nebula cloud
            const colors = [
                [0, 0.1, 0.3],    // Blue
                [0.3, 0, 0.3],    // Purple
                [0, 0.2, 0.2],    // Teal
                [0.2, 0, 0.1]     // Red
            ];
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            gradient.addColorStop(0, `rgba(${Math.floor(color[0]*255)}, ${Math.floor(color[1]*255)}, ${Math.floor(color[2]*255)}, 0.2)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillRect(0, 0, size, size);
        }
        
        // Add some "stars"
        ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const radius = Math.random() * 1.5;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
            ctx.fill();
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onClick.bind(this));
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
    }
    
    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Find intersections with event objects only (not the central singularity or background)
        const intersects = this.raycaster.intersectObjects(this.eventObjects, true);
        
        // Handle hover states
        if (intersects.length > 0) {
            // Find the top-level event object that was intersected
            let topLevelObject = intersects[0].object;
            while (topLevelObject.parent && !topLevelObject.userData.event &&
                   topLevelObject.parent !== this.scene) {
                topLevelObject = topLevelObject.parent;
            }
            
            if (topLevelObject.userData.event) {
                // New hover target
                if (this.intersectedObject !== topLevelObject) {
                    // Clear previous hover
                    if (this.intersectedObject) {
                        this.onHoverExit(this.intersectedObject);
                    }
                    
                    this.intersectedObject = topLevelObject;
                    this.onHoverEnter(this.intersectedObject);
                }
                
                // Already hovering over this object, update tooltip position
                this.updateTooltipPosition(event, this.intersectedObject);
            }
        } else {
            // No intersection, clear hover state
            if (this.intersectedObject) {
                this.onHoverExit(this.intersectedObject);
                this.intersectedObject = null;
            }
        }
    }
    
    onClick(event) {
        // Handle click - open detail panel if an event is clicked
        if (this.intersectedObject && this.intersectedObject.userData.event) {
            if (this.selectedObject !== this.intersectedObject) {
                // Clear previous selection
                if (this.selectedObject) {
                    this.onSelectExit(this.selectedObject);
                }
                
                // Set new selection
                this.selectedObject = this.intersectedObject;
                this.onSelectEnter(this.selectedObject);
                
                // Show detail panel for this event
                if (typeof this.onEventSelected === 'function') {
                    this.onEventSelected(this.selectedObject.userData.event);
                }
            }
        } else {
            // Clicked empty space, clear selection
            if (this.selectedObject) {
                this.onSelectExit(this.selectedObject);
                this.selectedObject = null;
                
                // Hide detail panel
                if (typeof this.onEventDeselected === 'function') {
                    this.onEventDeselected();
                }
            }
        }
    }
    
    onHoverEnter(object) {
        // Highlight the object
        this.scaleObject(object, 1.2);
        
        // Show tooltip
        if (typeof this.onShowTooltip === 'function' && object.userData.event) {
            this.onShowTooltip(object.userData.event);
        }
    }
    
    onHoverExit(object) {
        // Remove highlight
        this.scaleObject(object, 1.0);
        
        // Hide tooltip
        if (typeof this.onHideTooltip === 'function') {
            this.onHideTooltip();
        }
    }
    
    onSelectEnter(object) {
        // Highlight the selected object more prominently
        this.scaleObject(object, 1.5);
    }
    
    onSelectExit(object) {
        // Remove selection highlight
        this.scaleObject(object, 1.0);
    }
    
    scaleObject(object, scale) {
        // Scale the object while preserving its original scale
        if (object.userData.originalScale) {
            object.scale.copy(object.userData.originalScale).multiplyScalar(scale);
        } else {
            // If originalScale is not set, store current scale as original
            object.userData.originalScale = object.scale.clone();
            object.scale.multiplyScalar(scale);
        }
    }
    
    updateTooltipPosition(event, object) {
        // Update tooltip position
        if (typeof this.onUpdateTooltipPosition === 'function') {
            const position = {
                x: event.clientX,
                y: event.clientY
            };
            this.onUpdateTooltipPosition(position);
        }
    }
    
    loadEvents(events) {
        try {
            this.clearEvents();
            this.events = events;
            
            // Create 3D objects for each event
            this.createEventObjects();
            
            logger.info('Events loaded into singularity system', { count: events.length });
        } catch (error) {
            logger.handleError(error, 'loadEvents');
        }
    }
    
    clearEvents() {
        // Remove existing event objects from scene
        this.eventObjects.forEach(object => {
            this.scene.remove(object);
        });
        
        this.eventObjects = [];
    }
    
    createEventObjects() {
        try {
            // Calculate positioning scale based on number of events
            const radius = Math.max(10, 5 + this.events.length * 0.8);
            const spiralFactor = 0.2;
            
            // Sort events by age (to position older events further out)
            const sortedEvents = [...this.events].sort((a, b) => {
                const ageA = typeof a.age === 'number' ? a.age : 20; // Default age
                const ageB = typeof b.age === 'number' ? b.age : 20;
                return ageB - ageA; // Older events (smaller age) go earlier in array
            });
            
            // Create objects and position them in a spiral
            sortedEvents.forEach((event, index) => {
                // Create shape based on event type
                const eventShape = this.shapeFactory.createEventShape(event);
                
                // Position in spiral pattern
                const angle = index * 0.5;
                const distance = radius - (index * spiralFactor);
                const height = (index % 2 === 0) ? index * 0.2 : -index * 0.2;
                
                eventShape.position.x = Math.cos(angle) * distance;
                eventShape.position.y = Math.sin(angle) * distance;
                eventShape.position.z = height;
                
                // Store original position for animation
                eventShape.userData.originalPosition = eventShape.position.clone();
                
                // Add orbit animation
                eventShape.userData.orbit = {
                    angle: angle,
                    distance: distance,
                    height: height,
                    speed: 0.00005 + Math.random() * 0.00005
                };
                
                // Add to scene and tracking array
                this.scene.add(eventShape);
                this.eventObjects.push(eventShape);
            });
            
            logger.info('Event objects created', { count: this.eventObjects.length });
        } catch (error) {
            logger.handleError(error, 'createEventObjects');
        }
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const delta = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();
        
        // Update controls
        this.controls.update();
        
        // Update central singularity animation
        this.animateSingularity(delta, elapsedTime);
        
        // Update event objects animation
        this.animateEventObjects(delta, elapsedTime);
        
        // Render scene with composer for post-processing effects
        this.composer.render();
    }
    
    animateSingularity(delta, elapsedTime) {
        // Rotate central singularity
        if (this.centralSingularity.userData.rotation) {
            const rotation = this.centralSingularity.userData.rotation;
            this.centralSingularity.rotateOnAxis(rotation.axis, rotation.speed * delta * 1000);
        }
        
        // Animate singularity rings
        this.centralSingularity.children.forEach(child => {
            if (child.userData.animation && child.userData.animation.rotationSpeed) {
                child.rotation.z += child.userData.animation.rotationSpeed * delta * 1000;
            }
        });
        
        // Pulse effect for the core
        const pulseFactor = 1.0 + Math.sin(elapsedTime * 1.5) * 0.1;
        this.centralSingularity.scale.set(pulseFactor, pulseFactor, pulseFactor);
    }
    
    animateEventObjects(delta, elapsedTime) {
        this.eventObjects.forEach(object => {
            // Update shape animations
            this.shapeFactory.updateAnimation(object, delta);
            
            // Update orbit position
            if (object.userData.orbit) {
                const orbit = object.userData.orbit;
                orbit.angle += orbit.speed * delta * 1000;
                
                const x = Math.cos(orbit.angle) * orbit.distance;
                const y = Math.sin(orbit.angle) * orbit.distance;
                
                object.position.x = x;
                object.position.y = y;
            }
        });
    }
    
    setCallbacks(callbacks) {
        // Set callback functions for UI interaction
        if (callbacks.onShowTooltip) this.onShowTooltip = callbacks.onShowTooltip;
        if (callbacks.onHideTooltip) this.onHideTooltip = callbacks.onHideTooltip;
        if (callbacks.onUpdateTooltipPosition) this.onUpdateTooltipPosition = callbacks.onUpdateTooltipPosition;
        if (callbacks.onEventSelected) this.onEventSelected = callbacks.onEventSelected;
        if (callbacks.onEventDeselected) this.onEventDeselected = callbacks.onEventDeselected;
    }
    
    addEvent(event) {
        this.events.push(event);
        
        // Create and add the new event object
        const eventShape = this.shapeFactory.createEventShape(event);
        
        // Position the new event near the singularity first
        eventShape.position.set(3, 0, 0);
        
        // Calculate the final position
        const index = this.eventObjects.length;
        const angle = index * 0.5;
        const distance = 10 - (index * 0.2);
        const height = (index % 2 === 0) ? index * 0.2 : -index * 0.2;
        
        // Add orbit animation data
        eventShape.userData.orbit = {
            angle: angle,
            distance: distance,
            height: height,
            speed: 0.00005 + Math.random() * 0.00005
        };
        
        // Store original position for animation
        eventShape.userData.originalPosition = new THREE.Vector3(
            Math.cos(angle) * distance,
            Math.sin(angle) * distance,
            height
        );
        
        // Add to scene and tracking array
        this.scene.add(eventShape);
        this.eventObjects.push(eventShape);
        
        logger.info('New event added to singularity', { title: event.title });
        return eventShape;
    }
    
    removeEvent(eventId) {
        // Find the event and its object
        const eventIndex = this.events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            // Remove from events array
            this.events.splice(eventIndex, 1);
            
            // Find and remove the corresponding object
            const objectIndex = this.eventObjects.findIndex(o => 
                o.userData.event && o.userData.event.id === eventId
            );
            
            if (objectIndex !== -1) {
                const object = this.eventObjects[objectIndex];
                this.scene.remove(object);
                this.eventObjects.splice(objectIndex, 1);
                
                logger.info('Event removed from singularity', { id: eventId });
                return true;
            }
        }
        
        logger.warn('Failed to remove event, not found', { id: eventId });
        return false;
    }
    
    updateEventData(updatedEvent) {
        // Find the event
        const eventIndex = this.events.findIndex(e => e.id === updatedEvent.id);
        if (eventIndex !== -1) {
            // Update the event data
            this.events[eventIndex] = updatedEvent;
            
            // Find the corresponding object
            const objectIndex = this.eventObjects.findIndex(o => 
                o.userData.event && o.userData.event.id === updatedEvent.id
            );
            
            if (objectIndex !== -1) {
                // Update the object's event data
                this.eventObjects[objectIndex].userData.event = updatedEvent;
                
                logger.info('Event data updated in singularity', { id: updatedEvent.id });
                return true;
            }
        }
        
        logger.warn('Failed to update event, not found', { id: updatedEvent.id });
        return false;
    }
    
    // Method to highlight a specific event (e.g., for search functionality)
    highlightEvent(eventId) {
        let found = false;
        
        this.eventObjects.forEach(object => {
            if (object.userData.event && object.userData.event.id === eventId) {
                // Highlight this object
                this.scaleObject(object, 2.0);
                
                // Move camera to focus on this object
                const position = object.position.clone();
                this.controls.target.copy(position);
                
                // Move camera to a good viewing position
                const cameraOffset = new THREE.Vector3(5, 5, 5);
                this.camera.position.copy(position).add(cameraOffset);
                
                found = true;
            } else {
                // Reset other objects
                this.scaleObject(object, 1.0);
            }
        });
        
        return found;
    }
    
    // Reset view to show all events
    resetView() {
        // Reset all object scales
        this.eventObjects.forEach(object => {
            this.scaleObject(object, 1.0);
        });
        
        // Reset camera position and target
        this.camera.position.set(0, 0, 30);
        this.controls.target.set(0, 0, 0);
    }
}

// Export as global for non-module scripts
window.SingularitySystem = SingularitySystem;

export default SingularitySystem;
```

### `js\uiManager.js`

```js
// js/eventManager.js
import logger from './logger.js';

/**
 * Coordinates between data, visualization, and UI components
 */
class EventManager {
    /**
     * Creates a new EventManager
     * @param {DataManager} dataManager - Data manager instance
     * @param {SingularitySystem} singularitySystem - Singularity system instance
     * @param {UIManager} uiManager - UI manager instance
     */
    constructor(dataManager, singularitySystem, uiManager) {
        this.dataManager = dataManager;
        this.singularitySystem = singularitySystem;
        this.uiManager = uiManager;
        
        this.setupCallbacks();
    }
    
    /**
     * Initializes the system
     * @returns {Promise<boolean>} Success status
     */
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
    
    /**
     * Sets up callbacks between components
     */
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
    
    /**
     * Adds a new event
     * @param {Object} event - Event to add
     * @returns {Promise<Object|null>} Added event or null on failure
     */
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
    
    /**
     * Removes an event
     * @param {string} eventId - ID of event to remove
     * @returns {Promise<boolean>} Success status
     */
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
    
    /**
     * Updates an event
     * @param {Object} updatedEvent - Updated event data
     * @returns {Promise<boolean>} Success status
     */
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
    
    /**
     * Exports events data to a file
     * @returns {Promise<boolean>} Success status
     */
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
    
    /**
     * Imports events from JSON data
     * @param {string} jsonData - JSON string of events
     * @param {string} mode - Import mode ('replace' or 'append')
     * @returns {Promise<boolean>} Success status
     */
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
    
    /**
     * Highlights a specific event in the visualization
     * @param {string} eventId - Event ID to highlight
     * @returns {boolean} Success status
     */
    highlightEvent(eventId) {
        return this.singularitySystem.highlightEvent(eventId);
    }
    
    /**
     * Resets the view to show all events
     */
    resetView() {
        this.singularitySystem.resetView();
    }
    
    /**
     * Deselects the currently selected event
     */
    deselectEvent() {
        // Clear selection in singularity system
        this.singularitySystem.selectedObject = null;
    }
    
    /**
     * Generates a unique ID for events
     * @returns {string} Unique ID
     */
    generateEventId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
}

// Make available globally
window.EventManager = EventManager;

export default EventManager;
```
