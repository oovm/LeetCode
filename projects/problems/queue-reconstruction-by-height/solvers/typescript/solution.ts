export class Solution {
    reconstructQueue(people: number[][]): number[][] {
        people.sort((a, b) => b[0] - a[0] || a[1] - b[1]);
        const result: number[][] = [];
        for (const p of people) result.splice(p[1], 0, p);
        return result;
    }
}
