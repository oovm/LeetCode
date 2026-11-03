export class Solution {
    removeDigit(number: string, digit: string): string {
        let best = '';
        for (let i = 0; i < number.length; i++) {
            if (number[i] === digit) {
                const candidate = number.slice(0, i) + number.slice(i + 1);
                if (candidate > best) {
                    best = candidate;
                }
            }
        }
        return best;
    }
}
