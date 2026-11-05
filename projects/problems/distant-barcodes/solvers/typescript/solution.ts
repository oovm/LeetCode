export class Solution {
    rearrangeBarcodes(barcodes: number[]): number[] {
        const frequencies = new Map<number, number>();
        for (const value of barcodes) {
            frequencies.set(value, (frequencies.get(value) ?? 0) + 1);
        }
        const ordered = [...barcodes].sort((a, b) => {
            const left = frequencies.get(a)!;
            const right = frequencies.get(b)!;
            if (left !== right) {
                return right - left;
            }
            return a - b;
        });
        const result = new Array<number>(barcodes.length);
        const half = Math.floor((barcodes.length + 1) / 2);
        for (let position = 0; position < half; position++) {
            result[position * 2] = ordered[position];
        }
        for (let tail = 0; half + tail < barcodes.length; tail++) {
            result[tail * 2 + 1] = ordered[half + tail];
        }
        return result;
    }
}
