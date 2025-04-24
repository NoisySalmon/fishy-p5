// Solar System Data
const SUN_DATA = {
  diameter: 1391400, // in km
};

const PLANETS_DATA = [
  {
    id: "mercury",
    name: "Mercury",
    color: "#8C8C8C",
    distance: 0.39, // AU
    orbitPeriod: 88, // Earth days
    rotationPeriod: 58.65, // Earth days
    diameter: 4879, // km
    description: "Mercury is the smallest and innermost planet in the Solar System. It has no atmosphere to retain heat, causing extreme temperature variations.",
    temperature: "-173°C to 427°C",
    moons: 0,
    atmosphere: "Minimal - Sodium, Magnesium"
  },
  {
    id: "venus",
    name: "Venus",
    color: "#E2B55A",
    distance: 0.72, // AU
    orbitPeriod: 225, // Earth days
    rotationPeriod: -243, // Earth days (negative because retrograde rotation)
    diameter: 12104, // km
    description: "Venus is often called Earth's sister planet due to similar size and composition. It has a thick toxic atmosphere that traps heat, making it the hottest planet.",
    temperature: "462°C (average)",
    moons: 0,
    atmosphere: "Carbon Dioxide, Nitrogen"
  },
  {
    id: "earth",
    name: "Earth",
    color: "#3066BE",
    distance: 1, // AU
    orbitPeriod: 365.25, // Earth days
    rotationPeriod: 1, // Earth days
    diameter: 12742, // km
    description: "Earth is our home planet and the only known world where life exists. It has one natural satellite, the Moon, which helps stabilize Earth's orbit and slows its rotation.",
    temperature: "-88°C to 58°C",
    moons: 1,
    atmosphere: "Nitrogen, Oxygen"
  },
  {
    id: "mars",
    name: "Mars",
    color: "#CF5C36",
    distance: 1.52, // AU
    orbitPeriod: 687, // Earth days
    rotationPeriod: 1.03, // Earth days
    diameter: 6779, // km
    description: "Mars is known as the Red Planet due to iron oxide (rust) on its surface. It has the largest volcano and canyon in the solar system.",
    temperature: "-153°C to 20°C",
    moons: 2,
    atmosphere: "Carbon Dioxide, Argon, Nitrogen"
  },
  {
    id: "jupiter",
    name: "Jupiter",
    color: "#E9C46A",
    distance: 5.2, // AU
    orbitPeriod: 4333, // Earth days
    rotationPeriod: 0.41, // Earth days
    diameter: 139820, // km
    description: "Jupiter is the largest planet in our solar system and is primarily composed of hydrogen and helium. Its most notable feature is the Great Red Spot, a giant storm.",
    temperature: "-145°C (cloud top)",
    moons: 79,
    atmosphere: "Hydrogen, Helium"
  },
  {
    id: "saturn",
    name: "Saturn",
    color: "#D4B483",
    distance: 9.54, // AU
    orbitPeriod: 10759, // Earth days
    rotationPeriod: 0.45, // Earth days
    diameter: 116460, // km
    description: "Saturn is known for its spectacular ring system, composed mainly of ice particles, rock debris, and dust. It has 82 moons, with Titan being the largest.",
    temperature: "-178°C (cloud top)",
    moons: 82,
    atmosphere: "Hydrogen, Helium"
  },
  {
    id: "uranus",
    name: "Uranus",
    color: "#7BDFF2",
    distance: 19.22, // AU
    orbitPeriod: 30687, // Earth days
    rotationPeriod: -0.72, // Earth days (negative because retrograde rotation)
    diameter: 50724, // km
    description: "Uranus is an ice giant that rotates on its side due to a past collision. It appears blue-green due to methane in its atmosphere that absorbs red light.",
    temperature: "-224°C (cloud top)",
    moons: 27,
    atmosphere: "Hydrogen, Helium, Methane"
  },
  {
    id: "neptune",
    name: "Neptune",
    color: "#4361EE",
    distance: 30.06, // AU
    orbitPeriod: 60190, // Earth days
    rotationPeriod: 0.67, // Earth days
    diameter: 49244, // km
    description: "Neptune is the windiest planet in our solar system, with winds reaching 2,100 km/h. Its deep blue color comes from methane in the atmosphere.",
    temperature: "-218°C (cloud top)",
    moons: 14,
    atmosphere: "Hydrogen, Helium, Methane"
  }
];

