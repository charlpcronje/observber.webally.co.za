import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
// Optional: If TextGeometry is preferred over CanvasTexture
// import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// --- Configuration ---
const AGE_TO_DISTANCE_SCALE = 1.5;
const NODE_BASE_SIZE = 0.6; // Slightly larger base for solid shapes
const PROBABILITY_TO_GLOW_SCALE = 15;
const SINGULARITY_SIZE = 2;
const ORBIT_SPEED_SCALE = 0.0001;
const PULSE_SPEED = 1.5;
const PULSE_MAGNITUDE = 0.05; // Smaller pulse for solid shapes
const NODE_OPACITY = 0.6; // Base opacity for event nodes
const NODE_HOVER_OPACITY = 0.9; // Opacity on hover
const PROB_TEXT_FADE_MIN_DIST = 5; // Start fading in text when closer than this
const PROB_TEXT_FADE_MAX_DIST = 25; // Fully faded in when closer than this

const NEON_COLORS = {
    cyan: new THREE.Color(0x00ffff),
    magenta: new THREE.Color(0xff00ff),
    blue: new THREE.Color(0x007fff),
    green: new THREE.Color(0x00ff00),
    white: new THREE.Color(0xffffff),
    textGlow: "#E0E0FF", // Color for the probability text
};

const TYPE_TO_SHAPE = {
    'Trauma': 'Pyramid',
    'Biochemical': 'Sphere',
    'Impact': 'Cube',
    'Luck': 'Bullseye',
    'Micro-causal': 'Sphere',
    'default': 'Sphere'
};

const TYPE_TO_COLOR = {
    'Trauma': NEON_COLORS.magenta,
    'Biochemical': NEON_COLORS.green,
    'Impact': NEON_COLORS.blue,
    'Luck': NEON_COLORS.cyan,
    'Micro-causal': NEON_COLORS.green,
    'default': NEON_COLORS.white
};

// --- Global Variables ---
let scene, camera, renderer, controls, composer;
let singularity, eventNodes = [];
let clock = new THREE.Clock();
let raycaster, mouse;
let intersectedObject = null;
let allEventsData = [];
let totalProbability = 1.0; // Initialize cumulative probability
let probabilityTextPlane = null; // Mesh for displaying probability text

// --- DOM Elements ---
const container = document.getElementById('container');
const detailPanel = document.getElementById('detail-panel');
const closePanelBtn = document.getElementById('close-panel-btn');
const exportBtn = document.getElementById('export-btn');
const tooltipElement = document.getElementById('info-tooltip');

