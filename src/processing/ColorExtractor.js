
export class ColorExtractor {

    static extract(samples) {

        const colors = new Float32Array(
            samples.length * 3
        );

        samples.forEach((pixel, i) => {

            const index = i * 3;

            colors[index] = pixel.r / 255;
            colors[index + 1] = pixel.g / 255;
            colors[index + 2] = pixel.b / 255;

        });

        return colors;
    }
}
