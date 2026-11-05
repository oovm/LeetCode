export class Solution {
    prevPermOpt1(arr: number[]): number[] {
        const n = arr.length;
        const result = arr.slice();
        let i = n - 2;
        while (i >= 0 && result[i] <= result[i + 1]) {
            i--;
        }
        if (i < 0) {
            return result;
        }
        const target = result[i];
        let best = i + 1;
        for (let j = i + 2; j < n; j++) {
            if (result[j] < target && result[j] > result[best]) {
                best = j;
            }
        }
        while (best > i + 1 && result[best - 1] === result[best]) {
            best--;
        }
        [result[i], result[best]] = [result[best], result[i]];
        return result;
    }
}
