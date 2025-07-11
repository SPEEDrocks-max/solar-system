// --- Import Three.js and Extras ---
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// --- Basic Setup ---
window.addEventListener('DOMContentLoaded', () => {
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoPanel = document.getElementById("planet-info-panel");
const panelName = document.getElementById("panel-planet-name");
const panelImg = document.getElementById("panel-planet-img");
const panelDesc = document.getElementById("panel-planet-desc");
const panelCloseBtn = document.getElementById("panel-close-btn");

let isPaused = false; // Use this flag to pause animation when panel is open


// Remove default spacing and overflow
Object.assign(document.body.style, {
  margin: '0',
  padding: '0',
  overflow: 'hidden',
});
Object.assign(document.documentElement.style, {
  margin: '0',
  padding: '0',
});

//adding textures 

const textures = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('assets/')
const sunTextures = textures.load('assets/Solarsystemscope_texture_2k_sun.jpg')
const mercuryTexture = textures.load('assets/2k_mercury.jpg')
const venusTexture = textures.load('assets/2k_venus_surface.jpg')
const earthTexture = textures.load('assets/2k_earth_daymap.jpg')
const moonTexture = textures.load('assets/2k_moon.jpg')
const marsTexture = textures.load('assets/2k_mars.jpg')
const jupiterTexture = textures.load('assets/2k_jupiter.jpg')
const saturnTexture = textures.load('assets/2k_saturn.jpg')
const uranusTexture = textures.load('assets/2k_uranus.jpg')
const neptuneTexture = textures.load('assets/2k_neptune.jpg')
const asTexture = textures.load('assets/Rock030_4K-JPG_Color.jpg')
const asao = textures.load('assets/Rock030_4K-JPG_AmbientOcclusion.jpg')
const asd = textures.load('assets/Rock030_4K-JPG_Displacement.jpg')
const asr = textures.load('assets/Rock030_4K-JPG_Roughness.jpg')
const asn = textures.load('assets/Rock030_4K-JPG_NormalGL.jpg')
const glowtext = textures.load('assets/lensflare0.png')
const ringtext = textures.load('assets/dfda2d1cabfa176fe1c415208deea3b30be87eb0.jpg')

const backgroundimg = cubeTextureLoader.load([
  'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'
]);
scene.background = backgroundimg;

// --- Materials & Geometries ---
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const sunMaterial = new THREE.MeshStandardMaterial({
  map: sunTextures,
  emissive: new THREE.Color(0xffaa33),
  emissiveIntensity: 1.5,
  roughness: 1.4,
  metalness: 0,
});





// --- Create Sun & Glow ---
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);

const spriteGlow = new THREE.MeshStandardMaterial({
  map: glowtext,
  color: 0xffaa33,
  transparent: true,
  blending: THREE.AdditiveBlending,
});
const glowSprite = new THREE.Sprite(spriteGlow);
glowSprite.scale.set(50, 50, 1);
scene.add(glowSprite);

// --- Create Planets ---
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture});
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture});
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
const planets = [
  {
    name: 'Mercury', radius: 0.5, distance: 6.5, speed: 0.008, material: mercuryMaterial, moons: [{}] ,
   description : ' Mercury is the smallest planet in our solar system with a diameter of about 4,879 kilometers (3,032 miles). Its roughly the size of Earths moon and about 1/3 the width of Earth. Mercury is a rocky planet, characterized by its heavily cratered surface and a large metallic core. Its also the closest planet to the Sun, resulting in extreme temperature variations.'  
  
  },
  {
    name: 'Venus', radius: 0.7, distance: 9, speed: 0.004, material: venusMaterial, moons: [{}] ,
    description : 'Venus, often called Earths sister planet, is a rocky, terrestrial planet similar in size and mass to Earth, but with a vastly different surface environment. It is the second planet from the Sun and is shrouded in a thick, toxic atmosphere composed primarily of carbon dioxide, leading to an extreme greenhouse effect and scorching surface temperatures. '
  },
  {
    name: 'Earth', radius: 0.75, distance: 12, speed: 0.005, material: earthMaterial,
    moons: [{ name: 'Moon', radius: 0.2, distance: 1.2, speed: 0.015, material: moonMaterial }] , 
description: 'Earth is the only known planet to support life, orbiting the Sun at 149.6 million km. It has a balanced atmosphere of nitrogen and oxygen, liquid water, and a protective magnetic field. It has one moon.'

  },
  {
    name: 'Mars', radius: 0.75, distance: 15, speed: 0.006, material: marsMaterial,
    moons: [
      { name: 'Phobos', radius: 0.1, distance: 1.5, speed: 0.03, material: moonMaterial },
      { name: 'Deimos', radius: 0.2, distance: 2.4, speed: 0.03, material: moonMaterial }
    ] ,
    description: 'Mars is 227.9 million km from the Sun and known for its red color due to iron oxide. It has a thin atmosphere, two small moons (Phobos and Deimos), and evidence of ancient water flow.'

  },
  {
    name: 'Jupiter', radius: 2.5, distance: 25, speed: 0.006, material: jupiterMaterial, moons: [
      
    ] ,
    description: 'Jupiter is the largest planet, located about 778.5 million km from the Sun. It’s a gas giant with 95 moons and a massive magnetic field. Its Great Red Spot is a giant storm larger than Earth.'

  },
  {
    name: 'Saturn', radius: 2.2, distance: 33, speed: 0.0045, material: saturnMaterial, moons: [{}] , description: 'Saturn orbits at 1.43 billion km from the Sun and is famous for its rings made of ice and rock. It is a gas giant with over 80 moons, including Titan — the second-largest moon in the solar system.'

  },
  {
    name: 'Uranus', radius: 1.6, distance: 42, speed: 0.003, material: uranusMaterial, moons: [{}] , description: 'Uranus lies 2.87 billion km from the Sun. It is an ice giant with a bluish color due to methane gas and rotates sideways on its axis. It has at least 27 moons and faint rings.'

  },
  {
    name: 'Neptune', radius: 1.5, distance: 50, speed: 0.0025, material: neptuneMaterial, moons: [] , description: 'Neptune is the farthest planet, at about 4.5 billion km from the Sun. It’s an ice giant with deep blue color, supersonic winds, and 14 known moons. One year on Neptune equals 165 Earth years.'

  },
];



