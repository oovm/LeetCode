export class Solution {
    isPossibleDivide(nums: number[], k: number): boolean {
        if (nums.length % k !== 0) return false;

        const counts = new Map<number, number>();
        for (const value of nums) counts.set(value, (counts.get(value) ?? 0) + 1);

        const ordered = [...nums].sort((a, b) => a - b);
        for (const value of ordered) {
            if (counts.get(value)! === 0) continue;
            for (let step = 0; step < k; step += 1) {
                const target = value + step;
                const amount = counts.get(target) ?? 0;
                if (amount === 0) return false;
                counts.set(target, amount - 1);
            }
        }
        return true;
    }
}
