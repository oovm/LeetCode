export class Solution {
    checkZeroOnes(s: string): boolean {
        let longest = [0, 0];
        let run = 0;
        let prev = '';
        for (let i = 0; i <= s.length; i++) {
            if (i < s.length && s[i] === prev) {
                run += 1;
            } else {
                if (prev !== '') {
                    longest[Number(prev)] = Math.max(longest[Number(prev)], run);
                }
                prev = s[i];
                run = 1;
            }
        }
        return longest[1] > longest[0];
    }
}
