import { Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader } from "three";
import Block, { BlockOptions } from "./Block";
import Cube, { CubeFace } from "./Cube";
import arrow from "../textures/arrow.webp";

export const GRID_SIZE = 4;
export const GRID_MESH_NAME = "GRID";
const textureLoader = new TextureLoader();
const SHUFFLE_ITERACTIONS = 20;

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
    if (oldRow === newRow && oldColumn === newColumn) return;

    this.blockGrid[newRow][newColumn] = this.blockGrid[oldRow][oldColumn];
    this.blockGrid[oldRow][oldColumn] = undefined;
  }

  getBlockMovementRange(row: number, column: number) {
    let minRow = row;
    let maxRow = row;
    let minCol = column;
    let maxCol = column;

    while (minRow > 0 && !this.blockGrid[minRow - 1][column]) minRow--;
    while (maxRow < GRID_SIZE - 1 && !this.blockGrid[maxRow + 1][column])
      maxRow++;
    while (minCol > 0 && !this.blockGrid[row][minCol - 1]) minCol--;
    while (maxCol < GRID_SIZE - 1 && !this.blockGrid[row][maxCol + 1]) maxCol++;

    return [minRow, maxRow, minCol, maxCol];
  }

  shuffle() {
    const nonStaticBlocks = this.blockList.filter((block) => !block.isStatic);
    if (nonStaticBlocks.length === 0) return;

    for (let i = 0; i < SHUFFLE_ITERACTIONS; i++) {
      const block =
        nonStaticBlocks[Math.floor(Math.random() * nonStaticBlocks.length)];

      const [minRow, maxRow, minCol, maxCol] = this.getBlockMovementRange(
        block.row,
        block.column
      );

      const horizontal =
        minRow === maxRow
          ? true
          : minCol === maxCol
          ? false
          : Math.random() < 0.5;

      const newRow = horizontal
        ? block.row
        : Math.floor(Math.random() * (maxRow - minRow + 1) + minRow);
      const newCol = horizontal
        ? Math.floor(Math.random() * (maxCol - minCol + 1) + minCol)
        : block.column;

      this.updateBlockPosition(block.row, block.column, newRow, newCol);
      block.row = newRow;
      block.column = newCol;
      block.updateMeshPosiiton();
    }
  }
}
