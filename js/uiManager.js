// js/uiManager.js
// UIManager handles UI updates and callbacks for the application.

/**
 * Coordinates between data, visualization, and UI components
 */
class UIManager {
    constructor() {
        this.callbacks = {};
    }

    setCallbacks(callbacks) {
        this.callbacks = callbacks || {};
    }

    showTooltip(event) {
        // Implement tooltip display logic (e.g., update #tooltip element)
        const tooltip = document.getElementById('tooltip');
        if (tooltip && event) {
            tooltip.textContent = event.title || '';
            tooltip.classList.remove('hidden');
        }
    }

    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.classList.add('hidden');
        }
    }

    updateTooltipPosition(position) {
        const tooltip = document.getElementById('tooltip');
        if (tooltip && position) {
            tooltip.style.left = position.x + 'px';
            tooltip.style.top = position.y + 'px';
        }
    }

    showDetailPanel(event) {
        const panel = document.getElementById('detail-panel');
        if (panel && event) {
            panel.classList.remove('hidden');
            document.getElementById('event-title').textContent = event.title || '';
            document.getElementById('event-age').textContent = event.age || '';
            document.getElementById('event-year').textContent = event.year || '';
            document.getElementById('event-type').textContent = Array.isArray(event.type) ? event.type.join(', ') : (event.type || '');
            document.getElementById('event-probability').textContent = event.probability || '';
            document.getElementById('event-description').textContent = event.description || '';
        }
    }

    hideDetailPanel() {
        const panel = document.getElementById('detail-panel');
        if (panel) {
            panel.classList.add('hidden');
        }
    }
}

export default UIManager;