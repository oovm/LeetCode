export class Solution {
    winningPlayer(x: number, y: number): string {
        return Math.min(x, Math.floor(y / 4)) % 2 === 1 ? 'Alice' : 'Bob';
    }
}
