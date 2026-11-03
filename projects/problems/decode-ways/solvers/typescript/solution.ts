export class Solution {
    numDecodings(s: string): number {
        let prev2 = 1;
        let prev1 = s[0] === '0' ? 0 : 1;
        for (let i = 1; i < s.length; i++) {
            let cur = 0;
            if (s[i] !== '0') {
                cur += prev1;
            }
            const two = Number(s.slice(i - 1, i + 1));
            if (two >= 10 && two <= 26) {
                cur += prev2;
            }
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}
