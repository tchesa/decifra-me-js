import { Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader } from "three";
import Block, { BlockOptions } from "./Block";
import Cube, { CubeFace } from "./Cube";
import arrow from "../textures/arrow.webp";

export const GRID_SIZE = 4;
export const GRID_MESH_NAME = "GRID";
const textureLoader = new TextureLoader();

const positionByCubeFace: { [face in CubeFace]: [number, number, number] } = {
  FRONT: [0, 0, 0.5],
  RIGHT: [0.5, 0, 0],
  BACK: [0, 0, -0.5],
  LEFT: [-0.5, 0, 0],
  TOP: [0, 0.5, 0],
  BOT: [0, -0.5, 0],
};

const rotationByCubeFace: { [face in CubeFace]: [number, number, number] } = {
  FRONT: [0, 0, 0],
  RIGHT: [0, 0.5 * Math.PI, 0],
  BACK: [0, Math.PI, 0],
  LEFT: [0, -0.5 * Math.PI, 0],
  TOP: [-0.5 * Math.PI, 0, 0],
  BOT: [0.5 * Math.PI, 0, 0],
};

export type FixedGrid<T> = [
  [T | undefined, T | undefined, T | undefined, T | undefined],
  [T | undefined, T | undefined, T | undefined, T | undefined],
  [T | undefined, T | undefined, T | undefined, T | undefined],
  [T | undefined, T | undefined, T | undefined, T | undefined]
];

export type GridSetup = {
  grid: FixedGrid<BlockOptions>;
  face: CubeFace;
  cube: Cube;
};

export default class Grid {
  blockGrid: FixedGrid<Block>;
  face: CubeFace;
  mesh: Mesh;
  cube: Cube;
  blockList: Array<Block> = [];

  constructor(setup: GridSetup) {
    this.face = setup.face;

    const planeGeometry = new PlaneGeometry();
    const planeMaterial = new MeshBasicMaterial({
      color: "yellow",
      // wireframe: true,
      transparent: true,
      opacity: 0,
      // map: textureLoader.load(arrow),
    });
    const plane = new Mesh(planeGeometry, planeMaterial);
    // plane.scale.set(GRID_SIZE, GRID_SIZE, 1);
    plane.position.set(...positionByCubeFace[setup.face]);
    plane.rotation.set(...rotationByCubeFace[setup.face]);
    // plane.parent = setup.parent;
    // setup.parent.children.push(plane);
    plane.name = GRID_MESH_NAME;
    setup.cube.mesh.add(plane);
    this.cube = setup.cube;
    this.mesh = plane;

    this.blockGrid = [
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
    ];

    for (let i = 0; i < setup.grid.length; i++) {
      for (let j = 0; j < setup.grid[i].length; j++) {
        const blockSetup = setup.grid[i][j];

        if (blockSetup) {
          const block = new Block({
            ...blockSetup,
            row: i,
            column: j,
            grid: this,
          });
          this.blockGrid[i][j] = block;
          this.blockList.push(block);
        }
      }
    }
  }

  updateBlockPosition(
    oldRow: number,
    oldColumn: number,
    newRow: number,
    newColumn: number
  ) {
    this.blockGrid[newRow][newColumn] = this.blockGrid[oldRow][oldColumn];
    this.blockGrid[oldRow][oldColumn] = undefined;
  }
}
