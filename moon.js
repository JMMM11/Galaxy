import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";


const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


const imageFiles = [
  "lamejorfoto.jpg",
  "seductora.jpg",
  "collage.jpeg",
  "rulitos.jpg",
  "Graduación1.jpeg",
  "jejeje.jpg",
  "rulitos2.jpg",
];

// Cargar texturas para la luna
const textureLoader = new THREE.TextureLoader();
const moonTextures = imageFiles.map(file => textureLoader.load(file));

// Crear grupo para la luna
const moonGroup = new THREE.Group();
scene.add(moonGroup);

// Parámetros de la luna
const radius = 2.2;
const particleCount = 8000; 

// Crear partículas (sprites) para la luna
const particles = [];
for (let i = 0; i < particleCount; i++) {
    const texture = moonTextures[Math.floor(Math.random() * moonTextures.length)];
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        depthWrite: false
    });
    const sprite = new THREE.Sprite(material);

    // Coordenadas esféricas para distribuir los sprites en la esfera
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    sprite.position.set(x, y, z);
    sprite.scale.set(0.1, 0.1, 0.1); // Tamaño de los sprites
    sprite.lookAt(0, 0, 0); // Orientar el sprite hacia el centro de la esfera

    moonGroup.add(sprite);
    particles.push(sprite);
}

// Luz ambiental suave
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// --- ESTRELLAS COMO CUADRADITOS ---
// Crear una textura blanca pequeña para las estrellas
const starCanvas = document.createElement('canvas');
starCanvas.width = 4;
starCanvas.height = 4;
const ctx = starCanvas.getContext('2d');
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, 4, 4);
const starTexture = new THREE.CanvasTexture(starCanvas);

// Crear estrellas
const starCount = 3000;
for (let i = 0; i < starCount; i++) {
    const starMaterial = new THREE.SpriteMaterial({
        map: starTexture,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });
    const starSprite = new THREE.Sprite(starMaterial);

    // Posición aleatoria en un radio grande
    const starRadius = 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const x = starRadius * Math.sin(phi) * Math.cos(theta);
    const y = starRadius * Math.sin(phi) * Math.sin(theta);
    const z = starRadius * Math.cos(phi);

    starSprite.position.set(x, y, z);
    starSprite.scale.set(0.05, 0.05, 0.05); // Tamaño de las estrellas

    scene.add(starSprite);
}

// Controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animación
let time = 0;
function animate() {
    requestAnimationFrame(animate);

    // Rotación suave de la luna
    moonGroup.rotation.y += 0.001;

    // Efecto de "respiración" suave para la luna
    time += 0.01;
    particles.forEach((particle, i) => {
        const scale = 0.1 + 0.02 * Math.sin(time + i * 0.001);
        particle.scale.set(scale, scale, scale);
    });

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
