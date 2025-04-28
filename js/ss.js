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
        this.composer = new EffectComposer(this.renderer);
        
        // Add render pass
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Add bloom pass for glow effects
        const bloomPass = new UnrealBloomPass(
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

export default SingularitySystem;// js/singularitySystem.js