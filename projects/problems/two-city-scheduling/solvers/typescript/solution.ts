export class Solution {
    twoCitySchedCost(costs: number[][]): number {
        const rows = costs
            .map(([cityA, cityB]) => ({ cityA, cityB }))
            .sort((a, b) => (a.cityA - a.cityB) - (b.cityA - b.cityB) || a.cityA - b.cityA);

        const half = rows.length / 2;
        let total = 0;
        for (let index = 0; index < rows.length; index++) {
            total += index < half ? rows[index].cityA : rows[index].cityB;
        }
        return total;
    }
}
