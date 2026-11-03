export class Solution {
    numberOfSpecialSubstrings(s: string): number {
        const last = new Array<number>(26).fill(-1);
        let total = 0;
        let left = 0;
        for (let right = 0; right < s.length; right++) {
            const c = s.charCodeAt(right) - 97;
            if (last[c] >= left) {
                left = last[c] + 1;
            }
            last[c] = right;
            total += right - left + 1;
        }
        return total;
    }
}
