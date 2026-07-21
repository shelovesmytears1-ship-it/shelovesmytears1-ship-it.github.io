/**
 * 3D project gallery — a cylindrical carousel of project covers.
 * Auto-rotates, reacts to the cursor, is drag-spinnable, and a click on the
 * front-most cover opens that case. A DOM caption tracks the front item.
 * Lazy chunk; only inits when the section scrolls into view; paused off-screen
 * and when the tab is hidden. DPR capped.
 */
import * as THREE from 'three';

type Item = { cover: string; href: string; title: string };

export function initGallery3D(container: HTMLElement, caption: HTMLElement | null): void {
  let items: Item[] = [];
  try { items = JSON.parse(container.dataset.items || '[]'); } catch { /* noop */ }
  if (!items.length) return;

  const accent = getComputedStyle(container).getPropertyValue('--accent').trim() || '#2b34ff';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);
  container.classList.add('gl');

  const N = items.length;
  const PW = 2.4, PH = 1.5;                       // plane size (~16:10)
  const R = Math.max(3.2, (PW * N) / (2 * Math.PI) + 1.2);
  camera.position.set(0, 0, R + 3.4);

  const group = new THREE.Group();
  scene.add(group);

  const loader = new THREE.TextureLoader();
  const planes: THREE.Mesh[] = [];
  items.forEach((it, i) => {
    const theta = (i / N) * Math.PI * 2;
    const tex = loader.load(it.cover);
    tex.colorSpace = THREE.SRGBColorSpace;
    const card = new THREE.Group();
    // frame slightly larger, behind
    const frame = new THREE.Mesh(new THREE.PlaneGeometry(PW + 0.12, PH + 0.12), new THREE.MeshBasicMaterial({ color: new THREE.Color('#14141a') }));
    frame.position.z = -0.01;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), new THREE.MeshBasicMaterial({ map: tex }));
    (plane as any).userData = { href: it.href, title: it.title, index: i };
    card.add(frame); card.add(plane);
    card.position.set(Math.sin(theta) * R, 0, Math.cos(theta) * R);
    card.rotation.y = theta;                       // face outward
    group.add(card);
    planes.push(plane);
  });

  const resize = () => {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(container);

  // interaction: drag to spin + pointer tilt
  let rot = 0, vel = 0.0016, dragging = false, lastX = 0, tiltY = 0, tTiltY = 0;
  const canvas = renderer.domElement;
  canvas.style.touchAction = 'pan-y';
  canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); });
  addEventListener('pointerup', () => { dragging = false; });
  addEventListener('pointermove', (e) => {
    const r = container.getBoundingClientRect();
    tTiltY = ((e.clientY - (r.top + r.height / 2)) / r.height) * 0.5;
    if (dragging) { const dx = e.clientX - lastX; lastX = e.clientX; rot += dx * 0.006; vel = dx * 0.0006; }
  });

  // click front-most card
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let downX = 0, downY = 0;
  canvas.addEventListener('pointerdown', (e) => { downX = e.clientX; downY = e.clientY; });
  canvas.addEventListener('click', (e) => {
    if (Math.abs(e.clientX - downX) > 6 || Math.abs(e.clientY - downY) > 6) return; // was a drag
    const r = container.getBoundingClientRect();
    ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(planes, false)[0];
    if (hit) { const href = (hit.object as any).userData.href; if (href) location.href = href; }
  });

  let onScreen = false, frontIndex = -1;
  new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; if (onScreen) tick(); }, { threshold: 0.05 }).observe(container);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && onScreen) tick(); });

  let raf = 0;
  const render = () => {
    raf = 0;
    if (!dragging) { rot += vel; vel += (0.0016 - vel) * 0.02; }
    group.rotation.y = rot;
    tiltY += (tTiltY - tiltY) * 0.06;
    group.rotation.x = tiltY;

    // which card is at the front (closest to camera) → caption
    if (caption) {
      const step = (Math.PI * 2) / N;
      let idx = ((-Math.round(rot / step)) % N + N) % N;
      if (idx !== frontIndex) { frontIndex = idx; caption.textContent = items[idx].title; }
    }
    renderer.render(scene, camera);
    if (onScreen && !document.hidden) tick();
  };
  const tick = () => { if (!raf) raf = requestAnimationFrame(render); };
}
