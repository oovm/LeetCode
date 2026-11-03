export class Solution {
    bestClosingTime(customers: string): number {
        let penalty = 0;
        for (const ch of customers) {
            if (ch === 'Y') penalty += 1;
        }
        let best = penalty;
        let bestHour = 0;
        for (let i = 0; i < customers.length; i++) {
            penalty += customers[i] === 'N' ? 1 : -1;
            if (penalty < best) {
                best = penalty;
                bestHour = i + 1;
            }
        }
        return bestHour;
    }
}
