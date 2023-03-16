import { Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import Grid, { GRID_SIZE } from "./Grid";

export type BlockPortDivision =
  | "TOP_BOT"
  | "LEFT_RIGHT"
  | "TOP_RIGHT"
  | "RIGHT_BOT"
  | "BOT_LEFT"
  | "LEFT_TOP"
  | "BOT_LEFT_TOP"
  | "LEFT_TOP_RIGHT"
  | "TOP_RIGHT_BOT"
  | "RIGHT_BOT_LEFT"
  | "TOP_BOT_LEFT_RIGHT";

export type BlockColor = "BLUE" | "GREEN" | "ORANGE" | "PURPLE" | "YELLOW";

export const BLOCK_MESH_NAME = "Block";

export type BlockOptions = {
  division: BlockPortDivision;
  isStatic?: boolean;
  isEmitter?: boolean;
  color?: BlockColor;
};

export type BlockSetup = BlockOptions & {
  row: number;
  column: number;
  grid: Grid;
};

export default class Block {
  division: BlockPortDivision;
  isStatic: boolean;
  isEmitter: boolean;
  isEletrified: boolean;
  color?: BlockColor;
  mesh: Mesh;
  row: number;
  column: number;
  grid: Grid;
  static map: { [uuid: string]: Block } = {};

  constructor(setup: BlockSetup) {
    const planeGeometry = new PlaneGeometry();
    const planeMaterial = new MeshBasicMaterial({
      color: "red",
      // wireframe: true,
      // map: textureLoader.load(arrow),
    });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.name = BLOCK_MESH_NAME;
    plane.scale.set(1 / GRID_SIZE, 1 / GRID_SIZE, 1);
    plane.position.set(
      (-1.5 + setup.column) / GRID_SIZE,
      (1.5 - setup.row) / GRID_SIZE,
      0
    );
    // plane.rotation.set(...rotationByCubeFace[setup.face]);
    // plane.parent = setup.parent;
    // setup.parent.children.push(plane);
    setup.grid.mesh.add(plane);
    this.mesh = plane;
    Block.map[plane.uuid] = this;

    this.division = setup.division;
    this.isStatic = setup.isStatic || false;
    this.isEmitter = setup.isEmitter || false;
    this.color = setup.color;
    this.isEletrified = Boolean(setup.isEmitter && !setup.color);
    this.row = setup.row;
    this.column = setup.column;
    this.grid = setup.grid;
  }

  getMovementBoundaries(): { x: [number, number]; y: [number, number] } {
    let minX = -1.5 / GRID_SIZE;
    let maxX = 1.5 / GRID_SIZE;
    let minY = -1.5 / GRID_SIZE;
    let maxY = 1.5 / GRID_SIZE;

    for (let i = this.column - 1; i >= 0; i--) {
      if (this.grid.blockGrid[this.row][i]) {
        minX = (-1.5 + i + 1) / GRID_SIZE;
        break;
      }
    }

    for (let i = this.column + 1; i < GRID_SIZE; i++) {
      if (this.grid.blockGrid[this.row][i]) {
        maxX = (-1.5 + i - 1) / GRID_SIZE;
        break;
      }
    }

    for (let i = this.row - 1; i >= 0; i--) {
      if (this.grid.blockGrid[i][this.column]) {
        maxY = (1.5 - i - 1) / GRID_SIZE;
        break;
      }
    }

    for (let i = this.row + 1; i < GRID_SIZE; i++) {
      if (this.grid.blockGrid[i][this.column]) {
        minY = (1.5 - i + 1) / GRID_SIZE;
        break;
      }
    }

    return {
      x: [minX, maxX],
      y: [minY, maxY],
    };
  }
}
