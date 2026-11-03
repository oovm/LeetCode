export class Solution {
    gameResult(head: number[]): string {
        let score = 0;
        for (let i = 0; i + 1 < head.length; i += 2) {
            if (head[i] > head[i + 1]) score++;
            else if (head[i] < head[i + 1]) score--;
        }
        return score > 0 ? "Even" : score < 0 ? "Odd" : "Tie";
    }
}
