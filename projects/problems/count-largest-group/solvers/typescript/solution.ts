export class Solution {
    countLargestGroup(n: number): number {
        const digitSum = (x: number): number => {
            let total = 0;
            while (x > 0) {
                total += x % 10;
                x = Math.floor(x / 10);
            }
            return total;
        };
        const counts = new Map<number, number>();
        let best = 0;
        let ans = 0;
        for (let i = 1; i <= n; i++) {
            const s = digitSum(i);
            const size = (counts.get(s) ?? 0) + 1;
            counts.set(s, size);
            if (size > best) {
                best = size;
                ans = 1;
            } else if (size === best) {
                ans++;
            }
        }
        return ans;
    }
}
