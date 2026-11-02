export class Solution {
    rotatedDigits(n: number): number {
        const isGood = (x: number): boolean => {
            let hasChange = false;
            while (x > 0) {
                const d = x % 10;
                if (d === 3 || d === 4 || d === 7) return false;
                if (d === 2 || d === 5 || d === 6 || d === 9) hasChange = true;
                x = Math.floor(x / 10);
            }
            return hasChange;
        };
        let count = 0;
        for (let i = 1; i <= n; i++) {
            if (isGood(i)) count++;
        }
        return count;
    }
}
