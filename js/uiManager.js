showImportDialog() {
    this.importDialog.classList.remove('hidden');
}

hideImportDialog() {
    this.importDialog.classList.add('hidden');
    // Reset file input
    this.importFile.value = '';
}

importEvents() {
    try {
        const fileInput = this.importFile;
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('Please select a file to import');
            return;
        }
        
        const file = fileInput.files[0];
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            alert('Please select a JSON file');
            return;
        }
        
        // Get selected import mode
        let importMode = 'replace';
        for (const radio of this.importMode) {
            if (radio.checked) {
                importMode = radio.value;
                break;
            }
        }
        
        // Read the file
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileContent = event.target.result;
            
            try {
                // Call the import callback function
                if (typeof this.onImportData === 'function') {
                    const success = this.onImportData(fileContent, importMode);
                    
                    if (success) {
                        alert('Events imported successfully');
                        this.hideImportDialog();
                    } else {
                        alert('Failed to import events. Please check the file format.');
                    }
                }
            } catch (error) {
                logger.handleError(error, 'importEvents.parseJson');
                alert('Error parsing JSON file. Please make sure it\'s a valid JSON format.');
            }
        };
        
        reader.onerror = () => {
            logger.error('Error reading file', { fileName: file.name });
            alert('Error reading file. Please try again.');
        };
        
        reader.readAsText(file);
    } catch (error) {
        logger.handleError(error, 'importEvents');
        alert('Error importing events. Please check the console for details.');
    }
}

setCallbacks(callbacks) {
    if (callbacks.onAddEvent) this.onAddEvent = callbacks.onAddEvent;
    if (callbacks.onExportData) this.onExportData = callbacks.onExportData;
    if (callbacks.onImportData) this.onImportData = callbacks.onImportData;
    if (callbacks.onEventDeselected) this.onEventDeselected = callbacks.onEventDeselected;
}// js/uiManager.js
import logger from './logger.js';

class UIManager {
constructor() {
    this.initElements();
    this.setupEventListeners();
    
    // Format helpers
    this.probabilityFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 9
    });
}

initElements() {
    // UI elements
    this.tooltip = document.getElementById('tooltip');
    this.detailPanel = document.getElementById('detail-panel');
    this.closePanel = document.getElementById('close-panel');
    
    // Detail panel elements
    this.eventTitle = document.getElementById('event-title');
    this.eventAge = document.getElementById('event-age');
    this.eventYear = document.getElementById('event-year');
    this.eventType = document.getElementById('event-type');
    this.eventProbability = document.getElementById('event-probability');
    this.eventDescription = document.getElementById('event-description');
    
    // Form elements
    this.addEventForm = document.getElementById('add-event-form');
    this.addEventBtn = document.getElementById('add-event-btn');
    this.closeForm = document.getElementById('close-form');
    this.saveEventBtn = document.getElementById('save-event-btn');
    this.exportBtn = document.getElementById('export-btn');
    
    // Import elements
    this.importBtn = document.getElementById('import-btn');
    this.importDialog = document.getElementById('import-dialog');
    this.closeImport = document.getElementById('close-import');
    this.importFile = document.getElementById('import-file');
    this.confirmImportBtn = document.getElementById('confirm-import-btn');
    this.importMode = document.getElementsByName('import-mode');
    
    // Form input elements
    this.inputTitle = document.getElementById('input-title');
    this.inputAge = document.getElementById('input-age');
    this.inputYear = document.getElementById('input-year');
    this.inputProbability = document.getElementById('input-probability');
    this.inputDescription = document.getElementById('input-description');
    this.typeCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
}

setupEventListeners() {
    try {
        // Close panel button
        this.closePanel.addEventListener('click', () => {
            this.hideDetailPanel();
            if (typeof this.onEventDeselected === 'function') {
                this.onEventDeselected();
            }
        });
        
        // Add event button
        this.addEventBtn.addEventListener('click', () => {
            this.showAddEventForm();
        });
        
        // Close form button
        this.closeForm.addEventListener('click', () => {
            this.hideAddEventForm();
        });
        
        // Save event button
        this.saveEventBtn.addEventListener('click', () => {
            this.saveNewEvent();
        });
        
        // Export button
        this.exportBtn.addEventListener('click', () => {
            if (typeof this.onExportData === 'function') {
                this.onExportData();
            }
        });
        
        // Import button
        this.importBtn.addEventListener('click', () => {
            this.showImportDialog();
        });
        
        // Close import dialog
        this.closeImport.addEventListener('click', () => {
            this.hideImportDialog();
        });
        
        // Confirm import button
        this.confirmImportBtn.addEventListener('click', () => {
            this.importEvents();
        });
        
        logger.info('UI event listeners set up');
    } catch (error) {
        logger.handleError(error, 'setupEventListeners');
    }
}

