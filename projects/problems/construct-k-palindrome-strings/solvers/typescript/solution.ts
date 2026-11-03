export class Solution {
    canConstruct(s: string, k: number): boolean {
        if (k > s.length) {
            return false;
        }
        let oddMask = 0;
        for (const ch of s) {
            oddMask ^= 1 << (ch.charCodeAt(0) - 97);
        }
        const odds = oddMask.toString(2).replaceAll('0', '').length;
        return odds <= k;
    }
}
