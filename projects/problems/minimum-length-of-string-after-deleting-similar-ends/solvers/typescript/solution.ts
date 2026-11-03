export class Solution {
    minimumLength(s: string): number {
        let left = 0;
        let right = s.length - 1;
        while (left < right && s[left] === s[right]) {
            const ch = s[left];
            while (left <= right && s[left] === ch) left += 1;
            while (left <= right && s[right] === ch) right -= 1;
        }
        return right - left + 1;
    }
}
