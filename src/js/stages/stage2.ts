import { CubeSetup } from "../Cube";

const stage2: CubeSetup = {
  FRONT: [
    [
      { division: "RIGHT_BOT", isStatic: true, isEmitter: true },
      undefined,
      { division: "BOT_LEFT" },
      undefined,
    ],
    [
      { division: "TOP_RIGHT" },
      { division: "BOT_LEFT_TOP" },
      undefined,
      undefined,
    ],
    [undefined, { division: "TOP_BOT" }, undefined, undefined],
    [
      undefined,
      { division: "TOP_RIGHT" },
      { division: "LEFT_RIGHT" },
      { division: "LEFT_RIGHT" },
    ],
  ],
};

export default stage2;
