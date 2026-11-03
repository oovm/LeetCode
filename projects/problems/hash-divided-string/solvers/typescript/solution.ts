export class Solution {
    stringHash(s: string, k: number): string {
        const out: string[] = [];
        for (let i = 0; i < s.length; i += k) {
            let sum = 0;
            for (let j = i; j < i + k; j++) {
                sum += s.charCodeAt(j) - 97;
            }
            out.push(String.fromCharCode(97 + (sum % 26)));
        }
        return out.join('');
    }
}