showTooltip(event) {
    try {
        // Set tooltip content
        this.tooltip.innerHTML = `
            <div class="tooltip-title">${event.title}</div>
            <div class="tooltip-prob">Probability: 1 in ${this.formatProbability(event.probability)}</div>
        `;
        
        // Show tooltip
        this.tooltip.classList.remove('hidden');
    } catch (error) {
        logger.handleError(error, 'showTooltip');
    }
}

hideTooltip() {
    this.tooltip.classList.add('hidden');
}

updateTooltipPosition(position) {
    this.tooltip.style.left = `${position.x + 15}px`;
    this.tooltip.style.top = `${position.y + 15}px`;
}

showDetailPanel(event) {
    try {
        // Fill panel with event details
        this.eventTitle.textContent = event.title;
        this.eventAge.textContent = event.age;
        this.eventYear.textContent = event.year || 'Unknown';
        this.eventType.textContent = event.type.join(', ');
        
        // Format probability as "1 in X" format
        this.eventProbability.textContent = `1 in ${this.formatProbability(event.probability)}`;
        
        // Description
        this.eventDescription.textContent = event.description;
        
        // Show panel
        this.detailPanel.classList.remove('hidden');
    } catch (error) {
        logger.handleError(error, 'showDetailPanel');
    }
}

hideDetailPanel() {
    this.detailPanel.classList.add('hidden');
}

showAddEventForm() {
    try {
        // Clear form fields
        this.resetForm();
        
        // Show form
        this.addEventForm.classList.remove('hidden');
    } catch (error) {
        logger.handleError(error, 'showAddEventForm');
    }
}

hideAddEventForm() {
    this.addEventForm.classList.add('hidden');
}

showImportDialog() {
    this.importDialog.classList.remove('hidden');
}

hideImportDialog() {
    this.importDialog.classList.add('hidden');
    // Reset file input
    this.importFile.value = '';
}

resetForm() {
    this.inputTitle.value = '';
    this.inputAge.value = '';
    this.inputYear.value = '';
    this.inputProbability.value = '';
    this.inputDescription.value = '';
    
    // Uncheck all type checkboxes
    this.typeCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

saveNewEvent() {
    try {
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        // Get selected types
        const selectedTypes = [];
        this.typeCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedTypes.push(checkbox.value);
            }
        });
        
        // Create event object
        const newEvent = {
            title: this.inputTitle.value.trim(),
            age: this.inputAge.value.trim(),
            year: this.inputYear.value.trim() || null,
            type: selectedTypes,
            probability: 1 / this.inputProbability.value, // Convert "1 in X" to probability
            description: this.inputDescription.value.trim()
        };
        
        // Call callback function
        if (typeof this.onAddEvent === 'function') {
            this.onAddEvent(newEvent);
        }
        
        // Hide form
        this.hideAddEventForm();
        
        logger.info('New event form submitted', { title: newEvent.title });
    } catch (error) {
        logger.handleError(error, 'saveNewEvent');
        alert('Error saving event. Please check the console for details.');
    }
}

importEvents() {
    try {
        const fileInput = this.importFile;
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('Please select a file to import');
            return;
        }
        
        const file = fileInput.files[0];
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            alert('Please select a JSON file');
            return;
        }
        
        // Get selected import mode
        let importMode = 'replace';
        for (const radio of this.importMode) {
            if (radio.checked) {
                importMode = radio.value;
                break;
            }
        }
        
        // Read the file
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileContent = event.target.result;
            
            try {
                // Call the import callback function
                if (typeof this.onImportData === 'function') {
                    const success = this.onImportData(fileContent, importMode);
                    
                    if (success) {
                        alert('Events imported successfully');
                        this.hideImportDialog();
                    } else {
                        alert('Failed to import events. Please check the file format.');
                    }
                }
            } catch (error) {
                logger.handleError(error, 'importEvents.parseJson');
                alert('Error parsing JSON file. Please make sure it\'s a valid JSON format.');
            }
        };
        
        reader.onerror = () => {
            logger.error('Error reading file', { fileName: file.name });
            alert('Error reading file. Please try again.');
        };
        
        reader.readAsText(file);
    } catch (error) {
        logger.handleError(error, 'importEvents');
        alert('Error importing events. Please check the console for details.');
    }
}

validateForm() {
    // Basic validation
    if (!this.inputTitle.value.trim()) {
        alert('Please enter an event title');
        return false;
    }
    
    if (!this.inputAge.value.trim()) {
        alert('Please enter an age');
        return false;
    }
    
    if (!this.inputProbability.value.trim() || isNaN(this.inputProbability.value) || 
        parseInt(this.inputProbability.value) <= 0) {
        alert('Please enter a valid probability value (as "1 in X" where X is a positive number)');
        return false;
    }
    
    // Check if at least one type is selected
    let typeSelected = false;
    this.typeCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            typeSelected = true;
        }
    });
    
    if (!typeSelected) {
        alert('Please select at least one event type');
        return false;
    }
    
    if (!this.inputDescription.value.trim()) {
        alert('Please enter a description');
        return false;
    }
    
    return true;
}

