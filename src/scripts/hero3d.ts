/**
 * Hero 3D — full-bleed hero canvas in a single WebGL context:
 *   1) a very subtle animated shader backdrop (paper with a faint drifting
 *      accent glow toward the top-right), and
 *   2) a theme-specific object on the right that reacts to the cursor:
 *      Studio gets the faceted object, Editorial gets contour arcs and
 *      Refined Dark gets a denser knot/particle composition.
 * One renderer keeps the cost down. Text sits above via CSS z-index; the
 * backdrop stays low-contrast so copy remains readable.
 * Guards: DPR capped, paused off-screen and when the tab is hidden; the CSS
 * fallback glow covers mobile / reduced-motion (this module isn't loaded there).
 */
import * as THREE from 'three';

export function initHero3D(container: HTMLElement): void {
  // Astro's development HMR can re-run the module without replacing the
  // existing DOM node. Never stack two render loops/canvases in that case.
  if (container.querySelector('canvas')) return;

  const variant = document.documentElement.dataset.theme || 'studio';
  const isEditorial = variant === 'editorial';
  const isDark = variant === 'dark';
  const cs = getComputedStyle(container);
  const accentHex = cs.getPropertyValue('--accent').trim() || '#2b34ff';
  const paperHex = cs.getPropertyValue('--bg').trim() || '#f4f2ec';
  const accent = new THREE.Color(accentHex);
  const paper = new THREE.Color(paperHex);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 4.5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
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
      uStrength: { value: isDark ? 0.15 : isEditorial ? 0.11 : 0.14 },
      uDark: { value: isDark ? 1 : 0 },
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`,
    fragmentShader: `
      varying vec2 vUv; uniform float uTime; uniform vec3 uAccent; uniform vec3 uPaper;
      uniform float uStrength; uniform float uDark;
      void main(){
        vec2 uv = vUv;
        float w  = sin(uv.x*(3.0 + uDark*5.0) + uTime*(0.15 + uDark*0.09))*0.5+0.5;
        float w2 = sin((uv.y+uv.x)*(2.2 + uDark*3.0) - uTime*0.11)*0.5+0.5;
        float w3 = sin(length(uv-vec2(.72,.5))*12.0-uTime*.22)*.5+.5;
        float flow = mix(w, w2, 0.5);
        vec2 c = vec2(0.71 + 0.05*sin(uTime*0.1), 0.70);
        float blob = smoothstep(0.95, 0.15, distance(uv, c));
        vec3 tint = mix(uPaper, uAccent, uStrength);
        float energy = blob * (0.48 + 0.36*flow + uDark*.16*w3);
        vec3 col = mix(uPaper, tint, energy);
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  // fullscreen triangle-ish quad in clip space (vertex shader ignores camera)
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
  bg.frustumCulled = false;
  scene.add(bg);

  /* ---- theme-specific hero object ---- */
  const heroObject = new THREE.Group();
  let solidMesh: THREE.Object3D | null = null;
  let objectRadius = 1.32;

  if (isEditorial) {
    objectRadius = 1.5;
    const lineMaterial = new THREE.LineBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.34,
    });
    [
      { radius: 1.32, tube: 0.012, rx: 0.5, ry: 0.18 },
      { radius: 1.05, tube: 0.01, rx: 1.05, ry: -0.42 },
      { radius: 0.74, tube: 0.009, rx: -0.36, ry: 0.78 },
    ].forEach((ring) => {
      const geometry = new THREE.TorusGeometry(ring.radius, ring.tube, 5, 160);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), lineMaterial);
      edges.rotation.set(ring.rx, ring.ry, 0);
      heroObject.add(edges);
    });
    const points = [
      new THREE.Vector3(-1.4, -0.65, 0),
      new THREE.Vector3(-0.55, 0.8, 0.15),
      new THREE.Vector3(0.45, -0.2, 0.35),
      new THREE.Vector3(1.35, 0.7, 0),
    ];
    const curve = new THREE.CatmullRomCurve3(points);
    const contour = new THREE.BufferGeometry().setFromPoints(curve.getPoints(120));
    heroObject.add(new THREE.Line(contour, lineMaterial));
  } else if (isDark) {
    objectRadius = 1.45;
    const knotGeometry = new THREE.TorusKnotGeometry(0.92, 0.3, 128, 20, 2, 3);
    const knotMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#242831'),
      emissive: accent,
      emissiveIntensity: 0.055,
      metalness: 0.52,
      roughness: 0.4,
      clearcoat: 0.58,
      clearcoatRoughness: 0.3,
      side: THREE.DoubleSide,
    });
    solidMesh = new THREE.Mesh(knotGeometry, knotMaterial);
    heroObject.add(solidMesh);
    heroObject.add(new THREE.LineSegments(
      new THREE.WireframeGeometry(knotGeometry),
      new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.22 }),
    ));

    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(96 * 3);
    for (let i = 0; i < 96; i += 1) {
      const radius = 1.45 + ((i * 37) % 19) / 32;
      const angle = i * 2.39996;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.68;
      positions[i * 3 + 2] = ((i % 13) - 6) * 0.08;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    heroObject.add(new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: accent, size: 0.032, transparent: true, opacity: 0.72 }),
    ));
  } else {
    const geometry = new THREE.IcosahedronGeometry(1.25, 1);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1b1b24'),
      metalness: 0.28,
      roughness: 0.42,
      flatShading: true,
    });
    solidMesh = new THREE.Mesh(geometry, material);
    heroObject.add(solidMesh);
    heroObject.add(new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.18 }),
    ));
  }
  scene.add(heroObject);

  scene.add(new THREE.AmbientLight(0xffffff, isDark ? 0.34 : 0.55));
  const key = new THREE.DirectionalLight(0xffffff, isDark ? 1.5 : 1.15); key.position.set(-3, 4, 5); scene.add(key);
  const rim = new THREE.PointLight(accent, isDark ? 4.2 : 2.4, 20); rim.position.set(3.5, -2, 2); scene.add(rim);

  // Measure the complete composition, including the outer dark-theme
  // particles. The previous hand-written radius ignored them, which let the
  // object move outside the camera at some angles.
  const bounds = new THREE.Box3().setFromObject(heroObject);
  const sphere = new THREE.Sphere();
  bounds.getBoundingSphere(sphere);
  objectRadius = Math.max(objectRadius, sphere.radius);

  const baseRotation = {
    x: isEditorial ? 0.34 : isDark ? 0.42 : 0.28,
    y: isEditorial ? 0.2 : isDark ? -0.52 : -0.44,
    z: isEditorial ? -0.08 : 0,
  };
  heroObject.rotation.set(baseRotation.x, baseRotation.y, baseRotation.z);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const halfH = Math.tan((camera.fov / 2) * (Math.PI / 180)) * camera.position.z;
    const halfW = halfH * camera.aspect;
    const safeRadius = Math.max(0.001, objectRadius);
    const scale = Math.min(1, (halfH * 0.84) / safeRadius);
    heroObject.scale.setScalar(scale);

    // Keep a real gutter around the complete rotating composition. Wide
    // screens place it to the right; tighter canvases pull it toward center.
    const scaledRadius = safeRadius * scale;
    const maxX = Math.max(0, halfW - scaledRadius - 0.18);
    const desiredX = halfW * (isEditorial ? 0.42 : 0.46);
    heroObject.position.x = Math.min(desiredX, maxX);
  };
  resize();
  renderer.render(scene, camera);
  requestAnimationFrame(() => container.classList.add('gl-ready'));
  new ResizeObserver(resize).observe(container);

  let px = 0, py = 0, tx = 0, ty = 0;
  addEventListener('mousemove', (e) => { tx = (e.clientX / innerWidth) * 2 - 1; ty = (e.clientY / innerHeight) * 2 - 1; });

  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let motionAllowed = !motionQuery.matches;
  let onScreen = true;
  new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; if (onScreen) tick(); }, { threshold: 0.01 }).observe(container);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && onScreen) tick(); });
  motionQuery.addEventListener('change', (event) => {
    motionAllowed = !event.matches;
    if (onScreen && !document.hidden) tick();
  });

  const clock = new THREE.Clock();
  let elapsed = 0;
  let raf = 0;
  const render = () => {
    raf = 0;
    px += (tx - px) * 0.05; py += (ty - py) * 0.05;
    elapsed += Math.min(clock.getDelta(), 0.05);
    bgMat.uniforms.uTime.value = elapsed;

    // Bounded ambient motion keeps the designed three-quarter silhouette.
    // Full 360-degree rotation made rings turn edge-on and wireframes appear
    // to vanish; this keeps every theme continuously legible.
    if (motionAllowed) {
      heroObject.rotation.y = baseRotation.y + Math.sin(elapsed * 0.22) * 0.2 + px * 0.07;
      heroObject.rotation.x = baseRotation.x + Math.sin(elapsed * 0.17) * 0.065 - py * 0.045;
      heroObject.rotation.z = baseRotation.z + Math.sin(elapsed * 0.13) * 0.035 + px * 0.035;
      heroObject.position.y = -py * 0.1;
    }
    renderer.render(scene, camera);
    if (onScreen && !document.hidden && motionAllowed) tick();
  };
  const tick = () => { if (!raf) raf = requestAnimationFrame(render); };
  tick();
}
