export class Solution {
    getSmallestString(s: string, k: number): string {
        const chars = s.split('');
        let budget = k;
        for (let i = 0; i < chars.length && budget > 0; i++) {
            const code = chars[i].charCodeAt(0) - 97;
            const dist = Math.min(code, 26 - code);
            const take = Math.min(dist, budget);
            chars[i] = String.fromCharCode(97 + code - take);
            budget -= take;
        }
        return chars.join('');
    }
}
