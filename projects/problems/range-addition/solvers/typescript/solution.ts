export class Solution {
    getModifiedArray(length: number, updates: number[][]): number[] {
        const diff = new Array<number>(length + 1).fill(0);
        for (const [start, end, inc] of updates) {
            diff[start] += inc;
            diff[end + 1] -= inc;
        }
        const result = new Array<number>(length);
        let acc = 0;
        for (let i = 0; i < length; i++) {
            acc += diff[i];
            result[i] = acc;
        }
        return result;
    }
}