// --- Initial Event Data (Fallback - NO COMMENTS!) ---
const defaultEventsJSON = `
[{"title":"Fall from 4 Stories onto Cement","age":16,"year":null,"type":["Trauma"],"probability":1e-6,"description":"Fell from 4 stories (12-15 meters) directly onto cement, landing flat on back. No fractures, no internal injuries. Walked away unharmed without hospitalization."},{"title":"BMW X5 Crash at 160km/h","age":30,"year":null,"type":["Trauma","Impact"],"probability":1e-9,"description":"Driving at 160+ km/h, lost control, rolled forward multiple times. No seatbelt. Went through front and side windows. Back broken in 7 places, walked away from crash. Full recovery after 5 weeks wearing a Velcro back brace."},{"title":"Terminal Liver Failure Recovery","age":30,"year":null,"type":["Biochemical"],"probability":1e-6,"description":"Diagnosed with liver enzyme counts around 2,000, indicating total liver shutdown. Prognosis: 2 weeks to live. Self-medicated with heavy doses of OTC liver supplements (approx. 40 pills/day). Fully recovered in 2 weeks without hospitalization."},{"title":"Spider Bite Infection Averted","age":13,"year":null,"type":["Micro-causal","Biochemical"],"probability":1e-8,"description":"Bitten by spider; infection forming. Randomly caught broken phone aerial that punctured the exact spot, ejecting infection. Friend with similar bite hospitalized with severe infection. Survival through improbable physical intervention."},{"title":"Motorbike at 200km/h — Gate Opens","age":17,"year":null,"type":["Impact","Luck"],"probability":1e-9,"description":"Reached 200 km/h on a 350cc 2-stroke motorbike. Approaching closed steel gate with no time to brake. Gate randomly opened within ~200 milliseconds, allowing safe passage through the open gap instead of fatal collision."},{"title":"Footpeg Embedded in Knee","age":"Teens","year":null,"type":["Trauma","Biochemical"],"probability":0.001,"description":"Motorbike footpeg broke off and embedded into knee. Delayed treatment by one day. Manually extracted peg at hospital under minimal sedation. Avoided major infection or mobility loss."},{"title":"Motorbike Scrambler Crashes (~100 times)","age":"Teens","year":null,"type":["Trauma","Impact"],"probability":0.01,"description":"Approximately 100 crashes while racing motorbikes off-road without proper gear. Sustained minor injuries (broken fingers, toes) but always recovered fully. No long-term consequences."},{"title":"Holding Breath 6+ Minutes Despite Smoking","age":"40s","year":null,"type":["Biochemical"],"probability":0.001,"description":"Able to hold breath over 6 minutes despite 30 years of smoking history. Matches elite freediver lung capacity without training. Normal lung damage from smoking absent."},{"title":"4th Story Fall on Back at Drive-in","age":"Teens","year":null,"type":["Trauma"],"probability":0.0001,"description":"Fell from the 4th story height onto solid cement while messing around. Landed on back. No fractures, no hospitalization, no long-term damage."}]
`; // Make sure this is one line or uses backticks correctly without internal comments

// --- Initialization ---
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05050a, 0.01);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    container.appendChild(renderer.domElement);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1; // Allow closer zoom
    controls.maxDistance = 200;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(NEON_COLORS.white, 1.5, 150); // Slightly stronger point light
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Postprocessing (Bloom)
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.5;

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Raycasting
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Load Data & Calculate Total Probability
    loadEvents();
    calculateTotalProbability(); // Calculate after loading

    // Create Visuals
    createSingularity();
    createProbabilityText(); // Create text after singularity and probability calculation
    createEventNodes();

    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);
    closePanelBtn.addEventListener('click', hideDetailPanel);
    exportBtn.addEventListener('click', exportEvents);

    // Start Animation Loop
    animate();
}

// --- Data Handling ---
function loadEvents() {
    const storedEvents = localStorage.getItem('charlSurvivalEvents');
    try {
        if (storedEvents) {
            allEventsData = JSON.parse(storedEvents);
            console.log("Loaded events from Local Storage.");
        } else {
            throw new Error("No events in Local Storage");
        }
    } catch (e) {
        console.warn("Could not load from Local Storage or data invalid, using default events.", e);
        // Ensure defaultEventsJSON is valid before parsing
        try {
            allEventsData = JSON.parse(defaultEventsJSON);
            saveEvents(); // Save defaults to local storage
        } catch (jsonError) {
            console.error("FATAL: Default JSON is invalid!", jsonError);
            alert("Error: Default event data is corrupted. Please check the script.");
            allEventsData = []; // Prevent further errors
        }
    }
}

function calculateTotalProbability() {
    if (!allEventsData || allEventsData.length === 0) {
        totalProbability = 1.0; // Or handle as error/zero case
        return;
    }
    // Multiply probabilities - use reduce for conciseness
    totalProbability = allEventsData.reduce((acc, event) => {
        // Handle cases where probability might be missing or invalid
        const prob = typeof event.probability === 'number' ? event.probability : 1.0;
        return acc * prob;
    }, 1.0); // Start with 1.0

    console.log(`Total Cumulative Probability: ${totalProbability.toExponential(4)}`);

    // If text plane already exists, update it
    if (probabilityTextPlane) {
        updateProbabilityTextTexture();
    }
}


