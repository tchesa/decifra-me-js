import { CubeSetup } from "../Cube";

const stage0: CubeSetup = {
  FRONT: [
    [undefined, { division: "TOP_BOT", isStatic: true }, undefined, undefined],
    [undefined, { division: "TOP_BOT" }, undefined, undefined],
    [
      { division: "TOP_RIGHT", isStatic: true, isEmitter: true },
      { division: "LEFT_TOP_RIGHT" },
      { division: "BOT_LEFT" },
      undefined,
    ],
    [undefined, undefined, { division: "TOP_BOT" }, undefined],
  ],
  RIGHT: [
    [undefined, undefined, undefined, undefined],
    [
      undefined,
      { division: "LEFT_RIGHT", isStatic: true },
      { division: "LEFT_RIGHT", isStatic: true },
      { division: "LEFT_RIGHT" },
    ],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  BACK: [
    [undefined, { division: "TOP_BOT" }, undefined, undefined],
    [
      { division: "LEFT_RIGHT" },
      { division: "LEFT_TOP" },
      undefined,
      undefined,
    ],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
  LEFT: [
    [
      undefined,
      { division: "LEFT_RIGHT", isStatic: true },
      { division: "BOT_LEFT" },
      undefined,
    ],
    [undefined, undefined, { division: "TOP_BOT" }, undefined],
    [undefined, { division: "RIGHT_BOT" }, { division: "LEFT_TOP" }, undefined],
    [undefined, { division: "TOP_BOT" }, undefined, undefined],
  ],
  TOP: [
    [undefined, undefined, { division: "TOP_BOT", isStatic: true }, undefined],
    [
      undefined,
      { division: "RIGHT_BOT" },
      { division: "BOT_LEFT_TOP" },
      undefined,
    ],
    [
      undefined,
      { division: "TOP_RIGHT_BOT" },
      { division: "LEFT_TOP" },
      undefined,
    ],
    [undefined, { division: "TOP_BOT", isStatic: true }, undefined, undefined],
  ],
  BOT: [
    [undefined, undefined, { division: "TOP_BOT", isStatic: true }, undefined],
    [undefined, undefined, { division: "TOP_RIGHT" }, { division: "BOT_LEFT" }],
    [
      { division: "LEFT_RIGHT", isStatic: true },
      { division: "LEFT_RIGHT" },
      { division: "LEFT_RIGHT" },
      { division: "LEFT_TOP" },
    ],
    [undefined, undefined, undefined, undefined],
  ],
};

export default stage0;
