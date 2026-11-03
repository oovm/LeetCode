export class Solution {
    removeTrailingZeros(num: string): string {
        let end = num.length;
        while (end > 0 && num[end - 1] === '0') {
            end -= 1;
        }
        return num.slice(0, end);
    }
}
