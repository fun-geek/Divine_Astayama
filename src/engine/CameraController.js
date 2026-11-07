
import * as THREE from "three";
import { SCENE_CONFIG } from "../config/scene.config.js";

export class CameraController {

    constructor() {

        const config = SCENE_CONFIG.camera;

        this.camera = new THREE.PerspectiveCamera(
            config.fov,
            window.innerWidth / window.innerHeight,
            config.near,
            config.far
        );

        this.camera.position.set(
            config.position.x,
            config.position.y,
            config.position.z
        );
    }

    resize() {

        this.camera.aspect =
            window.innerWidth / window.innerHeight;

        this.camera.updateProjectionMatrix();
    }
}
