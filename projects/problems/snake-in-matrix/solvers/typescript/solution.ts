export class Solution {
    finalPositionOfSnake(n: number, commands: string[]): number {
        let row = 0;
        let col = 0;
        for (const c of commands) {
            if (c === "UP") row--;
            else if (c === "DOWN") row++;
            else if (c === "LEFT") col--;
            else col++;
        }
        return row * n + col;
    }
}
