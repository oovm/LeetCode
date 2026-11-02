export class Solution {
    divisorSubstrings(num: number, k: number): number {
        const s = String(num);
        let ans = 0;
        for (let i = 0; i + k <= s.length; i++) {
            const t = Number(s.slice(i, i + k));
            if (t !== 0 && num % t === 0) {
                ans++;
            }
        }
        return ans;
    }
}
