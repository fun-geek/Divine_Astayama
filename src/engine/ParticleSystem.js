
import * as THREE from "three";

import { PARTICLE_CONFIG } from "../config/particle.config.js";

export class ParticleSystem {

    constructor(scene) {

        this.scene = scene;

        this.count = PARTICLE_CONFIG.count;

        // Particle data
        this.positions = new Float32Array(this.count * 3);
        this.velocities = new Float32Array(this.count * 3);
        this.colors = new Float32Array(this.count * 3);

        // Formation targets
        this.faceTargets = null;
        this.fullTargets = null;

        // Formation colors
        this.faceColors = null;
        this.fullColors = null;

        // Animation state
        this.mix = 0;
        this.destination = 0;

        this.ready = false;

        this.initializeParticles();
        this.createGeometry();
    }

    // ----------------------------------
    // 1. INITIALIZE PARTICLES
    // ----------------------------------

    initializeParticles() {

        for (let i = 0; i < this.count; i++) {

            const index = i * 3;

            // Random starting positions
            this.positions[index] =
                (Math.random() - 0.5) * 130;

            this.positions[index + 1] =
                (Math.random() - 0.5) * 100;

            this.positions[index + 2] =
                (Math.random() - 0.5) * 30;

            // Initial velocity
            this.velocities[index] = 0;
            this.velocities[index + 1] = 0;
            this.velocities[index + 2] = 0;

            // Initial golden color
            this.colors[index] = 1.0;
            this.colors[index + 1] = 0.72;
            this.colors[index + 2] = 0.30;
        }
    }

    // ----------------------------------
    // 2. CREATE GLOW TEXTURE
    // ----------------------------------

    createParticleTexture() {

        const canvas = document.createElement("canvas");

        canvas.width = 64;
        canvas.height = 64;

        const context = canvas.getContext("2d");

        const gradient = context.createRadialGradient(
            32, 32, 0,
            32, 32, 32
        );

        gradient.addColorStop(
            0,
            "rgba(255,255,255,1)"
        );

        gradient.addColorStop(
            0.3,
            "rgba(255,255,255,0.85)"
        );

        gradient.addColorStop(
            0.65,
            "rgba(255,255,255,0.3)"
        );

        gradient.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        context.fillStyle = gradient;

        context.fillRect(0, 0, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);

        texture.colorSpace = THREE.SRGBColorSpace;

        return texture;
    }

    // ----------------------------------
    // 3. CREATE PARTICLE GEOMETRY
    // ----------------------------------

    createGeometry() {

        this.geometry = new THREE.BufferGeometry();

        this.geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(this.positions, 3)
        );

        this.geometry.setAttribute(
            "color",
            new THREE.BufferAttribute(this.colors, 3)
        );

        this.particleTexture = this.createParticleTexture();

        this.material = new THREE.PointsMaterial({

            size: PARTICLE_CONFIG.size,

            map: this.particleTexture,

            vertexColors: true,

            transparent: true,

            opacity: 0.95,

            blending: THREE.NormalBlending,

            depthWrite: false,

            sizeAttenuation: true
        });

        this.points = new THREE.Points(
            this.geometry,
            this.material
        );

        this.points.frustumCulled = false;

        this.scene.add(this.points);
    }

    // ----------------------------------
    // 4. LOAD IMAGE FORMATIONS
    // ----------------------------------

    setFormations(data) {

        if (
            !data.faceTargets ||
            !data.fullTargets ||
            !data.faceColors ||
            !data.fullColors
        ) {
            throw new Error(
                "Invalid particle formation data."
            );
        }

        const expectedLength = this.count * 3;

        const arrays = [
            data.faceTargets,
            data.fullTargets,
            data.faceColors,
            data.fullColors
        ];

        for (const array of arrays) {

            if (array.length !== expectedLength) {

                throw new Error(
                    "Particle formation size does not match particle count."
                );
            }
        }

        this.faceTargets = data.faceTargets;
        this.fullTargets = data.fullTargets;

        this.faceColors = data.faceColors;
        this.fullColors = data.fullColors;

        // Begin with face formation colors
        this.colors.set(this.faceColors);

        this.geometry.attributes.color.needsUpdate = true;

        this.mix = 0;
        this.destination = 0;

        this.ready = true;

        console.log(
            "Particle formations successfully loaded."
        );
    }

    // ----------------------------------
    // 5. CHANGE FORMATION
    // ----------------------------------

    setFormation(type) {

        if (!this.ready) {

            console.warn(
                "Particle formations are not ready."
            );

            return;
        }

        if (type === "face") {

            this.destination = 0;

        } else if (type === "full") {

            this.destination = 1;

        } else {

            console.warn(
                "Unknown formation:",
                type
            );
        }
    }

    // ----------------------------------
    // 6. UPDATE PARTICLE PHYSICS
    // ----------------------------------

    update(deltaTime = 1 / 60) {

        if (!this.ready) return;

        const attraction = PARTICLE_CONFIG.attraction;

        const damping = Math.pow(
            PARTICLE_CONFIG.damping,
            deltaTime * 60
        );

        // Smooth formation transition
        this.mix += (
            this.destination - this.mix
        ) * Math.min(1, deltaTime * 1.5);

        for (let i = 0; i < this.count; i++) {

            const index = i * 3;

            for (let axis = 0; axis < 3; axis++) {

                // Calculate interpolated position
                const target = THREE.MathUtils.lerp(
                    this.faceTargets[index + axis],
                    this.fullTargets[index + axis],
                    this.mix
                );

                // Calculate interpolated color
                const targetColor = THREE.MathUtils.lerp(
                    this.faceColors[index + axis],
                    this.fullColors[index + axis],
                    this.mix
                );

                // Spring attraction
                const difference =
                    target - this.positions[index + axis];

                this.velocities[index + axis] +=
                    difference *
                    attraction *
                    deltaTime * 60;

                // Friction / damping
                this.velocities[index + axis] *= damping;

                // Update position
                this.positions[index + axis] +=
                    this.velocities[index + axis] *
                    deltaTime * 60;

                // Smooth RGB transition
                this.colors[index + axis] +=
                    (
                        targetColor -
                        this.colors[index + axis]
                    ) *
                    Math.min(1, deltaTime * 3);
            }
        }

        // Notify Three.js that GPU attributes changed
        this.geometry.attributes.position.needsUpdate = true;

        this.geometry.attributes.color.needsUpdate = true;
    }

    // ----------------------------------
    // 7. CLEANUP
    // ----------------------------------

    dispose() {

        if (!this.points) return;

        this.scene.remove(this.points);

        this.geometry.dispose();

        this.material.dispose();

        this.particleTexture.dispose();

        this.ready = false;
    }
}
