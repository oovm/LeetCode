export class Solution {
    largestOddNumber(num: string): string {
        for (let i = num.length - 1; i >= 0; i--) {
            if ((num.charCodeAt(i) - 48) % 2 === 1) {
                return num.slice(0, i + 1);
            }
        }
        return '';
    }
}
