export class Solution {
    getEncryptedString(s: string, k: number): string {
        const n = s.length;
        let out = '';
        for (let i = 0; i < n; i++) {
            out += s[(i + k) % n];
        }
        return out;
    }
}
