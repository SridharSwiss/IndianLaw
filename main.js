import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const FLOOR_COUNT   = 52;
const FLOOR_H       = 4.75;          // metres per floor
const BUILDING_H    = FLOOR_COUNT * FLOOR_H;   // ≈247 m
const BUILDING_W    = 42;
const BUILDING_D    = 38;
const SETBACK_START = 38;            // floors above which silhouette narrows
const PODIUM_FLOORS = 6;
const PODIUM_H      = PODIUM_FLOORS * FLOOR_H;

// ─────────────────────────────────────────────────────────────────────────────
// Scene / Renderer / Camera
// ─────────────────────────────────────────────────────────────────────────────
const container = document.getElementById('canvas-container');
const renderer  = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled  = true;
renderer.shadowMap.type     = THREE.PCFSoftShadowMap;
renderer.toneMapping        = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure= 1.0;
renderer.outputColorSpace   = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.5, 8000);
camera.position.set(180, 80, 180);

// PMREM environment
const pmrem = new THREE.PMREMGenerator(renderer);
pmrem.compileEquirectangularShader();
const envTexture = pmrem.fromScene(new RoomEnvironment()).texture;
scene.environment = envTexture;

// ─────────────────────────────────────────────────────────────────────────────
// Controls
// ─────────────────────────────────────────────────────────────────────────────
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping    = true;
controls.dampingFactor    = 0.06;
controls.minDistance      = 20;
controls.maxDistance      = 900;
controls.maxPolarAngle    = Math.PI / 2.02;
controls.target.set(0, BUILDING_H * 0.45, 0);
controls.update();

// ─────────────────────────────────────────────────────────────────────────────
// Loading progress shim
// ─────────────────────────────────────────────────────────────────────────────
let progress = 0;
const fill   = document.getElementById('progress-fill');
const ltxt   = document.getElementById('loading-text');
function setProgress(p, msg) {
  progress = p;
  fill.style.width = p + '%';
  if (msg) ltxt.textContent = msg;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function hex(h) { return new THREE.Color(h); }
function mat(opts) { return new THREE.MeshStandardMaterial(opts); }

function box(w, h, d, material, rx=0, ry=0, rz=0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.rotation.set(rx, ry, rz);
  m.castShadow = m.receiveShadow = true;
  return m;
}

function cylinder(r, h, seg, material) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), material);
  m.castShadow = m.receiveShadow = true;
  return m;
}

// ─────────────────────────────────────────────────────────────────────────────
// Materials palette
// ─────────────────────────────────────────────────────────────────────────────
const MAT = {
  concrete:   mat({ color: 0xc8bfb0, roughness: .85, metalness: .05 }),
  concrete2:  mat({ color: 0xb8af9f, roughness: .9,  metalness: .0  }),
  coreWall:   mat({ color: 0xa89888, roughness: .8,  metalness: .0  }),

  glass:      mat({ color: 0x7ab8d4, roughness: .05, metalness: .1,
                    transparent: true, opacity: .72, side: THREE.DoubleSide }),
  glassDark:  mat({ color: 0x4a8aaa, roughness: .05, metalness: .15,
                    transparent: true, opacity: .78, side: THREE.DoubleSide }),
  glassNight: mat({ color: 0xfff0c8, roughness: .1, metalness: .05,
                    transparent: true, opacity: .85, emissive: 0xffd060,
                    emissiveIntensity: .8, side: THREE.DoubleSide }),

  mullion:    mat({ color: 0x888888, roughness: .3, metalness: .7 }),
  steel:      mat({ color: 0xaaaaaa, roughness: .25, metalness: .9 }),
  steelDark:  mat({ color: 0x555566, roughness: .3,  metalness: .85 }),
  aluminum:   mat({ color: 0xcccccc, roughness: .2,  metalness: .8  }),
  aluminumOrange: mat({ color: 0xe87820, roughness: .25, metalness: .7 }),

  pavement:   mat({ color: 0x6a6a6a, roughness: .95, metalness: 0 }),
  grass:      mat({ color: 0x3a7a2a, roughness: 1,   metalness: 0 }),
  water:      mat({ color: 0x1a6090, roughness: .1,  metalness: .3,
                    transparent: true, opacity: .8 }),

  lobbyFloor: mat({ color: 0xe8d8b0, roughness: .15, metalness: .05 }),
  lobbyWall:  mat({ color: 0xf5efe0, roughness: .5,  metalness: 0  }),
  marble:     mat({ color: 0xf0ead8, roughness: .08, metalness: .05 }),
  copper:     mat({ color: 0xb87333, roughness: .3,  metalness: .8  }),
  gold:       mat({ color: 0xd4a020, roughness: .2,  metalness: .9  }),
  signage:    mat({ color: 0xff8800, roughness: .4,  metalness: .2,
                    emissive: 0xff6600, emissiveIntensity: .4 }),
  led:        mat({ color: 0xffffff, roughness: 1,   metalness: 0,
                    emissive: 0xffffff, emissiveIntensity: 1 }),
  helipad:    mat({ color: 0x303030, roughness: .9,  metalness: 0  }),
  heliH:      mat({ color: 0xffff00, roughness: .5,  metalness: 0,
                    emissive: 0xffdd00, emissiveIntensity: .3 }),

  sky:        mat({ color: 0x87ceeb, roughness: 1, metalness: 0, side: THREE.BackSide }),
  ground:     mat({ color: 0x4a4a3a, roughness: 1, metalness: 0 }),

  podiumCladding: mat({ color: 0xd4c8a8, roughness: .55, metalness: .1 }),
  terracotta: mat({ color: 0xc0603a, roughness: .75, metalness: 0 }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Sky dome + atmosphere
// ─────────────────────────────────────────────────────────────────────────────
const skyGeo  = new THREE.SphereGeometry(3500, 24, 16);
const skyMesh = new THREE.Mesh(skyGeo, MAT.sky.clone());
scene.add(skyMesh);

// Horizon gradient using a cylinder
const horizonGeo  = new THREE.CylinderGeometry(3400, 3500, 600, 32, 1, true);
const horizonMat  = mat({ color: 0xe89040, transparent: true, opacity: .5, side: THREE.BackSide });
const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
horizonMesh.position.y = -200;
scene.add(horizonMesh);

// ─────────────────────────────────────────────────────────────────────────────
// Lighting rig
// ─────────────────────────────────────────────────────────────────────────────
const ambient = new THREE.AmbientLight(0xfff5e0, 0.35);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffeedd, 2.2);
sun.position.set(200, 350, 120);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.camera.near   = 10;
sun.shadow.camera.far    = 1200;
sun.shadow.camera.left   = -300;
sun.shadow.camera.right  = 300;
sun.shadow.camera.top    = 450;
sun.shadow.camera.bottom = -300;
sun.shadow.bias = -0.0003;
scene.add(sun);

const fill1 = new THREE.DirectionalLight(0x8090ff, 0.4);
fill1.position.set(-200, 100, -200);
scene.add(fill1);

const fill2 = new THREE.DirectionalLight(0xffd0a0, 0.25);
fill2.position.set(0, -100, 200);
scene.add(fill2);

// Spot on building crown
const crownSpot = new THREE.SpotLight(0xff9030, 5, 350, Math.PI / 12, 0.4, 1.5);
crownSpot.position.set(0, BUILDING_H + 80, 0);
crownSpot.target.position.set(0, BUILDING_H, 0);
scene.add(crownSpot, crownSpot.target);

// Lobby fill
const lobbyFill = new THREE.PointLight(0xffeebb, 3, 60, 1.5);
lobbyFill.position.set(0, PODIUM_H * 0.5, 0);
scene.add(lobbyFill);

// ─────────────────────────────────────────────────────────────────────────────
// Ground plane + surroundings
// ─────────────────────────────────────────────────────────────────────────────
setProgress(10, 'Building ground plane…');

const groundGeo = new THREE.PlaneGeometry(2400, 2400, 40, 40);
const ground    = new THREE.Mesh(groundGeo, MAT.ground);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Roads
function addRoad(w, d, x, z) {
  const r = new THREE.Mesh(new THREE.PlaneGeometry(w, d), MAT.pavement);
  r.rotation.x = -Math.PI / 2; r.position.set(x, 0.02, z);
  r.receiveShadow = true; scene.add(r);
}
addRoad(30, 1200, -130, 0);   // West road
addRoad(30, 1200,  130, 0);   // East road
addRoad(1200, 30,  0, -140);  // South road
addRoad(1200, 30,  0,  140);  // North road

// Pavement around building
const pavGeo = new THREE.PlaneGeometry(200, 200);
const pav    = new THREE.Mesh(pavGeo, MAT.pavement);
pav.rotation.x = -Math.PI / 2; pav.position.y = 0.01;
pav.receiveShadow = true; scene.add(pav);

// Lawn / green areas
function addGrass(w, d, x, z) {
  const g = new THREE.Mesh(new THREE.PlaneGeometry(w, d), MAT.grass);
  g.rotation.x = -Math.PI / 2; g.position.set(x, 0.03, z);
  g.receiveShadow = true; scene.add(g);
}
addGrass(80, 50, -140, 60);
addGrass(80, 50,  140, -60);
addGrass(50, 80, -60, -140);
addGrass(50, 80,  60,  140);

// Reflecting pool
const pool = new THREE.Mesh(new THREE.PlaneGeometry(60, 20), MAT.water);
pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.15, -110);
scene.add(pool);

