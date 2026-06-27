import sharp from "sharp";
import { GIFEncoder, quantize, applyPalette } from "gifenc";

export type AnimationPreset =
  | "pulse"
  | "fadeLoop"
  | "slideReveal"
  | "subtleRotate"
  | "ringPulse"
  | "zoomLoop";

const FRAME_COUNT = 12;
const FRAME_DELAY = 80;

async function loadImageBuffer(input: Buffer | string): Promise<Buffer> {
  if (typeof input === "string") {
    const response = await fetch(input);
    return Buffer.from(await response.arrayBuffer());
  }
  return input;
}

async function createFrame(
  sourceBuffer: Buffer,
  width: number,
  height: number,
  frameIndex: number,
  preset: AnimationPreset,
  isProfile: boolean
): Promise<Buffer> {
  const progress = frameIndex / FRAME_COUNT;
  const angle = Math.sin(progress * Math.PI * 2) * 3;

  let pipeline = sharp(sourceBuffer).resize(width, height, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  switch (preset) {
    case "pulse":
    case "zoomLoop": {
      const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.08;
      const newW = Math.round(width * scale);
      const newH = Math.round(height * scale);
      pipeline = sharp(sourceBuffer)
        .resize(newW, newH, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .extend({
          top: Math.floor((height - newH) / 2),
          bottom: Math.ceil((height - newH) / 2),
          left: Math.floor((width - newW) / 2),
          right: Math.ceil((width - newW) / 2),
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        });
      break;
    }
    case "fadeLoop": {
      const opacity = 0.7 + Math.sin(progress * Math.PI * 2) * 0.3;
      pipeline = pipeline.ensureAlpha().modulate({ brightness: opacity });
      break;
    }
    case "slideReveal": {
      const offset = Math.round(Math.sin(progress * Math.PI * 2) * 10);
      pipeline = pipeline.extend({
        left: Math.max(0, offset),
        right: Math.max(0, -offset),
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      }).resize(width, height);
      break;
    }
    case "subtleRotate": {
      pipeline = pipeline.rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
      break;
    }
    case "ringPulse": {
      if (isProfile) {
        const ringWidth = 2 + Math.round(Math.sin(progress * Math.PI * 2) * 3);
        pipeline = pipeline
          .resize(width - ringWidth * 2, height - ringWidth * 2, {
            fit: "cover",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .extend({
            top: ringWidth,
            bottom: ringWidth,
            left: ringWidth,
            right: ringWidth,
            background: { r: 37, g: 99, b: 235, alpha: 255 },
          });
      }
      break;
    }
  }

  return pipeline.png().toBuffer();
}

export async function buildAnimatedGif(
  input: Buffer | string,
  preset: AnimationPreset,
  options: { width?: number; height?: number; isProfile?: boolean } = {}
): Promise<Buffer> {
  const width = options.width ?? (options.isProfile ? 160 : 240);
  const height = options.height ?? (options.isProfile ? 160 : 80);
  const isProfile = options.isProfile ?? false;

  const sourceBuffer = await loadImageBuffer(input);
  const frames: Buffer[] = [];

  for (let i = 0; i < FRAME_COUNT; i++) {
    frames.push(await createFrame(sourceBuffer, width, height, i, preset, isProfile));
  }

  const firstFrameData = await sharp(frames[0])
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = firstFrameData;
  const palette = quantize(data, 256);
  const gif = GIFEncoder();

  for (const frame of frames) {
    const { data: frameData, info: frameInfo } = await sharp(frame)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const index = applyPalette(frameData, palette);
    gif.writeFrame(index, frameInfo.width, frameInfo.height, {
      palette,
      delay: FRAME_DELAY,
      dispose: 2,
    });
  }

  gif.finish();
  return Buffer.from(gif.bytes());
}

export async function optimizeGif(gifBuffer: Buffer, maxSizeKb = 150): Promise<Buffer> {
  if (gifBuffer.length <= maxSizeKb * 1024) return gifBuffer;

  const metadata = await sharp(gifBuffer, { animated: true }).metadata();
  const scale = Math.sqrt((maxSizeKb * 1024) / gifBuffer.length);
  const newWidth = Math.round((metadata.width ?? 240) * scale);

  return sharp(gifBuffer, { animated: true })
    .resize(newWidth)
    .gif()
    .toBuffer();
}
