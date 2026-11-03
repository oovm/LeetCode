export class Solution {
    numOfUnplacedFruits(fruits: number[], baskets: number[]): number {
        const used = new Array(baskets.length).fill(false);
        let unplaced = 0;
        for (const f of fruits) {
            let placed = false;
            for (let i = 0; i < baskets.length; i++) {
                if (!used[i] && baskets[i] >= f) {
                    used[i] = true;
                    placed = true;
                    break;
                }
            }
            if (!placed) unplaced++;
        }
        return unplaced;
    }
}
