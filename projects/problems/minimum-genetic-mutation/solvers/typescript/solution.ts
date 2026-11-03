export class Solution {
    minMutation(startGene: string, endGene: string, bank: string[]): number {
        const pool = new Set(bank);
        if (!pool.has(endGene)) return -1;
        const genes = ["A", "C", "G", "T"];
        const queue: [string, number][] = [[startGene, 0]];
        const seen = new Set([startGene]);
        for (let head = 0; head < queue.length; head++) {
            const [gene, steps] = queue[head];
            if (gene === endGene) return steps;
            for (let i = 0; i < 8; i++) {
                for (const g of genes) {
                    const next = gene.slice(0, i) + g + gene.slice(i + 1);
                    if (pool.has(next) && !seen.has(next)) {
                        seen.add(next);
                        queue.push([next, steps + 1]);
                    }
                }
            }
        }
        return -1;
    }
}
