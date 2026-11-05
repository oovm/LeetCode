export class Solution {
    distributeCoins(root: number[]): number {
        let moves = 0;
        const collect = (index: number): number => {
            if (index >= root.length) {
                return 0;
            }
            const left = collect(index * 2 + 1);
            const right = collect(index * 2 + 2);
            moves += Math.abs(left) + Math.abs(right);
            return left + right + root[index] - 1;
        };
        collect(0);
        return moves;
    }
}