// Camera and Simulation Variables
let angle = 0; // Orbital rotation angle
let simulationSpeed = 1;
let planetSizeScale = 5;
let orbitVisibility = 0.8;
let isPaused = false;
let showLabels = true;
let showOrbits = true;
let showAtmosphere = false;
let showStars = true;
let selectedPlanet = null;

// Orbital Camera Variables
let cameraDistance = 400;
let cameraRotationX = 0.3; // Angle around X axis (up/down)
let cameraRotationY = 0; // Angle around Y axis (left/right)
let cameraCenterX = 0;
let cameraCenterY = 0;
let cameraCenterZ = 0;

// Mouse interaction variables
let isDragging = false;
let startMouseX = 0;
let startMouseY = 0;
let startRotationX = 0;
let startRotationY = 0;

// Stars array
let stars = [];

// Constants
const DISTANCE_SCALE = 50; // Scale down actual distances
const SUN_SIZE = 20; // Base size for the sun

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create stars
  if (showStars) {
    for (let i = 0; i < 1000; i++) {
      stars.push({
        x: random(-2000, 2000),
        y: random(-2000, 2000),
        z: random(-2000, 2000),
        size: random(0.5, 2)
      });
    }
  }
}

function draw() {
  background(5, 10, 31);
  
  // Calculate camera position based on orbital parameters
  const camX = cameraCenterX + cameraDistance * Math.sin(cameraRotationY) * Math.cos(cameraRotationX);
  const camY = cameraCenterY + cameraDistance * Math.sin(cameraRotationX);
  const camZ = cameraCenterZ + cameraDistance * Math.cos(cameraRotationY) * Math.cos(cameraRotationX);
  
  // Set camera position
  camera(
    camX, camY, camZ,              // Camera position
    cameraCenterX, cameraCenterY, cameraCenterZ, // Look at point
    0, 1, 0                        // Up direction
  );
  
  // Ambient light for general scene lighting
  ambientLight(20, 20, 20);
  
  // Point light from sun position
  pointLight(255, 255, 200, 0, 0, 0);
  
  // Draw stars if enabled
  if (showStars) {
    push();
    fill(255);
    noStroke();
    for (let star of stars) {
      push();
      translate(star.x, star.y, star.z);
      sphere(star.size);
      pop();
    }
    pop();
  }
  
  // Update orbital rotation angle if not paused
  if (!isPaused) {
    angle += 0.005 * simulationSpeed;
  }
  
  // Draw the sun
  push();
  fill(255, 204, 0);
  sphere(SUN_SIZE);
  pop();
  
  // Draw planets
  PLANETS_DATA.forEach((planet, index) => {
    const orbitRadius = planet.distance * DISTANCE_SCALE;
    
    // Calculate position on orbit
    const orbitSpeed = 1 / (planet.orbitPeriod / 365.25);
    const planetAngle = angle * orbitSpeed;
    const x = orbitRadius * cos(planetAngle);
    const z = orbitRadius * sin(planetAngle);
    
    // Draw orbit path if enabled
    if (showOrbits) {
      push();
      noFill();
      stroke(255, orbitVisibility * 255);
      rotateX(HALF_PI);
      ellipse(0, 0, orbitRadius * 2, orbitRadius * 2);
      pop();
    }
    
    // Draw planet
    push();
    translate(x, 0, z);
    
    // Rotate planet on its axis
    const rotationSpeed = planet.rotationPeriod !== 0 ? 1 / Math.abs(planet.rotationPeriod) : 0;
    const rotationDirection = planet.rotationPeriod >= 0 ? 1 : -1;
    rotateY(angle * rotationSpeed * rotationDirection * 10);
    
    // Scale planet size
    const sizeFactor = planetSizeScale;
    const baseSize = (planet.diameter / SUN_DATA.diameter) * SUN_SIZE * 3;
    let displaySize = baseSize * sizeFactor;
    
    // Minimum size to ensure planets are visible
    displaySize = max(displaySize, 1);
    
    // Add stroke highlight for selected planet
    if (selectedPlanet === planet.id) {
      stroke(255);
      strokeWeight(1);
    } else {
      noStroke();
    }
    
    // Set planet color
    fill(planet.color);
    
    // Draw the planet sphere
    sphere(displaySize);
    
    // Add atmosphere effect if enabled
    if (showAtmosphere && ['earth', 'venus'].includes(planet.id)) {
      push();
      noFill();
      stroke(255, 100);
      strokeWeight(0.3);
      sphere(displaySize * 1.05);
      pop();
    }
    
    // Add label if enabled
    if (showLabels) {
      push();
      // Position the label above the planet
      translate(0, -displaySize - 5, 0);
      // Make the label face the camera
      rotateY(-angle * rotationSpeed * rotationDirection * 10);
      fill(255);
      // This would normally draw text, but it's complex in WEBGL mode
      // Using a small sphere as a substitute for simplicity
      sphere(0.5);
      pop();
    }
    
    pop();
  });
}

