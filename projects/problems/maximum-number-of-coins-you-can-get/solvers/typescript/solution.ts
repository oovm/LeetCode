export class Solution {
    maxCoins(piles: number[]): number {
        piles.sort((left, right) => left - right);
        const picks = piles.length / 3;
        let total = 0;
        let index = piles.length - 1;
        for (let taken = 0; taken < picks; taken++) {
            total += piles[index];
            index -= 2;
        }
        return total;
    }
}
