import path from "node:path";
import fs from "node:fs/promises";
import sharp, { FormatEnum } from "sharp";

type ImageMetadata = {
	width: number;
	height: number;
	format: keyof FormatEnum;
	size: number;
	src: string;
};

export async function getImageMetadata(src: string): Promise<ImageMetadata> {
	const imagePath = path.join(path.resolve("public"), src);

	const [{ width, height, format }, size] = await Promise.all([
		sharp(imagePath).metadata(),
		fs.readFile(imagePath).then((buffer) => new File([buffer], "image").size),
	]);

	if (width === undefined || height === undefined) {
		throw new Error(`Could not read width and/or height from ${imagePath}`);
	}

	if (format === undefined) {
		throw new Error(`Could not determine the image format from ${imagePath}`);
	}

	return {
		width,
		height,
		format,
		size,
		src,
	};
}