// Mouse event handlers for orbital camera
function mousePressed() {
  isDragging = true;
  startMouseX = mouseX;
  startMouseY = mouseY;
  startRotationX = cameraRotationX;
  startRotationY = cameraRotationY;
  
  // Check for planet selection
  checkPlanetSelection();
}

function mouseDragged() {
  if (isDragging) {
    const deltaX = mouseX - startMouseX;
    const deltaY = mouseY - startMouseY;
    
    const rotationSpeedFactor = 0.005;
    
    cameraRotationY = startRotationY + deltaX * rotationSpeedFactor;
    cameraRotationX = constrain(
      startRotationX + deltaY * rotationSpeedFactor,
      -PI/2 + 0.1, // Prevent camera from flipping
      PI/2 - 0.1   // Prevent camera from flipping
    );
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseWheel(event) {
  // Zoom in or out based on mouse wheel movement
  const zoomAmount = event.delta * 0.2;
  cameraDistance = constrain(cameraDistance + zoomAmount, 100, 2000);
  
  // Prevent default scrolling behavior
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Camera control functions for UI buttons
function cameraUp() {
  cameraRotationX = constrain(cameraRotationX - 0.1, -PI/2 + 0.1, PI/2 - 0.1);
}

function cameraDown() {
  cameraRotationX = constrain(cameraRotationX + 0.1, -PI/2 + 0.1, PI/2 - 0.1);
}

function cameraLeft() {
  cameraRotationY -= 0.1;
}

function cameraRight() {
  cameraRotationY += 0.1;
}

function zoomIn() {
  cameraDistance = constrain(cameraDistance - 30, 100, 1000);
}

function zoomOut() {
  cameraDistance = constrain(cameraDistance + 30, 100, 1000);
}

function resetCamera() {
  cameraDistance = 400;
  cameraRotationX = 0.3;
  cameraRotationY = 0;
  cameraCenterX = 0;
  cameraCenterY = 0;
  cameraCenterZ = 0;
}

// Planet selection and info panel functions
function checkPlanetSelection() {
  // This is a simplified version of planet selection since raycasting in 3D is complex
  // We'll just cycle through planets when clicking anywhere on the canvas
  
  // If clicking on the UI elements, don't change planet selection
  if (mouseX > width - 150 && mouseY > height - 150) return;
  
  // Find the current planet index
  let currentIndex = -1;
  if (selectedPlanet !== null) {
    currentIndex = PLANETS_DATA.findIndex(p => p.id === selectedPlanet);
  }
  
  // Select the next planet
  currentIndex = (currentIndex + 1) % PLANETS_DATA.length;
  selectedPlanet = PLANETS_DATA[currentIndex].id;
  
  // Show info panel
  showInfoPanel(PLANETS_DATA[currentIndex]);
}

function showInfoPanel(planet) {
  const infoPanel = document.getElementById('info-panel');
  const planetName = document.getElementById('planet-name');
  const infoContent = document.getElementById('info-content');
  
  planetName.innerText = planet.name;
  infoContent.innerHTML = `
    <p><strong>Distance from Sun:</strong> ${planet.distance} AU</p>
    <p><strong>Orbital Period:</strong> ${planet.orbitPeriod} days</p>
    <p><strong>Diameter:</strong> ${planet.diameter.toLocaleString()} km</p>
    <p><strong>Moons:</strong> ${planet.moons}</p>
    <p><strong>Temperature:</strong> ${planet.temperature}</p>
    <p><strong>Atmosphere:</strong> ${planet.atmosphere}</p>
    <p>${planet.description}</p>
  `;
  
  infoPanel.style.display = 'block';
}

function hideInfoPanel() {
  const infoPanel = document.getElementById('info-panel');
  infoPanel.style.display = 'none';
  selectedPlanet = null;
}