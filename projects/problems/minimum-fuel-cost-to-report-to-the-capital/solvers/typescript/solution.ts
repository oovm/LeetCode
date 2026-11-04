export class Solution {
    minimumFuelCost(roads: number[][], seats: number): number {
        const count = roads.length + 1;
        const adjacency: number[][] = Array.from({ length: count }, () => []);
        for (const [left, right] of roads) {
            adjacency[left].push(right);
            adjacency[right].push(left);
        }

        const parent = new Array<number>(count).fill(-1);
        const order: number[] = [0];
        const size = new Array<number>(count).fill(1);
        parent[0] = 0;
        let head = 0;
        while (head < order.length) {
            const city = order[head];
            head += 1;
            for (const next of adjacency[city]) {
                if (next !== parent[city]) {
                    parent[next] = city;
                    order.push(next);
                }
            }
        }

        let fuel = 0;
        for (let position = order.length - 1; position > 0; position -= 1) {
            const city = order[position];
            const subtree = size[city];
            fuel += Math.ceil(subtree / seats);
            size[parent[city]] += subtree;
        }
        return fuel;
    }
}