// Pool edges
const poolEdgeMat = mat({ color: 0x888870, roughness: .7, metalness: .1 });
[-10.5, 10.5].forEach(x => {
  const e = new THREE.Mesh(new THREE.BoxGeometry(1, 0.4, 20), poolEdgeMat);
  e.position.set(x, 0.2, -110); scene.add(e);
});
[-30.5, 30.5].forEach(z => {
  const e = new THREE.Mesh(new THREE.BoxGeometry(62, 0.4, 1), poolEdgeMat);
  e.position.set(0, 0.2, -110 + z); scene.add(e);
});

// ─────────────────────────────────────────────────────────────────────────────
// Surrounding buildings (Hyderabad skyline context)
// ─────────────────────────────────────────────────────────────────────────────
setProgress(18, 'Placing city context…');

function surroundingBuilding(x, z, w, d, h, color = 0x889090) {
  const m = mat({ color, roughness: .7, metalness: .05 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  b.position.set(x, h / 2, z);
  b.castShadow = b.receiveShadow = true;
  scene.add(b);

  // Simple window grid
  const wm = mat({ color: 0xaac8d8, roughness: .1, metalness: .2,
                   transparent: true, opacity: .6, emissive: 0xffd080, emissiveIntensity: .05 });
  const cols = Math.floor(w / 5), rows = Math.floor(h / 4);
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const wp = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), wm);
      wp.position.set(x - w/2 + (c + .5) * (w/cols), 3 + r * 4, z + d/2 + 0.05);
      scene.add(wp);
    }
  }
}

const ctxBuildings = [
  [-280, -180, 55, 45, 95],  [-340, 60, 40, 35, 75],  [-260, 200, 60, 50, 110],
  [300,  -160, 50, 40, 85],  [360,  40, 45, 38, 65],  [280,  220, 55, 48, 100],
  [-150, -300, 48, 42, 60],  [200,  -280, 52, 46, 90], [0,   -320, 60, 50, 45],
  [-380, -350, 70, 58, 70],  [400,  320, 65, 55, 80],  [-200, 350, 58, 45, 55],
];
ctxBuildings.forEach(([x,z,w,d,h]) => surroundingBuilding(x, z, w, d, h));

// Telecom tower
const ttMat = mat({ color: 0xaaaaaa, roughness: .3, metalness: .7 });
for (let i = 0; i < 6; i++) {
  const r  = 1.5 - i * 0.18;
  const yh = i * 22;
  const c  = cylinder(r, 22, 8, ttMat);
  c.position.set(-450, yh + 11, -250);
  scene.add(c);
}

// ─────────────────────────────────────────────────────────────────────────────
// Trees
// ─────────────────────────────────────────────────────────────────────────────
function addTree(x, z, scale = 1) {
  const trunkMat = mat({ color: 0x5c3d1a, roughness: .9, metalness: 0 });
  const foliMat  = mat({ color: 0x2d6a20, roughness: 1,   metalness: 0 });
  const trunk = cylinder(0.3 * scale, 4 * scale, 6, trunkMat);
  trunk.position.set(x, 2 * scale, z);
  scene.add(trunk);
  // Layered cones for tropical feel
  [0, 1.5, 3].forEach((yo, i) => {
    const r = (3.5 - i * 0.8) * scale;
    const c = new THREE.Mesh(new THREE.ConeGeometry(r, 4 * scale, 8), foliMat);
    c.position.set(x, 4 * scale + yo * scale, z);
    c.castShadow = true; scene.add(c);
  });
}

