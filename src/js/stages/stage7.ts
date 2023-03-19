import { BlockColor } from "../Block";
import { CubeSetup } from "../Cube";

const color1: BlockColor = "BLUE";
const color2: BlockColor = "GREEN";

const stage7: CubeSetup = {
  FRONT: [
    [
      undefined,
      undefined,
      { division: "TOP_BOT", color: color1, isStatic: true },
      undefined,
    ],
    [
      undefined,
      undefined,
      { division: "BOT_LEFT_TOP", isStatic: true, isEmitter: true },
      { division: "RIGHT_BOT" },
    ],
    [
      { division: "BOT_LEFT" },
      undefined,
      { division: "TOP_RIGHT_BOT" },
      { division: "LEFT_TOP" },
    ],
    [
      { division: "TOP_RIGHT" },
      { division: "LEFT_RIGHT" },
      { division: "LEFT_TOP" },
      undefined,
    ],
  ],
  RIGHT: [
    [undefined, undefined, undefined, undefined],
    [
      { division: "LEFT_RIGHT" },
      { division: "LEFT_RIGHT" },
      { division: "LEFT_RIGHT" },
      {
        division: "BOT_LEFT_TOP",
        color: color1,
        isEmitter: true,
        isStatic: true,
      },
    ],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  BACK: [
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  LEFT: [
    [undefined, undefined, undefined, undefined],
    [{ division: "TOP_BOT", color: color2 }, undefined, undefined, undefined],
    [
      { division: "TOP_BOT", color: color1, isStatic: true },
      undefined,
      { division: "RIGHT_BOT", color: color2 },
      { division: "LEFT_RIGHT", color: color2 },
    ],
    [
      { division: "TOP_RIGHT", color: color2 },
      { division: "LEFT_RIGHT", color: color2 },
      { division: "LEFT_TOP", color: color2 },
      undefined,
    ],
  ],
  TOP: [
    [undefined, undefined, undefined, undefined],
    [
      {
        division: "TOP_RIGHT_BOT",
        color: color2,
        isStatic: true,
        isEmitter: true,
      },
      { division: "LEFT_RIGHT", color: color1 },
      { division: "BOT_LEFT", color: color1 },
      undefined,
    ],
    [undefined, undefined, { division: "TOP_BOT", color: color1 }, undefined],
    [undefined, undefined, { division: "TOP_BOT", color: color1 }, undefined],
  ],
  BOT: [
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
};

export default stage7;
