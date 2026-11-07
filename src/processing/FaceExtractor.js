
export class FaceExtractor {

    static getRegion(image) {

        const referenceWidth = 456;
        const referenceHeight = 478;

        const scaleX = image.width / referenceWidth;
        const scaleY = image.height / referenceHeight;

        return {

            x: Math.round(115 * scaleX),
            y: Math.round(15 * scaleY),

            width: Math.round(235 * scaleX),
            height: Math.round(245 * scaleY)
        };
    }

}

import { SubjectMask } from "./SubjectMask.js";

export class FaceExtractor {

    static getMask(image) {

        const facePolygon = [

            [220, 15],
            [255, 45],
            [275, 100],
            [300, 145],
            [310, 180],
            [290, 220],
            [260, 255],
            [190, 255],
            [155, 225],
            [130, 185],
            [140, 145],
            [165, 95],
            [185, 45]
        ];

        return SubjectMask.create(
            image,
            facePolygon
        );
    }
}
