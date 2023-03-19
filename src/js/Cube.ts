import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import Block, {
  BlockOptions,
  BOT_DIVISIONS,
  LEFT_DIVISIONS,
  RIGHT_DIVISIONS,
  TOP_DIVISIONS,
} from "./Block";
import Grid, { FixedGrid, GRID_SIZE } from "./Grid";

export type CubeFace = "FRONT" | "BACK" | "LEFT" | "RIGHT" | "TOP" | "BOT";
const cubeFaces: CubeFace[] = ["FRONT", "BACK", "LEFT", "RIGHT", "TOP", "BOT"];

export type CubeSetup = Partial<{
  [face in CubeFace]: FixedGrid<BlockOptions>;
}>;

export const CUBE_MESH_NAME = "CUBE";

export default class Cube {
  grids: Partial<{ [face in CubeFace]: Grid }>;
  mesh: Mesh;
  emitter: Block | undefined;
  blockCount: number = 0;

  constructor(setup: CubeSetup) {
    const boxGeometry = new BoxGeometry();
    const boxMaterial = new MeshBasicMaterial({
      color: "white",
      // wireframe: true,
      transparent: true,
      opacity: 0,
      // map: textureLoader.load(texture1),
    });
    const box = new Mesh(boxGeometry, boxMaterial);
    box.scale.set(GRID_SIZE, GRID_SIZE, GRID_SIZE);
    box.name = CUBE_MESH_NAME;
    this.mesh = box;
    window.scene.add(box);

    this.grids = {};
    cubeFaces.map((face) => {
      const faceSetup = setup[face];

      if (faceSetup) {
        const grid = new Grid({
          grid: faceSetup,
          face,
          cube: this,
        });
        this.grids[face] = grid;
        this.blockCount += grid.blockList.length;
        // this.mesh.children.push(grid.mesh);
        // grid.mesh.parent = this.mesh;
      }
    });

    if (!this.emitter) {
      console.warn("Emitter not found");
    }
  }

  setAllEletrified(value: boolean) {
    cubeFaces.forEach((face) => {
      this.grids[face]?.blockList.forEach((block) => {
        if (!block.isEmitter || block.color) {
          block.setEletrified(value);
        }
      });
    });
  }

  checkEletrified() {
    // let eletrifiedCount = 1
    this.setAllEletrified(false);

    const queue: Block[] = [this.emitter!];
    const visited: { [id: string]: boolean } = {
      [this.emitter!.mesh.uuid]: true,
    };

    while (queue.length > 0) {
      const [current] = queue.splice(0, 1);
      // console.log(current.row, current.column);

      // top
      if (current.row > 0 && TOP_DIVISIONS.includes(current.division)) {
        const topBlock =
          this.grids[current.grid.face]!.blockGrid[current.row - 1][
            current.column
          ];
        if (
          topBlock &&
          !visited[topBlock.mesh.uuid] &&
          BOT_DIVISIONS.includes(topBlock.division)
        ) {
          topBlock.setEletrified(true);
          // eletrifiedCount++
          visited[topBlock.mesh.uuid] = true;
          queue.push(topBlock);
        }
      }

      // bottom
      if (
        current.row < GRID_SIZE - 1 &&
        BOT_DIVISIONS.includes(current.division)
      ) {
        const botBlock =
          this.grids[current.grid.face]!.blockGrid[current.row + 1][
            current.column
          ];
        if (
          botBlock &&
          !visited[botBlock.mesh.uuid] &&
          TOP_DIVISIONS.includes(botBlock.division)
        ) {
          botBlock.setEletrified(true);
          // eletrifiedCount++
          visited[botBlock.mesh.uuid] = true;
          queue.push(botBlock);
        }
      }

      // left
      if (current.column > 0 && LEFT_DIVISIONS.includes(current.division)) {
        const leftBlock =
          this.grids[current.grid.face]!.blockGrid[current.row][
            current.column - 1
          ];
        if (
          leftBlock &&
          !visited[leftBlock.mesh.uuid] &&
          RIGHT_DIVISIONS.includes(leftBlock.division)
        ) {
          leftBlock.setEletrified(true);
          // eletrifiedCount++
          visited[leftBlock.mesh.uuid] = true;
          queue.push(leftBlock);
        }
      }

      // right
      if (
        current.column < GRID_SIZE - 1 &&
        RIGHT_DIVISIONS.includes(current.division)
      ) {
        const rightBlock =
          this.grids[current.grid.face]!.blockGrid[current.row][
            current.column + 1
          ];
        if (
          rightBlock &&
          !visited[rightBlock.mesh.uuid] &&
          LEFT_DIVISIONS.includes(rightBlock.division)
        ) {
          rightBlock.setEletrified(true);
          // eletrifiedCount++
          visited[rightBlock.mesh.uuid] = true;
          queue.push(rightBlock);
        }
      }
    }
  }
}
