// galaxy.js (module)
import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

/**
 * Configurable parameters for the galaxy (tweak these)
 */
const params = {
  count: 130000,         // total points
  size: 0.006,           // particle size
  radius: 3.0,           // galaxy radius
  branches: 4,           // spiral arms
  spin: 1.2,             // how tightly wound
  randomness: 0.9,       // spread from arm
  randomnessPower: 2.0,  // distribution curve
  insideColor: "#ff6030",
  outsideColor: "#0949f0",
  rotationSpeed: 0.02    // rotation of whole points cloud
};

/* ---------- Basic scene ---------- */
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000010);
scene.fog = new THREE.FogExp2(0x000010, 0.08);

/* ---------- Camera ---------- */
const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 200);
camera.position.set(6, 2.5, 6);
scene.add(camera);

/* ---------- Renderer (optimized) ---------- */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.setClearColor(0x000010);

/* ---------- Controls ---------- */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 1.5;
controls.maxDistance = 30;

/* ---------- Galaxy: geometry / material / points ---------- */
let geometry = null;
let material = null;
let points = null;

function generateGalaxy() {
  // dispose previous
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
    points = null;
  }

  // geometry attributes
  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);
  const randomness = new Float32Array(params.count * 3); // small random offsets per axis
  const scales = new Float32Array(params.count);         // per-point scale factor if needed

  const colorInside = new THREE.Color(params.insideColor);
  const colorOutside = new THREE.Color(params.outsideColor);

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;

    // radius distribution: bias toward center using power
    const r = Math.pow(Math.random(), 1.2) * params.radius;

    // spin and branch angle
    const spinAngle = r * params.spin;
    const branch = i % params.branches;
    const branchAngle = (branch / params.branches) * Math.PI * 2;

    // randomness with signed direction and power curve for tighter core
    const randomX = (Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)) * params.randomness;
    const randomY = (Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)) * (params.randomness * 0.5);
    const randomZ = (Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)) * params.randomness;

    const angle = branchAngle + spinAngle;

    // base positions (on the spiral)
    positions[i3]     = Math.cos(angle) * r + randomX;
    positions[i3 + 1] = randomY * 0.6; // flatten slightly
    positions[i3 + 2] = Math.sin(angle) * r + randomZ;

    randomness[i3]     = randomX;
    randomness[i3 + 1] = randomY;
    randomness[i3 + 2] = randomZ;

    // per-point scale for future effects
    scales[i] = Math.random();

    // color interpolation with a slight non-linear bias
    const mixT = Math.pow(r / params.radius, 1.5);
    const mixed = colorInside.clone();
    mixed.lerp(colorOutside, mixT);

    colors[i3]     = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(randomness, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

  material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
}

generateGalaxy();

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
});

/* ---------- Animation ---------- */
const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();
  const delta = clock.getDelta();


  if (points) {
    points.rotation.y = elapsed * params.rotationSpeed;

    points.rotation.x = Math.sin(elapsed * 0.07) * 0.02;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();


window.addEventListener("keydown", (ev) => {
  if (ev.key === "r" || ev.key === "R") {

    params.spin = 0.5 + Math.random() * 2.5;
    params.randomness = 0.4 + Math.random() * 1.6;
    generateGalaxy();
  }
});
