import {
  BufferGeometry,
  Euler,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  OrthographicCamera,
  Raycaster,
  Scene,
  Shape,
  ShapeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
// import * as dat from "dat.gui";
import Cube, { CubeSetup, CUBE_MESH_NAME } from "./Cube";
import Block, { BLOCK_MESH_NAME } from "./Block";
import { GRID_MESH_NAME, GRID_SIZE } from "./Grid";
import { getGlobalUp } from "./utils";
import { clamp } from "three/src/math/MathUtils";
import { RotationAnimation } from "./Animation";

import stage1 from "./stages/stage1";
import stage2 from "./stages/stage2";
import stage3 from "./stages/stage3";
import stage4 from "./stages/stage4";
import stage5 from "./stages/stage5";
import stage6 from "./stages/stage6";
import stage7 from "./stages/stage7";
import stage8 from "./stages/stage8";
import stage9 from "./stages/stage9";

const stages: CubeSetup[] = [
  stage1,
  stage2,
  stage3,
  stage4,
  stage5,
  stage6,
  stage7,
  stage8,
  stage9,
];

const renderer = new WebGLRenderer();
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.scene = new Scene();
window.animations = [];
window.time = 0;

const camera = new OrthographicCamera(
  -6,
  6,
  6 * (window.innerHeight / window.innerWidth),
  -6 * (window.innerHeight / window.innerWidth),
  0.3,
  1000
);
camera.rotateZ(Math.PI / 4);
camera.position.z = 5;

const $blocksLeft = document.createElement("span");
$blocksLeft.id = "blocks-left";
$blocksLeft.innerHTML = `Blocks left: --`;
document.body.appendChild($blocksLeft);

// directional light
// const directionalLight = new DirectionalLight("white", 0.5);
// directionalLight.position.set(0, 0, 1);
// window.scene.add(directionalLight);

let cube = new Cube(stage1);
cube.shuffleAll();

const updateBlocksLeft = (eletrifiedCount: number) => {
  const blocksLeft = cube.blockCount - eletrifiedCount;

  const formattedNumber = blocksLeft >= 10 ? `${blocksLeft}` : `0${blocksLeft}`;

  $blocksLeft.innerHTML = `Blocks left: ${formattedNumber}`;
};

updateBlocksLeft(cube.checkEletrified());

const mousePosition = new Vector2();
let dragging: Object3D | undefined;
let draggingInitialPosition = new Vector3();
let pointerOffset = new Vector3();
let rotating = false;
let verticalRotation = false;
let rotationInitialPoint = new Vector2();
let cubeInitialRotation = new Euler();

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

  if (dragging) {
    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObjects(window.scene.children, false);
    const intersectedCube = intersects.find(
      (intersect) => intersect.object.name === CUBE_MESH_NAME
    );
    if (intersectedCube) {
      const hit = intersectedCube.point;
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
  } else if (rotating) {
    const offset = new Vector2(
      mousePosition.x - rotationInitialPoint.x,
      mousePosition.y - rotationInitialPoint.y
    );
    const rotationScale = 2;

    cube.mesh.rotation.set(
      cubeInitialRotation.x,
      cubeInitialRotation.y,
      cubeInitialRotation.z,
      cubeInitialRotation.order
    );
    if (verticalRotation) {
      cube.mesh.rotateOnWorldAxis(
        new Vector3(1, 0, 0),
        -offset.y * rotationScale
      );
    } else {
      cube.mesh.rotateOnWorldAxis(
        new Vector3(0, 1, 0),
        offset.x * rotationScale
      );
    }
  }
});