const treePositions = [
  [-70, -80], [70, -80], [-70, 80], [70, 80],
  [-90, 0], [90, 0], [-80, -40], [80, 40],
  [-160, -120], [160, -120], [-160, 120], [160, 120],
  [-30, -115], [30, -115], [0, -90],
];
treePositions.forEach(([x, z]) => addTree(x, z, 0.8 + Math.random() * 0.5));

// ─────────────────────────────────────────────────────────────────────────────
// Street furniture
// ─────────────────────────────────────────────────────────────────────────────
function addStreetLight(x, z) {
  const poleMat = mat({ color: 0x888888, roughness: .4, metalness: .6 });
  const poleCyl = cylinder(0.12, 9, 6, poleMat);
  poleCyl.position.set(x, 4.5, z);
  scene.add(poleCyl);
  const armGeo  = new THREE.BoxGeometry(0.1, 0.1, 2.5);
  const arm     = new THREE.Mesh(armGeo, poleMat);
  arm.position.set(x, 9, z + 1.25);
  scene.add(arm);
  const lampMat = mat({ color: 0xffffdd, emissive: 0xffff80, emissiveIntensity: 1.5,
                        roughness: 1, metalness: 0 });
  const lamp    = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), lampMat);
  lamp.position.set(x, 9, z + 2.5);
  scene.add(lamp);
  const pl = new THREE.PointLight(0xfff5cc, 2, 28, 2);
  pl.position.set(x, 9, z + 2.5);
  scene.add(pl);
}

[[-100,-105],[100,-105],[-100,105],[100,105],
 [-100,-50],[100,-50],[-100,50],[100,50],
 [-50,-130],[50,-130],[-50,130],[50,130]
].forEach(([x,z]) => addStreetLight(x, z));

// ─────────────────────────────────────────────────────────────────────────────
// Entry plaza + gates
// ─────────────────────────────────────────────────────────────────────────────
setProgress(28, 'Building plaza…');

// Driveway
const driveMat = mat({ color: 0x8a8070, roughness: .85, metalness: 0 });
const driveGeo = new THREE.PlaneGeometry(22, 70);
const drive    = new THREE.Mesh(driveGeo, driveMat);
drive.rotation.x = -Math.PI / 2; drive.position.set(0, 0.05, -75);
scene.add(drive);

// Bollards
for (let i = -3; i <= 3; i++) {
  if (i === 0) continue;
  const bm = mat({ color: 0xffcc00, roughness: .5, metalness: .2,
                   emissive: 0xffaa00, emissiveIntensity: .4 });
  const b  = cylinder(0.18, 0.9, 8, bm);
  b.position.set(i * 3.5, 0.45, -52); scene.add(b);
}

// Entrance canopy / porte-cochère
const canopyMat = mat({ color: 0xddd8c8, roughness: .5, metalness: .2 });
const canopy    = new THREE.Mesh(new THREE.BoxGeometry(36, 0.5, 14), canopyMat);
canopy.position.set(0, 10, -28); canopy.castShadow = true; scene.add(canopy);

// Canopy columns
[-15, 0, 15].forEach(x => {
  const col = cylinder(0.5, 10, 8, mat({ color: 0xcccccc, roughness: .3, metalness: .5 }));
  col.position.set(x, 5, -34); scene.add(col);
});

// Entrance steps
for (let s = 0; s < 4; s++) {
  const step = new THREE.Mesh(
    new THREE.BoxGeometry(30 - s*2, 0.3, 1.8),
    mat({ color: 0xd0c8b0, roughness: .6, metalness: 0 })
  );
  step.position.set(0, 0.15 + s * 0.3, -22 + s * 1.8);
  scene.add(step);
}

// Flagpoles
[-55, 55].forEach((x, i) => {
  const pole = cylinder(0.18, 20, 6, MAT.aluminum);
  pole.position.set(x, 10, -80); scene.add(pole);
  const flagMat = mat({
    color: i === 0 ? 0xff9933 : 0x138808,
    roughness: .8, metalness: 0,
    side: THREE.DoubleSide
  });
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(4, 2.5), flagMat);
  flag.position.set(x + 2, 20, -80); scene.add(flag);
});

// ─────────────────────────────────────────────────────────────────────────────
// Podium (floors 1-6)
// ─────────────────────────────────────────────────────────────────────────────
setProgress(35, 'Constructing podium…');

const podiumGroup = new THREE.Group();
scene.add(podiumGroup);

// Base slab
const podiumBase = box(BUILDING_W + 16, PODIUM_H, BUILDING_D + 12, MAT.podiumCladding);
podiumBase.position.y = PODIUM_H / 2;
podiumGroup.add(podiumBase);

// Podium facade panels
const panelMat  = mat({ color: 0xd8c8a0, roughness: .5, metalness: .1 });
const panelMat2 = mat({ color: 0xc8b890, roughness: .6, metalness: .05 });
const PANEL_W   = 2.5, PANEL_H = FLOOR_H - 0.8;

for (let f = 0; f < PODIUM_FLOORS; f++) {
  const y  = f * FLOOR_H + FLOOR_H / 2;
  const pm = f % 2 === 0 ? panelMat : panelMat2;

  // Front / back
  for (let c = 0; c < Math.floor((BUILDING_W + 16) / PANEL_W); c++) {
    const p = box(PANEL_W - 0.15, PANEL_H, 0.12, pm);
    p.position.set(-((BUILDING_W + 16) / 2) + (c + .5) * PANEL_W, y, (BUILDING_D + 12) / 2 + 0.05);
    podiumGroup.add(p);
    const p2 = box(PANEL_W - 0.15, PANEL_H, 0.12, pm);
    p2.position.set(-((BUILDING_W + 16) / 2) + (c + .5) * PANEL_W, y, -(BUILDING_D + 12) / 2 - 0.05);
    podiumGroup.add(p2);
  }
}

// Lobby glazing on South face
const lobbyGlazMat = mat({ color: 0x9ad4f0, roughness: .03, metalness: .1,
                           transparent: true, opacity: .65, side: THREE.DoubleSide });
const lobbyGlaz = new THREE.Mesh(new THREE.BoxGeometry(28, PODIUM_H - 1, 0.15), lobbyGlazMat);
lobbyGlaz.position.set(0, PODIUM_H / 2, (BUILDING_D + 12) / 2 + 0.2);
podiumGroup.add(lobbyGlaz);
lobbyGlaz.userData = { label: 'Grand Lobby Facade', desc: 'Triple-glazed 12 m curtain wall, electrochromic tinting' };

