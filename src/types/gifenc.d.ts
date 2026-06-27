declare module "gifenc" {
  export interface GIFEncoderInstance {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      opts?: {
        palette?: number[][];
        delay?: number;
        dispose?: number;
        transparent?: boolean;
        colorDepth?: number;
      }
    ): void;
    finish(): void;
    bytes(): Uint8Array;
    bytesView(): Uint8Array;
  }

  export function GIFEncoder(opt?: { initialCapacity?: number; auto?: boolean }): GIFEncoderInstance;

  export function quantize(rgba: Uint8Array | Buffer, maxColors: number, opts?: object): number[][];
  export function applyPalette(
    rgba: Uint8Array | Buffer,
    palette: number[][],
    format?: string
  ): Uint8Array;
}
