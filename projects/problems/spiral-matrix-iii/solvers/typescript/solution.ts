export class Solution {
    spiralMatrixIII(rows: number, cols: number, rStart: number, cStart: number): number[][] {
        const total = rows * cols;
        const result: number[][] = [[rStart, cStart]];
        let r = rStart;
        let c = cStart;
        let direction = 0;
        let moves = 1;

        const directions: Array<[number, number]> = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ];

        while (result.length < total) {
            for (let turn = 0; turn < 2; turn++) {
                for (let step = 0; step < moves; step++) {
                    r += directions[direction][0];
                    c += directions[direction][1];
                    if (r >= 0 && r < rows && c >= 0 && c < cols && result.length < total) {
                        result.push([r, c]);
                    }
                }
                direction = (direction + 1) % 4;
            }
            moves++;
        }
        return result;
    }
}
