
export class MaskDebugger {

    static show(image, mask, title = "Mask Preview") {

        // Remove previous preview
        document.getElementById("mask-debugger")?.remove();

        const panel = document.createElement("div");

        panel.id = "mask-debugger";

        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 100000;
            width: 320px;
            padding: 12px;
            background: #171717;
            border: 2px solid #d4a64a;
            border-radius: 10px;
            color: white;
            font-family: Arial;
        `;

        const heading = document.createElement("h3");

        heading.textContent = title;

        const canvas = document.createElement("canvas");

        canvas.width = image.width;
        canvas.height = image.height;

        canvas.style.width = "100%";
        canvas.style.height = "auto";

        const ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0);

        const overlay = ctx.createImageData(
            image.width,
            image.height
        );

        let selected = 0;

        for (let i = 0; i < mask.length; i++) {

            const index = i * 4;

            if (mask[i] === 1) {

                selected++;

                overlay.data[index] = 255;
                overlay.data[index + 1] = 160;
                overlay.data[index + 2] = 0;
                overlay.data[index + 3] = 120;

            } else {

                overlay.data[index + 3] = 0;
            }
        }

        ctx.putImageData(overlay, 0, 0);

        const info = document.createElement("p");

        info.textContent =
            `Selected pixels: ${selected}`;

        const close = document.createElement("button");

        close.textContent = "Close preview";

        close.onclick = () => panel.remove();

        panel.append(heading, canvas, info, close);

        document.body.appendChild(panel);

        console.log("Mask debugger displayed:", selected);
    }
}
