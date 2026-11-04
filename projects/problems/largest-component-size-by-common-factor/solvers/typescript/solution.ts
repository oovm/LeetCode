export class Solution {
    largestComponentSize(nums: number[]): number {
        const n = nums.length;
        const parent = new Array<number>(n);
        const size = new Array<number>(n).fill(1);
        for (let i = 0; i < n; i++) parent[i] = i;
        const find = (x: number): number => {
            while (parent[x] !== x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        };
        const union = (a: number, b: number): void => {
            const rootA = find(a);
            const rootB = find(b);
            if (rootA !== rootB) {
                parent[rootA] = rootB;
                size[rootB] += size[rootA];
            }
        };
        const owner = new Map<number, number>();
        for (let i = 0; i < n; i++) {
            let rest = nums[i];
            let divisor = 2;
            while (divisor * divisor <= rest) {
                if (rest % divisor === 0) {
                    if (owner.has(divisor)) union(owner.get(divisor) as number, i);
                    else owner.set(divisor, i);
                    while (rest % divisor === 0) rest /= divisor;
                }
                divisor++;
            }
            if (rest > 1) {
                if (owner.has(rest)) union(owner.get(rest) as number, i);
                else owner.set(rest, i);
            }
        }
        let best = 0;
        for (let i = 0; i < n; i++) {
            if (find(i) === i) best = Math.max(best, size[i]);
        }
        return best;
    }
}
