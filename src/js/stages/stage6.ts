import { BlockColor } from "../Block";
import { CubeSetup } from "../Cube";

const color: BlockColor = "BLUE";

const stage6: CubeSetup = {
  FRONT: [
    [
      { division: "RIGHT_BOT", color },
      { division: "LEFT_RIGHT", color },
      { division: "LEFT_RIGHT", color },
      { division: "BOT_LEFT", color, isEmitter: true, isStatic: true },
    ],
    [
      { division: "TOP_BOT", color },
      undefined,
      undefined,
      { division: "TOP_BOT" },
    ],
    [
      { division: "LEFT_TOP", color, isStatic: true },
      undefined,
      undefined,
      { division: "TOP_BOT" },
    ],
    [
      { division: "RIGHT_BOT", isStatic: true, isEmitter: true },
      { division: "LEFT_RIGHT" },
      { division: "LEFT_RIGHT" },
      { division: "LEFT_TOP", isStatic: true },
    ],
  ],
};

export default stage6;
