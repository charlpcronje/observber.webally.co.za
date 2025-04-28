import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// --- Configuration ---
const AGE_TO_DISTANCE_SCALE = 1.5; // How far out events orbit per year of age
const NODE_BASE_SIZE = 0.5;
const PROBABILITY_TO_GLOW_SCALE = 15; // Higher = more sensitive glow difference
const SINGULARITY_SIZE = 2;
const ORBIT_SPEED_SCALE = 0.0001; // Slow orbit
const PULSE_SPEED = 1.5;
const PULSE_MAGNITUDE = 0.1; // How much nodes pulse in size

const NEON_COLORS = {
    cyan: new THREE.Color(0x00ffff),
    magenta: new THREE.Color(0xff00ff),
    blue: new THREE.Color(0x007fff),
    green: new THREE.Color(0x00ff00),
    white: new THREE.Color(0xffffff),
};

const TYPE_TO_SHAPE = {
    'Trauma': 'Pyramid',
    'Biochemical': 'Sphere',
    'Impact': 'Cube',
    'Luck': 'Bullseye',
    'Micro-causal': 'Sphere', // Treat similar to Biochemical for shape
    // Default or mixed - maybe Sphere or random? Let's use Sphere for now.
    'default': 'Sphere'
};

const TYPE_TO_COLOR = {
    'Trauma': NEON_COLORS.magenta,
    'Biochemical': NEON_COLORS.green,
    'Impact': NEON_COLORS.blue,
    'Luck': NEON_COLORS.cyan,
    'Micro-causal': NEON_COLORS.green, // Same color
    'default': NEON_COLORS.white
};

// --- Global Variables ---
let scene, camera, renderer, controls, composer;
let singularity, eventNodes = [];
let clock = new THREE.Clock();
let raycaster, mouse;
let intersectedObject = null;
let allEventsData = [];

// --- DOM Elements ---
const container = document.getElementById('container');
const detailPanel = document.getElementById('detail-panel');
const closePanelBtn = document.getElementById('close-panel-btn');
const exportBtn = document.getElementById('export-btn');
const tooltipElement = document.getElementById('info-tooltip');

// --- Initial Event Data (Fallback) ---
// --- Initial Event Data (Fallback) ---
const defaultEventsJSON = `
[
  {
    "title": "Fall from 4 Stories onto Cement",
    "age": 16,
    "year": null,
    "type": ["Trauma"],
    "probability": 0.000001,
    "description": "Fell from 4 stories (12-15 meters) directly onto cement, landing flat on back. No fractures, no internal injuries. Walked away unharmed without hospitalization."
  },
  {
    "title": "BMW X5 Crash at 160km/h",
    "age": 30,
    "year": null,
    "type": ["Trauma", "Impact"],
    "probability": 0.000000001,
    "description": "Driving at 160+ km/h, lost control, rolled forward multiple times. No seatbelt. Went through front and side windows. Back broken in 7 places, walked away from crash. Full recovery after 5 weeks wearing a Velcro back brace."
  },
  {
    "title": "Terminal Liver Failure Recovery",
    "age": 30,
    "year": null,
    "type": ["Biochemical"],
    "probability": 0.000001,
    "description": "Diagnosed with liver enzyme counts around 2,000, indicating total liver shutdown. Prognosis: 2 weeks to live. Self-medicated with heavy doses of OTC liver supplements (approx. 40 pills/day). Fully recovered in 2 weeks without hospitalization."
  },
  {
    "title": "Spider Bite Infection Averted",
    "age": 13,
    "year": null,
    "type": ["Micro-causal", "Biochemical"],
    "probability": 0.00000001,
    "description": "Bitten by spider; infection forming. Randomly caught broken phone aerial that punctured the exact spot, ejecting infection. Friend with similar bite hospitalized with severe infection. Survival through improbable physical intervention."
  },
  {
    "title": "Motorbike at 200km/h — Gate Opens",
    "age": 17,
    "year": null,
    "type": ["Impact", "Luck"],
    "probability": 0.000000001,
    "description": "Reached 200 km/h on a 350cc 2-stroke motorbike. Approaching closed steel gate with no time to brake. Gate randomly opened within ~200 milliseconds, allowing safe passage through the open gap instead of fatal collision."
  },
  {
    "title": "Footpeg Embedded in Knee",
    "age": "Teens", 
    "year": null,
    "type": ["Trauma", "Biochemical"],
    "probability": 0.001,
    "description": "Motorbike footpeg broke off and embedded into knee. Delayed treatment by one day. Manually extracted peg at hospital under minimal sedation. Avoided major infection or mobility loss."
  },
  {
    "title": "Motorbike Scrambler Crashes (~100 times)",
    "age": "Teens", 
    "year": null,
    "type": ["Trauma", "Impact"],
    "probability": 0.01,
    "description": "Approximately 100 crashes while racing motorbikes off-road without proper gear. Sustained minor injuries (broken fingers, toes) but always recovered fully. No long-term consequences."
  },
  {
    "title": "Holding Breath 6+ Minutes Despite Smoking",
    "age": "40s", 
    "year": null,
    "type": ["Biochemical"],
    "probability": 0.001,
    "description": "Able to hold breath over 6 minutes despite 30 years of smoking history. Matches elite freediver lung capacity without training. Normal lung damage from smoking absent."
  },
  {
    "title": "4th Story Fall on Back at Drive-in",
    "age": "Teens", 
    "year": null,
    "type": ["Trauma"],
    "probability": 0.0001,
    "description": "Fell from the 4th story height onto solid cement while messing around. Landed on back. No fractures, no hospitalization, no long-term damage."
  }
]
`;

