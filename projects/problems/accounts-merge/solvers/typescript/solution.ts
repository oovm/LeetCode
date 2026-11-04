export class Solution {
    accountsMerge(accounts: string[][]): string[][] {
        const n = accounts.length;
        const parent = new Array<number>(n);
        for (let i = 0; i < n; i++) parent[i] = i;
        const find = (x: number): number => {
            while (parent[x] !== x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        };
        const union = (a: number, b: number): void => {
            const rootA = find(a);
            const rootB = find(b);
            if (rootA !== rootB) parent[rootA] = rootB;
        };
        const owner = new Map<string, number>();
        for (let i = 0; i < n; i++) {
            for (let k = 1; k < accounts[i].length; k++) {
                const email = accounts[i][k];
                if (owner.has(email)) union(i, owner.get(email) as number);
                else owner.set(email, i);
            }
        }
        const merged: string[][] = [];
        const grouped = new Set<number>();
        for (let i = 0; i < n; i++) {
            const root = find(i);
            if (grouped.has(root)) continue;
            grouped.add(root);
            const emails = new Set<string>();
            for (let j = 0; j < n; j++) {
                if (find(j) !== root) continue;
                for (let k = 1; k < accounts[j].length; k++) emails.add(accounts[j][k]);
            }
            merged.push([accounts[i][0], ...Array.from(emails).sort()]);
        }
        return merged;
    }
}
