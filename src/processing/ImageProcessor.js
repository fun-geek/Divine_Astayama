
export class ImageProcessor {

    constructor(particleCount) {
        this.count = particleCount;
    }

    async loadImage(path) {

        const image = new Image();

        image.src = path;

        await image.decode();

        console.log(
            "Maa Kali image loaded:",
            image.width,
            image.height
        );

        return image;
    }

    sampleRegion(imageData, region, worldHeight) {

        const { data, width } = imageData;

        const samples = [];

        const columns = Math.ceil(
            Math.sqrt(
                this.count * region.width / region.height
            )
        );

        const rows = Math.ceil(this.count / columns);

        const cellWidth = region.width / columns;
        const cellHeight = region.height / rows;

        const scale = worldHeight / region.height;

        for (let i = 0; i < this.count; i++) {

            const column = i % columns;
            const row = Math.floor(i / columns);

            const x = Math.min(
                width - 1,
                Math.floor(
                    region.x +
                    (column + Math.random()) * cellWidth
                )
            );

            const y = Math.floor(
                region.y +
                (row + Math.random()) * cellHeight
            );

            const index = (y * width + x) * 4;

            const r = data[index] / 255;
            const g = data[index + 1] / 255;
            const b = data[index + 2] / 255;

            const targetIndex = i * 3;

            samples.push({

                position: [
                    (x - region.x - region.width / 2) * scale,
                    -(y - region.y - region.height / 2) * scale,
                    (Math.random() - 0.5) * 0.5
                ],

                color: [r, g, b]
            });
        }

        return samples;
    }

    convertToArrays(samples) {

        const positions = new Float32Array(this.count * 3);
        const colors = new Float32Array(this.count * 3);

        samples.forEach((sample, i) => {

            const index = i * 3;

            positions[index] = sample.position[0];
            positions[index + 1] = sample.position[1];
            positions[index + 2] = sample.position[2];

            colors[index] = sample.color[0];
            colors[index + 1] = sample.color[1];
            colors[index + 2] = sample.color[2];
        });

        return { positions, colors };
    }

    async process(path) {

        const image = await this.loadImage(path);

        const canvas = document.createElement("canvas");

        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext("2d", {
            willReadFrequently: true
        });

        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(
            0,
            0,
            image.width,
            image.height
        );

        // Complete photograph
        const fullRegion = {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height
        };

        // Approximate crown and face crop
        const referenceWidth = 456;
        const referenceHeight = 478;

        const sx = image.width / referenceWidth;
        const sy = image.height / referenceHeight;

        const faceRegion = {
            x: Math.round(115 * sx),
            y: Math.round(15 * sy),
            width: Math.round(235 * sx),
            height: Math.round(245 * sy)
        };

        const faceSamples = this.sampleRegion(
            imageData,
            faceRegion,
            70
        );

        const fullSamples = this.sampleRegion(
            imageData,
            fullRegion,
            85
        );

        const face = this.convertToArrays(faceSamples);
        const full = this.convertToArrays(fullSamples);

        console.log("Face formation generated:", this.count);
        console.log("Full idol formation generated:", this.count);

        return {
            faceTargets: face.positions,
            fullTargets: full.positions,

            faceColors: face.colors,
            fullColors: full.colors,

            imageWidth: image.width,
            imageHeight: image.height
        };
    }
}
