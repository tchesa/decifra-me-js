import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import Cube from "./Cube";
import { BLOCK_MESH_NAME } from "./Block";
import { GRID_SIZE } from "./Grid";
import { getGlobalUp } from "./utils";

// import texture1 from "../textures/1.png";
// import bg from "../textures/bg.jpeg";

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
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

// const orbit = new OrbitControls(camera, renderer.domElement);
// orbit.update();

// const axesHelper = new THREE.AxesHelper(5);
// window.scene.add(axesHelper);

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
  RIGHT: [
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
  BACK: [
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
  LEFT: [
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
  TOP: [
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
  BOT: [
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
});

const mousePosition = new THREE.Vector2();
let dragging: THREE.Object3D | undefined;
let draggingInitialPosition = new THREE.Vector3();
let pointerOffset = new THREE.Vector3();

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

  if (dragging) {
    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObjects(window.scene.children, false);
    if (intersects.length > 0) {
      const hit = intersects[0].point;
      const gridTransformPosition = dragging.parent!.getWorldPosition(
        new THREE.Vector3()
      );
      // const gridRight = new THREE.Vector3(-1, 0, 0);

      const up = getGlobalUp(dragging.parent!);
      const pointerLocalPosition = new THREE.Vector3(
        (gridTransformPosition.x - hit.x / GRID_SIZE) * -up.y +
          (gridTransformPosition.y - hit.y / GRID_SIZE) * up.x -
          pointerOffset.x,
        (gridTransformPosition.y - hit.y / GRID_SIZE) * -up.y +
          (gridTransformPosition.x - hit.x / GRID_SIZE) * -up.x -
          pointerOffset.y,
        0
      );

      const horizontal =
        Math.abs(draggingInitialPosition.x - pointerLocalPosition.x) >
        Math.abs(draggingInitialPosition.y - pointerLocalPosition.y);

      dragging.position.set(
        horizontal ? pointerLocalPosition.x : draggingInitialPosition.x,
        horizontal ? draggingInitialPosition.y : pointerLocalPosition.y,
        0
      );
    }
  }
});

window.addEventListener("mousedown", function (e) {
  // console.log(mousePosition);
  raycaster.setFromCamera(mousePosition, camera);
  const intersects = raycaster.intersectObjects(window.scene.children);
  console.log(
    `${
      intersects.filter(
        (intersect) => intersect.object.name === BLOCK_MESH_NAME
      ).length
    } block(s) detected`
  );
  const blockIntersection = intersects.find(
    (intersect) => intersect.object.name === BLOCK_MESH_NAME
  );

  if (blockIntersection) {
    dragging = blockIntersection.object;
    draggingInitialPosition.set(
      dragging.position.x,
      dragging.position.y,
      dragging.position.z
    );

    const gridTransformPosition = dragging.parent!.getWorldPosition(
      new THREE.Vector3()
    );
    const hit = intersects[0].point;
    const up = getGlobalUp(dragging.parent!);

    const pointerLocalPosition = new THREE.Vector3(
      (gridTransformPosition.x - hit.x / GRID_SIZE) * -up.y +
        (gridTransformPosition.y - hit.y / GRID_SIZE) * up.x,
      (gridTransformPosition.y - hit.y / GRID_SIZE) * -up.y +
        (gridTransformPosition.x - hit.x / GRID_SIZE) * -up.x,
      0
    );

    pointerOffset = new THREE.Vector3(
      pointerLocalPosition.x - dragging.position.x,
      pointerLocalPosition.y - dragging.position.y,
      0
    );
  }
});

window.addEventListener("mouseup", function (e) {
  dragging = undefined;
});

const raycaster = new THREE.Raycaster();

// let drag = undefined

function animate(time: number) {
  renderer.render(window.scene, camera);
}
renderer.setAnimationLoop(animate);

const gui = new dat.GUI();
const options = {
  cubeX: 0,
  cubeY: 0,
};
gui.add(options, "cubeX", 0, 2).onChange(function (e) {
  cube.mesh.rotation.x = e * Math.PI;
});
gui.add(options, "cubeY", 0, 2).onChange(function (e) {
  cube.mesh.rotation.y = e * Math.PI;
});
