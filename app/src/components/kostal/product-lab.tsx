import { useEffect, useRef, useState } from "react";
import { Box, RotateCcw, ZoomIn, ZoomOut, Pause, Play, Maximize2, Minimize2, Grid2X2, ScanLine, LoaderCircle } from "lucide-react";
import { products, type Product } from "./products";

type ViewerActions = { zoom: (factor: number) => void; view: (name: string) => void };
function Viewer({ product }: { product: Product }) {
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const actions = useRef<ViewerActions | null>(null);
  const options = useRef({ rotate: false, wire: false, grid: true });
  const [rotate, setRotate] = useState(false);
  const [wire, setWire] = useState(false);
  const [grid, setGrid] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<"waiting" | "loading" | "ready" | "error">("waiting");
  const [retry, setRetry] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEnabled(true); observer.disconnect(); }
    }, { rootMargin: "350px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { options.current = { rotate, wire, grid }; }, [rotate, wire, grid]);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(frame.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') || []);
    focusable()[0]?.focus();
    document.body.style.overflow = "hidden";
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
      if (event.key === "Tab") {
        const buttons = focusable();
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", escape); previousFocus?.focus(); };
  }, [expanded]);

  useEffect(() => {
    const mount = host.current;
    if (!mount || !enabled) return;
    let disposed = false;
    let cleanup = () => {};
    const abort = new AbortController();
    actions.current = null;
    setStatus("loading");
    setRotate(false);
    setWire(false);
    void (async () => {
      const [THREE, { GLTFLoader }, { MeshoptDecoder }, { OrbitControls }, { RoomEnvironment }] = await Promise.all([
        import("three"), import("three/examples/jsm/loaders/GLTFLoader.js"),
        import("three/examples/jsm/libs/meshopt_decoder.module.js"),
        import("three/examples/jsm/controls/OrbitControls.js"),
        import("three/examples/jsm/environments/RoomEnvironment.js"),
      ]);
      if (disposed) return;
      const disposeObject = (object: InstanceType<typeof THREE.Object3D>) => {
        const geometries = new Set<InstanceType<typeof THREE.BufferGeometry>>();
        const materials = new Set<InstanceType<typeof THREE.Material>>();
        const textures = new Set<InstanceType<typeof THREE.Texture>>();
        object.traverse(node => {
          if (node instanceof THREE.Mesh) {
            geometries.add(node.geometry);
            for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
              materials.add(material);
              for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
            }
          }
        });
        geometries.forEach(g => g.dispose());
        materials.forEach(m => m.dispose());
        textures.forEach(t => { if (typeof ImageBitmap !== "undefined" && t.image instanceof ImageBitmap) t.image.close(); t.dispose(); });
      };
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      mount.replaceChildren(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, .05, 60);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = .08;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minDistance = 2.4;
      controls.maxDistance = 10;
      controls.autoRotateSpeed = .7;
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const environment = pmrem.fromScene(room, .04);
      scene.environment = environment.texture;
      room.dispose();
      pmrem.dispose();
      scene.add(new THREE.HemisphereLight(0xd8e8ff, 0x15253a, 2.2));
      const key = new THREE.DirectionalLight(0xffffff, 3);
      key.position.set(3, 5, 4); scene.add(key);
      const guide = new THREE.GridHelper(10, 24, 0x315274, 0x162e48);
      guide.position.y = -1.45; scene.add(guide);
      let object: InstanceType<typeof THREE.Group> | null = null;
      let raf = 0;
      let visible = true;
      let dirty = true;
      let lastOptions = "";
      const setView = (name: string) => {
        const distance = Math.max(5.5, 2.1 / Math.max(camera.aspect, .45));
        const positions: Record<string, [number, number, number]> = {
          perspective: [.6 * distance, .32 * distance, distance],
          front: [0, 0, distance], side: [distance, .1, 0], top: [0, distance, .001],
        };
        camera.position.set(...(positions[name] || positions.perspective));
        controls.target.set(0, 0, 0); controls.update(); dirty = true;
      };
      const resize = () => {
        const { width, height } = mount.getBoundingClientRect();
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        dirty = true;
      };
      const observer = new ResizeObserver(resize); observer.observe(mount);
      resize(); setView("perspective");
      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting; dirty = true;
        if (visible && !raf && !document.hidden) animate();
      });
      visibility.observe(mount);
      const onVisibility = () => { if (!document.hidden && visible && !raf) animate(); };
      document.addEventListener("visibilitychange", onVisibility);
      const contextLost = (event: Event) => { event.preventDefault(); setStatus("error"); };
      renderer.domElement.addEventListener("webglcontextlost", contextLost);
      const animate = () => {
        raf = 0;
        if (disposed || !visible || document.hidden) return;
        controls.autoRotate = options.current.rotate;
        guide.visible = options.current.grid;
        const next = JSON.stringify(options.current);
        if (next !== lastOptions && object) {
          object.traverse(node => { if (node instanceof THREE.Mesh) {
            for (const m of Array.isArray(node.material) ? node.material : [node.material])
              if (m instanceof THREE.MeshStandardMaterial) m.wireframe = options.current.wire;
          } });
          dirty = true; lastOptions = next;
        }
        const changed = controls.update();
        if (changed || dirty) { renderer.render(scene, camera); dirty = false; }
        raf = requestAnimationFrame(animate);
      };
      cleanup = () => {
        abort.abort(); cancelAnimationFrame(raf); observer.disconnect(); visibility.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        renderer.domElement.removeEventListener("webglcontextlost", contextLost);
        controls.dispose(); if (object) disposeObject(object);
        guide.geometry.dispose();
        for (const m of Array.isArray(guide.material) ? guide.material : [guide.material]) m.dispose();
        environment.dispose(); renderer.dispose(); renderer.forceContextLoss(); mount.replaceChildren();
        actions.current = null;
      };
      animate();
      const response = await fetch(product.file, { signal: abort.signal });
      if (!response.ok) throw new Error("Model unavailable");
      const buffer = await response.arrayBuffer();
      if (disposed) return;
      const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
      const gltf = await loader.parseAsync(buffer, "");
      if (disposed) { disposeObject(gltf.scene); return; }
      const bounds = new THREE.Box3().setFromObject(gltf.scene);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const scale = 3.25 / Math.max(size.x, size.y, size.z, .001);
      gltf.scene.position.copy(center.multiplyScalar(-scale));
      gltf.scene.scale.setScalar(scale);
      object = new THREE.Group(); object.add(gltf.scene); scene.add(object);
      actions.current = {
        zoom: factor => {
          const direction = camera.position.clone().sub(controls.target);
          direction.setLength(THREE.MathUtils.clamp(direction.length() * factor, 2.4, 10));
          camera.position.copy(controls.target).add(direction); controls.update(); dirty = true;
        },
        view: setView,
      };
      dirty = true; setStatus("ready");
    })().catch(error => {
      if (!disposed && error.name !== "AbortError") { console.error("KOSTAL 3D model load failed", error); cleanup(); setStatus("error"); }
    });
    return () => { disposed = true; abort.abort(); cleanup(); };
  }, [product.file, retry, enabled]);

  const view = (name: string) => { setRotate(false); actions.current?.view(name); };
  return (
    <div ref={frame} className={"product-stage" + (expanded ? " is-expanded" : "")} role={expanded ? "dialog" : undefined} aria-modal={expanded || undefined} aria-label={expanded ? "Visualização ampliada de " + product.name : undefined}>
      <div className="stage-topline"><span><Box size={16} aria-hidden="true" /> VISUALIZAÇÃO 3D</span>
        <button type="button" aria-label={expanded ? "Reduzir visualizador" : "Ampliar visualizador"} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>
          {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
      <div ref={host} className="product-stage__canvas" role="img" aria-label={"Modelo 3D de " + product.name} />
      {status !== "ready" && <div className="stage-message" role="status">
        {status === "error" ? <><Box size={28} /><strong>O modelo não carregou.</strong><span>Confira sua conexão ou tente novamente.</span><button type="button" onClick={() => setRetry(n => n + 1)}>Tentar novamente</button></>
          : <><LoaderCircle size={28} className={status === "loading" ? "loading-spinner" : ""} /><span>{status === "loading" ? "Preparando seu modelo..." : "A visualização 3D está logo aqui."}</span></>}
      </div>}
      <div className="stage-controls" aria-label="Controles do modelo 3D">
        <div className="stage-views" aria-label="Vistas do produto">
          <button type="button" disabled={status !== "ready"} onClick={() => view("front")}>Frente</button>
          <button type="button" disabled={status !== "ready"} onClick={() => view("side")}>Lateral</button>
          <button type="button" disabled={status !== "ready"} onClick={() => view("top")}>Topo</button>
        </div>
        <div className="stage-tools">
          <button type="button" disabled={status !== "ready"} aria-label="Aproximar" title="Aproximar" onClick={() => actions.current?.zoom(.82)}><ZoomIn size={19} /></button>
          <button type="button" disabled={status !== "ready"} aria-label="Afastar" title="Afastar" onClick={() => actions.current?.zoom(1.22)}><ZoomOut size={19} /></button>
          <button type="button" disabled={status !== "ready"} aria-label="Restaurar vista" title="Restaurar vista" onClick={() => view("perspective")}><RotateCcw size={18} /></button>
          <button type="button" disabled={status !== "ready"} aria-pressed={rotate} aria-label={rotate ? "Pausar rotação" : "Girar automaticamente"} title="Rotação automática" onClick={() => setRotate(!rotate)}>{rotate ? <Pause size={18} /> : <Play size={18} />}</button>
          <button type="button" disabled={status !== "ready"} aria-pressed={wire} aria-label="Mostrar malha" title="Mostrar malha" onClick={() => setWire(!wire)}><ScanLine size={19} /></button>
          <button type="button" aria-pressed={grid} aria-label="Mostrar grade" title="Mostrar grade" onClick={() => setGrid(!grid)}><Grid2X2 size={18} /></button>
        </div>
      </div>
      <p className="stage-instruction">Arraste para girar em qualquer direção. Use + e − para aproximar.</p>
    </div>
  );
}

