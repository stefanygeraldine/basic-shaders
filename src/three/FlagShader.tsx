import * as THREE from "three";
import * as dat from "dat.gui";
import { IObjectProps } from "../types.ts";
import testVertexShader from "../shaders/flag/vertex.glsl";
import testFragmentShader from "../shaders/flag/fragment.glsl";
import { forwardRef, useImperativeHandle } from "react";

const FlagShader = forwardRef((props: IObjectProps, ref) => {
  const { scene } = props;
  const texture = new THREE.TextureLoader();
  texture.load("flag-french.jpg");

  const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  const material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
      uFrequency: { value: new THREE.Vector2(10, 5) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("orange") },
      uTexture: { value: texture },
    },
  });

  const gui = new dat.GUI();
  const cameraFolder = gui.addFolder("frequency");
  cameraFolder.add(material.uniforms.uFrequency.value, "x", 0, 20, 0.01);
  cameraFolder.add(material.uniforms.uFrequency.value, "y", 0, 20, 0.01);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.y = 2 / 3;
  scene.add(mesh);

  useImperativeHandle(ref, () => ({
    updateTime: (time: number) => {
      material.uniforms.uTime.value = time;
    },
  }));
});

export default FlagShader;
