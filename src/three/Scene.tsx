import { useEffect, useRef } from "react";
import * as THREE from "three";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import FlagShader from "./FlagShader.tsx";

import useSize from "../hooks/useSize.ts";

interface FlagShader {
  updateTime: (elapsedTime: number) => void;
}

const scene = new THREE.Scene();
// Canvas
const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//renderer.setClearAlpha(0);

// Base camera
document.body.appendChild(renderer.domElement);
const groupCamera = new THREE.Group();
scene.add(groupCamera);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);

camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 1;
groupCamera.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function Scene() {
  const { innerWidth, innerHeight, devicePixelRatio } = useSize();
  const flagShaderRef = useRef<FlagShader | null>(null);

  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    if (flagShaderRef.current) {
      flagShaderRef.current.updateTime(elapsedTime);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    tick();
  }, []);

  useEffect(() => {
    // Update camera
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  }, [innerWidth, innerHeight, devicePixelRatio]);

  return (
    <>
      <FlagShader scene={scene} ref={flagShaderRef} />
    </>
  );
}

export default Scene;
