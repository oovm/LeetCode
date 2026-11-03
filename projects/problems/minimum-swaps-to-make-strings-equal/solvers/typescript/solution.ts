export class Solution {
    minimumSwap(s1: string, s2: string): number {
        let xy = 0;
        let yx = 0;
        for (let i = 0; i < s1.length; i++) {
            if (s1[i] === 'x' && s2[i] === 'y') xy += 1;
            else if (s1[i] === 'y' && s2[i] === 'x') yx += 1;
        }
        if ((xy + yx) % 2 === 1) {
            return -1;
        }
        return Math.ceil(xy / 2) + Math.ceil(yx / 2);
    }
}
