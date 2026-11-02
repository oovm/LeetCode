export class Solution {
    countSubstrings(s: string): number {
        const n = s.length;
        let count = 0;
        for (let center = 0; center < 2 * n - 1; center += 1) {
            let l = Math.floor(center / 2);
            let r = Math.floor(center / 2) + (center % 2);
            while (l >= 0 && r < n && s.charCodeAt(l) === s.charCodeAt(r)) {
                count += 1;
                l -= 1;
                r += 1;
            }
        }
        return count;
    }
}
