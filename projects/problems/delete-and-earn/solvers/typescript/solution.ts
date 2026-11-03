export class Solution {
    deleteAndEarn(nums: number[]): number {
        let max = 0;
        for (const x of nums) if (x > max) max = x;
        const counts = new Array<number>(max + 1).fill(0);
        for (const x of nums) counts[x]++;
        let take = 0;
        let skip = 0;
        for (let v = 0; v <= max; v++) {
            const nextTake = skip + v * counts[v];
            const nextSkip = Math.max(skip, take);
            take = nextTake;
            skip = nextSkip;
        }
        return Math.max(take, skip);
    }
}
