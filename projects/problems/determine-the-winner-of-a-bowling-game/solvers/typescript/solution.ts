export class Solution {
    isWinner(player1: number[], player2: number[]): number {
        const score = (rolls: number[]) => {
            let total = 0;
            for (let i = 0; i < rolls.length; i++) {
                const bonus = (i >= 1 && rolls[i - 1] === 10) || (i >= 2 && rolls[i - 2] === 10);
                total += bonus ? 2 * rolls[i] : rolls[i];
            }
            return total;
        };
        const s1 = score(player1);
        const s2 = score(player2);
        return s1 > s2 ? 1 : s2 > s1 ? 2 : 0;
    }
}
