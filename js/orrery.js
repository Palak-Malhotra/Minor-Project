import * as THREE from './three.module.min.js'; // Adjust path if necessary
import { OrbitControls } from './OrbitControls.js'; // Adjust path if necessary


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('orrery-container').appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;

// Add Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
pointLight.position.set(0, 0, 0); // Center light for the Sun
scene.add(pointLight);

// Load Textures and Add Planets
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('../textures/sun.jpg');
const earthTexture = textureLoader.load('../textures/earth.jpg');
const marsTexture = textureLoader.load('../textures/mars.jpg');

// Sun
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets
const planets = [
  { texture: earthTexture, distance: 30, size: 2, speed: 0.001 },
  { texture: marsTexture, distance: 45, size: 1.5, speed: 0.0008 }
];

planets.forEach((planet) => {
  const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ map: planet.texture });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  planet.mesh = mesh;
});

camera.position.set(0, 50, 100);

// Animation Loop
const animate = () => {
  requestAnimationFrame(animate);
  planets.forEach((planet) => {
    const time = Date.now() * planet.speed;
    planet.mesh.position.x = planet.distance * Math.cos(time);
    planet.mesh.position.z = planet.distance * Math.sin(time);
  });
  controls.update();
  renderer.render(scene, camera);
};

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
