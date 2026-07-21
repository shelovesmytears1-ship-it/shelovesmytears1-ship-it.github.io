/**
 * Hero 3D — full-bleed hero canvas in a single WebGL context:
 *   1) a very subtle animated shader backdrop (paper with a faint drifting
 *      accent glow toward the top-right), and
 *   2) a faceted "crystal" (icosahedron + wireframe) on the right that reacts
 *      to the cursor.
 * One renderer keeps the cost down. Text sits above via CSS z-index; the
 * backdrop stays low-contrast so copy remains readable.
 * Guards: DPR capped, paused off-screen and when the tab is hidden; the CSS
 * fallback glow covers mobile / reduced-motion (this module isn't loaded there).
 */
import * as THREE from 'three';

export function initHero3D(container: HTMLElement): void {
  const cs = getComputedStyle(container);
  const accentHex = cs.getPropertyValue('--accent').trim() || '#2b34ff';
  const paperHex = cs.getPropertyValue('--bg').trim() || '#f4f2ec';
  const accent = new THREE.Color(accentHex);
  const paper = new THREE.Color(paperHex);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 4.3;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);
  container.classList.add('gl');

  /* ---- subtle shader backdrop ---- */
  const bgMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uAccent: { value: new THREE.Vector3(accent.r, accent.g, accent.b) },
      uPaper: { value: new THREE.Vector3(paper.r, paper.g, paper.b) },
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`,
    fragmentShader: `
      varying vec2 vUv; uniform float uTime; uniform vec3 uAccent; uniform vec3 uPaper;
      void main(){
        vec2 uv = vUv;
        float w  = sin(uv.x*3.0 + uTime*0.15)*0.5+0.5;
        float w2 = sin((uv.y+uv.x)*2.2 - uTime*0.11)*0.5+0.5;
        float flow = mix(w, w2, 0.5);
        vec2 c = vec2(0.71 + 0.05*sin(uTime*0.1), 0.70);
        float blob = smoothstep(0.95, 0.15, distance(uv, c));
        vec3 tint = mix(uPaper, uAccent, 0.14);
        vec3 col = mix(uPaper, tint, blob * (0.55 + 0.45*flow));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  // fullscreen triangle-ish quad in clip space (vertex shader ignores camera)
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
  bg.frustumCulled = false;
  scene.add(bg);

  /* ---- crystal ---- */
  const crystal = new THREE.Group();
  const geo = new THREE.IcosahedronGeometry(1.25, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1b1b24'), metalness: 0.28, roughness: 0.42, flatShading: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  crystal.add(mesh);
  crystal.add(new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.18 })
  ));
  crystal.position.x = 1.7;
  scene.add(crystal);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.15); key.position.set(-3, 4, 5); scene.add(key);
  const rim = new THREE.PointLight(accent, 2.4, 20); rim.position.set(3.5, -2, 2); scene.add(rim);

  const CRYSTAL_R = 1.32; // icosahedron radius incl. wireframe

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    // Keep the crystal fully on screen: clamp against the visible half-width at
    // its own depth, so it can never bleed past the right edge on wide canvases.
    const halfW = Math.tan((camera.fov / 2) * (Math.PI / 180)) * camera.position.z * camera.aspect;
    const maxX = halfW - CRYSTAL_R - 0.42;
    crystal.position.x = Math.max(0.55, Math.min(1.1 + camera.aspect * 0.3, maxX));
  };
  resize();
  new ResizeObserver(resize).observe(container);

  let px = 0, py = 0, tx = 0, ty = 0;
  addEventListener('mousemove', (e) => { tx = (e.clientX / innerWidth) * 2 - 1; ty = (e.clientY / innerHeight) * 2 - 1; });

  let onScreen = true;
  new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; if (onScreen) tick(); }, { threshold: 0.01 }).observe(container);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && onScreen) tick(); });

  const clock = new THREE.Clock();
  let raf = 0;
  const render = () => {
    raf = 0;
    px += (tx - px) * 0.05; py += (ty - py) * 0.05;
    bgMat.uniforms.uTime.value = clock.getElapsedTime();
    crystal.rotation.y += 0.0032; crystal.rotation.x += 0.0012;
    crystal.position.y = -py * 0.3;
    mesh.rotation.z = px * 0.15;
    renderer.render(scene, camera);
    if (onScreen && !document.hidden) tick();
  };
  const tick = () => { if (!raf) raf = requestAnimationFrame(render); };
  tick();
}
