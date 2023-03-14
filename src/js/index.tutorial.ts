import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

import texture1 from "../textures/1.png";
import bg from "../textures/bg.jpeg";

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// renderer.setClearColor(0xffea00);
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(bg);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({
  color: "green",
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: "white",
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;
scene.add(plane);

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: "blue",
  // wireframe: true,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;
scene.add(sphere);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-20, 20, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
scene.add(directionalLight);

const directionalLightShadowHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightShadowHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
scene.add(directionalLightHelper);

const gui = new dat.GUI();
const options = {
  sphereColor: "#ffea00",
  wireframe: false,
};
gui.addColor(options, "sphereColor").onChange(function (e) {
  sphere.material.color.set(e);
});
gui.add(options, "wireframe").onChange(function (e) {
  sphere.material.wireframe = e;
});

function animate(time: number) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;
  renderer.render(scene, camera);
}

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
  // color: 0x00ff00,
  map: textureLoader.load(texture1),
});
const box2 = new THREE.Mesh(box2Geometry, box2Material);
box2.position.set(0, 15, 10);
scene.add(box2);

renderer.setAnimationLoop(animate);
