export class Solution {
    hasSameDigits(s: string): boolean {
        let digits = [...s].map((ch) => ch.charCodeAt(0) - 48);
        while (digits.length > 2) {
            const next: number[] = [];
            for (let i = 1; i < digits.length; i++) {
                next.push((digits[i - 1] + digits[i]) % 10);
            }
            digits = next;
        }
        return digits[0] === digits[1];
    }
}
