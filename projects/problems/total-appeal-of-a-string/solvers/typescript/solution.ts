export class Solution {
    appealSum(s: string): number {
        const last = new Array<number>(26).fill(-1);
        let total = 0;
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i) - 97;
            total += (i - last[c]) * (s.length - i);
            last[c] = i;
        }
        return total;
    }
}
