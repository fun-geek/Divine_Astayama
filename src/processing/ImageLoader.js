
export class ImageLoader {

    static async load(path) {

        const image = new Image();

        image.src = path;

        try {
            await image.decode();
        } catch {
            throw new Error(
                `Unable to load image: ${path}`
            );
        }

        console.log(
            `Loaded image: ${image.width} × ${image.height}`
        );

        return image;
    }
}
