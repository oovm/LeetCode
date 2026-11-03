export class Solution {
    isAnagram(s: string, t: string): boolean {
        if (s.length !== t.length) {
            return false;
        }
        const cnt = new Map<string, number>();
        for (let i = 0; i < s.length; i++) {
            const ch = s[i];
            cnt.set(ch, (cnt.get(ch) ?? 0) + 1);
        }
        for (let i = 0; i < t.length; i++) {
            const ch = t[i];
            const left = cnt.get(ch) ?? 0;
            if (left === 0) {
                return false;
            }
            cnt.set(ch, left - 1);
        }
        return true;
    }
}
