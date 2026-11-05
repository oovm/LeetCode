export class Solution {
    minimumLengthEncoding(words: string[]): number {
        const edges = new Map<number, number>();
        const depth: number[] = [0];
        const kids: number[] = [0];
        let nodes = 1;
        for (const word of words) {
            let node = 0;
            for (let cursor = word.length - 1; cursor >= 0; cursor--) {
                const edge = node * 26 + (word.charCodeAt(cursor) - 97);
                const next = edges.get(edge);
                if (next === undefined) {
                    edges.set(edge, nodes);
                    depth.push(depth[node] + 1);
                    kids.push(0);
                    kids[node]++;
                    node = nodes;
                    nodes++;
                } else {
                    node = next;
                }
            }
        }
        let total = 0;
        for (let id = 1; id < nodes; id++) {
            if (kids[id] === 0) {
                total += depth[id] + 1;
            }
        }
        return total;
    }
}