window.addEventListener("mousedown", function () {
  raycaster.setFromCamera(mousePosition, camera);
  const intersects = raycaster.intersectObjects(window.scene.children);
  // console.log(
  //   `${
  //     intersects.filter(
  //       (intersect) => intersect.object.name === BLOCK_MESH_NAME
  //     ).length
  //   } block(s) detected`
  // );

  const allowRotate =
    cube.grids.RIGHT ||
    cube.grids.LEFT ||
    cube.grids.TOP ||
    cube.grids.BOT ||
    cube.grids.BACK;

  const blockIntersection = intersects.find(
    (intersect) => intersect.object.name === BLOCK_MESH_NAME
  );

  const triangleIntersection = intersects.find(
    (intersect) =>
      intersect.object.name === Triangle.VERTICAL ||
      intersect.object.name === Triangle.HORIZONTAL
  );

  const gridIntersection = intersects.find(
    (intersect) => intersect.object.name === GRID_MESH_NAME
  );

  if (blockIntersection) {
    if (
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
      const hit = gridIntersection!.point;
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
  } else if (triangleIntersection && allowRotate) {
    const hit = triangleIntersection.point;
    rotating = true;
    verticalRotation = triangleIntersection.object.name === Triangle.VERTICAL;
    rotationInitialPoint.set(mousePosition.x, mousePosition.y);
    cubeInitialRotation = cube.mesh.rotation.clone();
  }
});

window.addEventListener("mouseup", function () {
  if (dragging && Block.map[dragging.uuid]) {
    Block.map[dragging.uuid].toggleSelected(false);
    Block.map[dragging!.uuid].snapPosition();
    const [a, b, c, d] = Block.map[dragging!.uuid].grid.getBlockMovementRange(
      Block.map[dragging!.uuid].row,
      Block.map[dragging!.uuid].column
    );
    // console.log(
    //   Block.map[dragging!.uuid].row,
    //   Block.map[dragging!.uuid].column
    // );
    // console.log(a, b, c, d);
    updateBlocksLeft(cube.checkEletrified());
  } else if (rotating) {
    // cube.mesh.rotation.set(
    //   (Math.round((cube.mesh.rotation.x / Math.PI) * 2) / 2) * Math.PI,
    //   (Math.round((cube.mesh.rotation.y / Math.PI) * 2) / 2) * Math.PI,
    //   (Math.round((cube.mesh.rotation.z / Math.PI) * 2) / 2) * Math.PI,
    //   cubeInitialRotation.order
    // );
    this.window.animations.push(
      new RotationAnimation(
        cube.mesh,
        new Euler(
          (Math.round((cube.mesh.rotation.x / Math.PI) * 2) / 2) * Math.PI,
          (Math.round((cube.mesh.rotation.y / Math.PI) * 2) / 2) * Math.PI,
          (Math.round((cube.mesh.rotation.z / Math.PI) * 2) / 2) * Math.PI,
          cubeInitialRotation.order
        ),
        300,
        "easeOutCubic"
      )
    );
  }

  dragging = undefined;
  rotating = false;
});

const raycaster = new Raycaster();

// let drag = undefined

// cube margin
const cubeMargin = 0.05;
const bufferGeometry = new BufferGeometry();
const geometry = bufferGeometry.setFromPoints([
  new Vector3(-GRID_SIZE / 2 - cubeMargin, -GRID_SIZE / 2 - cubeMargin, 2),
  new Vector3(GRID_SIZE / 2 + cubeMargin, -GRID_SIZE / 2 - cubeMargin, 2),
  new Vector3(GRID_SIZE / 2 + cubeMargin, GRID_SIZE / 2 + cubeMargin, 2),
  new Vector3(-GRID_SIZE / 2 - cubeMargin, GRID_SIZE / 2 + cubeMargin, 2),
  new Vector3(-GRID_SIZE / 2 - cubeMargin, -GRID_SIZE / 2 - cubeMargin, 2),
]);
window.scene.add(new Line(geometry, new LineBasicMaterial({ color: "gray" })));

const triangleScale = 5;

enum Triangle {
  HORIZONTAL = "TRIANGLE_HORIZONTAL",
  VERTICAL = "TRIANGLE_VERTICAL",
}

const rightTriangleShape = new Shape();
rightTriangleShape.moveTo(0, 0);
rightTriangleShape.lineTo(2 * triangleScale, -2 * triangleScale);
rightTriangleShape.lineTo(2 * triangleScale, 2 * triangleScale);

const rightTriangleGeometry = new ShapeGeometry(rightTriangleShape);
const triangleMaterial = new MeshBasicMaterial({
  color: "pink",
  wireframe: true,
  transparent: true,
  opacity: 0,
});
const rightTriangle = new Mesh(rightTriangleGeometry, triangleMaterial);
rightTriangle.name = Triangle.HORIZONTAL;
window.scene.add(rightTriangle);

const leftTriangleShape = new Shape();
leftTriangleShape.moveTo(0, 0);
leftTriangleShape.lineTo(-2 * triangleScale, -2 * triangleScale);
leftTriangleShape.lineTo(-2 * triangleScale, 2 * triangleScale);

const leftTriangleGeometry = new ShapeGeometry(leftTriangleShape);
const leftTriangle = new Mesh(leftTriangleGeometry, triangleMaterial);
leftTriangle.name = Triangle.HORIZONTAL;
window.scene.add(leftTriangle);

const topTriangleShape = new Shape();
topTriangleShape.moveTo(0, 0);
topTriangleShape.lineTo(2 * triangleScale, 2 * triangleScale);
topTriangleShape.lineTo(-2 * triangleScale, 2 * triangleScale);

const topTriangleGeometry = new ShapeGeometry(topTriangleShape);
const topTriangle = new Mesh(topTriangleGeometry, triangleMaterial);
topTriangle.name = Triangle.VERTICAL;
window.scene.add(topTriangle);

const bottomTriangleShape = new Shape();
bottomTriangleShape.moveTo(0, 0);
bottomTriangleShape.lineTo(2 * triangleScale, -2 * triangleScale);
bottomTriangleShape.lineTo(-2 * triangleScale, -2 * triangleScale);

const bottomTriangleGeometry = new ShapeGeometry(bottomTriangleShape);
const bottomTriangle = new Mesh(bottomTriangleGeometry, triangleMaterial);
bottomTriangle.name = Triangle.VERTICAL;
window.scene.add(bottomTriangle);

function animate(time: number) {
  window.time = time;

  // console.log(window.animations);
  window.animations = (window.animations || []).filter(
    (animation) => !animation.run(time)
  );

  renderer.render(window.scene, camera);
}

renderer.setAnimationLoop(animate);

const onSelectStage = (stage: CubeSetup) => () => {
  Block.clearAll();
  window.scene.remove(cube.mesh);
  cube = new Cube(stage);
  cube.shuffleAll();
  updateBlocksLeft(cube.checkEletrified());
};

const $ul = document.createElement("ul");
$ul.classList.add("stage-list");

stages.forEach((stage, i) => {
  const $li = document.createElement("li");
  const $button = document.createElement("button");
  $button.type = "button";
  $button.innerHTML = `Stage ${i + 1}`;
  $button.onclick = onSelectStage(stage);
  $li.appendChild($button);
  $ul.appendChild($li);
});

document.body.appendChild($ul);

// const gui = new dat.GUI();
// const options = {
//   cubeX: 0,
//   cubeY: 0,
// };
// gui.add(options, "cubeX", 0, 2).onChange(function (e) {
//   cube.mesh.rotation.x = e * Math.PI;
// });
// gui.add(options, "cubeY", 0, 2).onChange(function (e) {
//   cube.mesh.rotation.y = e * Math.PI;
// });
