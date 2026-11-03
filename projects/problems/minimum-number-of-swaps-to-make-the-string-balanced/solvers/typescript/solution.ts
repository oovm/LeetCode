export class Solution {
    minSwaps(s: string): number {
        let imbalance = 0;
        let worst = 0;
        for (const ch of s) {
            imbalance += ch === ']' ? 1 : -1;
            worst = Math.max(worst, imbalance);
        }
        return Math.ceil(worst / 2);
    }
}
