// js/app.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Make THREE available globally for our other modules
window.THREE = THREE;
window.OrbitControls = OrbitControls;
window.EffectComposer = EffectComposer;
window.RenderPass = RenderPass;
window.UnrealBloomPass = UnrealBloomPass;
window.ShaderPass = ShaderPass;

// Import our custom modules
import './logger.js';
import './dataManager.js';
import './shapeFactory.js';
import './singularitySystem.js';
import './uiManager.js';
import './eventManager.js';

class App {
    constructor() {
        this.container = document.getElementById('canvas-container');
        
        // Initialize system components
        this.initializeComponents();
    }
    
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