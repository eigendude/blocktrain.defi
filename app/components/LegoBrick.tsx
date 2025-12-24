import { useEffect, useRef } from "react";
import * as THREE from "three";

import styles from "./LegoBrick.module.css";

export function LegoBrick(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(6, 4, 8);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffdde1, 0.45);
    rimLight.position.set(-6, 6, -4);
    scene.add(rimLight);

    const fillLight = new THREE.HemisphereLight(0xffffff, 0x1a1a1d, 0.5);
    scene.add(fillLight);

    const brickGroup = new THREE.Group();

    const studSpacing = 1.6;
    const studRadius = 0.35;
    const studHeight = 0.24;
    const brickHeight = 1.15;
    const brickWidth = studSpacing * 2 + 0.2;
    const brickLength = studSpacing * 4 + 0.2;

    const material = new THREE.MeshStandardMaterial({
      color: "#c20404",
      roughness: 0.38,
      metalness: 0.08,
    });

    const baseGeometry = new THREE.BoxGeometry(
      brickLength,
      brickHeight,
      brickWidth,
    );
    const baseMesh = new THREE.Mesh(baseGeometry, material);
    baseMesh.position.y = brickHeight / 2;
    brickGroup.add(baseMesh);

    const studGeometry = new THREE.CylinderGeometry(
      studRadius,
      studRadius,
      studHeight,
      48,
    );

    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        const stud = new THREE.Mesh(studGeometry, material);
        stud.position.set(
          (col - 1.5) * studSpacing,
          brickHeight + studHeight / 2,
          (row - 0.5) * studSpacing,
        );
        stud.rotation.x = Math.PI / 2;
        brickGroup.add(stud);
      }
    }

    brickGroup.rotation.set(-0.35, 0.3, 0.2);
    scene.add(brickGroup);

    const rotationVelocity = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(0.005),
      THREE.MathUtils.randFloatSpread(0.0075),
      THREE.MathUtils.randFloatSpread(0.005),
    );

    let frame = 0;
    const drift = 0.0022;
    let animationFrameId = 0;

    const resize = (): void => {
      const { clientWidth, clientHeight } = container;
      const size = Math.max(160, Math.min(clientWidth, clientHeight));
      renderer.setSize(size, size);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };

    resize();
    container.appendChild(renderer.domElement);

    const animate = (): void => {
      animationFrameId = requestAnimationFrame(animate);
      frame += 1;

      if (frame % 180 === 0) {
        rotationVelocity.set(
          THREE.MathUtils.damp(
            rotationVelocity.x,
            THREE.MathUtils.randFloatSpread(0.01),
            8,
            1 / 60,
          ),
          THREE.MathUtils.damp(
            rotationVelocity.y,
            THREE.MathUtils.randFloatSpread(0.012),
            8,
            1 / 60,
          ),
          THREE.MathUtils.damp(
            rotationVelocity.z,
            THREE.MathUtils.randFloatSpread(0.01),
            8,
            1 / 60,
          ),
        );
      }

      brickGroup.rotation.x +=
        rotationVelocity.x + Math.sin(frame * 0.005) * drift;
      brickGroup.rotation.y +=
        rotationVelocity.y + Math.cos(frame * 0.004) * drift;
      brickGroup.rotation.z +=
        rotationVelocity.z + Math.sin(frame * 0.006) * drift * 0.8;

      brickGroup.position.y = Math.sin(frame * 0.01) * 0.08;

      renderer.render(scene, camera);
    };

    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.canvas} aria-hidden="true" />
  );
}
