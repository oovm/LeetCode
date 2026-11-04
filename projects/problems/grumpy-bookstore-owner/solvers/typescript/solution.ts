export class Solution {
    maxSatisfied(customers: number[], grumpy: number[], minutes: number): number {
        let base = 0;
        for (let i = 0; i < customers.length; i += 1) {
            if (grumpy[i] === 0) base += customers[i];
        }

        const width = Math.min(minutes, customers.length);
        let extra = 0;
        for (let i = 0; i < width; i += 1) {
            if (grumpy[i] === 1) extra += customers[i];
        }

        let best = extra;
        for (let right = width; right < customers.length; right += 1) {
            if (grumpy[right] === 1) extra += customers[right];
            if (grumpy[right - width] === 1) extra -= customers[right - width];
            best = Math.max(best, extra);
        }
        return base + best;
    }
}
