export class Solution {
    crackSafe(k: number, n: number): string {
        const total = k ** n;
        const visited = new Set<string>();
        const out: string[] = [];
        const start = '0'.repeat(n - 1);
        const dfs = (node: string): void => {
            for (let d = 0; d < k; d++) {
                const edge = node + d;
                if (!visited.has(edge)) {
                    visited.add(edge);
                    dfs(node.slice(1) + d);
                    out.push(String(d));
                }
            }
        };
        dfs(start);
        return start + out.reverse().join('');
    }
}
