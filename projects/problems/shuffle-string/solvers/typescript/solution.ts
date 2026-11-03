export class Solution {
    restoreString(s: string, indices: number[]): string {
        const out = new Array(s.length);
        for (let i = 0; i < s.length; i++) out[indices[i]] = s[i];
        return out.join("");
    }
}
