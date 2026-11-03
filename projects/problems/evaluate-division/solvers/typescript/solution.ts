export class Solution {
    calcEquation(equations: string[][], values: number[], queries: string[][]): number[] {
        const adj = new Map<string, Map<string, number>>();
        equations.forEach(([a, b], i) => {
            if (!adj.has(a)) adj.set(a, new Map());
            if (!adj.has(b)) adj.set(b, new Map());
            adj.get(a)!.set(b, values[i]);
            adj.get(b)!.set(a, 1 / values[i]);
        });
        const query = (start: string, end: string): number => {
            if (!adj.has(start) || !adj.has(end)) return -1;
            const seen = new Set<string>();
            const stack: [string, number][] = [[start, 1]];
            while (stack.length > 0) {
                const [node, acc] = stack.pop()!;
                if (node === end) return acc;
                if (seen.has(node)) continue;
                seen.add(node);
                for (const [next, w] of adj.get(node)!) stack.push([next, acc * w]);
            }
            return -1;
        };
        return queries.map(([a, b]) => query(a, b));
    }
}
