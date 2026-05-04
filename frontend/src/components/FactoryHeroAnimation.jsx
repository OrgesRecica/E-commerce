import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TAU = Math.PI * 2;

function makeGlowTexture(color = '#ff7a1a') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.28, `${color}bb`);
  gradient.addColorStop(1, `${color}00`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function roundedRectShape(width, height, radius) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function makeRoundedBox(width, height, depth, radius, material) {
  const geometry = new THREE.ExtrudeGeometry(roundedRectShape(width, height, radius), {
    depth,
    bevelEnabled: true,
    bevelSize: Math.min(radius * 0.32, 0.08),
    bevelThickness: Math.min(radius * 0.32, 0.08),
    bevelSegments: 6,
  });
  geometry.center();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeBox(width, height, depth, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeCylinderBetween(a, b, radius, material, segments = 12) {
  const direction = new THREE.Vector3().subVectors(b, a);
  const length = direction.length();
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, segments), material);
  mesh.position.copy(a).addScaledVector(direction, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function placeBetween(mesh, a, b, y, width, height) {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const length = Math.hypot(dx, dz);
  mesh.scale.set(width, height, length);
  mesh.position.set((a.x + b.x) / 2, y, (a.z + b.z) / 2);
  mesh.rotation.y = Math.atan2(dx, dz);
}

function pointOnPath(points, t) {
  const total = points.length - 1;
  const scaled = (((t % 1) + 1) % 1) * total;
  const index = Math.min(total - 1, Math.floor(scaled));
  const local = scaled - index;
  return new THREE.Vector3().lerpVectors(points[index], points[index + 1], local);
}

function directionOnPath(points, t) {
  const a = pointOnPath(points, t);
  const b = pointOnPath(points, t + 0.01);
  return b.sub(a).normalize();
}

function makePanelTexture(text = 'SC', bg = '#db382f') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, 108, 108);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 42px Poppins, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createFactoryScene(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 3.6, -3.6, 0.1, 100);
  camera.position.set(5.8, 5.2, 6.4);
  camera.lookAt(0, 0.35, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  const root = new THREE.Group();
  root.rotation.y = 0.5;
  root.position.set(-0.08, -0.02, -0.08);
  root.scale.setScalar(0.94);
  scene.add(root);

  const mats = {
    blue: new THREE.MeshStandardMaterial({ color: 0x0f67d5, roughness: 0.34, metalness: 0.08 }),
    blueTop: new THREE.MeshStandardMaterial({ color: 0x2297ff, roughness: 0.3, metalness: 0.05 }),
    orange: new THREE.MeshStandardMaterial({ color: 0xff8519, roughness: 0.38, metalness: 0.04 }),
    yellow: new THREE.MeshStandardMaterial({ color: 0xffc22e, roughness: 0.32, metalness: 0.08 }),
    belt: new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.52, metalness: 0.16 }),
    beltLine: new THREE.MeshStandardMaterial({ color: 0x30343b, roughness: 0.5, metalness: 0.12 }),
    red: new THREE.MeshStandardMaterial({ color: 0xdb382f, roughness: 0.42, metalness: 0.04 }),
    cyan: new THREE.MeshStandardMaterial({ color: 0x28d8ff, roughness: 0.24, metalness: 0.06, emissive: 0x064d66 }),
    brown: new THREE.MeshStandardMaterial({ color: 0xb66a34, roughness: 0.48, metalness: 0.04 }),
    black: new THREE.MeshStandardMaterial({ color: 0x0e1014, roughness: 0.5, metalness: 0.22 }),
    rail: new THREE.MeshStandardMaterial({ color: 0xdceeff, roughness: 0.26, metalness: 0.16 }),
    darkRail: new THREE.MeshStandardMaterial({ color: 0x0b1422, roughness: 0.44, metalness: 0.24 }),
    white: new THREE.MeshStandardMaterial({ color: 0xeef8ff, roughness: 0.2, emissive: 0x2f95c2, emissiveIntensity: 0.55 }),
    glowOrange: new THREE.MeshBasicMaterial({ color: 0xffaa20 }),
  };

  scene.add(new THREE.AmbientLight(0xffffff, 1.05));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(4.5, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.1;
  key.shadow.camera.far = 20;
  key.shadow.camera.left = -7;
  key.shadow.camera.right = 7;
  key.shadow.camera.top = 7;
  key.shadow.camera.bottom = -7;
  scene.add(key);

  const cyanLight = new THREE.PointLight(0x00d9ff, 5.4, 5.5);
  cyanLight.position.set(-2.95, 0.96, 0.34);
  root.add(cyanLight);
  const orangeLight = new THREE.PointLight(0xff6f00, 6.2, 5.2);
  orangeLight.position.set(-0.35, 1.18, -0.4);
  root.add(orangeLight);
  const rightLight = new THREE.PointLight(0x00caff, 4.2, 4.6);
  rightLight.position.set(2.08, 0.98, 0.36);
  root.add(rightLight);

  const glowOrange = makeGlowTexture('#ff7a1a');
  const glowCyan = makeGlowTexture('#00d9ff');
  const glows = [];
  const addGlow = (x, y, z, size, texture, opacity = 0.55) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    sprite.position.set(x, y, z);
    sprite.scale.set(size, size, 1);
    root.add(sprite);
    glows.push({ sprite, size });
    return sprite;
  };

  const leftMachine = makeRoundedBox(1.65, 1.15, 1.35, 0.16, mats.blue);
  leftMachine.position.set(-3.04, 0.58, 0.34);
  leftMachine.rotation.y = Math.PI / 2;
  root.add(leftMachine);

  const mainMachine = makeRoundedBox(1.42, 1.82, 1.38, 0.16, mats.blue);
  mainMachine.position.set(-0.35, 0.96, -0.4);
  mainMachine.rotation.y = Math.PI / 2;
  root.add(mainMachine);

  const rightMachine = makeRoundedBox(1.62, 1.25, 1.35, 0.16, mats.blue);
  rightMachine.position.set(2.18, 0.6, 0.36);
  rightMachine.rotation.y = Math.PI / 2;
  root.add(rightMachine);

  const sideControl = makeRoundedBox(0.62, 0.68, 0.54, 0.09, new THREE.MeshStandardMaterial({ color: 0x496fa9, roughness: 0.42 }));
  sideControl.position.set(-1.68, 0.46, -1.0);
  sideControl.rotation.y = Math.PI / 2;
  root.add(sideControl);

  const tray = makeRoundedBox(0.68, 0.08, 0.46, 0.04, new THREE.MeshStandardMaterial({ color: 0xeaf7ff, roughness: 0.28, metalness: 0.04 }));
  tray.position.set(-2.55, 0.16, -0.98);
  tray.rotation.y = Math.PI / 2;
  root.add(tray);
  const trayRim = makeRoundedBox(0.76, 0.08, 0.54, 0.04, mats.cyan);
  trayRim.position.set(-2.55, 0.105, -0.98);
  trayRim.rotation.y = Math.PI / 2;
  root.add(trayRim);

  const smallButton = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 32), mats.glowOrange);
  smallButton.position.set(-1.68, 0.86, -1.0);
  smallButton.castShadow = true;
  root.add(smallButton);
  addGlow(-1.68, 0.9, -1.0, 0.48, glowOrange, 0.34);

  const warningMat = new THREE.MeshBasicMaterial({ color: 0xffdf35, side: THREE.DoubleSide });
  const triangle = new THREE.Mesh(new THREE.CircleGeometry(0.13, 3), warningMat);
  triangle.position.set(0.36, 0.9, -1.28);
  triangle.rotation.set(-0.2, Math.PI / 2, Math.PI / 6);
  root.add(triangle);

  const panel = makeRoundedBox(0.48, 0.42, 0.08, 0.04, mats.yellow);
  panel.position.set(0.28, 0.42, -1.31);
  panel.rotation.y = Math.PI / 2;
  root.add(panel);
  root.add(makeCylinderBetween(new THREE.Vector3(0.2, 0.48, -1.38), new THREE.Vector3(0.2, 0.28, -1.54), 0.025, mats.darkRail, 8));
  root.add(makeCylinderBetween(new THREE.Vector3(0.4, 0.48, -1.38), new THREE.Vector3(0.4, 0.28, -1.54), 0.025, mats.darkRail, 8));

  const pipeMat = new THREE.MeshStandardMaterial({ color: 0xff9a1f, roughness: 0.42, metalness: 0.08 });
  root.add(makeCylinderBetween(new THREE.Vector3(-1.0, 0.3, -1.13), new THREE.Vector3(-1.58, 0.3, -1.18), 0.055, pipeMat, 16));
  root.add(makeCylinderBetween(new THREE.Vector3(-1.08, 0.28, -1.02), new THREE.Vector3(-1.54, 0.28, -0.84), 0.045, pipeMat, 16));

  for (let i = 0; i < 4; i += 1) {
    const vent = makeBox(0.12, 0.035, 0.48, mats.blueTop);
    vent.position.set(-0.74 + i * 0.18, 1.94, -0.62);
    vent.rotation.y = -0.22;
    root.add(vent);
  }

  const sideBoxes = [
    [-3.66, -0.08, -0.12],
    [-3.66, -0.08, 0.24],
    [1.78, -0.1, -0.26],
    [2.82, -0.1, -0.26],
  ];
  sideBoxes.forEach(([x, y, z], index) => {
    const foot = makeRoundedBox(0.22, 0.34, 0.2, 0.05, mats.blue);
    foot.position.set(x, 0.12, z);
    foot.rotation.y = index < 2 ? 0 : Math.PI / 2;
    root.add(foot);
  });

  const makeDoor = (x, y, z, color, scale = 1) => {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.42 * scale, 0.105 * scale, 18, 48, Math.PI), mats.orange);
    arch.position.set(x, y, z);
    arch.rotation.set(0, Math.PI / 2, Math.PI);
    arch.castShadow = true;
    root.add(arch);

    const door = new THREE.Mesh(new THREE.CircleGeometry(0.36 * scale, 48, 0, Math.PI), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    door.position.set(x - 0.012, y - 0.02, z);
    door.rotation.set(0, Math.PI / 2, Math.PI);
    root.add(door);
    addGlow(x - 0.08, y, z, 1.35 * scale, color === 0xff8b1a ? glowOrange : glowCyan, 0.48);
  };

  makeDoor(-3.06, 0.38, 0.34, 0x00e5ff, 0.86);
  makeDoor(-0.97, 0.62, -0.4, 0xff8b1a, 1.12);
  makeDoor(2.18, 0.4, 0.36, 0x00d9ff, 0.88);

  const makeConveyorPortal = (x, y, z, rotationY, width = 0.78, height = 0.58, texture = glowCyan) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotationY;

    const recess = makeRoundedBox(width, height, 0.08, 0.055, mats.black);
    recess.position.z = -0.025;
    group.add(recess);

    const backGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 0.72, height * 0.58),
      new THREE.MeshBasicMaterial({
        color: texture === glowOrange ? 0xff8b1a : 0x00d9ff,
        transparent: true,
        opacity: 0.24,
        side: THREE.DoubleSide,
      })
    );
    backGlow.position.z = 0.026;
    group.add(backGlow);

    const topRail = makeRoundedBox(width + 0.18, 0.11, 0.16, 0.035, mats.orange);
    topRail.position.y = height / 2 + 0.04;
    group.add(topRail);

    [-1, 1].forEach((side) => {
      const rail = makeRoundedBox(0.11, height + 0.1, 0.16, 0.035, mats.orange);
      rail.position.x = side * (width / 2 + 0.04);
      group.add(rail);
    });

    for (let i = 0; i < 5; i += 1) {
      const strip = makeBox(0.075, 0.26, 0.035, mats.darkRail);
      strip.position.set(-width * 0.32 + i * width * 0.16, height * 0.12, 0.055);
      group.add(strip);
    }

    const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, width * 0.82, 18), mats.rail);
    roller.rotation.z = Math.PI / 2;
    roller.position.set(0, -height * 0.28, 0.075);
    roller.castShadow = true;
    group.add(roller);

    root.add(group);
    addGlow(x, y + 0.06, z, width * 0.95, texture, 0.24);
  };

  makeConveyorPortal(-2.55, 0.45, 0.36, Math.PI / 2, 0.72, 0.52, glowCyan);
  makeConveyorPortal(-0.72, 0.5, -0.96, 0, 0.82, 0.56, glowOrange);
  makeConveyorPortal(0.28, 0.48, 0.34, 0, 0.82, 0.54, glowOrange);
  makeConveyorPortal(1.76, 0.44, 0.58, Math.PI / 2, 0.72, 0.52, glowCyan);

  const fans = [];
  const makeFan = (x, z, y = 1.32) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.08, 48), mats.cyan);
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = true;
    group.add(ring);
    for (let i = 0; i < 5; i += 1) {
      const blade = makeBox(0.08, 0.018, 0.28, mats.black);
      blade.position.z = 0.12;
      blade.rotation.y = (TAU / 5) * i;
      group.add(blade);
    }
    addGlow(x, y + 0.06, z, 0.86, glowCyan, 0.34);
    root.add(group);
    fans.push(group);
  };
  makeFan(-3.04, 0.34, 1.2);
  makeFan(2.18, 0.36, 1.22);

  const beacons = [];
  const makeBeacon = (x, z, delay = 0) => {
    const group = new THREE.Group();
    group.position.set(x, 1.98, z);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.12, 40), mats.yellow);
    base.castShadow = true;
    group.add(base);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 16), mats.glowOrange);
    cap.position.y = 0.11;
    group.add(cap);
    const light = new THREE.PointLight(0xffa000, 1.8, 1.4);
    light.position.y = 0.16;
    group.add(light);
    root.add(group);
    beacons.push({ group, light, cap, delay });
  };
  makeBeacon(-0.66, -0.04, 0);
  makeBeacon(-0.06, -0.04, 0.6);

  const beltCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.42, 0.18, 0.34),
    new THREE.Vector3(-2.62, 0.18, 0.36),
    new THREE.Vector3(-1.9, 0.2, -0.04),
    new THREE.Vector3(-1.62, 0.22, -0.88),
    new THREE.Vector3(-0.76, 0.24, -0.92),
    new THREE.Vector3(-0.22, 0.24, -0.4),
    new THREE.Vector3(0.36, 0.22, 0.34),
    new THREE.Vector3(1.2, 0.2, 0.62),
    new THREE.Vector3(1.82, 0.18, 0.58),
    new THREE.Vector3(2.38, 0.18, 0.08),
  ], false, 'centripetal', 0.45);
  const path = beltCurve.getPoints(32);

  const makeBeltSegment = (a, b) => {
    const base = makeBox(1, 1, 1, mats.orange);
    placeBetween(base, a, b, 0.13, 0.62, 0.2);
    root.add(base);

    const top = makeBox(1, 1, 1, mats.belt);
    placeBetween(top, a, b, 0.27, 0.46, 0.05);
    root.add(top);

    const stripes = [];
    const steps = Math.max(3, Math.floor(a.distanceTo(b) / 0.23));
    for (let i = 0; i < steps; i += 1) {
      const stripe = makeBox(0.03, 0.035, 0.18, mats.beltLine);
      const t = (i + 0.5) / steps;
      stripe.position.lerpVectors(a, b, t);
      stripe.position.y = 0.32;
      stripe.rotation.y = Math.atan2(b.x - a.x, b.z - a.z) + Math.PI / 2;
      root.add(stripe);
      stripes.push(stripe);

      if (i % 2 === 0) {
        const hazard = makeBox(0.045, 0.04, 0.22, mats.black);
        hazard.position.lerpVectors(a, b, t);
        hazard.position.y = 0.23;
        hazard.rotation.y = Math.atan2(b.x - a.x, b.z - a.z) + Math.PI / 2;
        hazard.position.x += Math.cos(hazard.rotation.y) * 0.24;
        hazard.position.z -= Math.sin(hazard.rotation.y) * 0.24;
        root.add(hazard);
      }
    }
    return stripes;
  };
  const movingStripes = [];
  for (let i = 0; i < path.length - 1; i += 1) {
    movingStripes.push(...makeBeltSegment(path[i], path[i + 1]));
  }

  const railPosts = [];
  for (let i = 2; i < path.length - 3; i += 3) {
    const p = path[i];
    const dir = directionOnPath(path, i / (path.length - 1));
    const normal = new THREE.Vector3(-dir.z, 0, dir.x).normalize();
    [-1, 1].forEach((side) => {
      const base = p.clone().addScaledVector(normal, side * 0.34);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.42, 10), mats.rail);
      post.position.set(base.x, 0.46, base.z);
      post.castShadow = true;
      root.add(post);
      railPosts.push({ post, base, top: new THREE.Vector3(base.x, 0.7, base.z), side });
    });
  }
  for (let i = 0; i < railPosts.length - 2; i += 2) {
    const a = railPosts[i].top;
    const b = railPosts[i + 2]?.top;
    if (b) root.add(makeCylinderBetween(a, b, 0.014, mats.rail, 8));
    const c = railPosts[i + 1].top;
    const d = railPosts[i + 3]?.top;
    if (d) root.add(makeCylinderBetween(c, d, 0.014, mats.rail, 8));
  }

  const packages = [];
  const makePackage = (color, offset) => {
    const texture = makePanelTexture(color === 'blue' ? 'K' : 'SC', color === 'blue' ? '#2f88dd' : '#db382f');
    const mat = color === 'blue'
      ? new THREE.MeshStandardMaterial({ color: 0x2f88dd, roughness: 0.36, emissive: 0x041b35, emissiveIntensity: 0.25 })
      : mats.red;
    const mesh = makeRoundedBox(0.28, 0.28, 0.28, 0.035, mat);
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.18, 0.18),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    );
    label.position.y = 0.148;
    label.rotation.x = -Math.PI / 2;
    mesh.add(label);
    root.add(mesh);
    packages.push({ mesh, offset, wobble: Math.random() * TAU });
  };
  makePackage('red', 0);
  makePackage('blue', 0.24);
  makePackage('red', 0.48);
  makePackage('blue', 0.72);

  const makeRobot = (x, z, delay) => {
    const group = new THREE.Group();
    group.position.set(x, 0.08, z);
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.48, 8, 18), mats.brown);
    body.position.y = 0.43;
    body.castShadow = true;
    group.add(body);
    const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 8), mats.white);
    eyeLeft.position.set(-0.08, 0.6, 0.17);
    const eyeRight = eyeLeft.clone();
    eyeRight.position.x = 0.08;
    group.add(eyeLeft, eyeRight);
    root.add(group);
    return { group, eyeLeft, eyeRight, delay };
  };
  const robots = [
    makeRobot(-1.85, 0.95, 0),
    makeRobot(2.58, -0.78, 1.2),
  ];

  root.add(makeCylinderBetween(new THREE.Vector3(2.78, 0.52, -0.8), new THREE.Vector3(3.08, 0.46, -0.54), 0.018, mats.rail, 8));
  root.add(makeCylinderBetween(new THREE.Vector3(3.08, 0.46, -0.54), new THREE.Vector3(3.12, 0.38, -0.3), 0.018, mats.rail, 8));

  const lowerBelt = makeBox(1.5, 0.24, 0.48, mats.black);
  lowerBelt.position.set(-0.9, 0.12, 2.0);
  lowerBelt.rotation.y = -0.22;
  root.add(lowerBelt);
  for (let i = 0; i < 4; i += 1) {
    const part = makeBox(0.22, 0.08, 0.16, mats.red);
    part.position.set(-1.45 + i * 0.25, 0.32, 1.96 - i * 0.02);
    part.rotation.y = 0.2;
    root.add(part);
  }

  const topBelt = makeBox(1.65, 0.22, 0.48, mats.black);
  topBelt.position.set(1.05, 0.13, -2.05);
  topBelt.rotation.y = 0.08;
  root.add(topBelt);
  for (let i = 0; i < 5; i += 1) {
    const part = makeBox(0.2, 0.09, 0.15, mats.cyan);
    part.position.set(0.55 + i * 0.18, 0.31, -2.06 + i * 0.04);
    part.rotation.y = -0.28;
    root.add(part);
  }

  const beams = [];
  const beamMat = new THREE.MeshStandardMaterial({ color: 0xffa71d, roughness: 0.38, metalness: 0.05 });
  const makeBeam = (x, z, rot, len) => {
    const beam = makeBox(len, 0.22, 0.28, beamMat);
    beam.position.set(x, 0.08, z);
    beam.rotation.y = rot;
    root.add(beam);
    beams.push(beam);
  };
  makeBeam(-2.9, -2.1, -0.78, 2.55);
  makeBeam(2.55, 1.86, -0.78, 2.85);
  makeBeam(3.2, 0.78, -0.78, 2.3);

  const resize = () => {
    const rect = container.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, true);
    const aspect = width / height;
    const frustum = width < 520 ? 9.4 : 5.2;
    camera.left = (-frustum * aspect) / 2;
    camera.right = (frustum * aspect) / 2;
    camera.top = frustum / 2;
    camera.bottom = -frustum / 2;
    camera.updateProjectionMatrix();
  };

  const clock = new THREE.Clock();
  let frame;
  const animate = () => {
    const elapsed = clock.getElapsedTime();
    root.rotation.y = 0.5 + Math.sin(elapsed * 0.35) * 0.022;

    fans.forEach((fan, index) => {
      fan.rotation.y += (index ? -1 : 1) * 0.13;
    });

    beacons.forEach(({ group, light, cap, delay }) => {
      const pulse = 0.68 + Math.sin(elapsed * 4.8 + delay) * 0.32;
      group.scale.setScalar(1 + pulse * 0.08);
      light.intensity = 1.25 + pulse * 2.2;
      cap.scale.setScalar(0.92 + pulse * 0.18);
    });

    packages.forEach(({ mesh, offset, wobble }) => {
      const t = (elapsed * 0.095 + offset) % 1;
      const p = pointOnPath(path, t);
      const dir = directionOnPath(path, t);
      mesh.position.copy(p);
      mesh.position.y += 0.18 + Math.sin(elapsed * 4 + wobble) * 0.025;
      mesh.rotation.y = Math.atan2(dir.x, dir.z);
      mesh.rotation.x = Math.sin(elapsed * 2.8 + wobble) * 0.05;
      mesh.rotation.z = Math.cos(elapsed * 2.4 + wobble) * 0.08;
    });

    movingStripes.forEach((stripe, i) => {
      stripe.material = i % 2 ? mats.beltLine : mats.belt;
    });

    robots.forEach(({ group, eyeLeft, eyeRight, delay }) => {
      group.position.y = Math.sin(elapsed * 1.6 + delay) * 0.035;
      const blink = Math.sin(elapsed * 4.2 + delay) < -0.92 ? 0.25 : 1;
      eyeLeft.scale.y = blink;
      eyeRight.scale.y = blink;
    });

    glows.forEach(({ sprite, size }, index) => {
      const pulse = 1 + Math.sin(elapsed * 2.4 + index) * 0.08;
      sprite.scale.set(size * pulse, size * pulse, 1);
    });

    renderer.render(scene, camera);
    frame = requestAnimationFrame(animate);
  };

  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  frame = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    renderer.dispose();
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          if (material.map) material.map.dispose();
          material.dispose();
        });
      }
    });
    glowOrange.dispose();
    glowCyan.dispose();
    container.removeChild(renderer.domElement);
  };
}

export default function FactoryHeroAnimation({ className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    return createFactoryScene(ref.current);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative h-[28rem] overflow-visible md:h-[35rem] lg:-ml-20 lg:-mr-10 lg:translate-x-3 ${className}`}
      aria-label="Animated 3D factory production line"
    />
  );
}
