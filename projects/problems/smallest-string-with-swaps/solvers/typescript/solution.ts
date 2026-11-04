export class Solution {
    smallestStringWithSwaps(s: string, pairs: number[][]): string {
        const n = s.length;
        const parent = new Array<number>(n);
        for (let i = 0; i < n; i++) parent[i] = i;
        const find = (x: number): number => {
            while (parent[x] !== x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        };
        for (const [a, b] of pairs) {
            const rootA = find(a);
            const rootB = find(b);
            if (rootA !== rootB) parent[rootA] = rootB;
        }
        const groups = new Map<number, number[]>();
        for (let i = 0; i < n; i++) {
            const root = find(i);
            const list = groups.get(root) ?? [];
            list.push(i);
            groups.set(root, list);
        }
        const result = s.split("");
        for (const list of groups.values()) {
            const letters = list.map((index) => s[index]).sort();
            list.sort((a, b) => a - b);
            for (let k = 0; k < list.length; k++) result[list[k]] = letters[k];
        }
        return result.join("");
    }
}