// --- Initialization ---
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05050a, 0.01); // Faint fog matching background

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Alpha for potential CSS background effects
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping; // Helps with bloom brightness
    container.appendChild(renderer.domElement);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 200;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft ambient light
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(NEON_COLORS.white, 1, 100);
    pointLight.position.set(0, 0, 0); // Light from the singularity
    scene.add(pointLight);

    // Postprocessing (Bloom)
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0; // Bloom everything slightly
    bloomPass.strength = 1.2; // Bloom intensity
    bloomPass.radius = 0.5;   // Bloom radius

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Raycasting
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Load Data
    loadEvents();

    // Create Visuals
    createSingularity();
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
        allEventsData = JSON.parse(defaultEventsJSON);
        saveEvents(); // Save defaults to local storage
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
    const dataStr = JSON.stringify(allEventsData, null, 2); // Pretty print JSON
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
    // Make it glow brightly, ignoring scene lights mostly
    const material = new THREE.MeshBasicMaterial({
        color: NEON_COLORS.white,
        // emissive: NEON_COLORS.blue, // Use bloom pass instead of direct emissive
        // emissiveIntensity: 5,
        toneMapped: false // Important for bloom to pick it up strongly
    });
    singularity = new THREE.Mesh(geometry, material);
    scene.add(singularity);
}

function createEventNodes() {
    // Clear existing nodes if reloading
    eventNodes.forEach(node => scene.remove(node));
    eventNodes = [];

    allEventsData.forEach((event, index) => {
        // --- Shape ---
        const primaryType = event.type[0] || 'default'; // Use first type for shape/color
        const shapeType = TYPE_TO_SHAPE[primaryType] || TYPE_TO_SHAPE['default'];
        let geometry;
        switch (shapeType) {
            case 'Pyramid':
                geometry = new THREE.TetrahedronGeometry(NODE_BASE_SIZE * 1.2, 0); // Pointy
                break;
            case 'Cube':
                geometry = new THREE.BoxGeometry(NODE_BASE_SIZE, NODE_BASE_SIZE, NODE_BASE_SIZE);
                break;
            case 'Bullseye': // Torus
                geometry = new THREE.TorusGeometry(NODE_BASE_SIZE * 0.6, NODE_BASE_SIZE * 0.2, 16, 50);
                break;
            case 'Sphere':
            default:
                geometry = new THREE.SphereGeometry(NODE_BASE_SIZE * 0.8, 16, 16);
                break;
        }

        // --- Color ---
        const color = TYPE_TO_COLOR[primaryType] || TYPE_TO_COLOR['default'];

        // --- Material ---
        // Calculate glow based on improbability (log scale helps manage extremes)
        // Lower probability = higher glow intensity
        const logProb = Math.log10(event.probability);
        // Normalize logProb (assuming range roughly -10 to -1) -> map to intensity (e.g., 0.5 to 5)
        // Clamp values to avoid extreme brightness or darkness
        const minLogProb = -10; // e.g., 1e-10
        const maxLogProb = -1;  // e.g., 0.1
        const normalizedProb = Math.max(0, Math.min(1, (logProb - minLogProb) / (maxLogProb - minLogProb)));
        // Invert: rarer (closer to minLogProb) should be brighter
        const glowIntensity = 0.5 + (1 - normalizedProb) * PROBABILITY_TO_GLOW_SCALE;

        const material = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true, // Neon outline effect
            // emissive: color, // Let bloom handle the glow based on brightness
            // emissiveIntensity: glowIntensity,
            toneMapped: false // Ensure wireframe shows up well with bloom
        });

         // --- Positioning (Age = Distance) ---
         let ageValue = 0;
         if (typeof event.age === 'number') {
             ageValue = event.age;
         } else if (typeof event.age === 'string') {
             // Try to extract a number from strings like "Teens" (approx 16), "40s" (approx 45)
             const match = event.age.match(/\d+/);
             if (event.age.toLowerCase().includes('teen')) ageValue = 16;
             else if (match) ageValue = parseInt(match[0]) + 5; // e.g., 40s -> 45
             else ageValue = 25; // Default fallback age if unparsable
         }
         const distance = SINGULARITY_SIZE * 2 + ageValue * AGE_TO_DISTANCE_SCALE; // Start outside singularity

         const phi = Math.acos(-1 + (2 * (index + 1)) / (allEventsData.length + 1)); // Distribute vertically somewhat evenly
         const theta = Math.sqrt((allEventsData.length + 1) * Math.PI) * phi; // Golden Angle spiral distribution


        // --- Mesh ---
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.setFromSphericalCoords(distance, phi, theta);

        // Add random initial rotation
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

        // Store event data for lookup on click/hover
        mesh.userData.eventData = event;
        mesh.userData.baseScale = 1.0; // For pulsing animation

        scene.add(mesh);
        eventNodes.push(mesh);
    });
}


// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Update Controls
    controls.update();

    // Animate Singularity
    if (singularity) {
        singularity.rotation.y += 0.005;
    }

    // Animate Event Nodes
    eventNodes.forEach(node => {
        // Slow rotation
        node.rotation.x += 0.001;
        node.rotation.y += 0.002;

        // Orbit around center (simple circular orbit for now)
        const eventData = node.userData.eventData;
        let ageValue = typeof eventData.age === 'number' ? eventData.age : 25; // Use fallback for orbit speed
        const orbitSpeed = ORBIT_SPEED_SCALE * (50 / (ageValue + 1)); // Slower for older/further events
        const angle = elapsed * orbitSpeed * (node.id % 2 === 0 ? 1 : -1); // Vary direction
        const distance = node.position.length(); // Keep original distance
        const currentPhi = Math.acos(node.position.z / distance); // Get current angles
        const currentTheta = Math.atan2(node.position.y, node.position.x);

        //node.position.x = distance * Math.sin(currentPhi) * Math.cos(currentTheta + delta * orbitSpeed);
        //node.position.y = distance * Math.sin(currentPhi) * Math.sin(currentTheta + delta * orbitSpeed);
        // Z position remains constant for this simple orbit

        // Or simpler rotation around Y axis if preferred:
        node.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), delta * orbitSpeed * 10 * (node.id % 2 === 0 ? 1 : -1));


        // Pulsing effect
        const pulse = Math.sin(elapsed * PULSE_SPEED + node.id) * PULSE_MAGNITUDE + node.userData.baseScale;
        node.scale.set(pulse, pulse, pulse);
    });

    // Update Hover Effect (needs to be done before rendering)
    updateHover();

    // Render Scene with Postprocessing
    composer.render(delta);
}

// --- Interactivity ---
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Position tooltip
    tooltipElement.style.left = `${event.clientX + 15}px`;
    tooltipElement.style.top = `${event.clientY + 10}px`;
}

function updateHover() {
    if (!eventNodes.length) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(eventNodes);

    if (intersects.length > 0) {
        const firstIntersect = intersects[0].object;
        if (intersectedObject !== firstIntersect) {
            // Reset previous hover effect
            if (intersectedObject) {
                intersectedObject.material.color.set(intersectedObject.userData.originalColor);
                 intersectedObject.userData.baseScale = 1.0; // Reset pulse base
            }

            // Apply new hover effect
            intersectedObject = firstIntersect;
            intersectedObject.userData.originalColor = intersectedObject.material.color.clone(); // Store original
            intersectedObject.material.color.lerp(NEON_COLORS.white, 0.5); // Brighten
            intersectedObject.userData.baseScale = 1.1; // Make pulse base larger

            // Show Tooltip
            const eventData = intersectedObject.userData.eventData;
            tooltipElement.textContent = `${eventData.title} (P: ${eventData.probability.toExponential(1)})`;
            tooltipElement.style.display = 'block';

        }
    } else {
        // No intersection
        if (intersectedObject) {
            // Reset last hovered object
            intersectedObject.material.color.set(intersectedObject.userData.originalColor);
            intersectedObject.userData.baseScale = 1.0;
        }
        intersectedObject = null;
        tooltipElement.style.display = 'none'; // Hide tooltip
    }
}


function onClick(event) {
    // Use the same raycasting logic as hover
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(eventNodes);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        showDetailPanel(clickedObject.userData.eventData);
    } else {
        // Clicked on background, potentially hide panel? (Optional)
        // hideDetailPanel();
    }
}

// --- UI Panel Logic ---
function showDetailPanel(eventData) {
    document.getElementById('detail-title').textContent = eventData.title;
    document.getElementById('detail-age').textContent = eventData.age ?? 'N/A';
    document.getElementById('detail-year').textContent = eventData.year ?? 'N/A';
    document.getElementById('detail-types').textContent = eventData.type.join(', ');
    document.getElementById('detail-probability').textContent = eventData.probability.toExponential(2); // Scientific notation

    // Simple Log Scale Visualization Width
    const logProb = Math.log10(eventData.probability);
    const minLogProb = -10;
    const maxLogProb = -1;
    const normalizedProb = Math.max(0, Math.min(1, (logProb - minLogProb) / (maxLogProb - minLogProb)));
    const vizWidth = Math.max(5, (1 - normalizedProb) * 50); // Rarer = wider bar (up to 50px)
    document.getElementById('detail-probability-viz').style.width = `${vizWidth}px`;


    document.getElementById('detail-description').textContent = eventData.description;

    detailPanel.classList.add('visible');
}

function hideDetailPanel() {
    detailPanel.classList.remove('visible');
}

// --- Start the application ---
init();