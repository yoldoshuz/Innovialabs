"use client";

import * as React from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const VIOLET = 0x7c3aed;
const LILAC = 0xa78bfa;

/** Four-point brand star (same curves as the logo mark), centered at 0,0. */
function sparkShape(size: number) {
  const s = size / 2;
  const k = s * 0.17; // control-point inset → concave sides like the mark
  const shape = new THREE.Shape();
  shape.moveTo(0, s);
  shape.quadraticCurveTo(k, k, s, 0);
  shape.quadraticCurveTo(k, -k, 0, -s);
  shape.quadraticCurveTo(-k, -k, -s, 0);
  shape.quadraticCurveTo(-k, k, 0, s);
  return shape;
}

function sparkGeometry(size: number, depth: number) {
  const geo = new THREE.ExtrudeGeometry(sparkShape(size), {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.6,
    bevelSize: size * 0.035,
    bevelSegments: 10,
    curveSegments: 48,
  });
  geo.center();
  return geo;
}

/**
 * Interactive 3D star-spark: follows the cursor, spins on click, idles
 * gently, and pauses rendering while off-screen. Static under reduced motion.
 */
export function SparkScene({ className }: { className?: string }) {
  const mountRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    // Soft studio lighting from a generated room environment.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x1a1033);
    const lightA = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    lightA.position.set(-4, 4, 4);
    lightA.lookAt(0, 0, 0);
    const lightB = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 3),
      new THREE.MeshBasicMaterial({ color: LILAC }),
    );
    lightB.position.set(5, -2, 3);
    lightB.lookAt(0, 0, 0);
    envScene.add(lightA, lightB);
    const envMap = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = envMap;

    const main = new THREE.Mesh(
      sparkGeometry(3.2, 0.32),
      new THREE.MeshPhysicalMaterial({
        color: VIOLET,
        roughness: 0.22,
        metalness: 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        sheen: 0.6,
        sheenColor: new THREE.Color(LILAC),
      }),
    );
    scene.add(main);

    // Two small satellites (guideline: max two accents per layout → one
    // hero star + its sparkles count as a single accent group).
    const satMat = new THREE.MeshPhysicalMaterial({
      color: LILAC,
      roughness: 0.3,
      clearcoat: 1,
    });
    const satA = new THREE.Mesh(sparkGeometry(0.8, 0.12), satMat);
    const satB = new THREE.Mesh(sparkGeometry(0.5, 0.1), satMat);
    scene.add(satA, satB);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(-3, 4, 6);
    scene.add(key);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // Pointer → target tilt (window-wide so the star "watches" the cursor).
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Click → a quick extra spin.
    let spin = 0;
    const onClick = () => {
      spin += Math.PI * 2;
    };
    mount.addEventListener("click", onClick);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    let spun = 0;

    const render = () => {
      raf = requestAnimationFrame(render);
      if (!visible || document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const k = 1 - Math.pow(0.02, dt); // frame-rate independent easing

      spun += (spin - spun) * k;
      main.rotation.y += (target.x * 0.6 + spun - main.rotation.y) * k;
      main.rotation.x += (target.y * 0.45 - main.rotation.x) * k;
      main.rotation.z = Math.sin(t * 0.6) * 0.08;
      main.position.y = Math.sin(t * 1.1) * 0.12;
      main.scale.setScalar(1 + Math.sin(t * 2.2) * 0.015);

      satA.position.set(
        Math.cos(t * 0.7) * 2.3,
        1.6 + Math.sin(t * 1.3) * 0.2,
        Math.sin(t * 0.7) * 0.8,
      );
      satA.rotation.set(t * 0.8, t * 1.2, 0);
      satB.position.set(
        Math.cos(t * 0.9 + 2.4) * 2.1,
        -1.7 + Math.cos(t * 1.1) * 0.2,
        Math.sin(t * 0.9 + 2.4) * 0.8,
      );
      satB.rotation.set(t, t * 0.6, 0);

      renderer.render(scene, camera);
    };

    if (reduce) {
      renderer.render(scene, camera);
    } else {
      render();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      mount.removeEventListener("click", onClick);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={cn("cursor-pointer select-none", className)}
    />
  );
}
