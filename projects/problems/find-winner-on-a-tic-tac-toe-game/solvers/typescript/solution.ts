export class Solution {
    tictactoe(moves: number[][]): string {
        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];
        const mask = (player: number): number => {
            let m = 0;
            for (let i = player; i < moves.length; i += 2) {
                m |= 1 << (moves[i][0] * 3 + moves[i][1]);
            }
            return m;
        };
        const a = mask(0);
        const b = mask(1);
        if (wins.some((w) => w.every((c) => (a >> c) & 1))) return "A";
        if (wins.some((w) => w.every((c) => (b >> c) & 1))) return "B";
        return moves.length === 9 ? "Draw" : "Pending";
    }
}