function saveEvents() {
    try {
        localStorage.setItem('charlSurvivalEvents', JSON.stringify(allEventsData));
        console.log("Events saved to Local Storage.");
    } catch (e) {
        console.error("Failed to save events to Local Storage:", e);
        alert("Error saving data to Local Storage. Data might be too large or storage is disabled.");
    }
}

function exportEvents() {
    const dataStr = JSON.stringify(allEventsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'charls_survival_events.json';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// --- 3D Object Creation ---
function createSingularity() {
    const geometry = new THREE.SphereGeometry(SINGULARITY_SIZE, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: NEON_COLORS.white,
        // Use bloom pass for glow
        toneMapped: false // Important for bloom
    });
    singularity = new THREE.Mesh(geometry, material);
    scene.add(singularity);
}

// --- Probability Text Creation (Using CanvasTexture) ---
let probabilityCanvas, probabilityContext; // Keep references for updates

function createProbabilityText() {
    probabilityCanvas = document.createElement('canvas');
    probabilityContext = probabilityCanvas.getContext('2d');

    // Set canvas resolution (higher for sharper text)
    const canvasWidth = 512;
    const canvasHeight = 128;
    probabilityCanvas.width = canvasWidth;
    probabilityCanvas.height = canvasHeight;

    const texture = new THREE.CanvasTexture(probabilityCanvas);
    texture.needsUpdate = true;

    // Plane geometry to display the texture
    const planeGeometry = new THREE.PlaneGeometry(canvasWidth / 50, canvasHeight / 50); // Adjust size as needed
    const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0, // Start fully transparent
        side: THREE.DoubleSide, // Visible from both sides
        depthWrite: false // Prevent fighting with transparent nodes
    });

    probabilityTextPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    // Position slightly in front of the singularity
    probabilityTextPlane.position.set(0, 0, SINGULARITY_SIZE + 0.5); // Adjust Z offset as needed
    scene.add(probabilityTextPlane);

    updateProbabilityTextTexture(); // Draw initial text
}

