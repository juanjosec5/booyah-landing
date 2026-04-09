// ── 3D TITLE (Three.js) ──
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const canvas = document.getElementById('title-3d');
if (!canvas) throw new Error('Canvas #title-3d not found');

// ── Renderer ──
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

// ── Scene + Camera ──
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);

// ── Lights ──
scene.add(new THREE.AmbientLight(0xffffff, 0.55));
const key = new THREE.DirectionalLight(0xffffff, 1.2);
key.position.set(3, 5, 6);
scene.add(key);
const rim = new THREE.DirectionalLight(0xe8419a, 0.55);
rim.position.set(-4, -1, 2);
scene.add(rim);

// ── Materials ──
const matFront = new THREE.MeshStandardMaterial({ color: 0x1a1611, roughness: 0.35, metalness: 0.1 });
const matSide  = new THREE.MeshStandardMaterial({ color: 0x1c1a17, roughness: 0.7,  metalness: 0.0 });

// ── Geometry config ──
const GEO_CONFIG = {
  size:           1,
  depth:          0.08,
  curveSegments:  6,
  bevelEnabled:   true,
  bevelThickness: 0.022,
  bevelSize:      0.027,
  bevelSegments:  8,
};

let mesh = null;
let font  = null;

function buildMesh(cfg) {
  if (mesh) {
    mesh.geometry.dispose();
    scene.remove(mesh);
  }
  const geo = new TextGeometry('BOOYAH', { font, ...cfg });
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  geo.translate(
    -(bb.max.x + bb.min.x) / 2,
    -(bb.max.y + bb.min.y) / 2,
    -(bb.max.z + bb.min.z) / 2
  );
  mesh = new THREE.Mesh(geo, [matFront, matSide]);
  scene.add(mesh);
  updateCamera();
}

function updateCamera() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  if (mesh) {
    const bb = mesh.geometry.boundingBox;
    const textW = bb.max.x - bb.min.x;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    camera.position.z = (textW / 2) / (Math.tan(vFov / 2) * camera.aspect * 0.58);
  }
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', updateCamera, { passive: true });

// ── Load font & build ──
new FontLoader().load(
  'https://cdn.jsdelivr.net/npm/three@0.168.0/examples/fonts/optimer_bold.typeface.json',
  (loadedFont) => {
    font = loadedFont;
    buildMesh(GEO_CONFIG);
    canvas.classList.add('loaded');
    initDevPanel();
  }
);

// ── Animation loop ──
const clock = new THREE.Clock();
(function tick() {
  requestAnimationFrame(tick);
  if (mesh) {
    const t = clock.getElapsedTime();
    mesh.rotation.y = Math.sin(t / 3) * 0.14;
    mesh.rotation.x = Math.sin(t / 5) * 0.04;
  }
  renderer.render(scene, camera);
})();


// ── DEV PANEL: depth slider ────────────────────────────────────────────────
// Shows a floating panel to tweak depth in real-time.
// Hidden by default — toggle with the ⚙ button in the bottom-right corner.

function initDevPanel() {
  const panel = document.createElement('div');
  panel.id = 'dev-panel';
  panel.style.cssText = `
    position: fixed; bottom: 72px; right: 20px;
    background: rgba(26,22,17,.92); color: #e6e2d8;
    padding: 16px 20px; font-family: monospace; font-size: 13px;
    border: 1px solid rgba(232,65,154,.35); border-radius: 4px;
    z-index: 99999; min-width: 220px;
    display: none; flex-direction: column; gap: 10px;
  `;
  panel.innerHTML = `
    <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#E8419A;margin-bottom:4px">3D Title Dev</div>
    <label style="display:flex;flex-direction:column;gap:4px">
      <span>Depth</span>
      <input id="dp-depth" type="range" min="0.01" max="0.60" step="0.01" value="${GEO_CONFIG.depth}" style="accent-color:#E8419A">
    </label>
    <label style="display:flex;flex-direction:column;gap:4px">
      <span>Bevel size</span>
      <input id="dp-bevel" type="range" min="0.00" max="0.15" step="0.005" value="${GEO_CONFIG.bevelSize}" style="accent-color:#E8419A">
    </label>
    <div id="dp-values" style="font-size:11px;color:rgba(230,226,216,.55);border-top:1px solid rgba(255,255,255,.07);padding-top:8px">
      depth: ${GEO_CONFIG.depth} &nbsp;|&nbsp; bevel: ${GEO_CONFIG.bevelSize}
    </div>
  `;
  document.body.appendChild(panel);

  // Toggle button
  const btn = document.createElement('button');
  btn.id = 'dev-toggle';
  btn.textContent = '⚙';
  btn.title = 'Toggle 3D dev panel';
  btn.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(26,22,17,.85); color: #E8419A;
    border: 1px solid rgba(232,65,154,.4);
    font-size: 18px; cursor: pointer; z-index: 99999;
    display: flex; align-items: center; justify-content: center;
  `;
  btn.addEventListener('click', () => {
    const visible = panel.style.display === 'flex';
    panel.style.display = visible ? 'none' : 'flex';
  });
  document.body.appendChild(btn);

  // Live update on slider change
  function update() {
    GEO_CONFIG.depth      = parseFloat(document.getElementById('dp-depth').value);
    GEO_CONFIG.bevelSize  = parseFloat(document.getElementById('dp-bevel').value);
    document.getElementById('dp-values').textContent =
      `depth: ${GEO_CONFIG.depth.toFixed(3)}  |  bevel: ${GEO_CONFIG.bevelSize.toFixed(3)}`;
    buildMesh(GEO_CONFIG);
  }

  document.getElementById('dp-depth').addEventListener('input', update);
  document.getElementById('dp-bevel').addEventListener('input', update);
}
