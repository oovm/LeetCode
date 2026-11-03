export class Solution {
    canConvertString(s: string, k: number, t: string): boolean {
        if (s.length !== t.length) {
            return false;
        }
        const used = new Array<number>(26).fill(0);
        for (let i = 0; i < s.length; i++) {
            const shift = (t.charCodeAt(i) - s.charCodeAt(i) + 26) % 26;
            if (shift !== 0) {
                used[shift] += 1;
                if (shift + (used[shift] - 1) * 26 > k) {
                    return false;
                }
            }
        }
        return true;
    }
}