// Podium roof deck
const roofDeck = box(BUILDING_W + 16, 0.4, BUILDING_D + 12,
                     mat({ color: 0x7a9060, roughness: .9, metalness: 0 }));
roofDeck.position.y = PODIUM_H + 0.2;
podiumGroup.add(roofDeck);

// Podium roof garden features
function addPot(x, z) {
  const pm = mat({ color: 0xa05030, roughness: .8, metalness: 0 });
  const pot = cylinder(0.8, 1, 8, pm);
  pot.position.set(x, PODIUM_H + 1, z);
  podiumGroup.add(pot);
  const fm = mat({ color: 0x2a8020, roughness: 1, metalness: 0 });
  const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 6), fm);
  foliage.position.set(x, PODIUM_H + 2.3, z);
  podiumGroup.add(foliage);
}
for (let i = -3; i <= 3; i++) {
  addPot(i * 8, (BUILDING_D + 12) / 2 - 3);
  addPot(i * 8, -(BUILDING_D + 12) / 2 + 3);
}

// ─────────────────────────────────────────────────────────────────────────────
// Lobby interior (visible through glass)
// ─────────────────────────────────────────────────────────────────────────────
setProgress(40, 'Furnishing lobby…');

const lobbyGroup = new THREE.Group();
scene.add(lobbyGroup);

// Floor
const lobbyFloor = box(BUILDING_W - 2, 0.2, BUILDING_D - 2, MAT.marble);
lobbyFloor.position.y = 0.1; lobbyGroup.add(lobbyFloor);

// Walls
const lobbyWallMat = mat({ color: 0xf0e8d0, roughness: .4, metalness: 0 });
[-BUILDING_W/2 + 1, BUILDING_W/2 - 1].forEach(x => {
  const w = box(1, PODIUM_H, BUILDING_D - 2, lobbyWallMat);
  w.position.set(x, PODIUM_H/2, 0); lobbyGroup.add(w);
});
[-(BUILDING_D/2)+1, (BUILDING_D/2)-1].forEach(z => {
  const w = box(BUILDING_W - 2, PODIUM_H, 1, lobbyWallMat);
  w.position.set(0, PODIUM_H/2, z); lobbyGroup.add(w);
});

// Reception desk — curved suggestion
const deskMat = mat({ color: 0x4a3020, roughness: .3, metalness: .3 });
const desk    = new THREE.Mesh(new THREE.CylinderGeometry(8, 8.5, 1.1, 32, 1, false,
                               -Math.PI/3, Math.PI*1.3), deskMat);
desk.position.set(0, 0.55, -4); lobbyGroup.add(desk);
desk.userData = { label: 'Reception Desk', desc: 'Curved dark-stone concierge counter with digital display facade' };

// Marble feature wall behind desk
const featureWall = box(22, 6, 0.4, mat({ color: 0xe8d8c0, roughness: .1, metalness: .05 }));
featureWall.position.set(0, 3, -(BUILDING_D/2) + 2); lobbyGroup.add(featureWall);
// Signage on wall
const signGeo  = new THREE.BoxGeometry(12, 1.5, 0.1);
const signMesh = new THREE.Mesh(signGeo, MAT.signage);
signMesh.position.set(0, 4.5, -(BUILDING_D/2) + 2.3); lobbyGroup.add(signMesh);

// Atrium column forest (4 columns)
const colMat = mat({ color: 0xd4c8a0, roughness: .15, metalness: .1 });
[[-10, -6], [10, -6], [-10, 6], [10, 6]].forEach(([x, z]) => {
  const col = cylinder(1, PODIUM_H, 16, colMat);
  col.position.set(x, PODIUM_H/2, z); lobbyGroup.add(col);
  // Capital ring
  const cap = cylinder(1.4, 0.4, 16, mat({ color: 0xd4a020, roughness: .3, metalness: .7 }));
  cap.position.set(x, PODIUM_H - 0.2, z); lobbyGroup.add(cap);
});

// Lobby ceiling
const lobbyCeil = box(BUILDING_W - 2, 0.3, BUILDING_D - 2,
                      mat({ color: 0xfaf5ec, roughness: .5, metalness: 0 }));
lobbyCeil.position.y = PODIUM_H - 0.15; lobbyGroup.add(lobbyCeil);

// Ceiling lights grid
const ceilLightMat = mat({ color: 0xffffff, emissive: 0xffeebb, emissiveIntensity: 1.2,
                           roughness: 1, metalness: 0 });
for (let x = -15; x <= 15; x += 6) {
  for (let z = -14; z <= 14; z += 6) {
    const cl = new THREE.Mesh(new THREE.CircleGeometry(0.4, 12), ceilLightMat);
    cl.rotation.x = Math.PI / 2; cl.position.set(x, PODIUM_H - 0.28, z);
    lobbyGroup.add(cl);
  }
}

// Water feature / fountain
const fountainBase = cylinder(4, 0.5, 24, MAT.marble);
fountainBase.position.set(0, 0.25, 10); lobbyGroup.add(fountainBase);
const fountainWater = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.15, 24), MAT.water);
fountainWater.position.set(0, 0.5, 10); lobbyGroup.add(fountainWater);
fountainWater.userData = { label: 'Lobby Fountain', desc: 'Circular water feature with illuminated base, Deccani geometric motif' };

// Elevator bank indicators
for (let e = -3; e <= 3; e++) {
  if (e === 0) continue;
  const elevMat = mat({ color: 0xaaaaaa, roughness: .2, metalness: .8 });
  const elevDoor = box(2.2, 2.8, 0.1, elevMat);
  elevDoor.position.set(e * 4, 1.4, -(BUILDING_D/2) + 1.5); lobbyGroup.add(elevDoor);
  const ledNum = mat({ color: 0xff8000, emissive: 0xff6000, emissiveIntensity: 1.5,
                       roughness: 1, metalness: 0 });
  const num = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.4), ledNum);
  num.position.set(e * 4, 3, -(BUILDING_D/2) + 1.5); lobbyGroup.add(num);
}
lobbyGroup.userData = { label: 'Elevator Bank', desc: '14 high-speed elevators (2–3.5 m/s), 2 panoramic lifts' };

// ─────────────────────────────────────────────────────────────────────────────
// Core (concrete shear walls visible as inner block)
// ─────────────────────────────────────────────────────────────────────────────
setProgress(48, 'Building structural core…');

const coreGroup = new THREE.Group();
scene.add(coreGroup);

