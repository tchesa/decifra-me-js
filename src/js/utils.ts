import { Object3D, Quaternion, Vector3 } from "three";
import {
  BlockPortDivision,
  BOT_DIVISIONS,
  LEFT_DIVISIONS,
  RIGHT_DIVISIONS,
  TOP_DIVISIONS,
} from "./Block";
import { CubeFace } from "./Cube";

export const getGlobalUp = (object: Object3D): Vector3 => {
  let position = new Vector3();
  let quaternion = new Quaternion();
  let scale = new Vector3();

  object.matrixWorld.decompose(position, quaternion, scale);
  const globalUp = new Vector3(0, 1, 0).applyQuaternion(quaternion).normalize();

  return globalUp;
};

type MultifaceConnectionNode = Partial<{
  TOP: [CubeFace, number, number, BlockPortDivision[]];
  RIGHT: [CubeFace, number, number, BlockPortDivision[]];
  BOT: [CubeFace, number, number, BlockPortDivision[]];
  LEFT: [CubeFace, number, number, BlockPortDivision[]];
}>;

export const multifaceConnectionHelper: {
  [face in CubeFace]: [
    [
      MultifaceConnectionNode,
      MultifaceConnectionNode,
      MultifaceConnectionNode,
      MultifaceConnectionNode
    ],
    [MultifaceConnectionNode, undefined, undefined, MultifaceConnectionNode],
    [MultifaceConnectionNode, undefined, undefined, MultifaceConnectionNode],
    [
      MultifaceConnectionNode,
      MultifaceConnectionNode,
      MultifaceConnectionNode,
      MultifaceConnectionNode
    ]
  ];
} = {
  FRONT: [
    [
      {
        TOP: ["TOP", 3, 0, BOT_DIVISIONS],
        LEFT: ["LEFT", 0, 3, RIGHT_DIVISIONS],
      },
      { TOP: ["TOP", 3, 1, BOT_DIVISIONS] },
      { TOP: ["TOP", 3, 2, BOT_DIVISIONS] },
      {
        TOP: ["TOP", 3, 3, BOT_DIVISIONS],
        RIGHT: ["RIGHT", 0, 0, LEFT_DIVISIONS],
      },
    ],
    [
      { LEFT: ["LEFT", 1, 3, RIGHT_DIVISIONS] },
      undefined,
      undefined,
      { RIGHT: ["RIGHT", 1, 0, LEFT_DIVISIONS] },
    ],
    [
      { LEFT: ["LEFT", 2, 3, RIGHT_DIVISIONS] },
      undefined,
      undefined,
      { RIGHT: ["RIGHT", 2, 0, LEFT_DIVISIONS] },
    ],
    [
      {
        BOT: ["BOT", 0, 0, TOP_DIVISIONS],
        LEFT: ["LEFT", 3, 3, RIGHT_DIVISIONS],
      },
      { BOT: ["BOT", 0, 1, TOP_DIVISIONS] },
      { BOT: ["BOT", 0, 2, TOP_DIVISIONS] },
      {
        BOT: ["BOT", 0, 3, TOP_DIVISIONS],
        RIGHT: ["RIGHT", 3, 0, LEFT_DIVISIONS],
      },
    ],
  ],
  RIGHT: [
    [
      {
        TOP: ["TOP", 3, 3, RIGHT_DIVISIONS],
        LEFT: ["FRONT", 0, 3, RIGHT_DIVISIONS],
      },
      { TOP: ["TOP", 2, 3, RIGHT_DIVISIONS] },
      { TOP: ["TOP", 1, 3, RIGHT_DIVISIONS] },
      {
        TOP: ["TOP", 0, 3, RIGHT_DIVISIONS],
        RIGHT: ["BACK", 0, 0, LEFT_DIVISIONS],
      },
    ],
    [
      { LEFT: ["FRONT", 1, 3, RIGHT_DIVISIONS] },
      undefined,
      undefined,
      { RIGHT: ["BACK", 1, 0, LEFT_DIVISIONS] },
    ],
    [
      { LEFT: ["FRONT", 2, 3, RIGHT_DIVISIONS] },
      undefined,
      undefined,
      { RIGHT: ["BACK", 2, 0, LEFT_DIVISIONS] },
    ],
    [
      {
        BOT: ["BOT", 0, 3, RIGHT_DIVISIONS],
        LEFT: ["FRONT", 3, 3, RIGHT_DIVISIONS],
      },
      { BOT: ["BOT", 1, 3, RIGHT_DIVISIONS] },
      { BOT: ["BOT", 2, 3, RIGHT_DIVISIONS] },
      {
        BOT: ["BOT", 3, 3, RIGHT_DIVISIONS],
        RIGHT: ["BACK", 3, 0, LEFT_DIVISIONS],
      },
    ],
  ],
  BACK: [
    [
      {
        TOP: ["TOP", 0, 3, TOP_DIVISIONS],
        LEFT: ["RIGHT", 0, 3, RIGHT_DIVISIONS],
      },
      { TOP: ["TOP", 0, 2, TOP_DIVISIONS] },
      { TOP: ["TOP", 0, 1, TOP_DIVISIONS] },
      {
        TOP: ["TOP", 0, 0, TOP_DIVISIONS],
        RIGHT: ["LEFT", 0, 0, LEFT_DIVISIONS],
      },
    ],
    [
      { LEFT: ["RIGHT", 1, 3, RIGHT_DIVISIONS] },
      undefined,
      undefined,
      { RIGHT: ["LEFT", 1, 0, LEFT_DIVISIONS] },
    ],
    [
      { LEFT: ["RIGHT", 2, 3, RIGHT_DIVISIONS] },
      undefined,
      undefined,
      { RIGHT: ["LEFT", 2, 0, LEFT_DIVISIONS] },
    ],
    [
      {
        BOT: ["BOT", 3, 3, BOT_DIVISIONS],
        LEFT: ["RIGHT", 3, 3, RIGHT_DIVISIONS],
      },
      { BOT: ["BOT", 3, 2, BOT_DIVISIONS] },
      { BOT: ["BOT", 3, 1, BOT_DIVISIONS] },
      {
        BOT: ["BOT", 3, 0, BOT_DIVISIONS],
        RIGHT: ["LEFT", 3, 0, LEFT_DIVISIONS],
      },
    ],
  ],
  LEFT: [
    [
      {
        TOP: ["TOP", 0, 0, LEFT_DIVISIONS],
        LEFT: ["BACK", 0, 3, RIGHT_DIVISIONS],
      },
      { TOP: ["TOP", 1, 0, LEFT_DIVISIONS] },
      { TOP: ["TOP", 2, 0, LEFT_DIVISIONS] },
      {
        TOP: ["TOP", 3, 0, LEFT_DIVISIONS],
        RIGHT: ["FRONT", 0, 0, LEFT_DIVISIONS],
      },
    ],
    [
      { LEFT: ["BACK", 1, 3, RIGHT_DIVISIONS] },
      undefined,
      undefined,
      { RIGHT: ["FRONT", 1, 0, LEFT_DIVISIONS] },
    ],
    [
      { LEFT: ["BACK", 2, 3, RIGHT_DIVISIONS] },
      undefined,
      undefined,
      { RIGHT: ["FRONT", 2, 0, LEFT_DIVISIONS] },
    ],
    [
      {
        BOT: ["BOT", 3, 0, LEFT_DIVISIONS],
        LEFT: ["BACK", 3, 3, RIGHT_DIVISIONS],
      },
      { BOT: ["BOT", 3, 1, LEFT_DIVISIONS] },
      { BOT: ["BOT", 3, 2, LEFT_DIVISIONS] },
      {
        BOT: ["BOT", 3, 3, LEFT_DIVISIONS],
        RIGHT: ["FRONT", 3, 0, LEFT_DIVISIONS],
      },
    ],
  ],
  TOP: [
    [
      {
        TOP: ["BACK", 0, 3, TOP_DIVISIONS],
        LEFT: ["LEFT", 0, 0, TOP_DIVISIONS],
      },
      { TOP: ["BACK", 0, 2, TOP_DIVISIONS] },
      { TOP: ["BACK", 0, 1, TOP_DIVISIONS] },
      {
        TOP: ["BACK", 0, 0, TOP_DIVISIONS],
        RIGHT: ["RIGHT", 0, 3, TOP_DIVISIONS],
      },
    ],
    [
      { LEFT: ["LEFT", 0, 1, TOP_DIVISIONS] },
      undefined,
      undefined,
      { RIGHT: ["RIGHT", 0, 2, TOP_DIVISIONS] },
    ],
    [
      { LEFT: ["LEFT", 0, 2, TOP_DIVISIONS] },
      undefined,
      undefined,
      { RIGHT: ["RIGHT", 0, 1, TOP_DIVISIONS] },
    ],
    [
      {
        BOT: ["FRONT", 0, 0, TOP_DIVISIONS],
        LEFT: ["LEFT", 0, 3, TOP_DIVISIONS],
      },
      { BOT: ["FRONT", 0, 1, TOP_DIVISIONS] },
      { BOT: ["FRONT", 0, 2, TOP_DIVISIONS] },
      {
        BOT: ["FRONT", 0, 3, TOP_DIVISIONS],
        RIGHT: ["RIGHT", 0, 0, TOP_DIVISIONS],
      },
    ],
  ],
  BOT: [
    [
      {
        TOP: ["FRONT", 3, 0, BOT_DIVISIONS],
        LEFT: ["LEFT", 3, 3, BOT_DIVISIONS],
      },
      { TOP: ["FRONT", 3, 1, BOT_DIVISIONS] },
      { TOP: ["FRONT", 3, 2, BOT_DIVISIONS] },
      {
        TOP: ["FRONT", 3, 3, BOT_DIVISIONS],
        RIGHT: ["RIGHT", 3, 0, BOT_DIVISIONS],
      },
    ],
    [
      { LEFT: ["LEFT", 3, 2, BOT_DIVISIONS] },
      undefined,
      undefined,
      { RIGHT: ["RIGHT", 3, 1, BOT_DIVISIONS] },
    ],
    [
      { LEFT: ["LEFT", 3, 1, BOT_DIVISIONS] },
      undefined,
      undefined,
      { RIGHT: ["RIGHT", 3, 2, BOT_DIVISIONS] },
    ],
    [
      {
        BOT: ["BACK", 3, 3, BOT_DIVISIONS],
        LEFT: ["LEFT", 3, 0, BOT_DIVISIONS],
      },
      { BOT: ["BACK", 3, 2, BOT_DIVISIONS] },
      { BOT: ["BACK", 3, 1, BOT_DIVISIONS] },
      {
        BOT: ["BACK", 3, 0, BOT_DIVISIONS],
        RIGHT: ["RIGHT", 3, 3, BOT_DIVISIONS],
      },
    ],
  ],
};
