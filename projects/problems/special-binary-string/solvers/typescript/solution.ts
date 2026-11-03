export class Solution {
    makeLargestSpecial(s: string): string {
        const parts: string[] = [];
        let balance = 0;
        let start = 0;
        for (let i = 0; i < s.length; i++) {
            balance += s[i] === '1' ? 1 : -1;
            if (balance === 0) {
                parts.push('1' + this.makeLargestSpecial(s.slice(start + 1, i)) + '0');
                start = i + 1;
            }
        }
        parts.sort().reverse();
        return parts.join('');
    }
}
