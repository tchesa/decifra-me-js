import { Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import { GRID_SIZE } from "./Grid";

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

export type BlockOptions = {
  division: BlockPortDivision;
  isStatic?: boolean;
  isEmitter?: boolean;
  color?: BlockColor;
};

export type BlockSetup = BlockOptions & {
  parent: Mesh;
  row: number;
  column: number;
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

  constructor(setup: BlockSetup) {
    const planeGeometry = new PlaneGeometry();
    const planeMaterial = new MeshBasicMaterial({
      color: "red",
      wireframe: true,
      // map: textureLoader.load(arrow),
    });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.scale.set(1 / GRID_SIZE, 1 / GRID_SIZE, 1);
    plane.position.set(
      (-1.5 + setup.column) / GRID_SIZE,
      (1.5 - setup.row) / GRID_SIZE,
      0
    );
    // plane.rotation.set(...rotationByCubeFace[setup.face]);
    // plane.parent = setup.parent;
    // setup.parent.children.push(plane);
    setup.parent.add(plane);
    this.mesh = plane;

    this.division = setup.division;
    this.isStatic = setup.isStatic || false;
    this.isEmitter = setup.isEmitter || false;
    this.color = setup.color;
    this.isEletrified = Boolean(setup.isEmitter && !setup.color);
    this.row = setup.row;
    this.column = setup.column;
  }
}
