/**
 * 3D project gallery — coverflow with depth.
 *
 * Six things keep it from reading as a bare widget:
 *   1. every card carries a soft drop shadow, so it sits on the page
 *   2. fog + opacity falloff dissolve distant cards into the paper instead of
 *      merely shrinking them (aerial perspective)
 *   3. the project name renders behind the cards in the page's display type
 *      (DOM, not WebGL — stays crisp and uses the real webfont)
 *   4. a spring drives the index, so releases overshoot slightly and settle
 *   5. hovering a card lifts it toward the camera and lights an accent edge
 *   6. page scroll drives which project is at the front; drag nudges on top
 *
 * Lazy chunk; only inits when the section scrolls into view; paused off-screen
 * and when the tab is hidden. DPR capped.
 */
import * as THREE from 'three';

type Item = { cover: string; href: string; title: string; niche?: string };

/** Card pose by absolute offset from the front slot. */
const KF = [
  { xAbs: 0.0, z:  0.0, rotYAbs: 0.00, scale: 1.00, opacity: 1.00 },
  { xAbs: 2.7, z: -1.1, rotYAbs: 0.88, scale: 0.78, opacity: 0.50 },
  { xAbs: 4.5, z: -2.3, rotYAbs: 1.06, scale: 0.58, opacity: 0.16 },
  { xAbs: 6.0, z: -3.4, rotYAbs: 1.18, scale: 0.44, opacity: 0.00 },
];

const lp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function stateAt(offset: number) {
  const abs = Math.abs(offset);
  const sgn = offset < 0 ? -1 : 1;
  const fi = Math.min(Math.floor(abs), KF.length - 2);
  const t = abs - fi;
  const a = KF[fi], b = KF[fi + 1];
  return {
    x:       sgn * lp(a.xAbs, b.xAbs, t),
    z:             lp(a.z, b.z, t),
    rotY:  -sgn  * lp(a.rotYAbs, b.rotYAbs, t),
    scale:         lp(a.scale, b.scale, t),
    opacity:       lp(a.opacity, b.opacity, t),
  };
}

