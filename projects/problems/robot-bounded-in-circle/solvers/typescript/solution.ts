export class Solution {
    isRobotBounded(instructions: string): boolean {
        const dirs = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ];
        let x = 0;
        let y = 0;
        let facing = 0;
        for (const ch of instructions) {
            if (ch === 'G') {
                x += dirs[facing][0];
                y += dirs[facing][1];
            } else if (ch === 'L') {
                facing = (facing + 3) % 4;
            } else {
                facing = (facing + 1) % 4;
            }
        }
        return (x === 0 && y === 0) || facing !== 0;
    }
}
