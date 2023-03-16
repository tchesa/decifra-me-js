import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
} from "three";
import { BlockOptions, BlockSetup } from "./Block";
import Grid, { FixedGrid, GridSetup, GRID_SIZE } from "./Grid";

export type CubeFace = "FRONT" | "BACK" | "LEFT" | "RIGHT" | "TOP" | "BOT";
const cubeFaces: CubeFace[] = ["FRONT", "BACK", "LEFT", "RIGHT", "TOP", "BOT"];

export type CubeSetup = Partial<{
  [face in CubeFace]: FixedGrid<BlockOptions>;
}>;

export default class Cube {
  grids: Partial<{ [face in CubeFace]: Grid }>;
  mesh: Mesh;

  constructor(setup: CubeSetup) {
    const boxGeometry = new BoxGeometry();
    const boxMaterial = new MeshBasicMaterial({
      color: "white",
      wireframe: true,
      // map: textureLoader.load(texture1),
    });
    const box = new Mesh(boxGeometry, boxMaterial);
    box.scale.set(GRID_SIZE, GRID_SIZE, GRID_SIZE);
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
        // this.mesh.children.push(grid.mesh);
        // grid.mesh.parent = this.mesh;
      }
    });
  }
}