const coreW = 14, coreD = 12;
const coreMesh = box(coreW, BUILDING_H, coreD, MAT.coreWall);
coreMesh.position.y = BUILDING_H / 2;
coreGroup.add(coreMesh);
coreMesh.userData = { label: 'RC Shear Core', desc: '800 mm reinforced-concrete central core, M60 grade concrete' };

// Core lift shaft openings
for (let f = 0; f < FLOOR_COUNT; f++) {
  const y = f * FLOOR_H + FLOOR_H * 0.5;
  for (let s = -1; s <= 1; s += 2) {
    const shaft = box(2, FLOOR_H * 0.7, 0.15, mat({ color: 0x222222, roughness: 1, metalness: 0 }));
    shaft.position.set(s * 4, y, coreD / 2 + 0.08);
    coreGroup.add(shaft);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tower floors + facade — main body (floors 7–37) and setback zone (38–52)
// ─────────────────────────────────────────────────────────────────────────────
setProgress(55, 'Stacking tower floors…');

const towerGroup = new THREE.Group();
scene.add(towerGroup);
towerGroup.userData.floors = [];

// Shared spandrel mat (orange accent — Hyderabad colour nod)
const spandrelMat = MAT.aluminumOrange;

for (let f = PODIUM_FLOORS; f < FLOOR_COUNT; f++) {
  const isSetback = f >= SETBACK_START;
  const shrink    = isSetback ? (f - SETBACK_START) * 0.18 : 0;
  const fw        = BUILDING_W - shrink * 2;
  const fd        = BUILDING_D - shrink * 2;
  const y         = f * FLOOR_H;

  // Floor slab
  const slabMat = f % 2 === 0 ? MAT.concrete : MAT.concrete2;
  const slab    = box(fw + 0.5, 0.35, fd + 0.5, slabMat);
  slab.position.y = y + 0.175;
  slab.userData = { floorIndex: f, label: `Floor ${f + 1}`, desc: `Level ${f + 1} — ${f < 15 ? 'Office' : f < 42 ? 'Premium Office' : f < 50 ? 'Sky Lounge / Hotel' : 'Penthouse Suite'}` };
  towerGroup.add(slab);
  towerGroup.userData.floors.push(slab);

  // Curtain-wall glass panels — 4 facades
  const glassH  = FLOOR_H - 0.5;
  const gMat    = f % 3 === 0 ? MAT.glassDark : MAT.glass;

  // South facade
  const colCount = Math.floor(fw / 3.5);
  for (let c = 0; c < colCount; c++) {
    const gp = new THREE.Mesh(new THREE.BoxGeometry(3.2, glassH, 0.08), gMat);
    gp.position.set(-fw/2 + (c + .5) * (fw/colCount), y + glassH/2 + 0.4, fd/2 + 0.04);
    towerGroup.add(gp);
  }
  // North facade
  for (let c = 0; c < colCount; c++) {
    const gp = new THREE.Mesh(new THREE.BoxGeometry(3.2, glassH, 0.08), gMat);
    gp.position.set(-fw/2 + (c + .5) * (fw/colCount), y + glassH/2 + 0.4, -fd/2 - 0.04);
    towerGroup.add(gp);
  }
  // East + West facades
  const colCountD = Math.floor(fd / 3.5);
  for (let c = 0; c < colCountD; c++) {
    ['E', 'W'].forEach(side => {
      const gp = new THREE.Mesh(new THREE.BoxGeometry(0.08, glassH, 3.2), gMat);
      gp.position.set(
        side === 'E' ? fw/2 + 0.04 : -fw/2 - 0.04,
        y + glassH/2 + 0.4,
        -fd/2 + (c + .5) * (fd/colCountD)
      );
      towerGroup.add(gp);
    });
  }

  // Mullions (vertical aluminium framing)
  const mullionStep = fw / colCount;
  for (let c = 0; c <= colCount; c++) {
    const mul = box(0.12, FLOOR_H, 0.14, MAT.mullion);
    mul.position.set(-fw/2 + c * mullionStep, y + FLOOR_H/2, fd/2);
    towerGroup.add(mul);
    const mul2 = box(0.12, FLOOR_H, 0.14, MAT.mullion);
    mul2.position.set(-fw/2 + c * mullionStep, y + FLOOR_H/2, -fd/2);
    towerGroup.add(mul2);
  }

  // Spandrel band (horizontal orange accent)
  if (f % 4 === 0 || isSetback) {
    const sp = box(fw + 0.6, 0.45, fd + 0.6, spandrelMat);
    sp.position.y = y + 0.22;
    towerGroup.add(sp);
  }

  // Mechanical floor visual indicator
  if (f === 25 || f === 38) {
    const mfMat = mat({ color: 0x555566, roughness: .6, metalness: .3 });
    const mf    = box(fw + 1, FLOOR_H * 0.8, fd + 1, mfMat);
    mf.position.y = y + FLOOR_H * 0.4;
    mf.userData = { label: `Mechanical Floor ${f + 1}`, desc: 'HVAC plant, fire tanks, electrical switchgear, sky-lobby' };
    towerGroup.add(mf);
  }
}

// Continuous corner columns
setProgress(65, 'Adding structural columns…');
const colMat2 = mat({ color: 0xc8c0b0, roughness: .6, metalness: .1 });
[[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx, sz]) => {
  const col = cylinder(0.9, BUILDING_H, 12, colMat2);
  col.position.set(sx * (BUILDING_W/2 - 0.4), BUILDING_H/2, sz * (BUILDING_D/2 - 0.4));
  scene.add(col);
});

// Outrigger trusses at mechanical floors
[25, 38].forEach(f => {
  const y   = f * FLOOR_H + FLOOR_H/2;
  const trM = MAT.steel;
  for (let i = -1; i <= 1; i += 2) {
    // Diagonal bracing
    const diag = box(0.3, 0.3, BUILDING_D * 0.6, trM, 0, 0, Math.PI/8 * i);
    diag.position.set(i * (BUILDING_W/2 - 2), y, 0);
    scene.add(diag);
  }
  // Belt truss ring
  const belt = box(BUILDING_W + 2, 0.6, 0.3, trM);
  belt.position.set(0, y, BUILDING_D/2 + 0.15); scene.add(belt);
  const belt2 = box(BUILDING_W + 2, 0.6, 0.3, trM);
  belt2.position.set(0, y, -BUILDING_D/2 - 0.15); scene.add(belt2);
});

// ─────────────────────────────────────────────────────────────────────────────
// Sky Lobby (floor 26)
// ─────────────────────────────────────────────────────────────────────────────
const skyLobbyY = 25 * FLOOR_H;
const skyLobbyMat = mat({ color: 0xf8f2e8, roughness: .2, metalness: .02 });
const skyLobbyFloor = box(BUILDING_W - 2, 0.2, BUILDING_D - 2, skyLobbyMat);
skyLobbyFloor.position.y = skyLobbyY + 0.1;
skyLobbyFloor.userData = { label: 'Sky Lobby — Floor 26', desc: 'Double-height transfer floor, express elevator interchange, sky café' };
scene.add(skyLobbyFloor);
const skyLobbyLight = new THREE.PointLight(0xffeebb, 4, 30, 1.8);
skyLobbyLight.position.set(0, skyLobbyY + 3, 0);
scene.add(skyLobbyLight);

// ─────────────────────────────────────────────────────────────────────────────
// Crown / Spire
// ─────────────────────────────────────────────────────────────────────────────
setProgress(75, 'Finishing crown…');

const crownBase = FLOOR_COUNT * FLOOR_H;
const crownGroup = new THREE.Group();
scene.add(crownGroup);

// Tapered parapet wall
const parapet = box(BUILDING_W * 0.65, 4, BUILDING_D * 0.65,
                    mat({ color: 0xb8b0a0, roughness: .5, metalness: .1 }));
parapet.position.y = crownBase + 2; crownGroup.add(parapet);

// Glass crown fins
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2;
  const finMat = mat({ color: 0x7ab8d4, roughness: .05, metalness: .1,
                       transparent: true, opacity: .55, side: THREE.DoubleSide });
  const fin = box(0.1, 14, 10, finMat);
  fin.position.set(Math.cos(angle) * 12, crownBase + 10, Math.sin(angle) * 8);
  fin.rotation.y = angle; crownGroup.add(fin);
}

