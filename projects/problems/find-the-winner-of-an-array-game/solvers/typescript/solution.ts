export class Solution {
    getWinner(arr: number[], k: number): number {
        let winner = arr[0];
        let wins = 0;
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > winner) {
                winner = arr[i];
                wins = 1;
            } else {
                wins++;
            }
            if (wins >= k) {
                return winner;
            }
        }
        return winner;
    }
}