/** Soft radial blob used as a fake contact shadow behind every card. */
function shadowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(20,20,26,.5)');
  grd.addColorStop(0.45, 'rgba(20,20,26,.2)');
  grd.addColorStop(1, 'rgba(20,20,26,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export function initGallery3D(container: HTMLElement, caption: HTMLElement | null): void {
  let items: Item[] = [];
  try { items = JSON.parse(container.dataset.items || '[]'); } catch { /* noop */ }
  if (!items.length) return;

  const cs = getComputedStyle(container);
  const paper  = new THREE.Color(cs.getPropertyValue('--bg').trim() || '#f4f2ec');
  const ink    = new THREE.Color(cs.getPropertyValue('--ink').trim() || '#14141a');
  const accent = new THREE.Color(cs.getPropertyValue('--accent').trim() || '#2b34ff');
  const theme = document.documentElement.dataset.theme || 'studio';
  const editorial = theme === 'editorial';
  const dark = theme === 'dark';

  const titleEl = document.getElementById('gallery3d-title');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.z = 9;
  // aerial perspective — far cards wash out to the page colour
  scene.fog = new THREE.Fog(paper, 9.6, 15.5);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);
  container.classList.add('gl');

  scene.add(new THREE.AmbientLight(0xffffff, 0.66));
  const key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(1.5, 2, 5);
  scene.add(key);

  const N = items.length;
  const PW = 3.4, PH = 2.125; // 16:10, matching the covers
  const padX = editorial ? 0.20 : 0.13;
  const padBottom = editorial ? 0.20 : 0.13;
  const railH = editorial ? 0.19 : 0.16;
  const outerW = PW + padX * 2;
  const outerH = PH + padBottom * 2 + railH;
  const frameY = (railH - padBottom) * 0.5;
  const frameColor = dark
    ? new THREE.Color('#15171b')
    : editorial
      ? new THREE.Color('#e4dbca')
      : new THREE.Color('#faf9f5');
  const railColor = dark
    ? new THREE.Color('#202228')
    : editorial
      ? new THREE.Color('#d8cbb6')
      : new THREE.Color('#e8e9f2');
  const edgeColor = dark ? accent : editorial ? new THREE.Color('#8a4d35') : accent;

  const shadowTex = shadowTexture();
  const frameGeo = new THREE.PlaneGeometry(outerW, outerH);
  const viewportGeo = new THREE.PlaneGeometry(PW + 0.025, PH + 0.025);

  type Card = {
    group: THREE.Group;
    planeMat: THREE.MeshStandardMaterial;
    shadowMat: THREE.MeshBasicMaterial;
    frameLayers: Array<{ mat: THREE.Material & { opacity: number }; base: number }>;
    accentMat: THREE.LineBasicMaterial;
    lift: number;
    glow: number;
  };

  const loader = new THREE.TextureLoader();
  const cards: Card[] = [];
  const planes: THREE.Mesh[] = [];

  items.forEach((it, i) => {
    const tex = loader.load(it.cover);
    tex.colorSpace = THREE.SRGBColorSpace;

    const group = new THREE.Group();

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex, transparent: true, depthWrite: false, opacity: 0, fog: false,
    });
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(PW * 1.45, PH * 1.5), shadowMat);
    shadow.position.set(0, -0.3, -0.08);

    const frameLayers: Card['frameLayers'] = [];
    const register = <T extends THREE.Material & { opacity: number }>(mat: T, base: number) => {
      frameLayers.push({ mat, base });
      return mat;
    };

    const frameMat = register(new THREE.MeshBasicMaterial({
      color: frameColor, transparent: true,
    }), 1);
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, frameY, -0.012);

    const planeMat = new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.7, metalness: 0.04, transparent: true,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), planeMat);
    plane.position.z = 0.006;
    plane.userData = { href: it.href, index: i };

    const railMat = register(new THREE.MeshBasicMaterial({
      color: railColor, transparent: true, depthWrite: false,
    }), dark ? 0.98 : 0.92);
    const rail = new THREE.Mesh(new THREE.PlaneGeometry(PW, railH), railMat);
    rail.position.set(0, PH / 2 + railH / 2 + 0.025, 0.004);

    const viewportEdgeMat = register(new THREE.LineBasicMaterial({
      color: dark ? new THREE.Color('#41444c') : ink,
      transparent: true,
    }), dark ? 0.82 : editorial ? 0.48 : 0.24);
    const viewportEdge = new THREE.LineSegments(new THREE.EdgesGeometry(viewportGeo), viewportEdgeMat);
    viewportEdge.position.z = 0.012;

    const outerEdgeMat = register(new THREE.LineBasicMaterial({
      color: edgeColor, transparent: true,
    }), dark ? 0.58 : editorial ? 0.66 : 0.44);
    const outerEdge = new THREE.LineSegments(new THREE.EdgesGeometry(frameGeo), outerEdgeMat);
    outerEdge.position.set(0, frameY, 0.002);

    const dotGeo = editorial
      ? new THREE.PlaneGeometry(0.075, 0.018)
      : new THREE.CircleGeometry(0.024, 14);
    const dotStart = -PW / 2 + 0.11;
    const dotGap = editorial ? 0.12 : 0.075;
    const dots = new THREE.Group();
    for (let d = 0; d < 3; d++) {
      const dotMat = register(new THREE.MeshBasicMaterial({
        color: d === 0 ? edgeColor : ink,
        transparent: true,
        depthWrite: false,
      }), d === 0 ? 0.9 : dark ? 0.42 : 0.28);
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(dotStart + d * dotGap, PH / 2 + railH / 2 + 0.025, 0.012);
      dots.add(dot);
    }

    const accentMat = new THREE.LineBasicMaterial({
      color: accent, transparent: true, opacity: 0,
    });
    const accentEdge = new THREE.LineSegments(new THREE.EdgesGeometry(viewportGeo), accentMat);
    accentEdge.position.z = 0.018;

    group.add(shadow, frame, rail, plane, viewportEdge, outerEdge, dots, accentEdge);
    scene.add(group);
    cards.push({ group, planeMat, shadowMat, frameLayers, accentMat, lift: 0, glow: 0 });
    planes.push(plane);
  });

  const resize = () => {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(container);

  /* ---- state ---- */
  let pos = 0;          // rendered index (spring follows target)
  let vel = 0;
  let manual = 0;       // drag offset on top of the scroll-driven index
  let scrollDrive = 0;  // index the page scroll asks for
  let hoverIndex = -1;
  let dragging = false, lastX = 0, downX = 0, downY = 0, moved = false;

  const target = () => clamp(scrollDrive + manual, -0.35, N - 0.65);

  /* ---- scroll drives which project is at the front ---- */
  const readScroll = () => {
    const r = container.getBoundingClientRect();
    // 0 as the section arrives from below, 1 as it leaves past the top
    const prog = (innerHeight - r.top) / (innerHeight + r.height);
    scrollDrive = clamp(prog, 0, 1) * (N - 1);
  };
  readScroll();
  addEventListener('scroll', readScroll, { passive: true });
  addEventListener('resize', readScroll);

  /* ---- pointer ---- */
  const cv = renderer.domElement;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  const pick = (clientX: number, clientY: number): number => {
    const r = container.getBoundingClientRect();
    ndc.x = ((clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(planes, false)[0];
    return hit ? (hit.object.userData.index as number) : -1;
  };

  cv.style.touchAction = 'pan-y';
  cv.addEventListener('pointerdown', (e) => {
    dragging = true; moved = false;
    lastX = downX = e.clientX; downY = e.clientY;
    container.style.cursor = 'grabbing';
    cv.setPointerCapture(e.pointerId);
  });
  addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    container.style.cursor = '';
  });
  addEventListener('pointermove', (e) => {
    if (dragging) {
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      if (Math.abs(e.clientX - downX) > 3) moved = true;
      manual -= dx * 0.007;
    } else {
      hoverIndex = pick(e.clientX, e.clientY);
      container.style.cursor = hoverIndex >= 0 ? 'pointer' : '';
    }
  });
  cv.addEventListener('pointerleave', () => { hoverIndex = -1; });

  cv.addEventListener('click', (e) => {
    if (moved || Math.abs(e.clientX - downX) > 6 || Math.abs(e.clientY - downY) > 6) return;
    const idx = pick(e.clientX, e.clientY);
    if (idx < 0) return;
    const front = Math.round(pos);
    if (idx === front) location.href = items[idx].href;
    else manual = idx - scrollDrive;   // bring the clicked card to the front
  });

  /* ---- title / caption ---- */
  let front = -1;
  let swapTimer = 0;
  const setFront = (i: number) => {
    if (i === front) return;
    front = i;
    if (caption) caption.textContent = `${String(i + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}${items[i].niche ? ` · ${items[i].niche}` : ''}`;
    if (titleEl) {
      titleEl.classList.add('swap');
      clearTimeout(swapTimer);
      swapTimer = window.setTimeout(() => {
        titleEl.textContent = items[i].title;
        titleEl.classList.remove('swap');
      }, 200);
    }
  };

  /* ---- loop ---- */
  let onScreen = false, raf = 0;
  new IntersectionObserver((es) => {
    onScreen = es[0].isIntersecting;
    if (onScreen) tick();
  }, { threshold: 0.05 }).observe(container);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && onScreen) tick(); });

  const render = () => {
    raf = 0;

    // spring: reaches the target with a little overshoot, then settles
    vel += (target() - pos) * 0.085;
    vel *= 0.82;
    pos += vel;

    for (let i = 0; i < N; i++) {
      const c = cards[i];
      const offset = i - pos;
      const abs = Math.abs(offset);
      if (abs >= 3.4) { c.group.visible = false; continue; }
      c.group.visible = true;

      const s = stateAt(offset);
      const isHover = hoverIndex === i;
      c.lift += ((isHover ? 0.5 : 0) - c.lift) * 0.12;
      c.glow += ((isHover ? 1 : 0) - c.glow) * 0.14;

      c.group.position.set(s.x, c.lift * 0.1, s.z + c.lift);
      c.group.rotation.y = s.rotY;
      c.group.scale.setScalar(s.scale);
      c.group.renderOrder = Math.round(20 - abs * 4);

      const o = s.opacity;
      c.planeMat.opacity = o;
      c.planeMat.depthWrite = o > 0.99;
      for (const layer of c.frameLayers) {
        layer.mat.opacity = o * layer.base;
      }
      c.accentMat.opacity = o * (0.18 + c.glow * 0.82);
      // shadow tightens and darkens as the card lifts
      c.shadowMat.opacity = o * (0.5 + c.lift * 0.8);
    }

    setFront(((Math.round(pos) % N) + N) % N);

    renderer.render(scene, camera);
    if (onScreen && !document.hidden) tick();
  };

  const tick = () => { if (!raf) raf = requestAnimationFrame(render); };
}
