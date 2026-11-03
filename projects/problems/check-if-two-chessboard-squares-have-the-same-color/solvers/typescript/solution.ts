export class Solution {
    checkTwoChessboards(coordinate1: string, coordinate2: string): boolean {
        const color = (c: string): number => (c.charCodeAt(0) + c.charCodeAt(1)) % 2;
        return color(coordinate1) === color(coordinate2);
    }
}