// --- Create Orbit Lines ---
const createOrbitLine = (radius, segments = 70) => {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.2, gapSize: 0.1 });
  const line = new THREE.LineLoop(geometry, material);
  line.computeLineDistances();
  return line;
};

planets.forEach(p => scene.add(createOrbitLine(p.distance)));

// --- Create Planet Meshes ---
const planetMeshes = planets.map(planet => {
  const mesh = new THREE.Mesh(sphereGeometry, planet.material);
  mesh.scale.setScalar(planet.radius);
  mesh.position.x = planet.distance;
  scene.add(mesh);

  planet.moons.forEach(moon => {
    if (moon.name) {
      const moonMesh = new THREE.Mesh(sphereGeometry, moon.material);
      moonMesh.scale.setScalar(moon.radius);
      moonMesh.position.x = moon.distance;
      mesh.add(moonMesh);
    }

  });

  // Add Saturn ring
      const ringGeo = new THREE.RingGeometry(planet.radius*1.4  , planet.radius);
    const ringMaterial = new THREE.MeshBasicMaterial({
  map: ringtext,
  side: THREE.DoubleSide,
  transparent: true,
  //depthWrite: false,
  opacity : 1
});
 const ringMesh = new THREE.Mesh(ringGeo, ringMaterial);
   if(planet.name === 'Saturn'){

const pos = ringGeo.attributes.position;
const uv = ringGeo.attributes.uv;
for (let i = 0; i < uv.count; i++) {
  const x = pos.getX(i);
  const y = pos.getY(i);
  const u = (x + 5)/10
  const v = (y + 5)/10
  uv.setXY(i, u, v);
}
   ringGeo.attributes.uv.needsUpdate = true;
    ringMesh.rotation.x = Math.PI/2 - 0.4;
    ringMesh.position.y = 0.01;
    ringMesh.renderOrder = 999;
   mesh.add(ringMesh);


   }
  ringMesh.layers.enableAll();  // ensure it's renderable
ringMesh.visible = true;
ringMesh.material.needsUpdate = true;
   return mesh;

});


// --- Asteroids ---
const asteroidGroup = new THREE.Group();
for (let i = 0; i < 600; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 17 + Math.random() * 5;
  const size = 0.10 + Math.random() * 0.07;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = (Math.random() - 0.5) * 0.5;

  const rock = new THREE.Mesh(
    new THREE.SphereGeometry(size, 6, 6),
    new THREE.MeshStandardMaterial({
      map: asTexture,
      normalMap: asn,
      roughnessMap: asr,
      aoMap: asao,
    })
  );

  rock.position.set(x, y, z);
  rock.rotationSpeed = Math.random() * 0.01;
  asteroidGroup.add(rock);
}
scene.add(asteroidGroup);

// --- Lights ---
scene.add(new THREE.AmbientLight(0xffffff, 0.06));
const sunlight = new THREE.PointLight(0xffffff, 500, 300);
sunlight.position.set(0, 0, 0);
sunlight.castShadow = true;
scene.add(sunlight);

// --- Camera & Controls ---
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100000);
camera.position.set(0, 20, 40);
scene.add(camera);

const canvas = document.querySelector('canvas.mainjs');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation Loop ---
const renderloop = () => {
  if(!isPaused){
  asteroidGroup.rotation.y += 0.0015;
  glowSprite.position.copy(sun.position);
  glowSprite.lookAt(camera.position);

  planetMeshes.forEach((planet, i) => {
    planet.rotation.y += planets[i].speed;
    planet.position.x = Math.cos(planet.rotation.y) * planets[i].distance;
    planet.position.z = Math.sin(planet.rotation.y) * planets[i].distance;

    planet.children.forEach((moon, j) => {
      if (planets[i].moons[j]) {
        moon.rotation.y += planets[i].moons[j].speed;
        moon.position.x = Math.cos(moon.rotation.y) * planets[i].moons[j].distance;
        moon.position.z = Math.sin(moon.rotation.y) * planets[i].moons[j].distance;
      }
    });
  });

  asteroidGroup.children.forEach(rock => {
    rock.rotation.y += rock.rotationSpeed;
  });

  controls.update();
}
  renderer.render(scene, camera);
  requestAnimationFrame(renderloop);
};
window.addEventListener("click", (event) => {
  if (isPaused) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planetMeshes);

  if (intersects.length > 0) {
    const clickedPlanet = intersects[0].object;
    const planetIndex = planetMeshes.indexOf(clickedPlanet);
    const planetData = planets[planetIndex];

    // Pause animations
    isPaused = true;

    // Fill panel info
 
    panelName.textContent = planetData.name;
panelImg.src = `assets/${planetData.name.toLowerCase()}.jpg`;
panelDesc.textContent = planetData.description || "No data available.";

    //panelDesc.textContent = `Distance: ${planetData.distance} AU\nRadius: ${planetData.radius}`;

    // Show panel
    infoPanel.classList.remove("hidden");
  }
});
panelCloseBtn.addEventListener("click", () => {
  infoPanel.classList.add("hidden");
  isPaused = false;
});


renderloop();

});