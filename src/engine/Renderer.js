
import * as THREE from "three";
import { SCENE_CONFIG } from "../config/scene.config.js";

export class Renderer {

    constructor(container) {

        this.instance = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        });

        this.instance.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                SCENE_CONFIG.maxPixelRatio
            )
        );

        this.instance.setSize(
            window.innerWidth,
            window.innerHeight
        );

        container.appendChild(this.instance.domElement);
    }

    render(scene, camera) {
        this.instance.render(scene, camera);
    }

    resize() {

        this.instance.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }

    dispose() {
        this.instance.dispose();
        this.instance.domElement.remove();
    }
}
