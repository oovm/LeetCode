export class Solution {
    kthGrammar(_n: number, k: number): number {
        let bits = k - 1;
        let parity = 0;
        while (bits > 0) {
            parity += bits % 2;
            bits = Math.floor(bits / 2);
        }
        return parity % 2;
    }
}
