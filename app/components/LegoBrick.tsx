/*
 * Copyright (C) 2025-2026 blocktrain.fi
 * https://github.com/blocktrain/blocktrain-dapp
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 * See the file LICENSE.txt for more information.
 */

"use client";

import type { JSX } from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import styles from "./LegoBrick.module.css";

const BRICK_LENGTH: number = 3.2; // 4 studs along the X axis
const BRICK_WIDTH: number = 1.6; // 2 studs along the Z axis
const BRICK_HEIGHT: number = 0.96;
const STUD_SPACING: number = 0.8;
const STUD_RADIUS: number = 0.24;
const STUD_HEIGHT: number = 0.18;

export function LegoBrick(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container: HTMLDivElement | null = containerRef.current;

    if (container === null) {
      return undefined;
    }

    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.classList.add(styles.canvas);
    container.appendChild(renderer.domElement);

    const scene: THREE.Scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.06);

    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      35,
      1,
      0.1,
      100,
    );
    camera.position.set(6, 4, 6);

    const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(
      0xfff0e0,
      0.8,
    );
    scene.add(ambientLight);

    const keyLight: THREE.DirectionalLight = new THREE.DirectionalLight(
      0xfff4d5,
      1.35,
    );
    keyLight.position.set(4, 6, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight: THREE.PointLight = new THREE.PointLight(0xff2b2b, 0.85, 24);
    rimLight.position.set(-4, 3, -2);
    scene.add(rimLight);

    const fillLight: THREE.HemisphereLight = new THREE.HemisphereLight(
      0xffcccc,
      0x1a1a1a,
      0.65,
    );
    scene.add(fillLight);

    const bounceLight: THREE.PointLight = new THREE.PointLight(
      0xffd6aa,
      0.4,
      18,
    );
    bounceLight.position.set(0.5, -2.5, 1.5);
    scene.add(bounceLight);

    const brickGroup: THREE.Group = new THREE.Group();
    scene.add(brickGroup);

    const materials: THREE.Material[] = [];
    const geometries: THREE.BufferGeometry[] = [];

    const redMaterial: THREE.MeshStandardMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xc00b0b,
        metalness: 0.28,
        roughness: 0.28,
        envMapIntensity: 0.65,
      });
    materials.push(redMaterial);

    const baseGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(
      BRICK_LENGTH,
      BRICK_HEIGHT,
      BRICK_WIDTH,
      32,
      32,
      24,
    );
    geometries.push(baseGeometry);

    const brickBase: THREE.Mesh = new THREE.Mesh(baseGeometry, redMaterial);
    brickBase.castShadow = true;
    brickBase.receiveShadow = true;
    brickGroup.add(brickBase);

    const studGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      STUD_RADIUS,
      STUD_RADIUS,
      STUD_HEIGHT,
      32,
    );
    geometries.push(studGeometry);

    const studYOffset: number = BRICK_HEIGHT / 2 + STUD_HEIGHT / 2;
    const studOffsetX: number = ((4 - 1) * STUD_SPACING) / 2;
    const studOffsetZ: number = ((2 - 1) * STUD_SPACING) / 2;

    for (let xIndex = 0; xIndex < 4; xIndex += 1) {
      for (let zIndex = 0; zIndex < 2; zIndex += 1) {
        const stud: THREE.Mesh = new THREE.Mesh(studGeometry, redMaterial);
        stud.position.set(
          -studOffsetX + STUD_SPACING * xIndex,
          studYOffset,
          -studOffsetZ + STUD_SPACING * zIndex,
        );
        stud.castShadow = true;
        stud.receiveShadow = true;
        brickGroup.add(stud);
      }
    }

    brickGroup.rotation.set(0.45, -0.25, 0.35);

    const rotationVelocity: THREE.Vector3 = new THREE.Vector3(
      0.0028 + Math.random() * 0.0012,
      0.0034 + Math.random() * 0.0014,
      0.0016 + Math.random() * 0.0009,
    );

    const clock: THREE.Clock = new THREE.Clock();

    const resizeRenderer = (): void => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    resizeRenderer();

    const onWindowResize = (): void => {
      resizeRenderer();
    };

    window.addEventListener("resize", onWindowResize);

    const animate = (): void => {
      const delta: number = clock.getDelta();

      rotationVelocity.x = THREE.MathUtils.clamp(
        rotationVelocity.x + (Math.random() - 0.5) * 0.00045,
        0.0018,
        0.0058,
      );
      rotationVelocity.y = THREE.MathUtils.clamp(
        rotationVelocity.y + (Math.random() - 0.5) * 0.0005,
        0.0022,
        0.0065,
      );
      rotationVelocity.z = THREE.MathUtils.clamp(
        rotationVelocity.z + (Math.random() - 0.5) * 0.00035,
        0.001,
        0.0042,
      );

      brickGroup.rotation.x += rotationVelocity.x * delta * 60;
      brickGroup.rotation.y += rotationVelocity.y * delta * 60;
      brickGroup.rotation.z += rotationVelocity.z * delta * 60;

      camera.lookAt(brickGroup.position);
      renderer.render(scene, camera);

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return (): void => {
      window.removeEventListener("resize", onWindowResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);

      geometries.forEach((geometry: THREE.BufferGeometry) => {
        geometry.dispose();
      });
      materials.forEach((material: THREE.Material) => {
        material.dispose();
      });
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container} aria-hidden={true} />
  );
}
