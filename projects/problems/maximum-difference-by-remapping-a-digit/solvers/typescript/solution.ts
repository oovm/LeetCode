export class Solution {
    minMaxDifference(num: number): number {
        const digits = String(num);
        let maxFrom = '';
        for (const ch of digits) {
            if (ch !== '9') {
                maxFrom = ch;
                break;
            }
        }
        const max = maxFrom === '' ? num : Number(digits.replaceAll(maxFrom, '9'));
        const min = Number(digits.replaceAll(digits[0] as string, '0'));
        return max - min;
    }
}
