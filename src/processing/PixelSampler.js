
export class PixelSampler {

    static sample(imageData, mask, count) {

        const { data, width, height } = imageData;

        const candidates = [];

        for (let y = 0; y < height; y++) {

            for (let x = 0; x < width; x++) {

                const pixelIndex = y * width + x;

                if (!mask[pixelIndex]) continue;

                const index = pixelIndex * 4;

                const alpha = data[index + 3];

                if (alpha < 20) continue;

                candidates.push({

                    x,
                    y,

                    r: data[index],
                    g: data[index + 1],
                    b: data[index + 2],

                    alpha
                });
            }
        }

        if (!candidates.length) {
            throw new Error("No valid foreground pixels found.");
        }

        // Shuffle candidates using Fisher-Yates
        for (let i = candidates.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [candidates[i], candidates[j]] =
                [candidates[j], candidates[i]];
        }

        const samples = [];

        // Sample without replacement
        const sampleCount = Math.min(count, candidates.length);

        for (let i = 0; i < sampleCount; i++) {
            samples.push(candidates[i]);
        }

        // If there are fewer pixels than particles,
        // repeat samples to preserve particle count.
        while (samples.length < count) {

            samples.push(
                candidates[
                    Math.floor(Math.random() * candidates.length)
                ]
            );
        }

        console.log("Foreground pixels:", candidates.length);
        console.log("Generated samples:", samples.length);

        return samples;
    }
}

