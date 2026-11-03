export class Solution {
    maxOperations(s: string): number {
        let operations = 0;
        let ones = 0;
        for (let i = 0; i < s.length; i++) {
            if (s[i] === '1') ones += 1;
            else if (i > 0 && s[i - 1] === '1') operations += ones;
        }
        return operations;
    }
}
