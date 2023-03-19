import { BlockColor } from "../Block";
import { CubeSetup } from "../Cube";

const color1: BlockColor = "BLUE";
const color2: BlockColor = "GREEN";
const color3: BlockColor = "YELLOW";

const stage8: CubeSetup = {
  FRONT: [
    [
      undefined,
      { division: "RIGHT_BOT", color: color3 },
      { division: "BOT_LEFT", color: color3 },
      undefined,
    ],
    [
      { division: "LEFT_RIGHT", color: color3, isStatic: true },
      { division: "LEFT_TOP", color: color3 },
      { division: "TOP_BOT_LEFT_RIGHT", isStatic: true },
      { division: "LEFT_RIGHT" },
    ],
    [
      { division: "RIGHT_BOT" },
      { division: "RIGHT_BOT_LEFT" },
      { division: "BOT_LEFT_TOP" },
      undefined,
    ],
    [
      { division: "TOP_BOT_LEFT_RIGHT", isEmitter: true, isStatic: true },
      { division: "LEFT_TOP_RIGHT" },
      { division: "LEFT_TOP" },
      undefined,
    ],
  ],
  RIGHT: [
    [
      undefined,
      undefined,
      undefined,
      { division: "BOT_LEFT", isEmitter: true, color: color2, isStatic: true },
    ],
    [
      { division: "LEFT_RIGHT" },
      { division: "BOT_LEFT_TOP" },
      { division: "LEFT_RIGHT", isStatic: true, color: color2 },
      { division: "BOT_LEFT_TOP", color: color1 },
    ],
    [
      { division: "RIGHT_BOT" },
      { division: "LEFT_TOP" },
      undefined,
      { division: "TOP_BOT", color: color1 },
    ],
    [
      { division: "TOP_RIGHT" },
      {
        division: "LEFT_RIGHT",
        color: color3,
        isEmitter: true,
        isStatic: true,
      },
      { division: "LEFT_RIGHT", color: color1 },
      { division: "LEFT_TOP", color: color1 },
    ],
  ],
  BACK: [
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  LEFT: [
    [undefined, undefined, undefined, undefined],
    [
      {
        division: "TOP_BOT_LEFT_RIGHT",
        color: color1,
        isEmitter: true,
        isStatic: true,
      },
      { division: "TOP_BOT", color: color2, isStatic: true },
      { division: "RIGHT_BOT", color: color3 },
      { division: "LEFT_RIGHT", color: color3 },
    ],
    [
      { division: "TOP_RIGHT", color: color3 },
      { division: "LEFT_TOP_RIGHT", color: color3 },
      { division: "LEFT_TOP", color: color3 },
      undefined,
    ],
    [undefined, undefined, undefined, undefined],
  ],
  TOP: [
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  BOT: [
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
};

export default stage8;