// Central spire shaft
const spireShaft = cylinder(1.2, 35, 8, MAT.steel);
spireShaft.position.y = crownBase + 4 + 17.5; crownGroup.add(spireShaft);

// Observation deck ring
const obsDeck = cylinder(7, 1, 24, mat({ color: 0xaaaaaa, roughness: .2, metalness: .7 }));
obsDeck.position.y = crownBase + 22; crownGroup.add(obsDeck);
obsDeck.userData = { label: 'Observation Deck', desc: '360° panoramic deck, 247 m above street level' };

// Obs deck glass rail
const railMat = mat({ color: 0x9dd8f0, roughness: .05, metalness: .1,
                      transparent: true, opacity: .5, side: THREE.DoubleSide });
const rail    = cylinder(7.2, 1.5, 24, railMat);
rail.position.y = crownBase + 22.75; crownGroup.add(rail);

// Spire tip + beacon
const spireTip = new THREE.Mesh(new THREE.ConeGeometry(0.6, 8, 8), MAT.gold);
spireTip.position.y = crownBase + 4 + 35 + 4; crownGroup.add(spireTip);

// Beacon light (blinking handled in animate)
const beaconMat = mat({ color: 0xff2200, emissive: 0xff1100, emissiveIntensity: 2,
                        roughness: 1, metalness: 0 });
const beacon    = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 6), beaconMat);
beacon.position.y = crownBase + 4 + 35 + 8.5; crownGroup.add(beacon);
const beaconLight = new THREE.PointLight(0xff2200, 5, 40, 2);
beaconLight.position.copy(beacon.position); crownGroup.add(beaconLight);

// ─────────────────────────────────────────────────────────────────────────────
// Helipad
// ─────────────────────────────────────────────────────────────────────────────
const helipadY = crownBase + 5;
const helipad  = cylinder(10, 0.35, 32, MAT.helipad);
helipad.position.set(0, helipadY, 0);
helipad.userData = { label: 'Rooftop Helipad', desc: 'DGCA-compliant VIP helipad, FATO 12 m dia, night-capable with TLOF lighting' };
scene.add(helipad);

// Helipad H marking
const hMark = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), MAT.heliH);
hMark.rotation.x = -Math.PI / 2;
hMark.position.set(0, helipadY + 0.2, 0);
scene.add(hMark);

// Helipad perimeter lights
for (let i = 0; i < 16; i++) {
  const a   = (i / 16) * Math.PI * 2;
  const hlm = mat({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 2, roughness: 1 });
  const hl  = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 4), hlm);
  hl.position.set(Math.cos(a) * 9.8, helipadY + 0.3, Math.sin(a) * 9.8);
  scene.add(hl);
}

// ─────────────────────────────────────────────────────────────────────────────
// Rooftop mechanical equipment
// ─────────────────────────────────────────────────────────────────────────────
const mechMat  = mat({ color: 0x667766, roughness: .7, metalness: .3 });
const mechMat2 = mat({ color: 0x888888, roughness: .4, metalness: .6 });
// HVAC units
[[-12, 15], [12, 15], [0, -14], [-14, 0], [14, 0]].forEach(([x, z]) => {
  const unit = box(5, 2.5, 4, mechMat);
  unit.position.set(x, crownBase + 3.25, z); scene.add(unit);
  // Fan cylinders on top
  [-.8, .8].forEach(dx => {
    const fan = cylinder(0.9, 0.5, 16, mechMat2);
    fan.position.set(x + dx, crownBase + 4.75, z); scene.add(fan);
  });
});
// Cooling towers
[-18, 18].forEach(x => {
  const ct = cylinder(3.5, 7, 16, mechMat);
  ct.position.set(x, crownBase + 5.5, 12); scene.add(ct);
  const ctTop = cylinder(4, 0.5, 16, mat({ color: 0x445544, roughness: .8, metalness: .2 }));
  ctTop.position.set(x, crownBase + 9.25, 12); scene.add(ctTop);
});

// ─────────────────────────────────────────────────────────────────────────────
// Night-window emissive tiles (every window lights up at night)
// ─────────────────────────────────────────────────────────────────────────────
setProgress(83, 'Wiring night lighting…');

