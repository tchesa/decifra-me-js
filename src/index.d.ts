import { Scene } from "three";

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
  }
}
