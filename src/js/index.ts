import {
  DirectionalLight,
  Object3D,
  OrthographicCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import * as dat from "dat.gui";
import Cube from "./Cube";
import Block, { BLOCK_MESH_NAME } from "./Block";
import { GRID_SIZE } from "./Grid";
import { getGlobalUp } from "./utils";
import { clamp } from "three/src/math/MathUtils";

// import texture1 from "../textures/1.png";
// import bg from "../textures/bg.jpeg";

const renderer = new WebGLRenderer();
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.scene = new Scene();

// const camera = new PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
const camera = new OrthographicCamera(
  -5,
  5,
  5 * (window.innerHeight / window.innerWidth),
  -5 * (window.innerHeight / window.innerWidth),
  0.3,
  1000
);
camera.position.z = 5;

// const textureLoader = new TextureLoader();

// const orbit = new OrbitControls(camera, renderer.domElement);
// orbit.update();

// const axesHelper = new AxesHelper(5);
// window.scene.add(axesHelper);

// directional light
const directionalLight = new DirectionalLight("white", 0.5);
directionalLight.position.set(0, 0, 1);
window.scene.add(directionalLight);

// const boxGeometry = new BoxGeometry();
// const boxMaterial = new MeshStandardMaterial({
//   color: "white",
//   // map: textureLoader.load(texture1),
// });
// const box = new Mesh(boxGeometry, boxMaterial);
// box.scale.set(4, 4, 4);
const cube = new Cube({
  FRONT: [
    [undefined, undefined, undefined, { division: "LEFT_RIGHT" }],
    [undefined, undefined, undefined, undefined],
    [
      { division: "LEFT_RIGHT" },
      { division: "LEFT_RIGHT" },
      // { division: "LEFT_RIGHT" },
      undefined,
      { division: "BOT_LEFT_TOP", isEmitter: true, isStatic: true },
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

const mousePosition = new Vector2();
let dragging: Object3D | undefined;
let draggingInitialPosition = new Vector3();
let pointerOffset = new Vector3();

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

  if (dragging) {
    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObjects(window.scene.children, false);
    if (intersects.length > 0) {
      const hit = intersects[0].point;
      const gridTransformPosition = dragging.parent!.getWorldPosition(
        new Vector3()
      );

      const up = getGlobalUp(dragging.parent!);
      const pointerLocalPosition = new Vector3(
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

      const movementBoundaries =
        Block.map[dragging.uuid].getMovementBoundaries();

      const limitedPosition = new Vector3(
        clamp(pointerLocalPosition.x, ...movementBoundaries.x),
        clamp(pointerLocalPosition.y, ...movementBoundaries.y),
        pointerLocalPosition.z
      );

      dragging.position.set(
        horizontal ? limitedPosition.x : draggingInitialPosition.x,
        horizontal ? draggingInitialPosition.y : limitedPosition.y,
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

  if (
    blockIntersection &&
    Block.map[blockIntersection.object.uuid] &&
    !Block.map[blockIntersection.object.uuid].isStatic
  ) {
    dragging = blockIntersection.object;
    Block.map[blockIntersection.object.uuid].toggleSelected(true);
    draggingInitialPosition.set(
      dragging.position.x,
      dragging.position.y,
      dragging.position.z
    );

    const gridTransformPosition = dragging.parent!.getWorldPosition(
      new Vector3()
    );
    const hit = intersects[0].point;
    const up = getGlobalUp(dragging.parent!);

    const pointerLocalPosition = new Vector3(
      (gridTransformPosition.x - hit.x / GRID_SIZE) * -up.y +
        (gridTransformPosition.y - hit.y / GRID_SIZE) * up.x,
      (gridTransformPosition.y - hit.y / GRID_SIZE) * -up.y +
        (gridTransformPosition.x - hit.x / GRID_SIZE) * -up.x,
      0
    );

    pointerOffset = new Vector3(
      pointerLocalPosition.x - dragging.position.x,
      pointerLocalPosition.y - dragging.position.y,
      0
    );
  }
});

window.addEventListener("mouseup", function (e) {
  if (dragging && Block.map[dragging.uuid]) {
    Block.map[dragging.uuid].toggleSelected(false);
    Block.map[dragging!.uuid].snapPosition();
    cube.checkEletrified();
  }

  dragging = undefined;
});

const raycaster = new Raycaster();

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
