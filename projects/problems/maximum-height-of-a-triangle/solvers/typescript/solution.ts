function heightStarting(first: number, second: number): number {
    let a = first;
    let b = second;
    let row = 1;
    for (;;) {
        if (row % 2 === 1) {
            if (a < row) {
                return row - 1;
            }
            a -= row;
        } else {
            if (b < row) {
                return row - 1;
            }
            b -= row;
        }
        row += 1;
    }
}

export class Solution {
    maxHeightOfTriangle(red: number, blue: number): number {
        return Math.max(heightStarting(red, blue), heightStarting(blue, red));
    }
}
