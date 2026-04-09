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

// ── Animation config ──
const ANIM = {
  rockY:     0.14,   // amplitude of Y rotation (radians)
  rockYSpeed: 3,     // period divisor — higher = slower
  rockX:     0.04,
  rockXSpeed: 5,
};

// ── Animation loop ──
const clock = new THREE.Clock();
(function tick() {
  requestAnimationFrame(tick);
  if (mesh) {
    const t = clock.getElapsedTime();
    mesh.rotation.y = Math.sin(t / ANIM.rockYSpeed) * ANIM.rockY;
    mesh.rotation.x = Math.sin(t / ANIM.rockXSpeed) * ANIM.rockX;
  }
  renderer.render(scene, camera);
})();


// ── DEV PANEL ─────────────────────────────────────────────────────────────
// Toggle with the ⚙ button in the bottom-right corner.

function initDevPanel() {
  // ── helpers ──
  const ACCENT = '#E8419A';
  const row = (label, inputHtml) => `
    <label style="display:flex;flex-direction:column;gap:3px;font-size:11px">
      <span style="color:rgba(230,226,216,.6);letter-spacing:.06em">${label}</span>
      ${inputHtml}
    </label>`;
  const slider = (id, min, max, step, val) =>
    `<input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${val}"
      style="accent-color:${ACCENT};width:100%">`;
  const section = (title) =>
    `<div style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${ACCENT};
      margin-top:6px;padding-top:8px;border-top:1px solid rgba(255,255,255,.07)">${title}</div>`;

  const panel = document.createElement('div');
  panel.id = 'dev-panel';
  panel.style.cssText = `
    position: fixed; bottom: 72px; right: 20px;
    background: rgba(26,22,17,.95); color: #e6e2d8;
    padding: 16px 18px; font-family: monospace; font-size: 12px;
    border: 1px solid rgba(232,65,154,.35); border-radius: 4px;
    z-index: 99999; width: 260px; max-height: 80vh; overflow-y: auto;
    display: none; flex-direction: column; gap: 8px;
    scrollbar-width: thin; scrollbar-color: ${ACCENT} transparent;
  `;

  panel.innerHTML = `
    <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${ACCENT}">3D Title — Dev Panel</div>

    ${section('Geometry')}
    ${row('Depth',           slider('dp-depth',   0.01, 0.60, 0.005, GEO_CONFIG.depth))}
    ${row('Size',            slider('dp-size',    0.50, 2.00, 0.05,  GEO_CONFIG.size))}
    ${row('Curve segments',  slider('dp-curves',  2,    24,   1,     GEO_CONFIG.curveSegments))}

    ${section('Bevel')}
    ${row('Bevel size',      slider('dp-bsize',   0.00, 0.20, 0.005, GEO_CONFIG.bevelSize))}
    ${row('Bevel thickness', slider('dp-bthick',  0.00, 0.20, 0.005, GEO_CONFIG.bevelThickness))}
    ${row('Bevel segments',  slider('dp-bsegs',   1,    20,   1,     GEO_CONFIG.bevelSegments))}

    ${section('Animation')}
    ${row('Rock Y amplitude',  slider('dp-ry',    0.00, 0.50, 0.01,  ANIM.rockY))}
    ${row('Rock Y speed',      slider('dp-rys',   0.50, 10,   0.25,  ANIM.rockYSpeed))}
    ${row('Rock X amplitude',  slider('dp-rx',    0.00, 0.20, 0.005, ANIM.rockX))}

    ${section('Lighting')}
    ${row('Key intensity',   slider('dp-key',     0.00, 3.00, 0.05,  key.intensity))}
    ${row('Rim intensity',   slider('dp-rim',     0.00, 2.00, 0.05,  rim.intensity))}
    ${row('Ambient',         slider('dp-amb',     0.00, 2.00, 0.05,  0.55))}

    <div id="dp-values" style="
      font-size:10px;color:rgba(230,226,216,.45);
      border-top:1px solid rgba(255,255,255,.07);
      padding-top:8px;margin-top:4px;line-height:1.7;white-space:pre
    "></div>
  `;
  document.body.appendChild(panel);

  // Grab the ambient light reference so we can update it
  let ambLight;
  scene.traverse(obj => { if (obj.isAmbientLight) ambLight = obj; });

  function readValues() {
    return {
      geo: {
        depth:          +panel.querySelector('#dp-depth').value,
        size:           +panel.querySelector('#dp-size').value,
        curveSegments:  +panel.querySelector('#dp-curves').value,
        bevelSize:      +panel.querySelector('#dp-bsize').value,
        bevelThickness: +panel.querySelector('#dp-bthick').value,
        bevelSegments:  +panel.querySelector('#dp-bsegs').value,
      },
      anim: {
        rockY:      +panel.querySelector('#dp-ry').value,
        rockYSpeed: +panel.querySelector('#dp-rys').value,
        rockX:      +panel.querySelector('#dp-rx').value,
      },
      light: {
        key: +panel.querySelector('#dp-key').value,
        rim: +panel.querySelector('#dp-rim').value,
        amb: +panel.querySelector('#dp-amb').value,
      },
    };
  }

  function updateValues() {
    const v = readValues();

    // Geometry — only rebuild if geo params changed
    const geoChanged = Object.keys(v.geo).some(k => GEO_CONFIG[k] !== v.geo[k]);
    if (geoChanged) {
      Object.assign(GEO_CONFIG, v.geo, { bevelEnabled: true });
      buildMesh(GEO_CONFIG);
    }

    // Animation
    Object.assign(ANIM, v.anim);

    // Lights
    key.intensity = v.light.key;
    rim.intensity = v.light.rim;
    if (ambLight) ambLight.intensity = v.light.amb;

    // Status readout
    const g = v.geo, a = v.anim, l = v.light;
    panel.querySelector('#dp-values').textContent =
      `depth ${g.depth.toFixed(3)}  size ${g.size.toFixed(2)}  curves ${g.curveSegments}\n` +
      `bevel sz ${g.bevelSize.toFixed(3)}  th ${g.bevelThickness.toFixed(3)}  segs ${g.bevelSegments}\n` +
      `rockY ${a.rockY.toFixed(3)} @ spd ${a.rockYSpeed}  rockX ${a.rockX.toFixed(3)}\n` +
      `key ${l.key.toFixed(2)}  rim ${l.rim.toFixed(2)}  amb ${l.amb.toFixed(2)}`;
  }

  panel.addEventListener('input', updateValues);

  // ── Toggle button ──
  const btn = document.createElement('button');
  btn.id = 'dev-toggle';
  btn.textContent = '⚙';
  btn.title = 'Toggle 3D dev panel';
  btn.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(26,22,17,.85); color: ${ACCENT};
    border: 1px solid rgba(232,65,154,.4);
    font-size: 18px; cursor: pointer; z-index: 99999;
    display: flex; align-items: center; justify-content: center;
  `;
  btn.addEventListener('click', () => {
    const visible = panel.style.display === 'flex';
    panel.style.display = visible ? 'none' : 'flex';
  });
  document.body.appendChild(btn);

  // Prime the readout
  updateValues();
}
