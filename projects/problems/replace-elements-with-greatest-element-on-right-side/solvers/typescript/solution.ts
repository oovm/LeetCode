export class Solution {
    replaceElements(arr: number[]): number[] {
        const n = arr.length;
        const out = new Array(n);
        let max = -1;
        for (let i = n - 1; i >= 0; i--) {
            out[i] = max;
            max = Math.max(max, arr[i]);
        }
        return out;
    }
}
