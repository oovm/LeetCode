export class Solution {
    robotSim(commands: number[], obstacles: number[][]): number {
        const blocked = new Set<number>();
        for (const [row, col] of obstacles) {
            blocked.add((row + 30000) * 65536 + (col + 30000));
        }
        const dx = [0, 1, 0, -1];
        const dy = [1, 0, -1, 0];
        let x = 0;
        let y = 0;
        let facing = 0;
        let best = 0;
        for (const command of commands) {
            if (command === -1) {
                facing = (facing + 1) % 4;
            } else if (command === -2) {
                facing = (facing + 3) % 4;
            } else {
                for (let remaining = 0; remaining < command; remaining++) {
                    const nextX = x + dx[facing];
                    const nextY = y + dy[facing];
                    if (blocked.has((nextX + 30000) * 65536 + (nextY + 30000))) {
                        break;
                    }
                    x = nextX;
                    y = nextY;
                    best = Math.max(best, x * x + y * y);
                }
            }
        }
        return best;
    }
}
