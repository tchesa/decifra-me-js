import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import Block, {
  BlockOptions,
  BOT_DIVISIONS,
  LEFT_DIVISIONS,
  RIGHT_DIVISIONS,
  TOP_DIVISIONS,
} from "./Block";
import Grid, { FixedGrid, GRID_SIZE } from "./Grid";
import { multifaceConnectionHelper } from "./utils";

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

      // top
      if (TOP_DIVISIONS.includes(current.division)) {
        const topBlock =
          current.row > 0
            ? this.grids[current.grid.face]!.blockGrid[current.row - 1][
                current.column
              ]
            : this.grids[
                multifaceConnectionHelper[current.grid.face][current.row][
                  current.column
                ]!.TOP![0]
              ]?.blockGrid[
                multifaceConnectionHelper[current.grid.face][current.row][
                  current.column
                ]!.TOP![1]
              ][
                multifaceConnectionHelper[current.grid.face][current.row][
                  current.column
                ]!.TOP![2]
              ];

        const neighbourAllowedDivisions =
          current.row > 0
            ? BOT_DIVISIONS
            : multifaceConnectionHelper[current.grid.face][current.row][
                current.column
              ]!.TOP![3];

        if (
          topBlock &&
          !visited[topBlock.mesh.uuid] &&
          neighbourAllowedDivisions.includes(topBlock.division)
        ) {
          topBlock.setEletrified(true);
          // eletrifiedCount++
          visited[topBlock.mesh.uuid] = true;
          queue.push(topBlock);
        }
      }

      // bottom
      if (BOT_DIVISIONS.includes(current.division)) {
        const botBlock =
          current.row < GRID_SIZE - 1
            ? this.grids[current.grid.face]!.blockGrid[current.row + 1][
                current.column
              ]
            : this.grids[
                multifaceConnectionHelper[current.grid.face][current.row][
                  current.column
                ]!.BOT![0]
              ]?.blockGrid[
                multifaceConnectionHelper[current.grid.face][current.row][
                  current.column
                ]!.BOT![1]
              ][
                multifaceConnectionHelper[current.grid.face][current.row][
                  current.column
                ]!.BOT![2]
              ];

        const neighbourAllowedDivisions =
          current.row < GRID_SIZE - 1
            ? TOP_DIVISIONS
            : multifaceConnectionHelper[current.grid.face][current.row][
                current.column
              ]!.BOT![3];

        if (
          botBlock &&
          !visited[botBlock.mesh.uuid] &&
          neighbourAllowedDivisions.includes(botBlock.division)
        ) {
          botBlock.setEletrified(true);
          // eletrifiedCount++
          visited[botBlock.mesh.uuid] = true;
          queue.push(botBlock);
        }
      }

      // left
      if (LEFT_DIVISIONS.includes(current.division)) {
        const leftBlock =
          current.column > 0
            ? this.grids[current.grid.face]!.blockGrid[current.row][
                current.column - 1
              ]
            : this.grids[
                multifaceConnectionHelper[current.grid.face][current.row][
                  current.column
                ]!.LEFT![0]
              ]?.blockGrid[
                multifaceConnectionHelper[current.grid.face][current.row][
                  current.column
                ]!.LEFT![1]
              ][
                multifaceConnectionHelper[current.grid.face][current.row][
                  current.column
                ]!.LEFT![2]
              ];

        const neighbourAllowedDivisions =
          current.column > 0
            ? RIGHT_DIVISIONS
            : multifaceConnectionHelper[current.grid.face][current.row][
                current.column
              ]!.LEFT![3];

        if (
          leftBlock &&
          !visited[leftBlock.mesh.uuid] &&
          neighbourAllowedDivisions.includes(leftBlock.division)
        ) {
          leftBlock.setEletrified(true);
          // eletrifiedCount++
          visited[leftBlock.mesh.uuid] = true;
          queue.push(leftBlock);
        }
      }

      // right
      if (RIGHT_DIVISIONS.includes(current.division)) {
        const rightBlock =
          current.column < GRID_SIZE - 1
            ? this.grids[current.grid.face]!.blockGrid[current.row][
                current.column + 1
              ]
            : this.grids[
                multifaceConnectionHelper[current.grid.face][current.row][
                  current.column
                ]!.RIGHT![0]
              ]?.blockGrid[
                multifaceConnectionHelper[current.grid.face][current.row][
                  current.column
                ]!.RIGHT![1]
              ][
                multifaceConnectionHelper[current.grid.face][current.row][
                  current.column
                ]!.RIGHT![2]
              ];

        const neighbourAllowedDivisions =
          current.column < GRID_SIZE - 1
            ? LEFT_DIVISIONS
            : multifaceConnectionHelper[current.grid.face][current.row][
                current.column
              ]!.RIGHT![3];

        if (
          rightBlock &&
          !visited[rightBlock.mesh.uuid] &&
          neighbourAllowedDivisions.includes(rightBlock.division)
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
