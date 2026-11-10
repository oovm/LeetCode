export class Solution {
    isArmstrong(n: number): boolean {
        const digits = String(n).split("").map(Number);
        const k = digits.length;
        let total = 0;
        for (const d of digits) total += d ** k;
        return total === n;
    }
}
