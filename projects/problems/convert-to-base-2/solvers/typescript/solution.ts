export class Solution {
    baseNeg2(n: number): string {
        if (n === 0) {
            return '0';
        }
        const out: string[] = [];
        let rest = n;
        while (rest !== 0) {
            out.push(String(rest & 1));
            rest = -(rest >> 1);
        }
        return out.reverse().join('');
    }
}
