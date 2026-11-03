export class Solution {
    minimumOperations(num: string): number {
        const n = num.length;
        let best = num.includes('0') ? n - 1 : n;
        for (const [d1, d2] of [
            ['0', '0'],
            ['2', '5'],
            ['5', '0'],
            ['7', '5'],
        ]) {
            let cost = 0;
            let i = n - 1;
            while (i >= 0 && num[i] !== d2) {
                i -= 1;
                cost += 1;
            }
            let j = i - 1;
            while (j >= 0 && num[j] !== d1) {
                j -= 1;
                cost += 1;
            }
            if (i >= 0 && j >= 0) {
                best = Math.min(best, cost);
            }
        }
        return best;
    }
}