function updateProbabilityTextTexture() {
    if (!probabilityContext || !probabilityCanvas) return;

    const ctx = probabilityContext;
    const canvas = probabilityCanvas;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Style the text
    const fontSize = 48;
    ctx.font = `Bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = NEON_COLORS.textGlow; // Use a defined neon color
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Optional: Add a subtle glow effect directly on the canvas text
    ctx.shadowColor = NEON_COLORS.blue.getStyle(); // Use a neon color for shadow
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Text content
    const text = `P: ${totalProbability.toExponential(2)}`;

    // Draw text centered
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Reset shadow for other potential drawing
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;


    // Tell Three.js the texture needs updating
    if (probabilityTextPlane && probabilityTextPlane.material.map) {
        probabilityTextPlane.material.map.needsUpdate = true;
    }
}

function createEventNodes() {
    eventNodes.forEach(nodeGroup => scene.remove(nodeGroup)); // Remove the group
    eventNodes = [];

    allEventsData.forEach((event, index) => {
        // --- Shape Geometry ---
        const primaryType = event.type[0] || 'default';
        const shapeType = TYPE_TO_SHAPE[primaryType] || TYPE_TO_SHAPE['default'];
        let geometry;
        // Adjust base size slightly for different shapes if needed
        switch (shapeType) {
            case 'Pyramid': geometry = new THREE.TetrahedronGeometry(NODE_BASE_SIZE * 1.2, 0); break;
            case 'Cube': geometry = new THREE.BoxGeometry(NODE_BASE_SIZE, NODE_BASE_SIZE, NODE_BASE_SIZE); break;
            case 'Bullseye': geometry = new THREE.TorusGeometry(NODE_BASE_SIZE * 0.7, NODE_BASE_SIZE * 0.3, 16, 50); break;
            case 'Sphere': default: geometry = new THREE.SphereGeometry(NODE_BASE_SIZE, 16, 16); break;
        }

        // --- Material (Solid + Transparent) ---
        const color = TYPE_TO_COLOR[primaryType] || TYPE_TO_COLOR['default'];
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color, // Give it a base glow picked up by bloom
            emissiveIntensity: 0.2, // Subtle emissive
            shininess: 80, // Make it a bit shiny
            specular: 0xaaaaaa, // Grey specular highlights
            transparent: true,
            opacity: NODE_OPACITY,
            // side: THREE.DoubleSide // Needed if geometry normals are inconsistent, but usually not for primitives
        });

        // --- Mesh (Solid Shape) ---
        const mesh = new THREE.Mesh(geometry, material);

        // --- Outline ---
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: color,
            linewidth: 2, // Note: linewidth > 1 might not work on all systems/browsers
            transparent: true,
            opacity: 0.9, // Make outline slightly more opaque
            toneMapped: false // Ensure outline is picked up well by bloom
        });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        mesh.add(wireframe); // Add outline as a child of the solid mesh

        // --- Positioning ---
        let ageValue = 0;
        if (typeof event.age === 'number') ageValue = event.age;
        else if (typeof event.age === 'string') {
            const match = event.age.match(/\d+/);
            if (event.age.toLowerCase().includes('teen')) ageValue = 16;
            else if (match) ageValue = parseInt(match[0]) + 5;
            else ageValue = 25;
        }
        const distance = SINGULARITY_SIZE * 2.5 + ageValue * AGE_TO_DISTANCE_SCALE; // Push out slightly more
        const phi = Math.acos(-1 + (2 * (index + 1)) / (allEventsData.length + 1));
        const theta = Math.sqrt((allEventsData.length + 1) * Math.PI) * phi;
        mesh.position.setFromSphericalCoords(distance, phi, theta);

        // Random initial rotation
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

        // Store data and original state for hover
        mesh.userData.eventData = event;
        mesh.userData.baseScale = 1.0;
        mesh.userData.originalColor = material.color.clone(); // Store original color
        mesh.userData.originalOpacity = material.opacity; // Store original opacity
        mesh.userData.originalEmissiveIntensity = material.emissiveIntensity; // Store original emissive

        // Add the group (mesh + its wireframe child) to the scene and list
        scene.add(mesh);
        eventNodes.push(mesh); // We track the main mesh, raycaster hits this
    });
}

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    controls.update(); // Required if enableDamping is true

    // Singularity animation
    if (singularity) {
        singularity.rotation.y += 0.005;
    }

    // Event Node Animation (Orbit, Rotate, Pulse)
    eventNodes.forEach(node => {
        node.rotation.x += 0.001;
        node.rotation.y += 0.002;

        // Orbit around Y axis
        node.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), delta * ORBIT_SPEED_SCALE * 50 * (node.id % 2 === 0 ? 1 : -1));

        // Pulsing effect
        const scale = node.userData.baseScale + Math.sin(elapsed * PULSE_SPEED + node.id) * PULSE_MAGNITUDE;
        node.scale.set(scale, scale, scale);
    });

    // Probability Text Visibility & Orientation
    if (probabilityTextPlane && singularity) {
        const distance = camera.position.distanceTo(singularity.position);
        // Calculate opacity based on distance (fade in as camera gets closer)
        const opacity = Math.max(0, Math.min(1, 1.0 - (distance - PROB_TEXT_FADE_MIN_DIST) / (PROB_TEXT_FADE_MAX_DIST - PROB_TEXT_FADE_MIN_DIST)));
        probabilityTextPlane.material.opacity = opacity * 0.9; // Max opacity slightly less than 1

        // Make text face the camera
        probabilityTextPlane.lookAt(camera.position);
    }

    // Update Hover Effect before rendering
    updateHover();

    // Render Scene via Composer
    composer.render(delta);
}

// --- Interactivity ---
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    // Optional: update probability text canvas aspect if needed, but fixed size is usually ok
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    tooltipElement.style.left = `${event.clientX + 15}px`;
    tooltipElement.style.top = `${event.clientY + 10}px`;
}

function updateHover() {
    if (!eventNodes.length) return;

    raycaster.setFromCamera(mouse, camera);
    // Important: Raycast against the main mesh nodes, not their wireframe children
    const intersects = raycaster.intersectObjects(eventNodes, false); // false = don't check children

    if (intersects.length > 0) {
        // The first intersect is the solid mesh because we added it first / didn't raycast children
        const firstIntersect = intersects[0].object;

        if (intersectedObject !== firstIntersect) {
            // Reset previous hover effect
            if (intersectedObject) {
                intersectedObject.material.opacity = intersectedObject.userData.originalOpacity;
                intersectedObject.material.emissiveIntensity = intersectedObject.userData.originalEmissiveIntensity;
                // Reset color only if needed (we aren't changing it now)
                // intersectedObject.material.color.set(intersectedObject.userData.originalColor);
                intersectedObject.userData.baseScale = 1.0; // Reset pulse base
            }

            // Apply new hover effect
            intersectedObject = firstIntersect;
            // Store original values if not already stored (first hover) - Belt and braces
             if (intersectedObject.userData.originalOpacity === undefined) {
                 intersectedObject.userData.originalOpacity = intersectedObject.material.opacity;
             }
             if (intersectedObject.userData.originalEmissiveIntensity === undefined) {
                 intersectedObject.userData.originalEmissiveIntensity = intersectedObject.material.emissiveIntensity;
             }

            // Make it more opaque and slightly brighter emissive on hover
            intersectedObject.material.opacity = NODE_HOVER_OPACITY;
            intersectedObject.material.emissiveIntensity = intersectedObject.userData.originalEmissiveIntensity * 2.0; // Brighter glow
            intersectedObject.userData.baseScale = 1.05; // Make pulse base slightly larger

            // Show Tooltip
            const eventData = intersectedObject.userData.eventData;
            tooltipElement.textContent = `${eventData.title} (P: ${eventData.probability.toExponential(1)})`;
            tooltipElement.style.display = 'block';

        }
    } else {
        // No intersection
        if (intersectedObject) {
            // Reset last hovered object
            intersectedObject.material.opacity = intersectedObject.userData.originalOpacity;
            intersectedObject.material.emissiveIntensity = intersectedObject.userData.originalEmissiveIntensity;
            // intersectedObject.material.color.set(intersectedObject.userData.originalColor);
            intersectedObject.userData.baseScale = 1.0;
            intersectedObject = null;
        }
        tooltipElement.style.display = 'none'; // Hide tooltip
    }
}


function onClick(event) {
    // Check if the click was on the detail panel itself or its buttons
    if (detailPanel.classList.contains('visible') && detailPanel.contains(event.target)) {
        return; // Don't re-trigger click if clicking inside the open panel
    }

    // Use raycasting result from hover update logic
    if (intersectedObject) { // If mouse is currently over an object when clicked
        showDetailPanel(intersectedObject.userData.eventData);
    } else {
        // Optional: If clicking background, hide panel
         hideDetailPanel();
    }
}

// --- UI Panel Logic ---
function showDetailPanel(eventData) {
    document.getElementById('detail-title').textContent = eventData.title;
    document.getElementById('detail-age').textContent = eventData.age ?? 'N/A';
    document.getElementById('detail-year').textContent = eventData.year ?? 'N/A';
    document.getElementById('detail-types').textContent = eventData.type.join(', ');
    document.getElementById('detail-probability').textContent = eventData.probability.toExponential(2);

    const logProb = Math.log10(eventData.probability);
    const minLogProb = -10;
    const maxLogProb = -1;
    const normalizedProb = Math.max(0, Math.min(1, (logProb - minLogProb) / (maxLogProb - minLogProb)));
    const vizWidth = Math.max(5, (1 - normalizedProb) * 50);
    document.getElementById('detail-probability-viz').style.width = `${vizWidth}px`;

    document.getElementById('detail-description').textContent = eventData.description;

    detailPanel.classList.add('visible'); // Uses CSS transition
}

function hideDetailPanel() {
    detailPanel.classList.remove('visible'); // Uses CSS transition
}

// --- Start the application ---
init();