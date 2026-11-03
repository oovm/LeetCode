export class Solution {
    reinitializePermutation(n: number): number {
        let position = 1;
        let count = 0;
        do {
            position = position % 2 === 0 ? position / 2 : n / 2 + (position - 1) / 2;
            count += 1;
        } while (position !== 1);
        return count;
    }
}
