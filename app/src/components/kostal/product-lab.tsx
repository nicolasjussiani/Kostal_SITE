import { useEffect, useRef, useState } from "react";

const models = [
  { name: "Controle do volante", file: "/assets/models/steering-control.glb", code: "COMANDO" },
  { name: "Avisador piezoelétrico", file: "/assets/models/piezo-buzzer.glb", code: "SINAL" },
  { name: "Conector elétrico", file: "/assets/models/electrical-connector.glb", code: "CONEXÃO" },
  { name: "Cinta de airbag", file: "/assets/models/clock-spring.glb", code: "MOVIMENTO" },
  { name: "Chave automotiva", file: "/assets/models/car-key-fob.glb", code: "ACESSO" },
] as const;

export function ProductLab() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState("Carregando modelo 3D");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let animationFrame = 0;
    let cleanup = () => {};
    let modelCleanup = () => {};
    setStatus("Carregando modelo 3D");

    void (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { MeshoptDecoder } = await import("three/examples/jsm/libs/meshopt_decoder.module.js");
      if (disposed) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x061426);
      scene.fog = new THREE.FogExp2(0x061426, 0.055);

      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0.2, 5.6);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = true;
      mount.replaceChildren(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xa8c6ef, 0x061426, 1.15));
      const key = new THREE.DirectionalLight(0xf6f8fb, 5.2);
      key.position.set(-3.5, 5, 4);
      key.castShadow = true;
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x397ab9, 3.8);
      rim.position.set(4, 1, -3);
      scene.add(rim);
      const signal = new THREE.PointLight(0xe87722, 8, 9, 1.7);
      signal.position.set(-2.5, -1.4, 2);
      scene.add(signal);

      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(3.8, 96),
        new THREE.MeshStandardMaterial({ color: 0x081a30, roughness: 0.72, metalness: 0.12 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -1.48;
      floor.receiveShadow = true;
      scene.add(floor);

      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load(
        models[selected].file,
        (gltf) => {
          if (disposed) return;
          const object = gltf.scene;
          const box = new THREE.Box3().setFromObject(object);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const scale = 2.85 / (Math.max(size.x, size.y, size.z) || 1);
          object.scale.setScalar(scale);
          object.position.sub(center.multiplyScalar(scale));
          object.rotation.set(-0.12, -0.55, 0.08);
          object.traverse((node) => {
            if (node instanceof THREE.Mesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
          scene.add(object);
          setStatus(`${models[selected].name} pronto para explorar`);

          const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          let dragging = false;
          let previousX = 0;
          const onPointerDown = (event: PointerEvent) => {
            dragging = true;
            previousX = event.clientX;
            renderer.domElement.setPointerCapture(event.pointerId);
          };
          const onPointerMove = (event: PointerEvent) => {
            if (!dragging) return;
            object.rotation.y += (event.clientX - previousX) * 0.008;
            previousX = event.clientX;
          };
          const onPointerUp = () => { dragging = false; };
          renderer.domElement.addEventListener("pointerdown", onPointerDown);
          renderer.domElement.addEventListener("pointermove", onPointerMove);
          renderer.domElement.addEventListener("pointerup", onPointerUp);
          renderer.domElement.addEventListener("pointercancel", onPointerUp);

          const animate = () => {
            if (!prefersReduced && !dragging) object.rotation.y += 0.0028;
            renderer.render(scene, camera);
            animationFrame = window.requestAnimationFrame(animate);
          };
          animate();

          modelCleanup = () => {
            renderer.domElement.removeEventListener("pointerdown", onPointerDown);
            renderer.domElement.removeEventListener("pointermove", onPointerMove);
            renderer.domElement.removeEventListener("pointerup", onPointerUp);
            renderer.domElement.removeEventListener("pointercancel", onPointerUp);
            object.traverse((node) => {
              if (node instanceof THREE.Mesh) {
                node.geometry.dispose();
                const materials = Array.isArray(node.material) ? node.material : [node.material];
                materials.forEach((material) => material.dispose());
              }
            });
          };
        },
        undefined,
        () => setStatus("Não foi possível carregar este modelo"),
      );

      const resize = () => {
        const { width, height } = mount.getBoundingClientRect();
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      const observer = new ResizeObserver(resize);
      observer.observe(mount);
      resize();

      cleanup = () => {
        modelCleanup();
        observer.disconnect();
        window.cancelAnimationFrame(animationFrame);
        renderer.dispose();
        mount.replaceChildren();
      };
    })();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      cleanup();
    };
  }, [selected]);

  return (
    <section className="product-lab" id="produtos" aria-labelledby="product-lab-title">
      <div className="product-lab__intro">
        <p className="technical-label">LABORATÓRIO 3D</p>
        <h2 id="product-lab-title">Explore cada componente.</h2>
        <p>Arraste para girar. Selecione uma peça para observar forma, materiais e pontos de interface.</p>
      </div>
      <div className="product-lab__shell">
        <div className="product-lab__index" role="tablist" aria-label="Modelos de componentes">
          {models.map((model, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={selected === index}
              key={model.file}
              onClick={() => setSelected(index)}
            >
              <span>{model.code}</span>
              <strong>{model.name}</strong>
            </button>
          ))}
        </div>
        <div className="product-lab__viewport">
          <div ref={mountRef} className="product-lab__canvas" aria-hidden="true" />
          <p className="product-lab__status" aria-live="polite">{status}</p>
          <span className="product-lab__axis">X / Y / Z</span>
        </div>
      </div>
    </section>
  );
}
