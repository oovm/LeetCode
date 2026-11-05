export class Solution {
    longestMountain(arr: number[]): number {
        const n = arr.length;
        if (n < 3) {
            return 0;
        }
        const up = new Array<number>(n).fill(1);
        for (let index = 1; index < n; index++) {
            if (arr[index] > arr[index - 1]) {
                up[index] = up[index - 1] + 1;
            }
        }
        const down = new Array<number>(n).fill(1);
        for (let index = n - 2; index >= 0; index--) {
            if (arr[index] > arr[index + 1]) {
                down[index] = down[index + 1] + 1;
            }
        }
        let best = 0;
        for (let peak = 1; peak + 1 < n; peak++) {
            if (up[peak] > 1 && down[peak] > 1) {
                best = Math.max(best, up[peak] + down[peak] - 1);
            }
        }
        return best;
    }
}
