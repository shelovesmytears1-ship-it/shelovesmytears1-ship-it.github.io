/**
 * 3D project gallery — coverflow carousel.
 * Center card faces camera; adjacent cards fold outward with depth + opacity.
 * Drag or click side cards to navigate; click front card to open the case.
 * Lazy chunk; IO-gated; pauses off-screen / hidden tab; DPR capped.
 */
import * as THREE from 'three';

type Item = { cover: string; href: string; title: string };

export function initGallery3D(container: HTMLElement, caption: HTMLElement | null): void {
  let items: Item[] = [];
  try { items = JSON.parse(container.dataset.items || '[]'); } catch { /* noop */ }
  if (!items.length) return;

  const ink = getComputedStyle(container).getPropertyValue('--ink').trim() || '#14141a';

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.z = 9;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);
  container.classList.add('gl');

  // Lighting for subtle card depth
  scene.add(new THREE.AmbientLight(0xffffff, 0.62));
  const key = new THREE.DirectionalLight(0xffffff, 0.88);
  key.position.set(1.5, 2, 5);
  scene.add(key);

  const N  = items.length;
  const PW = 3.4, PH = 2.1;

  const loader = new THREE.TextureLoader();
  const cards:  THREE.Group[] = [];
  const planes: THREE.Mesh[]  = [];

  items.forEach((it, i) => {
    const tex = loader.load(it.cover);
    tex.colorSpace = THREE.SRGBColorSpace;

    const card  = new THREE.Group();
    const frame = new THREE.Mesh(
      new THREE.PlaneGeometry(PW + 0.1, PH + 0.1),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(ink), transparent: true })
    );
    frame.position.z = -0.002;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(PW, PH),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0.04, transparent: true })
    );
    plane.userData = { href: it.href, title: it.title, index: i };

    card.add(frame);
    card.add(plane);
    scene.add(card);
    cards.push(card);
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

  // Coverflow keyframes by absolute offset from center
  const KF = [
    { xAbs: 0.0, z:  0.0, rotYAbs: 0.00, scale: 1.00, opacity: 1.00 }, // 0 — front
    { xAbs: 2.7, z: -0.9, rotYAbs: 0.88, scale: 0.79, opacity: 0.58 }, // 1 — adjacent
    { xAbs: 4.6, z: -1.7, rotYAbs: 1.06, scale: 0.61, opacity: 0.26 }, // 2 — outer
    { xAbs: 6.2, z: -2.4, rotYAbs: 1.18, scale: 0.48, opacity: 0.00 }, // 3 — hidden
  ];

  const lp = (a: number, b: number, t: number) => a + (b - a) * t;

  function stateAt(offset: number) {
    const abs  = Math.abs(offset);
    const sgn  = offset < 0 ? -1 : 1;
    const fi   = Math.min(Math.floor(abs), KF.length - 2);
    const t    = abs - fi;
    const a = KF[fi], b = KF[fi + 1];
    return {
      x:       sgn * lp(a.xAbs,    b.xAbs,    t),
      z:              lp(a.z,       b.z,       t),
      rotY: -sgn  * lp(a.rotYAbs, b.rotYAbs, t),
      scale:          lp(a.scale,   b.scale,   t),
      opacity:        lp(a.opacity, b.opacity, t),
    };
  }

  let targetIdx  = 0;
  let displayIdx = 0;
  let dragging = false, lastX = 0, downX = 0, downY = 0;

  const cv = renderer.domElement;
  cv.style.touchAction = 'pan-y';

  cv.addEventListener('pointerdown', (e) => {
    dragging = true; lastX = downX = e.clientX; downY = e.clientY;
    container.style.cursor = 'grabbing';
    cv.setPointerCapture(e.pointerId);
  });
  addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    container.style.cursor = '';
    targetIdx = Math.max(0, Math.min(N - 1, Math.round(targetIdx)));
  });
  addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    targetIdx -= dx * 0.007;
    targetIdx  = Math.max(-0.3, Math.min(N - 0.7, targetIdx));
  });

  // Click: navigate if front card, snap if side card
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  cv.addEventListener('click', (e) => {
    if (Math.abs(e.clientX - downX) > 6 || Math.abs(e.clientY - downY) > 6) return;
    const r = container.getBoundingClientRect();
    ndc.x = ((e.clientX - r.left) / r.width)  * 2 - 1;
    ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(planes, false)[0];
    if (!hit) return;
    const idx   = (hit.object as any).userData.index as number;
    const front = Math.round(displayIdx);
    if (idx === front) { location.href = (hit.object as any).userData.href; }
    else               { targetIdx = idx; }
  });

  let onScreen = false, lastFront = -1, rafId = 0;

  new IntersectionObserver((es) => {
    onScreen = es[0].isIntersecting;
    if (onScreen) tick();
  }, { threshold: 0.05 }).observe(container);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && onScreen) tick(); });

  const render = () => {
    rafId = 0;
    displayIdx += (targetIdx - displayIdx) * 0.1;
    if (Math.abs(displayIdx - targetIdx) < 0.0005) displayIdx = targetIdx;

    for (let i = 0; i < N; i++) {
      const offset = i - displayIdx;
      if (Math.abs(offset) >= 3.5) { cards[i].visible = false; continue; }
      cards[i].visible = true;
      const s     = stateAt(offset);
      const order = Math.round(10 - Math.abs(offset) * 2);

      cards[i].position.set(s.x, 0, s.z);
      cards[i].rotation.y = s.rotY;
      cards[i].scale.setScalar(s.scale);
      cards[i].traverse((obj) => {
        obj.renderOrder = order;
        if (!(obj as THREE.Mesh).isMesh) return;
        const m = (obj as THREE.Mesh).material as THREE.Material & { opacity: number };
        m.opacity    = s.opacity;
        m.depthWrite = s.opacity > 0.99;
      });
    }

    const front = ((Math.round(displayIdx) % N) + N) % N;
    if (front !== lastFront && caption) { lastFront = front; caption.textContent = items[front].title; }

    renderer.render(scene, camera);
    if (onScreen && !document.hidden) tick();
  };

  const tick = () => { if (!rafId) rafId = requestAnimationFrame(render); };
}
