
import * as THREE from "three";

import { Renderer } from "./Renderer.js";
import { CameraController } from "./CameraController.js";

import { SCENE_CONFIG } from "../config/scene.config.js";

export class SceneManager {

    constructor(container) {

        this.scene = new THREE.Scene();

        this.scene.background = new THREE.Color(
            SCENE_CONFIG.background
        );

        this.cameraController = new CameraController();

        this.camera = this.cameraController.camera;

        this.renderer = new Renderer(container);

        this.clock = new THREE.Clock();

        this.onResize = this.onResize.bind(this);

        window.addEventListener(
            "resize",
            this.onResize
        );
    }

    onResize() {

        this.cameraController.resize();

        this.renderer.resize();
    }

    getDeltaTime() {

        return Math.min(
            this.clock.getDelta(),
            0.05
        );
    }

    render() {

        this.renderer.render(
            this.scene,
            this.camera
        );
    }

    dispose() {

        window.removeEventListener(
            "resize",
            this.onResize
        );

        this.renderer.dispose();
    }
}
