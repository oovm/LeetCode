export class Solution {
    winnerOfGame(colors: string): boolean {
        let alice = 0;
        let bob = 0;
        for (let i = 1; i < colors.length - 1; i++) {
            if (colors[i - 1] === colors[i] && colors[i] === colors[i + 1]) {
                if (colors[i] === 'A') alice += 1;
                else bob += 1;
            }
        }
        return alice > bob;
    }
}
