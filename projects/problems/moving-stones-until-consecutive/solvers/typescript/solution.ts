export class Solution {
    numMovesStones(a: number, b: number, c: number): number[] {
        const sorted = [a, b, c].sort((x, y) => x - y);
        const [x, y, z] = sorted;
        let minMoves = 2;
        if (y - x === 1 && z - y === 1) minMoves = 0;
        else if (y - x <= 2 || z - y <= 2) minMoves = 1;
        const maxMoves = y - x - 1 + (z - y - 1);
        return [minMoves, maxMoves];
    }
}
