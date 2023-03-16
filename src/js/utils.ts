import { Object3D, Quaternion, Vector3 } from "three";

export const getGlobalUp = (object: Object3D): Vector3 => {
  let position = new Vector3();
  let quaternion = new Quaternion();
  let scale = new Vector3();

  object.matrixWorld.decompose(position, quaternion, scale);
  const globalUp = new Vector3(0, 1, 0).applyQuaternion(quaternion).normalize();

  return globalUp;
};
