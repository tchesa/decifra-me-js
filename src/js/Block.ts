import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3,
} from "three";
import {
  OpacityAnimation,
  PositionAnimation,
  ScaleAnimation,
} from "./Animation";
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

export const TOP_DIVISIONS: BlockPortDivision[] = [
  "TOP_BOT",
  "TOP_RIGHT",
  "LEFT_TOP",
  "BOT_LEFT_TOP",
  "LEFT_TOP_RIGHT",
  "TOP_RIGHT_BOT",
  "TOP_BOT_LEFT_RIGHT",
];

export const RIGHT_DIVISIONS: BlockPortDivision[] = [
  "LEFT_RIGHT",
  "TOP_RIGHT",
  "RIGHT_BOT",
  "LEFT_TOP_RIGHT",
  "TOP_RIGHT_BOT",
  "RIGHT_BOT_LEFT",
  "TOP_BOT_LEFT_RIGHT",
];

export const BOT_DIVISIONS: BlockPortDivision[] = [
  "TOP_BOT",
  "RIGHT_BOT",
  "BOT_LEFT",
  "TOP_RIGHT_BOT",
  "RIGHT_BOT_LEFT",
  "BOT_LEFT_TOP",
  "TOP_BOT_LEFT_RIGHT",
];

export const LEFT_DIVISIONS: BlockPortDivision[] = [
  "LEFT_RIGHT",
  "BOT_LEFT",
  "LEFT_TOP",
  "RIGHT_BOT_LEFT",
  "BOT_LEFT_TOP",
  "LEFT_TOP_RIGHT",
  "TOP_BOT_LEFT_RIGHT",
];

export type BlockColor = "BLUE" | "GREEN" | "ORANGE" | "PURPLE" | "YELLOW";

export const BLOCK_MESH_NAME = "Block";
const generalEmitterMaterial = new LineBasicMaterial({ color: "red" });
const generalLineMaterial = new LineBasicMaterial({ color: "gray" });
const backMaskMaterial = new MeshBasicMaterial({ color: "black" });

const hexColors: { [color in BlockColor]: string } = {
  BLUE: "#00b4ff",
  GREEN: "#00ff4c",
  ORANGE: "#ff7900",
  PURPLE: "#e600ff",
  YELLOW: "#fbff00",
};

const blueLineMaterial = new LineBasicMaterial({ color: hexColors.BLUE });
const greenLineMaterial = new LineBasicMaterial({ color: hexColors.GREEN });
const orangeLineMaterial = new LineBasicMaterial({ color: hexColors.ORANGE });
const purpleLineMaterial = new LineBasicMaterial({ color: hexColors.PURPLE });
const yellowLineMaterial = new LineBasicMaterial({ color: hexColors.YELLOW });

const getColorByMaterial = (
  color: BlockColor | undefined
): LineBasicMaterial => {
  switch (color) {
    case "BLUE":
      return blueLineMaterial;
    case "GREEN":
      return greenLineMaterial;
    case "ORANGE":
      return orangeLineMaterial;
    case "PURPLE":
      return purpleLineMaterial;
    case "YELLOW":
      return yellowLineMaterial;
    default:
      return generalLineMaterial;
  }
};

const generateAnimatedLineEmitterMaterial = (
  color: BlockColor | undefined
): LineBasicMaterial => {
  if (color) {
    return new LineBasicMaterial({
      color: hexColors[color],
      transparent: true,
    });
  }

  return new LineBasicMaterial({ color: "red", transparent: true });
};

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

