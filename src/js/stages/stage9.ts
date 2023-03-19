import { CubeSetup } from "../Cube";

const stage9: CubeSetup = {
  FRONT: [
    [
      { division: "RIGHT_BOT_LEFT", isStatic: true, isEmitter: true },
      { division: "TOP_RIGHT", color: "GREEN", isStatic: true },
      { division: "LEFT_TOP", color: "GREEN", isStatic: true },
      { division: "TOP_BOT" },
    ],
    [
      { division: "TOP_BOT" },
      undefined,
      { division: "RIGHT_BOT" },
      { division: "LEFT_TOP" },
    ],
    [
      { division: "TOP_RIGHT" },
      { division: "LEFT_RIGHT" },
      { division: "LEFT_TOP" },
      undefined,
    ],
    [
      {
        division: "TOP_BOT_LEFT_RIGHT",
        color: "BLUE",
        isEmitter: true,
        isStatic: true,
      },
      { division: "LEFT_RIGHT", color: "ORANGE" },
      { division: "LEFT_RIGHT", color: "PURPLE" },
      { division: "LEFT_RIGHT", color: "GREEN" },
    ],
  ],
  RIGHT: [
    [undefined, undefined, undefined, undefined],
    [
      { division: "RIGHT_BOT", color: "PURPLE" },
      { division: "LEFT_RIGHT", color: "ORANGE", isStatic: true },
      { division: "LEFT_RIGHT", color: "GREEN" },
      { division: "BOT_LEFT", color: "GREEN", isStatic: true },
    ],
    [
      { division: "TOP_BOT", color: "PURPLE", isStatic: true },
      { division: "RIGHT_BOT", color: "PURPLE" },
      { division: "LEFT_RIGHT", color: "ORANGE" },
      { division: "LEFT_TOP", color: "GREEN" },
    ],
    [
      { division: "LEFT_TOP", color: "GREEN" },
      { division: "TOP_BOT", color: "ORANGE" },
      undefined,
      undefined,
    ],
  ],
  BACK: [
    [
      undefined,
      { division: "RIGHT_BOT", color: "PURPLE" },
      { division: "LEFT_RIGHT", color: "BLUE" },
      { division: "BOT_LEFT", color: "GREEN" },
    ],
    [
      undefined,
      { division: "TOP_BOT", color: "ORANGE", isStatic: true },
      undefined,
      { division: "TOP_BOT", color: "PURPLE" },
    ],
    [
      { division: "RIGHT_BOT", color: "GREEN" },
      { division: "LEFT_TOP_RIGHT", color: "BLUE" },
      { division: "BOT_LEFT", color: "GREEN" },
      { division: "TOP_BOT", color: "ORANGE", isStatic: true },
    ],
    [
      { division: "TOP_BOT", color: "ORANGE" },
      undefined,
      { division: "TOP_RIGHT", color: "PURPLE" },
      { division: "LEFT_TOP", color: "BLUE", isStatic: true },
    ],
  ],
  LEFT: [
    [
      undefined,
      undefined,
      { division: "TOP_BOT", color: "GREEN", isStatic: true },
      { division: "TOP_BOT" },
    ],
    [
      { division: "TOP_BOT", color: "PURPLE", isStatic: true },
      undefined,
      { division: "TOP_BOT", color: "GREEN" },
      { division: "TOP_BOT" },
    ],
    [
      { division: "TOP_BOT", color: "PURPLE" },
      undefined,
      { division: "TOP_BOT", color: "GREEN", isStatic: true },
      { division: "TOP_BOT" },
    ],
    [
      { division: "TOP_RIGHT_BOT", color: "PURPLE" },
      { division: "LEFT_RIGHT", color: "PURPLE" },
      { division: "LEFT_TOP_RIGHT", color: "GREEN" },
      { division: "LEFT_TOP" },
    ],
  ],
  TOP: [
    [
      undefined,
      {
        division: "LEFT_RIGHT",
        color: "GREEN",
        isEmitter: true,
        isStatic: true,
      },
      { division: "LEFT_RIGHT" },
      { division: "BOT_LEFT" },
    ],
    [undefined, undefined, undefined, { division: "TOP_BOT", isStatic: true }],
    [
      { division: "LEFT_RIGHT" },
      { division: "LEFT_RIGHT" },
      { division: "LEFT_RIGHT" },
      { division: "BOT_LEFT_TOP" },
    ],
    [
      { division: "LEFT_RIGHT", color: "GREEN" },
      { division: "BOT_LEFT", color: "GREEN" },
      { division: "TOP_BOT", color: "PURPLE", isStatic: true, isEmitter: true },
      { division: "TOP_BOT" },
    ],
  ],
  BOT: [
    [
      { division: "RIGHT_BOT", color: "GREEN" },
      { division: "RIGHT_BOT_LEFT", color: "GREEN" },
      { division: "LEFT_RIGHT", color: "PURPLE", isStatic: true },
      { division: "BOT_LEFT", color: "PURPLE" },
    ],
    [
      undefined,
      { division: "TOP_BOT", color: "GREEN" },
      undefined,
      { division: "TOP_RIGHT", color: "GREEN" },
    ],
    [
      undefined,
      { division: "TOP_BOT", color: "PURPLE", isStatic: true },
      undefined,
      undefined,
    ],
    [
      { division: "LEFT_RIGHT", color: "PURPLE" },
      { division: "LEFT_TOP_RIGHT", color: "PURPLE" },
      { division: "LEFT_RIGHT", color: "PURPLE" },
      {
        division: "BOT_LEFT",
        color: "ORANGE",
        isStatic: true,
        isEmitter: true,
      },
    ],
  ],
};

export default stage9;
