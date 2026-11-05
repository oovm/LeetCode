export class Solution {
    earliestAcq(logs: number[][], n: number): number {
        const ordered = [...logs].sort((a, b) => a[0] - b[0]);
        const parent = new Array<number>(n);
        for (let i = 0; i < n; i += 1) {
            parent[i] = i;
        }
        const find = (value: number): number => {
            let root = value;
            while (parent[root] !== root) {
                root = parent[root];
            }
            let cursor = value;
            while (parent[cursor] !== cursor) {
                const next = parent[cursor];
                parent[cursor] = root;
                cursor = next;
            }
            return root;
        };

        let groups = n;
        for (const [moment, left, right] of ordered) {
            const leftRoot = find(left);
            const rightRoot = find(right);
            if (leftRoot !== rightRoot) {
                parent[leftRoot] = rightRoot;
                groups -= 1;
                if (groups === 1) {
                    return moment;
                }
            }
        }
        return -1;
    }
}
