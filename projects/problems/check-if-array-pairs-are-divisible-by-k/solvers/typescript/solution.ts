export class Solution {
    canArrange(arr: number[], k: number): boolean {
        const counts = new Map<number, number>();
        for (const value of arr) {
            const remainder = ((value % k) + k) % k;
            counts.set(remainder, (counts.get(remainder) ?? 0) + 1);
        }

        for (const [remainder, amount] of counts) {
            if (remainder === 0) {
                if (amount % 2 !== 0) return false;
            } else if (k % 2 === 0 && remainder * 2 === k) {
                if (amount % 2 !== 0) return false;
            } else if ((counts.get(k - remainder) ?? 0) !== amount) {
                return false;
            }
        }
        return true;
    }
}
