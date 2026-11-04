export class Solution {
    bestTeamScore(scores: number[], ages: number[]): number {
        const players = scores
            .map((score, index) => ({ score, age: ages[index] }))
            .sort((a, b) => a.score - b.score || a.age - b.age);

        const dp = new Array<number>(players.length).fill(0);
        let best = 0;
        for (let index = 0; index < players.length; index++) {
            const player = players[index];
            let total = player.score;
            for (let previous = 0; previous < index; previous++) {
                if (players[previous].age <= player.age) {
                    total = Math.max(total, dp[previous] + player.score);
                }
            }
            dp[index] = total;
            best = Math.max(best, total);
        }
        return best;
    }
}
