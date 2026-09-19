import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import "./scroll-product-story.css";

const chapters = [
  { label: "Comando", title: "Precisão que você", accent: "sente no toque.", body: "Da intenção ao movimento. Conheça os componentes que conectam você ao veículo.", name: "Chave combinada", code: "12270239", file: "multifunction-stalk.glb", image: "chave-de-seta.png" },
  { label: "Conexão", title: "Inteligência em", accent: "cada conexão.", body: "Interfaces compactas. Encaixes precisos. Explore a engenharia que trabalha por trás de cada comando.", name: "Módulo do vidro elétrico", code: "10020532", file: "window-module.glb", image: "modulos.jpg" },
  { label: "Movimento", title: "Projetada para", accent: "seguir em frente.", body: "Energia e informação acompanham o movimento. Veja de perto os detalhes que fazem parte dessa experiência.", name: "Cinta de airbag 10 vias", code: "10094738", file: "clock-spring.glb", image: "sistemas-eletricos.jpg" },
];

/** Separate mesh scene: the existing video scrub controller is left untouched. */
export function ScrollProductStory() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const draw = useRef<((progress: number) => void) | null>(null);
  const progress = useRef(0);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const still = paused || reduced;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = section.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = still ? activeRef.current / 2 : Math.min(1, Math.max(0, -rect.top / Math.max(1, el.offsetHeight - window.innerHeight)));
      progress.current = p;
      const index = Math.round(p * 2);
      if (index !== activeRef.current) { activeRef.current = index; setActive(index); }
      el.style.setProperty("--story-progress", String(p));
      if (rect.bottom > 0 && rect.top < window.innerHeight && !document.hidden) draw.current?.(p);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); document.removeEventListener("visibilitychange", schedule); };
  }, [still]);

  useEffect(() => {
    const mount = canvas.current;
    if (!mount) return;
    let disposed = false;
    let cleanup = () => {};
    const abort = new AbortController();
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void (async () => {
        const [T, { GLTFLoader }, { MeshoptDecoder }, { RoomEnvironment }] = await Promise.all([
          import("three"), import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/libs/meshopt_decoder.module.js"), import("three/examples/jsm/environments/RoomEnvironment.js"),
        ]);
        if (disposed) return;
        const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputColorSpace = T.SRGBColorSpace;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        mount.appendChild(renderer.domElement);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(34, 1, .1, 50);
        camera.position.set(0, .15, 7.4);
        const room = new RoomEnvironment();
        const pmrem = new T.PMREMGenerator(renderer);
        const environment = pmrem.fromScene(room, .04);
        scene.environment = environment.texture;
        room.dispose(); pmrem.dispose();
        scene.add(new T.HemisphereLight(0xe4efff, 0x23415b, 1.3));
        const light = new T.DirectionalLight(0xffffff, 2);
        light.position.set(2, 4, 4); scene.add(light);
        const groups: InstanceType<typeof T.Group>[] = [];
        const resources = new Set<InstanceType<typeof T.Object3D>>();
        const release = (root: InstanceType<typeof T.Object3D>) => {
          const textures = new Set<InstanceType<typeof T.Texture>>();
          root.traverse(node => {
            if (!(node instanceof T.Mesh)) return;
            node.geometry.dispose();
            for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
              for (const value of Object.values(material)) if (value instanceof T.Texture) textures.add(value);
              material.dispose();
            }
          });
          textures.forEach(texture => { if (typeof ImageBitmap !== "undefined" && texture.image instanceof ImageBitmap) texture.image.close(); texture.dispose(); });
        };
        const render = (p: number) => {
          if (disposed || document.hidden) return;
          groups.forEach((group, index) => {
            const offset = index - p * 2;
            group.visible = Math.abs(offset) < 1;
            group.position.set(offset * 5.3, Math.sin(p * Math.PI * 2) * .12, -Math.abs(offset) * 1.4);
            group.rotation.set(.1 + Math.sin(p * Math.PI) * .2, -.3 + p * 1.35 + index * .18, -.12 + p * .24);
          });
          renderer.render(scene, camera);
        };
        draw.current = render;
        const resize = () => {
          const { width, height } = mount.getBoundingClientRect();
          camera.aspect = width / Math.max(height, 1);
          camera.position.z = camera.aspect < 1 ? 8.8 : 7.4;
          camera.updateProjectionMatrix(); renderer.setSize(width, height, false); render(progress.current);
        };
        const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(mount);
        const lost = (event: Event) => { event.preventDefault(); setReady(false); setFailed(true); };
        renderer.domElement.addEventListener("webglcontextlost", lost);
        cleanup = () => {
          draw.current = null; resizeObserver.disconnect();
          renderer.domElement.removeEventListener("webglcontextlost", lost);
          resources.forEach(release); resources.clear(); environment.dispose();
          renderer.dispose(); renderer.forceContextLoss(); mount.replaceChildren();
        };
        resize();
        const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
        // Keep one canvas and release every mesh on unmount, including late loads.
        await Promise.all(chapters.map(async (chapter, index) => {
          const response = await fetch("/assets/models/" + chapter.file, { signal: abort.signal });
          if (!response.ok) throw new Error("Unavailable model");
          const gltf = await loader.parseAsync(await response.arrayBuffer(), "");
          if (disposed || abort.signal.aborted) { release(gltf.scene); return; }
          resources.add(gltf.scene);
          const bounds = new T.Box3().setFromObject(gltf.scene);
          const size = bounds.getSize(new T.Vector3());
          const center = bounds.getCenter(new T.Vector3());
          const scale = 3.65 / Math.max(size.x, size.y, size.z, .001);
          gltf.scene.scale.setScalar(scale); gltf.scene.position.copy(center.multiplyScalar(-scale));
          const group = new T.Group(); group.add(gltf.scene); groups[index] = group; scene.add(group);
        }));
        if (!disposed && !abort.signal.aborted) { render(progress.current); setReady(true); }
      })().catch(error => {
        if (!disposed && error.name !== "AbortError") { abort.abort(); cleanup(); setFailed(true); }
      });
    }, { rootMargin: "250px" });
    observer.observe(mount);
    return () => { disposed = true; abort.abort(); observer.disconnect(); cleanup(); };
  }, []);

  const jump = (index: number) => {
    if (still) { activeRef.current = index; setActive(index); progress.current = index / 2; draw.current?.(index / 2); return; }
    const el = section.current;
    if (el) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top + (el.offsetHeight - window.innerHeight) * index / 2, behavior: "smooth" });
  };
  const chapter = chapters[active];
  return (
    <section ref={section} className={"scroll-story" + (reduced ? " is-reduced" : "")} id="experiencia" aria-label="Experiência de produtos KOSTAL em 3D">
      <div className="story-sticky">
        <div className="story-grid" aria-hidden="true" />
        <div className="story-orbit" aria-hidden="true"><span /><span /></div>
        <div className="story-wordmark" aria-hidden="true">KOSTAL</div>
        <div className="story-copy">
          <p className="technical-label"><span className="live-dot" /> ENGENHARIA EM MOVIMENTO</p>
          <div className="story-chapters">
            {chapters.map((item, index) => <div className={"story-chapter" + (active === index ? " is-active" : "")} key={item.code} aria-hidden={active !== index}>
              {index === 0 ? <h1>{item.title}<br /><em>{item.accent}</em></h1> : <h2>{item.title}<br /><em>{item.accent}</em></h2>}
              <p>{item.body}</p>
            </div>)}
          </div>
          <div className="story-actions"><a href="#produtos" className="hero-catalog-cta">Explorar produtos <ArrowUpRight size={19} /></a><a href="#filme" className="story-secondary">Nossa engenharia <ArrowDown size={16} /></a></div>
        </div>
        <div className={"story-visual" + (ready ? " is-ready" : "")}>
          <img className="story-fallback" src={"/assets/catalog/" + chapter.image} alt={chapter.name} aria-hidden={ready} width="800" height="800" />
          <div ref={canvas} className="story-canvas" role="img" aria-hidden={!ready} aria-label={"Representação 3D de " + chapter.name} />
          <div className="story-product-label"><span className="story-cross" aria-hidden="true">+</span><span><b>{chapter.name}</b><small>KOSTAL {chapter.code} · {ready ? "MODELO 3D" : failed ? "FOTO DO PRODUTO" : "CARREGANDO 3D"}</small></span></div>
        </div>
        <div className="story-bottom">
          <p className="story-scroll-hint"><ArrowDown size={16} /> {still ? "Escolha uma etapa" : "Role para explorar"}</p>
          <nav className="story-steps" aria-label="Etapas da experiência">{chapters.map((item, index) => <button type="button" key={item.code} aria-current={active === index ? "step" : undefined} onClick={() => jump(index)}><span>0{index + 1}</span>{item.label}</button>)}</nav>
          <button type="button" className="story-motion" onClick={() => setPaused(!paused)} disabled={reduced} aria-pressed={still} aria-label={still ? "Ativar animação de rolagem" : "Pausar animação de rolagem"} title={reduced ? "Movimento reduzido nas preferências do dispositivo" : "Ativar ou pausar animação"}>{still ? <Play size={16} /> : <Pause size={16} />}</button>
        </div>
        <div className="story-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
