export class Solution {
    squareIsWhite(coordinates: string): boolean {
        const col = coordinates.charCodeAt(0) - 97;
        const row = coordinates.charCodeAt(1) - 49;
        return (col + row) % 2 === 1;
    }
}
