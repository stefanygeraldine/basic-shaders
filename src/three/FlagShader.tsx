import * as THREE from "three";
import * as dat from "dat.gui";
import { IObjectProps } from "../types.ts";
import flagVertexShader from "../shaders/flag/vertex.glsl";
import flagFragmentShader from "../shaders/flag/fragment.glsl";
import { forwardRef, useImperativeHandle, useRef } from "react";
import MyTexture from "../assets/textures/gradients/texture.png";

const FlagShader = forwardRef((props: IObjectProps, ref) => {
  const { scene } = props;
  const textureLoader = new THREE.TextureLoader();
  const meshRef = useRef<THREE.Mesh>();

  textureLoader.load(MyTexture, (texture) => {
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    const material = new THREE.RawShaderMaterial({
      vertexShader: flagVertexShader,
      fragmentShader: flagFragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("orange") },
        uTexture: { value: texture },
      },
    });

    const gui = new dat.GUI();
    const frequencyFolder = gui.addFolder("frequency");
    frequencyFolder.add(material.uniforms.uFrequency.value, "x", 0, 20, 0.01);
    frequencyFolder.add(material.uniforms.uFrequency.value, "y", 0, 20, 0.01);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.y = 2 / 3;
    scene.add(mesh);
    meshRef.current = mesh;
  });

  useImperativeHandle(ref, () => ({
    updateTime: (time: number) => {
      if (meshRef.current) {
        (
          meshRef.current.material as THREE.ShaderMaterial
        ).uniforms.uTime.value = time;
      }
    },
  }));

  return null;
});

export default FlagShader;
