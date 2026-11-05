export class Solution {
    mctFromLeafValues(arr: number[]): number {
        const n = arr.length;
        const cost = new Array<number>(n * n).fill(0);
        const largest = new Array<number>(n * n).fill(0);
        for (let index = 0; index < n; index += 1) {
            largest[index * n + index] = arr[index];
        }
        for (let length = 2; length <= n; length += 1) {
            for (let left = 0; left + length <= n; left += 1) {
                const right = left + length - 1;
                let best = Number.MAX_SAFE_INTEGER;
                let maximum = 0;
                for (let split = left; split < right; split += 1) {
                    const candidate =
                        cost[left * n + split] +
                        cost[(split + 1) * n + right] +
                        largest[left * n + split] * largest[(split + 1) * n + right];
                    if (candidate < best) {
                        best = candidate;
                    }
                    maximum = Math.max(
                        maximum,
                        largest[left * n + split],
                        largest[(split + 1) * n + right],
                    );
                }
                cost[left * n + right] = best;
                largest[left * n + right] = maximum;
            }
        }
        return cost[n - 1];
    }
}
