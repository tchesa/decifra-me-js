import { CubeSetup } from "../Cube";

const stage4: CubeSetup = {
  FRONT: [
    [undefined, undefined, undefined, { division: "TOP_BOT" }],
    [
      { division: "LEFT_RIGHT", isStatic: true },
      { division: "BOT_LEFT" },
      undefined,
      { division: "TOP_BOT" },
    ],
    [
      undefined,
      { division: "TOP_RIGHT_BOT" },
      { division: "LEFT_RIGHT" },
      { division: "LEFT_TOP" },
    ],
    [
      undefined,
      { division: "LEFT_TOP_RIGHT", isStatic: true, isEmitter: true },
      undefined,
      undefined,
    ],
  ],
  RIGHT: [
    [
      undefined,
      { division: "TOP_RIGHT", isStatic: true },
      { division: "LEFT_TOP", isStatic: true },
      undefined,
    ],
    [undefined, undefined, undefined, undefined],
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
    [
      undefined,
      { division: "RIGHT_BOT_LEFT", isStatic: true },
      undefined,
      undefined,
    ],
    [
      undefined,
      { division: "TOP_RIGHT" },
      { division: "LEFT_RIGHT" },
      { division: "LEFT_RIGHT" },
    ],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  TOP: [
    [undefined, undefined, undefined, undefined],
    [
      undefined,
      undefined,
      undefined,
      { division: "RIGHT_BOT", isStatic: true },
    ],
    [
      undefined,
      undefined,
      undefined,
      { division: "TOP_RIGHT_BOT", isStatic: true },
    ],
    [undefined, undefined, undefined, { division: "TOP_BOT", isStatic: true }],
  ],
  BOT: [
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
};

export default stage4;
