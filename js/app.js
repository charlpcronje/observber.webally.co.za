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

// Pin code modal logic
function showPinModal() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'pin-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.7);
        z-index: 99999;
        display: flex; align-items: center; justify-content: center;`
    ;
    // Modal box
    const modal = document.createElement('div');
    modal.id = 'pin-modal-box';
    modal.style.cssText = `
        background: #181818;
        color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 24px #000a;
        padding: 32px 28px;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 280px;
    `;
    // Title
    const title = document.createElement('h2');
    title.textContent = 'Enter PIN to Access';
    title.style.marginBottom = '16px';
    modal.appendChild(title);
    // Input
    const input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'PIN';
    input.maxLength = 8;
    input.style.cssText = 'font-size: 20px; margin-bottom: 16px; padding: 8px; border-radius: 6px; border: 1px solid #555; text-align: center;';
    modal.appendChild(input);
    // Error
    const errorMsg = document.createElement('div');
    errorMsg.style.cssText = 'color: #ff4444; min-height: 22px; margin-bottom: 8px; font-size: 15px;';
    modal.appendChild(errorMsg);
    // Button
    const btn = document.createElement('button');
    btn.textContent = 'Unlock';
    btn.style.cssText = 'padding: 8px 24px; font-size: 18px; border-radius: 6px; border: none; background: #05d9e8; color: #222; cursor: pointer; font-weight: bold;';
    btn.onclick = tryUnlock;
    modal.appendChild(btn);
    // Enter key
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') tryUnlock();
    });
    // Focus input
    setTimeout(() => input.focus(), 200);
    // Try unlock logic
    function tryUnlock() {
        if (input.value === '4334') {
            sessionStorage.setItem('pinUnlocked', 'yes');
            document.body.removeChild(overlay);
            startApp();
        } else {
            errorMsg.textContent = 'Incorrect PIN.';
            input.value = '';
            input.focus();
        }
    }
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

function startApp() {
    try {
        window.app = new App();
    } catch (error) {
        console.error('Failed to start application:', error);
        alert('Failed to start application. Please check the console for details.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('pinUnlocked') === 'yes') {
        startApp();
    } else {
        showPinModal();
    }
});