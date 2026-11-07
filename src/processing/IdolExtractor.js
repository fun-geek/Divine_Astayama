
import { SubjectMask } from "./SubjectMask.js";

export class IdolExtractor {

    static getMask(image) {

        const idolPolygon = [

            // Crown
            [220, 15],
            [255, 70],
            [285, 145],

            // Right raised arm and weapon
            [365, 65],
            [390, 115],
            [410, 180],

            // Right shoulder and lower hand
            [390, 225],
            [415, 260],
            [405, 320],
            [375, 380],

            // Lower body
            [390, 440],
            [420, 478],
            [35, 478],

            // Left lower hand
            [45, 400],
            [65, 345],
            [45, 290],

            // Left shoulder and raised arm
            [65, 230],
            [45, 175],
            [55, 135],

            // Head and crown left
            [115, 175],
            [145, 115],
            [185, 55]
        ];

        return SubjectMask.create(
            image,
            idolPolygon
        );
    }
}
