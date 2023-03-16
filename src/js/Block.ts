import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3,
} from "three";
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
const generalEmitterMaterial = new LineBasicMaterial({ color: "red" });
const generalLineMaterial = new LineBasicMaterial({ color: "gray" });

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
  private outerLineMaterial: LineBasicMaterial;
  private connectionLineMaterial: LineBasicMaterial;

  constructor(setup: BlockSetup) {
    const planeGeometry = new PlaneGeometry();
    const planeMaterial = new MeshBasicMaterial({
      color: "red",
      // wireframe: true,
      transparent: true,
      opacity: 0,
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
    this.grid = setup.grid;
    this.isEletrified = Boolean(setup.isEmitter && !setup.color);

    if (this.isEmitter && !this.color) {
      this.grid.cube.emitter = this;
    }

    this.connectionLineMaterial = new LineBasicMaterial({
      color: this.isEletrified ? "red" : "gray",
    });
    const connectionLines = Block.drawConnectionLines(
      this.division,
      this.connectionLineMaterial
    );
    connectionLines.forEach((line) => {
      this.mesh.add(line);
    });
    this.outerLineMaterial = new LineBasicMaterial({ color: "gray" });
    const borderLines = Block.drawBorders(
      this.outerLineMaterial,
      this.isStatic,
      this.isEmitter
    );
    borderLines.forEach((line) => {
      this.mesh.add(line);
    });

    this.row = setup.row;
    this.column = setup.column;
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

  snapPosition() {
    const newColumn = Math.round(
      (this.mesh.position.x + 1.5 / GRID_SIZE) * GRID_SIZE
    );
    const newRow = Math.round(
      (1.5 / GRID_SIZE - this.mesh.position.y) * GRID_SIZE
    );
    this.mesh.position.set(
      (-1.5 + newColumn) / GRID_SIZE,
      (1.5 - newRow) / GRID_SIZE,
      0
    );

    if (newRow !== this.row || newColumn !== this.column) {
      this.grid.updateBlockPosition(this.row, this.column, newRow, newColumn);
      this.row = newRow;
      this.column = newColumn;
    }
  }

  static connectionLineMaterial = new LineBasicMaterial({ color: "gray" });
  static drawConnectionLines(
    division: BlockPortDivision,
    material: LineBasicMaterial
  ): Line[] {
    const lines: Line[] = [];

    if (
      division === "TOP_BOT" ||
      division === "TOP_RIGHT" ||
      division === "LEFT_TOP" ||
      division === "BOT_LEFT_TOP" ||
      division === "LEFT_TOP_RIGHT" ||
      division === "TOP_RIGHT_BOT" ||
      division === "TOP_BOT_LEFT_RIGHT"
    ) {
      const bufferGeometry = new BufferGeometry();
      const geometry = bufferGeometry.setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(0, 0.5, 0),
      ]);
      lines.push(new Line(geometry, material));
    }

    if (
      division === "LEFT_RIGHT" ||
      division === "TOP_RIGHT" ||
      division === "RIGHT_BOT" ||
      division === "LEFT_TOP_RIGHT" ||
      division === "TOP_RIGHT_BOT" ||
      division === "RIGHT_BOT_LEFT" ||
      division === "TOP_BOT_LEFT_RIGHT"
    ) {
      const bufferGeometry = new BufferGeometry();
      const geometry = bufferGeometry.setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(0.5, 0, 0),
      ]);
      lines.push(new Line(geometry, material));
    }

    if (
      division === "TOP_BOT" ||
      division === "RIGHT_BOT" ||
      division === "BOT_LEFT" ||
      division === "TOP_RIGHT_BOT" ||
      division === "RIGHT_BOT_LEFT" ||
      division === "BOT_LEFT_TOP" ||
      division === "TOP_BOT_LEFT_RIGHT"
    ) {
      const bufferGeometry = new BufferGeometry();
      const geometry = bufferGeometry.setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(0, -0.5, 0),
      ]);
      lines.push(new Line(geometry, material));
    }

    if (
      division === "LEFT_RIGHT" ||
      division === "BOT_LEFT" ||
      division === "LEFT_TOP" ||
      division === "RIGHT_BOT_LEFT" ||
      division === "BOT_LEFT_TOP" ||
      division === "LEFT_TOP_RIGHT" ||
      division === "TOP_BOT_LEFT_RIGHT"
    ) {
      const bufferGeometry = new BufferGeometry();
      const geometry = bufferGeometry.setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(-0.5, 0, 0),
      ]);
      lines.push(new Line(geometry, material));
    }

    return lines;
  }

  static drawBorders(
    outerLineMaterial: LineBasicMaterial,
    isStatic: boolean,
    isEmitter: boolean
  ): Line[] {
    const lines: Line[] = [];
    const outerBorderDistance = 0.45;
    const innerBorderDistance = 0.2;
    const staticBorderDistance = 0.2;

    const bufferGeometry = new BufferGeometry();
    const innerLineMaterial = isEmitter
      ? generalEmitterMaterial
      : generalLineMaterial;
    const geometry = bufferGeometry.setFromPoints([
      new Vector3(-innerBorderDistance, -innerBorderDistance, 0),
      new Vector3(innerBorderDistance, -innerBorderDistance, 0),
      new Vector3(innerBorderDistance, innerBorderDistance, 0),
      new Vector3(-innerBorderDistance, innerBorderDistance, 0),
      new Vector3(-innerBorderDistance, -innerBorderDistance, 0),
    ]);
    lines.push(new Line(geometry, innerLineMaterial));

    if (isStatic) {
      const geometry = new BufferGeometry().setFromPoints([
        new Vector3(
          -outerBorderDistance,
          -outerBorderDistance + staticBorderDistance,
          0
        ),
        new Vector3(-outerBorderDistance, -outerBorderDistance, 0),
        new Vector3(
          -outerBorderDistance + staticBorderDistance,
          -outerBorderDistance,
          0
        ),
      ]);
      lines.push(new Line(geometry, generalLineMaterial));

      const geometry2 = new BufferGeometry().setFromPoints([
        new Vector3(
          outerBorderDistance - staticBorderDistance,
          -outerBorderDistance,
          0
        ),
        new Vector3(outerBorderDistance, -outerBorderDistance, 0),
        new Vector3(
          outerBorderDistance,
          -outerBorderDistance + staticBorderDistance,
          0
        ),
      ]);
      lines.push(new Line(geometry2, generalLineMaterial));

      const geometry3 = new BufferGeometry().setFromPoints([
        new Vector3(
          outerBorderDistance,
          outerBorderDistance - staticBorderDistance,
          0
        ),
        new Vector3(outerBorderDistance, outerBorderDistance, 0),
        new Vector3(
          outerBorderDistance - staticBorderDistance,
          outerBorderDistance,
          0
        ),
      ]);
      lines.push(new Line(geometry3, generalLineMaterial));

      const geometry4 = new BufferGeometry().setFromPoints([
        new Vector3(
          -outerBorderDistance + staticBorderDistance,
          outerBorderDistance,
          0
        ),
        new Vector3(-outerBorderDistance, outerBorderDistance, 0),
        new Vector3(
          -outerBorderDistance,
          outerBorderDistance - staticBorderDistance,
          0
        ),
      ]);
      lines.push(new Line(geometry4, generalLineMaterial));
    } else {
      const bufferGeometry = new BufferGeometry();
      const geometry = bufferGeometry.setFromPoints([
        new Vector3(-outerBorderDistance, -outerBorderDistance, 0),
        new Vector3(outerBorderDistance, -outerBorderDistance, 0),
        new Vector3(outerBorderDistance, outerBorderDistance, 0),
        new Vector3(-outerBorderDistance, outerBorderDistance, 0),
        new Vector3(-outerBorderDistance, -outerBorderDistance, 0),
      ]);
      lines.push(new Line(geometry, outerLineMaterial));
    }

    return lines;
  }

  toggleSelected(selected: boolean) {
    this.outerLineMaterial.color.set(selected ? "white" : "gray");
  }
}
