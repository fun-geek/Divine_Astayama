
export class TargetGenerator {

    static generate(samples, region, worldHeight) {

        const targets = new Float32Array(
            samples.length * 3
        );

        const scale = worldHeight / region.height;

        samples.forEach((pixel, i) => {

            const index = i * 3;

            // Horizontal position
            targets[index] =
                (pixel.x - region.x - region.width / 2) * scale;

            // Vertical position (image Y is downward)
            targets[index + 1] =
                -(pixel.y - region.y - region.height / 2) * scale;

            // Small depth variation
            targets[index + 2] =
                (Math.random() - 0.5) * 1.5;

        });

        return targets;
    }
}
