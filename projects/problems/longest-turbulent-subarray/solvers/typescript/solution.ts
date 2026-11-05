export class Solution {
    maxTurbulenceSize(arr: number[]): number {
        let best = 1;
        let run = 1;
        let previousSign = 0;
        for (let i = 1; i < arr.length; i++) {
            const difference = arr[i] - arr[i - 1];
            const sign = difference > 0 ? 1 : difference < 0 ? -1 : 0;
            if (sign === 0) {
                run = 1;
            } else if (previousSign === 0 || sign === previousSign) {
                run = 2;
            } else {
                run++;
            }
            best = Math.max(best, run);
            previousSign = sign;
        }
        return best;
    }
}
