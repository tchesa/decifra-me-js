import { Scene } from "three";
import Animation from "./js/Animation";

declare module "*.png" {
  const path: string;
  export default path;
}

declare module "*.jpeg" {
  const path: string;
  export default path;
}

declare global {
  interface Window {
    scene: Scene;
    animations: Animation[];
    time: number;
  }
}
