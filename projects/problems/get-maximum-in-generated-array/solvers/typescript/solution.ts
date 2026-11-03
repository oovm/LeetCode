export class Solution {
    getMaximumGenerated(n: number): number {
        if (n === 0) {
            return 0;
        }
        const arr = new Array<number>(n + 1).fill(0);
        arr[1] = 1;
        let max = 1;
        for (let i = 2; i <= n; i++) {
            arr[i] = i % 2 === 0 ? (arr[i / 2] as number) : (arr[(i - 1) / 2] as number) + (arr[(i + 1) / 2] as number);
            max = Math.max(max, arr[i] as number);
        }
        return max;
    }
}
