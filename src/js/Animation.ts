import { Euler, Object3D, Vector3 } from "three";

// https://easings.net/
type TimingFunction =
  | "linear"
  // | "easeInSine"
  // | "easeOutSine"
  // | "easeInOutSine"
  // | "easeInQuad"
  // | "easeOutQuad"
  // | "easeInOutQuad"
  // | "easeInCubic"
  | "easeOutCubic";
// | "easeInOutCubic"
// | "easeInQuart"
// | "easeOutQuart"
// | "easeInOutQuart"
// | "easeInQuint"
// | "easeOutQuint"
// | "easeInOutQuint"
// | "easeInExpo"
// | "easeOutExpo"
// | "easeInOutExpo"
// | "easeInCirc"
// | "easeOutCirc"
// | "easeInOutCirc"
// | "easeInBack"
// | "easeOutBack"
// | "easeInOutBack"
// | "easeInElastic"
// | "easeOutElastic"
// | "easeInOutElastic"
// | "easeInBounce"
// | "easeOutBounce"
// | "easeInOutBounce";

type EaseFunction = (x: number) => number;

const linear: EaseFunction = (x) => x;
const easeOutCubic: EaseFunction = (x) => 1 - Math.pow(1 - x, 3);

const calculateProgress = (start: number, now: number, duration: number) =>
  (now - start) / duration;

const ease: { [timingFunction in TimingFunction]: EaseFunction } = {
  linear,
  easeOutCubic,
};

export default interface Animation {
  run(time: number): boolean;
}

export class PositionAnimation implements Animation {
  private mesh: Object3D;
  private from: Vector3;
  private to: Vector3;
  private duration: number;
  private start: number;
  private timingFunction: TimingFunction;

  constructor(
    mesh: Object3D,
    to: Vector3,
    duration: number,
    timingFunction: TimingFunction = "linear"
  ) {
    this.mesh = mesh;
    this.from = mesh.position.clone();
    this.to = to;
    this.duration = duration;
    this.start = window.time;
    this.timingFunction = timingFunction;
  }

  run(time: number): boolean {
    const progress = calculateProgress(this.start, time, this.duration);

    if (progress >= 1) {
      this.mesh.position.set(this.to.x, this.to.y, this.to.z);
      return true;
    }

    const easeProgress = ease[this.timingFunction](progress);

    this.mesh.position.set(
      this.from.x + (this.to.x - this.from.x) * easeProgress,
      this.from.y + (this.to.y - this.from.y) * easeProgress,
      this.from.z + (this.to.z - this.from.z) * easeProgress
    );

    return false;
  }
}

export class RotationAnimation implements Animation {
  mesh: Object3D;
  private from: Euler;
  to: Euler;
  duration: number;
  private start: number;
  private timingFunction: TimingFunction;

  constructor(
    mesh: Object3D,
    to: Euler,
    duration: number,
    timingFunction: TimingFunction = "linear"
  ) {
    this.mesh = mesh;
    this.from = mesh.rotation.clone();
    this.to = to;
    this.duration = duration;
    this.start = window.time;
    this.timingFunction = timingFunction;
  }

  run(time: number): boolean {
    const progress = calculateProgress(this.start, time, this.duration);

    if (progress >= 1) {
      this.mesh.rotation.set(this.to.x, this.to.y, this.to.z, this.to.order);
      return true;
    }

    const easeProgress = ease[this.timingFunction](progress);

    this.mesh.rotation.set(
      this.from.x + (this.to.x - this.from.x) * easeProgress,
      this.from.y + (this.to.y - this.from.y) * easeProgress,
      this.from.z + (this.to.z - this.from.z) * easeProgress,
      this.to.order
    );

    return false;
  }
}
