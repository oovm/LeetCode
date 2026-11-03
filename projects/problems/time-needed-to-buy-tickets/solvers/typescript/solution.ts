export class Solution {
    timeRequiredToBuy(tickets: number[], k: number): number {
        let time = 0;
        const target = tickets[k];
        for (let i = 0; i < tickets.length; i++) {
            time += Math.min(tickets[i], i <= k ? target : target - 1);
        }
        return time;
    }
}
