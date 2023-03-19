import { CubeSetup } from "../Cube";

// const stageX: CubeSetup = {
//   FRONT: [
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//   ],
//   RIGHT: [
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//   ],
//   BACK: [
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//   ],
//   LEFT: [
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//   ],
//   TOP: [
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//   ],
//   BOT: [
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//     [undefined, undefined, undefined, undefined],
//   ],
// };

const stage1: CubeSetup = {
  FRONT: [
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [
      { division: "LEFT_RIGHT" },
      { division: "LEFT_RIGHT" },
      { division: "LEFT_RIGHT" },
      { division: "BOT_LEFT_TOP", isEmitter: true, isStatic: true },
    ],
    [undefined, undefined, undefined, undefined],
  ],
};

export default stage1;
