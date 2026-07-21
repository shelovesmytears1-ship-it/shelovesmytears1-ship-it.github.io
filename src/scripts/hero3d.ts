/**
 * Hero 3D — a single faceted "crystal" that drifts and reacts to the cursor.
 * Lazy-imported (separate chunk) and only when the hero is on screen.
 * Performance-guarded: DPR capped, paused off-screen and when the tab is hidden.
 * The accent rim light is read from the current theme's --accent, so the same
 * module themes itself correctly if reused by another direction.
 */
import * as THREE from 'three';

export function initHero3D(container: HTMLElement): void {
  const accent = getComputedStyle(container).getPropertyValue('--accent').trim() || '#2b34ff';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 4.3;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);
  container.classList.add('gl'); // hide CSS fallback orb

  // Faceted crystal
  const geo = new THREE.IcosahedronGeometry(1.4, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1b1b24'),
    metalness: 0.28,
    roughness: 0.42,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // subtle wireframe overlay for craft/precision feel
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({ color: new THREE.Color(accent), transparent: true, opacity: 0.16 })
  );
  mesh.add(wire);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const rim = new THREE.PointLight(new THREE.Color(accent), 2.4, 20);
  rim.position.set(3.5, -2, 2);
  scene.add(rim);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(container);

  // pointer influence
  let px = 0, py = 0, tx = 0, ty = 0;
  addEventListener('mousemove', (e) => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = (e.clientY / innerHeight) * 2 - 1;
  });

  // run only when visible + tab active
  let onScreen = true;
  new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; if (onScreen) tick(); }, { threshold: 0.01 }).observe(container);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && onScreen) tick(); });

  let raf = 0;
  const render = () => {
    px += (tx - px) * 0.05;
    py += (ty - py) * 0.05;
    mesh.rotation.y += 0.0032;
    mesh.rotation.x += 0.0012;
    mesh.position.x = px * 0.35;
    mesh.position.y = -py * 0.3;
    renderer.render(scene, camera);
    raf = 0;
    if (onScreen && !document.hidden) tick();
  };
  const tick = () => { if (!raf) raf = requestAnimationFrame(render); };
  tick();
}