const calculateLocalPosition = (row: number, column: number) =>
  new Vector3((-1.5 + column) / GRID_SIZE, (1.5 - row) / GRID_SIZE, 0);

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
  static colorBlocks: { [color in BlockColor]: Block[] } = {
    BLUE: [],
    GREEN: [],
    ORANGE: [],
    PURPLE: [],
    YELLOW: [],
  };
  private outerLineMaterial: LineBasicMaterial;
  private connectionLineMaterial: LineBasicMaterial;
  disabled: boolean;
  private animatedEmitterLine: Line | undefined;
  private animatedEmitterLineAnimation: number | undefined;
  private animatedEmitterLineMaterial: LineBasicMaterial | undefined;
  private animatedEmitterLineMaterialAnimation: number | undefined;

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
    const planePosition = calculateLocalPosition(setup.row, setup.column);
    plane.position.set(planePosition.x, planePosition.y, planePosition.z);
    // plane.rotation.set(...rotationByCubeFace[setup.face]);
    // plane.parent = setup.parent;
    // setup.parent.children.push(plane);
    setup.grid.mesh.add(plane);
    this.mesh = plane;
    Block.map[plane.uuid] = this;

    // const maskPlaneGeometry = new PlaneGeometry();
    const mask = new Mesh(planeGeometry, backMaskMaterial);
    mask.position.setZ(-0.001);
    mask.rotateX(Math.PI);
    plane.add(mask);

    this.division = setup.division;
    this.isStatic = setup.isStatic || false;
    this.isEmitter = setup.isEmitter || false;
    this.color = setup.color;

    if (this.color) {
      Block.colorBlocks[this.color].push(this);
    }

    this.grid = setup.grid;
    this.isEletrified = false;
    this.disabled = Boolean(setup.color && !setup.isEmitter);

    if (this.isEmitter && !this.color) {
      this.grid.cube.emitter = this;
    }

    this.connectionLineMaterial = new LineBasicMaterial({
      color: this.isEletrified ? "red" : "gray",
      transparent: true,
      opacity: this.disabled ? 0 : 1,
    });
    this.outerLineMaterial = new LineBasicMaterial({ color: "gray" });
    this.animatedEmitterLineMaterial = this.isEmitter
      ? generateAnimatedLineEmitterMaterial(this.color)
      : undefined;
    const borderLines = this.drawBorders();
    borderLines.forEach((line) => {
      this.mesh.add(line);
    });
    const connectionLines = Block.drawConnectionLines(
      this.division,
      this.connectionLineMaterial
    );
    connectionLines.forEach((line) => {
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
    // this.mesh.position.set(
    //   (-1.5 + newColumn) / GRID_SIZE,
    //   (1.5 - newRow) / GRID_SIZE,
    //   0
    // );
    window.animations.push(
      new PositionAnimation(
        this.mesh,
        new Vector3(
          (-1.5 + newColumn) / GRID_SIZE,
          (1.5 - newRow) / GRID_SIZE,
          0
        ),
        150,
        "easeOutCubic"
      )
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

    if (TOP_DIVISIONS.includes(division)) {
      const bufferGeometry = new BufferGeometry();
      const geometry = bufferGeometry.setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(0, 0.5, 0),
      ]);
      lines.push(new Line(geometry, material));
    }

    if (RIGHT_DIVISIONS.includes(division)) {
      const bufferGeometry = new BufferGeometry();
      const geometry = bufferGeometry.setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(0.5, 0, 0),
      ]);
      lines.push(new Line(geometry, material));
    }

    if (BOT_DIVISIONS.includes(division)) {
      const bufferGeometry = new BufferGeometry();
      const geometry = bufferGeometry.setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(0, -0.5, 0),
      ]);
      lines.push(new Line(geometry, material));
    }

    if (LEFT_DIVISIONS.includes(division)) {
      const bufferGeometry = new BufferGeometry();
      const geometry = bufferGeometry.setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(-0.5, 0, 0),
      ]);
      lines.push(new Line(geometry, material));
    }

    return lines;
  }

  drawBorders(): Line[] {
    const lines: Line[] = [];
    const outerBorderDistance = 0.45;
    const innerBorderDistance = 0.2;
    const staticBorderDistance = 0.2;

    const bufferGeometry = new BufferGeometry();
    const innerLineMaterial =
      this.isEmitter && !this.color
        ? generalEmitterMaterial
        : getColorByMaterial(this.color);
    const geometry = bufferGeometry.setFromPoints([
      new Vector3(-innerBorderDistance, -innerBorderDistance, 0),
      new Vector3(innerBorderDistance, -innerBorderDistance, 0),
      new Vector3(innerBorderDistance, innerBorderDistance, 0),
      new Vector3(-innerBorderDistance, innerBorderDistance, 0),
      new Vector3(-innerBorderDistance, -innerBorderDistance, 0),
    ]);
    lines.push(new Line(geometry, innerLineMaterial));

    if (this.isEmitter) {
      const geometry = new BufferGeometry().setFromPoints([
        new Vector3(-innerBorderDistance, -innerBorderDistance, 0),
        new Vector3(innerBorderDistance, -innerBorderDistance, 0),
        new Vector3(innerBorderDistance, innerBorderDistance, 0),
        new Vector3(-innerBorderDistance, innerBorderDistance, 0),
        new Vector3(-innerBorderDistance, -innerBorderDistance, 0),
      ]);
      const line = new Line(geometry, this.animatedEmitterLineMaterial);
      this.animatedEmitterLine = line;
      lines.push(line);
    }

    if (this.isStatic) {
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
      lines.push(new Line(geometry, this.outerLineMaterial));
    }

    return lines;
  }

  toggleSelected(selected: boolean) {
    this.outerLineMaterial.color.set(selected ? "white" : "gray");
  }

  setEletrified(value: boolean) {
    const wasEletrified = this.isEletrified;
    this.isEletrified = value;
    this.connectionLineMaterial.color.set(value ? "red" : "gray");

    if (this.isEmitter) {
      if (value && !wasEletrified) {
        this.animatedEmitterLine?.scale.set(1, 1, 1);
        const scaleAnimation = new ScaleAnimation(
          this.animatedEmitterLine!,
          new Vector3(1.75, 1.75, 1.75),
          750,
          "easeOutCubic",
          true
        );
        if (this.animatedEmitterLineMaterial)
          this.animatedEmitterLineMaterial.opacity = 1;
        const opacityAnimation = new OpacityAnimation(
          this.animatedEmitterLineMaterial!,
          0,
          750,
          "linear",
          true
        );

        window.animations = window.animations.filter(
          (animation) =>
            !(
              animation.id === this.animatedEmitterLineAnimation ||
              animation.id === this.animatedEmitterLineMaterialAnimation
            )
        );

        this.animatedEmitterLineAnimation = scaleAnimation.id;
        this.animatedEmitterLineMaterialAnimation = opacityAnimation.id;
        window.animations.push(scaleAnimation, opacityAnimation);
      } else if (this.color && !value && wasEletrified) {
        window.animations.forEach((animation) => {
          if (
            animation.id === this.animatedEmitterLineAnimation ||
            animation.id === this.animatedEmitterLineMaterialAnimation
          ) {
            animation.loop = false;
          }
        });
      }
    }
  }

  toggleDisabled(value: boolean) {
    this.disabled = value;
    this.connectionLineMaterial.opacity = value ? 0 : 1;
  }

  updateMeshPosiiton() {
    const newPosition = calculateLocalPosition(this.row, this.column);
    this.mesh.position.set(newPosition.x, newPosition.y, newPosition.z);
  }

  static clearAll() {
    Block.map = {};
    Block.colorBlocks = {
      BLUE: [],
      GREEN: [],
      ORANGE: [],
      PURPLE: [],
      YELLOW: [],
    };
  }
}
