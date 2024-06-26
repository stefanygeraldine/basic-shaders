import {  useEffect} from "react";
import * as THREE from "three";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Model1 from "./Model1.tsx";
import EnvironmentMap from "./EnvironmentMap.tsx";

import useSize from "../hooks/useSize.ts";

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
camera.position.y = 8;
camera.position.z = 10;
groupCamera.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function Scene() {
  const { innerWidth, innerHeight, devicePixelRatio } = useSize();

  console.log("Parent rendered");

 // const clock = new THREE.Clock();
  //let oldElapsedTime = 0;
  const tick = () => {
    //const elapsedTime = clock.getElapsedTime();
    //const deltaTime = elapsedTime - oldElapsedTime;
    //oldElapsedTime = elapsedTime;

    // Update controls
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  /*
  const gui = new dat.GUI();
  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -10, 10);
  cameraFolder.add(camera.position, "y", -10, 10);
  cameraFolder.add(camera.position, "z", 0, 20);
 */

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
      <Model1 scene={scene} />
      <EnvironmentMap scene={scene} />
    </>
  );
}

export default Scene;
