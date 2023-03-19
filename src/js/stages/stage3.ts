import { CubeSetup } from "../Cube";

const stage3: CubeSetup = {
  FRONT: [
    [undefined, undefined, undefined, undefined],
    [
      undefined,
      { division: "RIGHT_BOT" },
      { division: "LEFT_RIGHT", isStatic: true },
      { division: "BOT_LEFT" },
    ],
    [
      { division: "LEFT_RIGHT", isStatic: true, isEmitter: true },
      { division: "BOT_LEFT_TOP" },
      undefined,
      { division: "TOP_BOT" },
    ],
    [
      undefined,
      { division: "TOP_RIGHT" },
      { division: "LEFT_RIGHT", isStatic: true },
      { division: "LEFT_TOP" },
    ],
  ],
};

export default stage3;
