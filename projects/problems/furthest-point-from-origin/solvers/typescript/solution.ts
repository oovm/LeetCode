export class Solution {
    furthestDistanceFromOrigin(moves: string): number {
        let balance = 0;
        let blanks = 0;
        for (const ch of moves) {
            if (ch === 'L') balance -= 1;
            else if (ch === 'R') balance += 1;
            else blanks += 1;
        }
        return Math.abs(balance) + blanks;
    }
}