const nightWindows = [];
for (let f = PODIUM_FLOORS; f < FLOOR_COUNT; f++) {
  const shrink = f >= SETBACK_START ? (f - SETBACK_START) * 0.18 : 0;
  const fw     = BUILDING_W - shrink * 2;
  const fd     = BUILDING_D - shrink * 2;
  const y      = f * FLOOR_H + FLOOR_H * 0.55;
  const wMat   = mat({ color: 0xfff5d0, roughness: 1, metalness: 0,
                       emissive: 0xffd060, emissiveIntensity: 0 });
  nightWindows.push(wMat);

  const wCols = Math.floor(fw / 3.5);
  for (let c = 0; c < wCols; c++) {
    // Only 70% of windows emit (random offices on)
    if (Math.random() > 0.7) continue;
    const side = Math.random() > .5 ? 1 : -1;
    const wp = new THREE.Mesh(new THREE.PlaneGeometry(2, 2.5), wMat);
    wp.position.set(
      -fw/2 + (c + .5) * (fw/wCols),
      y,
      side > 0 ? fd/2 + 0.12 : -fd/2 - 0.12
    );
    if (side < 0) wp.rotation.y = Math.PI;
    scene.add(wp);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Facade LED strip accents (edge-lit vertical fins)
// ─────────────────────────────────────────────────────────────────────────────
const ledStripMat = mat({ color: 0xff8c1a, roughness: 1, metalness: 0,
                          emissive: 0xff6600, emissiveIntensity: 0.4 });
for (let i = -2; i <= 2; i++) {
  const strip = box(0.25, BUILDING_H - PODIUM_H, 0.25, ledStripMat);
  strip.position.set(i * (BUILDING_W / 4.5), PODIUM_H + (BUILDING_H - PODIUM_H)/2, BUILDING_D/2 + 0.3);
  scene.add(strip);
  const strip2 = strip.clone();
  strip2.position.z = -BUILDING_D/2 - 0.3; scene.add(strip2);
}

// ─────────────────────────────────────────────────────────────────────────────
// Floor bar (side HUD)
// ─────────────────────────────────────────────────────────────────────────────
const floorBar = document.getElementById('floor-ticks');
const floorNum = document.getElementById('floor-number');
const ticks    = [];
// Show every 5th floor only to keep it manageable
for (let f = FLOOR_COUNT; f >= 1; f--) {
  const tick = document.createElement('div');
  tick.className = 'floor-tick';
  tick.dataset.f  = f;
  floorBar.appendChild(tick);
  ticks.push({ f, el: tick });
}

// ─────────────────────────────────────────────────────────────────────────────
// Raycasting for interactive tooltips
// ─────────────────────────────────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2(-999, -999);
const tooltip   = document.getElementById('tooltip');
const ttTitle   = document.getElementById('tt-title');
const ttBody    = document.getElementById('tt-body');

renderer.domElement.addEventListener('mousemove', e => {
  mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  tooltip.style.left = (e.clientX + 14) + 'px';
  tooltip.style.top  = (e.clientY - 10) + 'px';
});

// ─────────────────────────────────────────────────────────────────────────────
// Camera animation targets
// ─────────────────────────────────────────────────────────────────────────────
let camMode    = 'orbit';   // orbit | fly | lobby | roof | exterior | xray
let flyT       = 0;
let autoNight  = false;

const camTargets = {
  lobby:    { pos: new THREE.Vector3(0, 5, 50),         tgt: new THREE.Vector3(0, 4, 0) },
  roof:     { pos: new THREE.Vector3(30, BUILDING_H+50, 30), tgt: new THREE.Vector3(0, BUILDING_H+5, 0) },
  exterior: { pos: new THREE.Vector3(250, 60, 0),       tgt: new THREE.Vector3(0, BUILDING_H*0.4, 0) },
};

function tweenCamera(target) {
  controls.enabled = true;
  gsap(camera.position, target.pos, 1.6);
  gsap(controls.target, target.tgt, 1.6);
}

// Mini tween (no dep)
function gsap(obj, to, dur) {
  const from   = { x: obj.x, y: obj.y, z: obj.z };
  const start  = performance.now();
  const tick   = () => {
    const t  = Math.min((performance.now() - start) / (dur * 1000), 1);
    const e  = 1 - Math.pow(1 - t, 3);
    obj.x    = from.x + (to.x - from.x) * e;
    obj.y    = from.y + (to.y - from.y) * e;
    obj.z    = from.z + (to.z - from.z) * e;
    if (t < 1) requestAnimationFrame(tick);
  };
  tick();
}

// ─────────────────────────────────────────────────────────────────────────────
// Time of day controller
// ─────────────────────────────────────────────────────────────────────────────
const timeSlider = document.getElementById('time-slider');
const timeVal    = document.getElementById('time-val');

function setTimeOfDay(t) {
  // t: 0 = midnight, 50 = dawn, 65 = day, 80 = dusk, 100 = midnight
  const norm   = t / 100;
  const isNight = t < 35 || t > 90;
  const isDusk  = (t >= 75 && t <= 90) || (t >= 25 && t <= 40);

  // Sky colour
  let skyCol, horizCol, sunInt, ambInt, sunColor;
  if (t < 25) {
    skyCol   = new THREE.Color(0x020410);
    horizCol = new THREE.Color(0x080820);
    sunInt   = 0.0; ambInt = 0.06; sunColor = new THREE.Color(0x000022);
  } else if (t < 40) {
    const p  = (t - 25) / 15;
    skyCol   = new THREE.Color(0x020410).lerp(new THREE.Color(0xf08030), p);
    horizCol = new THREE.Color(0x080820).lerp(new THREE.Color(0xff6010), p);
    sunInt   = p * 1.2; ambInt = 0.06 + p * 0.3; sunColor = new THREE.Color(0xff9040);
  } else if (t < 75) {
    const p  = (t - 40) / 35;
    skyCol   = new THREE.Color(0xf08030).lerp(new THREE.Color(0x87ceeb), p);
    horizCol = new THREE.Color(0xff6010).lerp(new THREE.Color(0xe89040), p);
    sunInt   = 1.2 + p * 1.0; ambInt = 0.36 + p * 0.15; sunColor = new THREE.Color(0xffeedd);
  } else if (t < 90) {
    const p  = (t - 75) / 15;
    skyCol   = new THREE.Color(0x87ceeb).lerp(new THREE.Color(0x020410), p);
    horizCol = new THREE.Color(0xe89040).lerp(new THREE.Color(0x080820), p);
    sunInt   = 2.2 * (1 - p); ambInt = 0.35 * (1 - p) + 0.06; sunColor = new THREE.Color(0xff6030);
  } else {
    skyCol   = new THREE.Color(0x020410);
    horizCol = new THREE.Color(0x080820);
    sunInt   = 0.0; ambInt = 0.06; sunColor = new THREE.Color(0x000022);
  }

  skyMesh.material.color.copy(skyCol);
  horizonMesh.material.color.copy(horizCol);
  sun.intensity   = sunInt;
  sun.color.copy(sunColor);
  ambient.intensity = ambInt;

  // Night-window glow
  const nightGlow = isNight ? 1.5 : (isDusk ? 0.6 : 0);
  nightWindows.forEach(m => { m.emissiveIntensity = nightGlow * (0.5 + Math.random() * 0.5); });

  // LED strips brighter at night
  ledStripMat.emissiveIntensity = isNight ? 1.8 : 0.4;

  // Tone mapping
  renderer.toneMappingExposure = isNight ? 1.8 : 1.0;

  // Update HUD
  timeVal.textContent = t < 25 ? 'Night' : t < 40 ? 'Dawn' : t < 75 ? 'Day' : t < 90 ? 'Dusk' : 'Night';
}

timeSlider.addEventListener('input', () => {
  setTimeOfDay(parseInt(timeSlider.value));
  autoNight = false;
  document.getElementById('btn-night').classList.remove('active');
});

// ─────────────────────────────────────────────────────────────────────────────
// Button handlers
// ─────────────────────────────────────────────────────────────────────────────
function setMode(mode) {
  camMode = mode;
  ['btn-orbit','btn-fly','btn-lobby','btn-roof','btn-exterior','btn-xray','btn-night']
    .forEach(id => document.getElementById(id)?.classList.remove('active'));
}

document.getElementById('btn-orbit').addEventListener('click', () => {
  setMode('orbit'); controls.enabled = true;
  document.getElementById('btn-orbit').classList.add('active');
  gsap(camera.position, { x: 180, y: 80, z: 180 }, 1.5);
  gsap(controls.target, { x: 0, y: BUILDING_H * 0.45, z: 0 }, 1.5);
});

document.getElementById('btn-fly').addEventListener('click', () => {
  setMode('fly'); flyT = 0; controls.enabled = false;
  document.getElementById('btn-fly').classList.add('active');
});

document.getElementById('btn-lobby').addEventListener('click', () => {
  setMode('orbit'); tweenCamera(camTargets.lobby);
  document.getElementById('btn-lobby').classList.add('active');
});

document.getElementById('btn-roof').addEventListener('click', () => {
  setMode('orbit'); tweenCamera(camTargets.roof);
  document.getElementById('btn-roof').classList.add('active');
});

document.getElementById('btn-exterior').addEventListener('click', () => {
  setMode('orbit'); tweenCamera(camTargets.exterior);
  document.getElementById('btn-exterior').classList.add('active');
});

document.getElementById('btn-xray').addEventListener('click', () => {
  const btn = document.getElementById('btn-xray');
  btn.classList.toggle('active');
  const isXray = btn.classList.contains('active');
  MAT.glass.opacity   = isXray ? 0.18 : 0.72;
  MAT.glassDark.opacity = isXray ? 0.18 : 0.78;
  towerGroup.traverse(o => {
    if (o.isMesh && o.material === MAT.coreWall) {
      o.material.color.setHex(isXray ? 0x8080ff : 0xa89888);
      o.material.wireframe = isXray;
    }
  });
  coreGroup.children.forEach(o => {
    if (o.isMesh) { o.material.wireframe = isXray; }
  });
});

document.getElementById('btn-night').addEventListener('click', () => {
  autoNight = !autoNight;
  document.getElementById('btn-night').classList.toggle('active', autoNight);
});

// ─────────────────────────────────────────────────────────────────────────────
// Resize
// ─────────────────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─────────────────────────────────────────────────────────────────────────────
// FPS counter
// ─────────────────────────────────────────────────────────────────────────────
let fps = 60, lastT = performance.now(), frames = 0;
const fpsEl = document.getElementById('fps-val');

// ─────────────────────────────────────────────────────────────────────────────
// Animate
// ─────────────────────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
let   autoT = 0;

setProgress(95, 'Rendering…');
setTimeout(() => {
  const loading = document.getElementById('loading');
  loading.style.opacity = '0';
  setTimeout(() => loading.style.display = 'none', 900);
}, 800);

setProgress(100, 'Done');

function animate() {
  requestAnimationFrame(animate);
  const dt  = clock.getDelta();
  const now = performance.now();

  // FPS
  frames++;
  if (now - lastT > 500) { fps = Math.round(frames * 1000 / (now - lastT)); frames = 0; lastT = now; }
  fpsEl.textContent = fps;

  // Auto-night cycle
  if (autoNight) {
    autoT += dt * 4;
    const t = (Math.sin(autoT * 0.3) * 0.5 + 0.5) * 100;
    timeSlider.value = t;
    setTimeOfDay(t);
  }

  // Fly-through
  if (camMode === 'fly') {
    flyT += dt * 0.08;
    const r   = 160 + Math.sin(flyT * 0.5) * 60;
    const h   = 30 + (Math.sin(flyT * 0.25) * 0.5 + 0.5) * (BUILDING_H + 30);
    camera.position.set(Math.cos(flyT) * r, h, Math.sin(flyT) * r);
    camera.lookAt(0, h * 0.55, 0);
  }

  // Beacon blink
  const blinkOn = Math.sin(now * 0.003) > 0.7;
  beaconLight.intensity  = blinkOn ? 8 : 0;
  beacon.material.emissiveIntensity = blinkOn ? 3 : 0.2;

  // Gentle water shimmer
  MAT.water.emissiveIntensity = 0.08 + Math.sin(now * 0.001) * 0.04;
  MAT.water.emissive = new THREE.Color(0x2288aa);

  // Wind-sway (subtle)
  towerGroup.rotation.z = Math.sin(now * 0.0004) * 0.0008;
  coreGroup.rotation.z  = towerGroup.rotation.z;

  // Raycast for hover tooltips
  raycaster.setFromCamera(mouse, camera);
  const allObjects = [];
  scene.traverse(o => { if (o.isMesh && o.userData.label) allObjects.push(o); });
  const hits = raycaster.intersectObjects(allObjects);
  if (hits.length > 0) {
    const h0 = hits[0].object;
    ttTitle.textContent = h0.userData.label || '';
    ttBody.textContent  = h0.userData.desc  || '';
    tooltip.style.display = 'block';

    // Floor indicator
    if (h0.userData.floorIndex !== undefined) {
      const fi = h0.userData.floorIndex;
      floorNum.textContent = fi + 1;
      ticks.forEach(t => {
        t.el.classList.toggle('active', t.f === fi + 1);
      });
    }
  } else {
    tooltip.style.display = 'none';
  }

  controls.update();
  renderer.render(scene, camera);
}

// Initialise time
setTimeOfDay(65);
animate();
