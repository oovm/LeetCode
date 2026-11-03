export class Solution {
    minMovesToSeat(seats: number[], students: number[]): number {
        const a = [...seats].sort((x, y) => x - y);
        const b = [...students].sort((x, y) => x - y);
        let moves = 0;
        for (let i = 0; i < a.length; i++) moves += Math.abs(a[i] - b[i]);
        return moves;
    }
}
