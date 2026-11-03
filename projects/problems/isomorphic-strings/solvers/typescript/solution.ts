export class Solution {
    isIsomorphic(s: string, t: string): boolean {
        const forward = new Map<string, string>();
        const backward = new Map<string, string>();
        for (let i = 0; i < s.length; i++) {
            const a = s[i];
            const b = t[i];
            if ((forward.get(a) ?? b) !== b || (backward.get(b) ?? a) !== a) {
                return false;
            }
            forward.set(a, b);
            backward.set(b, a);
        }
        return true;
    }
}