export function ProductLab() {
  const [selected, setSelected] = useState(products[0].id);
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filtered = products.filter(p => (category === "Todos" || p.category === category) && normalize(p.name + " " + p.category).includes(normalize(query)));
  const product = products.find(p => p.id === selected) || products[0];
  return (
    <section className="product-lab" id="produtos" aria-labelledby="product-lab-title">
      <div className="lab-heading">
        <p className="technical-label">PRODUTOS EM PERSPECTIVA</p>
        <h2 id="product-lab-title">Cada detalhe.<br /><span>Todos os ângulos.</span></h2>
        <p>Conheça os componentes de perto. Escolha uma peça e explore sua forma, seus encaixes e seus materiais.</p>
      </div>
      <div className="lab-filterbar">
        <label className="lab-search"><span>Buscar produto</span><input type="search" placeholder="Nome do componente" value={query} onChange={e => setQuery(e.target.value)} /></label>
        <label className="lab-category"><span>Família</span><select value={category} onChange={e => setCategory(e.target.value)}>{["Todos", ...new Set(products.map(p => p.category))].map(value => <option key={value}>{value}</option>)}</select></label>
        <span className="lab-count" role="status">{filtered.length} de {products.length} modelos</span>
      </div>
      <div className="lab-workspace">
        <div className="lab-products" aria-label="Selecionar componente">
          {filtered.map((p) => <button key={p.id} type="button" aria-pressed={selected === p.id} onClick={() => setSelected(p.id)}>
            <span className="lab-product-number">{String(products.indexOf(p) + 1).padStart(2, "0")}</span>
            <span><small>{p.category}</small><strong>{p.name}</strong></span><Box size={17} aria-hidden="true" />
          </button>)}
          {filtered.length === 0 && <div className="lab-empty"><strong>Nenhum componente encontrado.</strong><button type="button" onClick={() => { setQuery(""); setCategory("Todos"); }}>Limpar filtros</button></div>}
        </div>
        <div className="lab-main">
          <Viewer product={product} />
          <div className="lab-detail" aria-live="polite">
            <div><span className="lab-detail__category">{product.category}</span><h3>{product.name}</h3><p>{product.description}</p></div>
            <dl><div><dt>Função</dt><dd>{product.function}</dd></div><div><dt>Observe em 3D</dt><dd>{product.detail}</dd></div></dl>
            <a href="https://kostalbrasil.com.br/catalogo/pecas" target="_blank" rel="noreferrer">Consultar aplicação <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
      <p className="lab-note">Modelos ilustrativos, incluindo variações de uma mesma peça. Confirme códigos, medidas e compatibilidade no catálogo oficial.</p>
    </section>
  );
}
