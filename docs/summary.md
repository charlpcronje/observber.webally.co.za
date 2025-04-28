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