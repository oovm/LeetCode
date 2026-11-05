export class Solution {
    numRabbits(answers: number[]): number {
        const counts = new Map<number, number>();
        for (const value of answers) {
            counts.set(value, (counts.get(value) ?? 0) + 1);
        }
        let total = 0;
        for (const [value, amount] of counts) {
            const group = value + 1;
            total += Math.ceil(amount / group) * group;
        }
        return total;
    }
}
