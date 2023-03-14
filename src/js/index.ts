import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import Cube from "./Cube";

// import texture1 from "../textures/1.png";
// import bg from "../textures/bg.jpeg";

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(
  -5,
  5,
  5 * (window.innerHeight / window.innerWidth),
  -5 * (window.innerHeight / window.innerWidth),
  0.3,
  1000
);
camera.position.z = 5;

// const textureLoader = new THREE.TextureLoader();

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const axesHelper = new THREE.AxesHelper(5);
window.scene.add(axesHelper);

// directional light
const directionalLight = new THREE.DirectionalLight("white", 0.5);
directionalLight.position.set(0, 0, 1);
window.scene.add(directionalLight);

// const boxGeometry = new THREE.BoxGeometry();
// const boxMaterial = new THREE.MeshStandardMaterial({
//   color: "white",
//   // map: textureLoader.load(texture1),
// });
// const box = new THREE.Mesh(boxGeometry, boxMaterial);
// box.scale.set(4, 4, 4);
const cube = new Cube({
  FRONT: [
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [
      { division: "LEFT_RIGHT" },
      { division: "LEFT_RIGHT" },
      { division: "LEFT_RIGHT" },
      { division: "BOT_LEFT_TOP", isEmitter: true },
    ],
    [undefined, undefined, undefined, undefined],
  ],
  // RIGHT: [
  //   [undefined, undefined, undefined, undefined],
  //   [undefined, undefined, undefined, undefined],
  //   [
  //     { division: "LEFT_RIGHT" },
  //     { division: "LEFT_RIGHT" },
  //     { division: "LEFT_RIGHT" },
  //     { division: "BOT_LEFT_TOP", isEmitter: true },
  //   ],
  //   [undefined, undefined, undefined, undefined],
  // ],
  // BACK: [
  //   [undefined, undefined, undefined, undefined],
  //   [undefined, undefined, undefined, undefined],
  //   [
  //     { division: "LEFT_RIGHT" },
  //     { division: "LEFT_RIGHT" },
  //     { division: "LEFT_RIGHT" },
  //     { division: "BOT_LEFT_TOP", isEmitter: true },
  //   ],
  //   [undefined, undefined, undefined, undefined],
  // ],
  // LEFT: [
  //   [undefined, undefined, undefined, undefined],
  //   [undefined, undefined, undefined, undefined],
  //   [
  //     { division: "LEFT_RIGHT" },
  //     { division: "LEFT_RIGHT" },
  //     { division: "LEFT_RIGHT" },
  //     { division: "BOT_LEFT_TOP", isEmitter: true },
  //   ],
  //   [undefined, undefined, undefined, undefined],
  // ],
  // TOP: [
  //   [undefined, undefined, undefined, undefined],
  //   [undefined, undefined, undefined, undefined],
  //   [
  //     { division: "LEFT_RIGHT" },
  //     { division: "LEFT_RIGHT" },
  //     { division: "LEFT_RIGHT" },
  //     { division: "BOT_LEFT_TOP", isEmitter: true },
  //   ],
  //   [undefined, undefined, undefined, undefined],
  // ],
  // BOT: [
  //   [undefined, undefined, undefined, undefined],
  //   [undefined, undefined, undefined, undefined],
  //   [
  //     { division: "LEFT_RIGHT" },
  //     { division: "LEFT_RIGHT" },
  //     { division: "LEFT_RIGHT" },
  //     { division: "BOT_LEFT_TOP", isEmitter: true },
  //   ],
  //   [undefined, undefined, undefined, undefined],
  // ],
});

function animate(time: number) {
  renderer.render(window.scene, camera);
}
renderer.setAnimationLoop(animate);

const gui = new dat.GUI();
const options = {
  cubeX: 0,
};
gui.add(options, "cubeX", 0, 5).onChange(function (e) {
  cube.mesh.position.x = e;
});
