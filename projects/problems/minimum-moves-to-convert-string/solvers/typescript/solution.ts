export class Solution {
    minimumMoves(s: string): number {
        let moves = 0;
        let i = 0;
        while (i < s.length) {
            if (s[i] === 'X') {
                moves += 1;
                i += 3;
            } else {
                i += 1;
            }
        }
        return moves;
    }
}
