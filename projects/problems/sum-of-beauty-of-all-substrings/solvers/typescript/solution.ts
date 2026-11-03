export class Solution {
    beautySum(s: string): number {
        let total = 0;
        for (let i = 0; i < s.length; i++) {
            const counts = new Array<number>(26).fill(0);
            for (let j = i; j < s.length; j++) {
                counts[s.charCodeAt(j) - 97] += 1;
                let max = 0;
                let min = Infinity;
                for (const c of counts) {
                    if (c > 0) {
                        max = Math.max(max, c);
                        min = Math.min(min, c);
                    }
                }
                total += max - min;
            }
        }
        return total;
    }
}
