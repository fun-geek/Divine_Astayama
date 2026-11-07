
export class SubjectMask {

    static scalePolygon(points, image) {

        const scaleX = image.width / 456;
        const scaleY = image.height / 478;

        return points.map(([x, y]) => ({
            x: x * scaleX,
            y: y * scaleY
        }));
    }

    static create(image, points) {

        const canvas = document.createElement("canvas");

        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext("2d");

        const polygon = this.scalePolygon(points, image);

        context.fillStyle = "#ffffff";

        context.beginPath();

        context.moveTo(
            polygon[0].x,
            polygon[0].y
        );

        for (let i = 1; i < polygon.length; i++) {

            context.lineTo(
                polygon[i].x,
                polygon[i].y
            );
        }

        context.closePath();

        context.fill();

        const maskData = context.getImageData(
            0,
            0,
            image.width,
            image.height
        );

        const mask = new Uint8Array(
            image.width * image.height
        );

        for (let i = 0; i < mask.length; i++) {

            mask[i] = maskData.data[i * 4 + 3] > 0
                ? 1
                : 0;
        }

        return mask;
    }
}
