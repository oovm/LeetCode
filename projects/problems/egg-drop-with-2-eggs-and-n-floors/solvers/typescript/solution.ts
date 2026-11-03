export class Solution {
    twoEggDrop(n: number): number {
        let k = 0;
        while ((k * (k + 1)) / 2 < n) {
            k += 1;
        }
        return k;
    }
}
