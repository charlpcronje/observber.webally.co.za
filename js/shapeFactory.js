// js/shapeFactory.js
import * as THREE from 'three';
import logger from './logger.js';

class ShapeFactory {
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
    
    createFallbackShape(event) {
        // Simple fallback shape for error cases
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Add event data for interaction
        mesh.userData = { event: event };
        
        return mesh;
    }
    
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

// Export as global for non-module scripts
window.ShapeFactory = ShapeFactory;

export default ShapeFactory;
    
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
    
    createFallbackShape(event) {
        // Simple fallback shape for error cases
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Add event data for interaction
        mesh.userData = { event: event };
        
        return mesh;
    }
    
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