formatProbability(probability) {
    if (probability <= 0) return 'infinity';
    
    // Convert to "1 in X" format
    const oneInX = Math.round(1 / probability);
    
    // Format with separators for large numbers
    return this.probabilityFormatter.format(oneInX);
}

setCallbacks(callbacks) {
    if (callbacks.onAddEvent) this.onAddEvent = callbacks.onAddEvent;
    if (callbacks.onExportData) this.onExportData = callbacks.onExportData;
    if (callbacks.onImportData) this.onImportData = callbacks.onImportData;
    if (callbacks.onEventDeselected) this.onEventDeselected = callbacks.onEventDeselected;
}
}

// Export as global for non-module scripts
window.UIManager = UIManager;

export default UIManager;

showTooltip(event) {
    try {
        // Set tooltip content
        this.tooltip.innerHTML = `
            <div class="tooltip-title">${event.title}</div>
            <div class="tooltip-prob">Probability: 1 in ${this.formatProbability(event.probability)}</div>
        `;
        
        // Show tooltip
        this.tooltip.classList.remove('hidden');
    } catch (error) {
        logger.handleError(error, 'showTooltip');
    }
}

hideTooltip() {
    this.tooltip.classList.add('hidden');
}

updateTooltipPosition(position) {
    this.tooltip.style.left = `${position.x + 15}px`;
    this.tooltip.style.top = `${position.y + 15}px`;
}

showDetailPanel(event) {
    try {
        // Fill panel with event details
        this.eventTitle.textContent = event.title;
        this.eventAge.textContent = event.age;
        this.eventYear.textContent = event.year || 'Unknown';
        this.eventType.textContent = event.type.join(', ');
        
        // Format probability as "1 in X" format
        this.eventProbability.textContent = `1 in ${this.formatProbability(event.probability)}`;
        
        // Description
        this.eventDescription.textContent = event.description;
        
        // Show panel
        this.detailPanel.classList.remove('hidden');
    } catch (error) {
        logger.handleError(error, 'showDetailPanel');
    }
}

hideDetailPanel() {
    this.detailPanel.classList.add('hidden');
}

showAddEventForm() {
    try {
        // Clear form fields
        this.resetForm();
        
        // Show form
        this.addEventForm.classList.remove('hidden');
    } catch (error) {
        logger.handleError(error, 'showAddEventForm');
    }
}

hideAddEventForm() {
    this.addEventForm.classList.add('hidden');
}

resetForm() {
    this.inputTitle.value = '';
    this.inputAge.value = '';
    this.inputYear.value = '';
    this.inputProbability.value = '';
    this.inputDescription.value = '';
    
    // Uncheck all type checkboxes
    this.typeCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

saveNewEvent() {
    try {
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        // Get selected types
        const selectedTypes = [];
        this.typeCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedTypes.push(checkbox.value);
            }
        });
        
        // Create event object
        const newEvent = {
            title: this.inputTitle.value.trim(),
            age: this.inputAge.value.trim(),
            year: this.inputYear.value.trim() || null,
            type: selectedTypes,
            probability: 1 / this.inputProbability.value, // Convert "1 in X" to probability
            description: this.inputDescription.value.trim()
        };
        
        // Call callback function
        if (typeof this.onAddEvent === 'function') {
            this.onAddEvent(newEvent);
        }
        
        // Hide form
        this.hideAddEventForm();
        
        logger.info('New event form submitted', { title: newEvent.title });
    } catch (error) {
        logger.handleError(error, 'saveNewEvent');
        alert('Error saving event. Please check the console for details.');
    }
}

validateForm() {
    // Basic validation
    if (!this.inputTitle.value.trim()) {
        alert('Please enter an event title');
        return false;
    }
    
    if (!this.inputAge.value.trim()) {
        alert('Please enter an age');
        return false;
    }
    
    if (!this.inputProbability.value.trim() || isNaN(this.inputProbability.value) || 
        parseInt(this.inputProbability.value) <= 0) {
        alert('Please enter a valid probability value (as "1 in X" where X is a positive number)');
        return false;
    }
    
    // Check if at least one type is selected
    let typeSelected = false;
    this.typeCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            typeSelected = true;
        }
    });
    
    if (!typeSelected) {
        alert('Please select at least one event type');
        return false;
    }
    
    if (!this.inputDescription.value.trim()) {
        alert('Please enter a description');
        return false;
    }
    
    return true;
}

formatProbability(probability) {
    if (probability <= 0) return 'infinity';
    
    // Convert to "1 in X" format
    const oneInX = Math.round(1 / probability);
    
    // Format with separators for large numbers
    return this.probabilityFormatter.format(oneInX);
}

setCallbacks(callbacks) {
    if (callbacks.onAddEvent) this.onAddEvent = callbacks.onAddEvent;
    if (callbacks.onExportData) this.onExportData = callbacks.onExportData;
    if (callbacks.onEventDeselected) this.onEventDeselected = callbacks.onEventDeselected;
}
}