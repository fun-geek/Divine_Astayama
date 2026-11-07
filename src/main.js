
import * as THREE from "three";

import { ImageProcessor } from "./processing/ImageProcessor.js";

import "./style.css";

const app = document.getElementById("app");

const PARTICLE_COUNT = 18000;

let renderer;
let animationId;

async function initialize() {

    // -------------------------------
    // SCENE
    // -------------------------------

    const scene = new THREE.Scene();

    scene.background = new THREE.Color("#020108");

    // -------------------------------
    // CAMERA
    // -------------------------------

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.z = 100;

    // -------------------------------
    // RENDERER
    // -------------------------------

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    app.replaceChildren(renderer.domElement);

    // -------------------------------
    // LOAD IMAGE
    // -------------------------------

    const processor = new ImageProcessor(PARTICLE_COUNT);

    const formations = await processor.process(
        "/assets/ma.jpg"
    );

    // -------------------------------
    // PARTICLE ARRAYS
    // -------------------------------

    const positions = new Float32Array(PARTICLE_COUNT * 3);

    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    const colors = new Float32Array(PARTICLE_COUNT * 3);

    // Begin with scattered particles
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {

        positions[i] = (Math.random() - 0.5) * 120;

        velocities[i] = 0;

        colors[i] = 1;
    }

    // -------------------------------
    // GEOMETRY
    // -------------------------------

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
    );

    // -------------------------------
    // PARTICLE MATERIAL
    // -------------------------------

   const material = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    blending: THREE.NormalBlending,
    depthWrite: false,
    sizeAttenuation: true
});

    const particles = new THREE.Points(
        geometry,
        material
    );

    particles.frustumCulled = false;

    scene.add(particles);

    // -------------------------------
    // FORMATION STATE
    // -------------------------------

    let currentFormation = "face";

    let transition = 0;

    let destination = 0;

    function setFormation(type) {

        if (type === "face") {
            destination = 0;
            currentFormation = "face";
        }

        if (type === "full") {
            destination = 1;
            currentFormation = "full";
        }

        console.log("Formation:", currentFormation);
    }

    // Keyboard controls
    window.addEventListener("keydown", (event) => {

        if (event.key === "1") setFormation("face");

        if (event.key === "2") setFormation("full");
    });

    // -------------------------------
    // ANIMATION
    // -------------------------------

    const clock = new THREE.Clock();

    function animate() {

        animationId = requestAnimationFrame(animate);

        const delta = Math.min(clock.getDelta(), 0.05);

        const elapsed = clock.elapsedTime;

        transition += (
            destination - transition
        ) * Math.min(1, delta * 1.5);

        const attraction = 0.018;

        const damping = Math.pow(0.92, delta * 60);

        for (let i = 0; i < PARTICLE_COUNT; i++) {

            const index = i * 3;

            for (let axis = 0; axis < 3; axis++) {

                const target = THREE.MathUtils.lerp(
                    formations.faceTargets[index + axis],
                    formations.fullTargets[index + axis],
                    transition
                );

                const targetColor = THREE.MathUtils.lerp(
                    formations.faceColors[index + axis],
                    formations.fullColors[index + axis],
                    transition
                );

                const difference =
                    target - positions[index + axis];

                velocities[index + axis] +=
                    difference * attraction * delta * 60;

                velocities[index + axis] *= damping;

                positions[index + axis] +=
                    velocities[index + axis] * delta * 60;

                colors[index + axis] +=
                    (targetColor - colors[index + axis]) *
                    Math.min(1, delta * 4);
            }
        }

        geometry.attributes.position.needsUpdate = true;

        geometry.attributes.color.needsUpdate = true;

        particles.rotation.z =
            Math.sin(elapsed * 0.2) * 0.008;

        renderer.render(scene, camera);
    }

    animate();

    // Start with face, then show complete idol
    setTimeout(() => setFormation("full"), 10000);

    // -------------------------------
    // RESIZE
    // -------------------------------

    window.addEventListener("resize", () => {

        camera.aspect =
            window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    });

    console.log("Divine Dots image integration complete!");

    console.log("Press 1 = Face | Press 2 = Full Idol");

}

initialize().catch(error => {

    console.error("Divine Dots failed:", error);

    const message = document.createElement("pre");

    message.style.cssText = `
        position: fixed;
        inset: 15px;
        color: white;
        background: #300000;
        padding: 20px;
        white-space: pre-wrap;
        overflow: auto;
        z-index: 999999;
    `;

    message.textContent = error.stack || String(error);

    app.replaceChildren(message);
});
