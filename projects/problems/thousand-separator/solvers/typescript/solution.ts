export class Solution {
    thousandSeparator(n: number): string {
        const digits = String(n);
        const groups: string[] = [];
        for (let i = digits.length; i > 0; i -= 3) {
            groups.unshift(digits.slice(Math.max(0, i - 3), i));
        }
        return groups.join('.');
    }
}
