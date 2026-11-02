export class Solution {
    largestInteger(num: number): number {
        const digits = String(num).split("").map(Number);
        const evens = digits.filter((d) => d % 2 === 0).sort((a, b) => b - a);
        const odds = digits.filter((d) => d % 2 === 1).sort((a, b) => b - a);
        let ei = 0;
        let oi = 0;
        let out = "";
        for (const d of digits) {
            out += d % 2 === 0 ? evens[ei++] : odds[oi++];
        }
        return Number(out);
    }
}
