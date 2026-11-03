export class Solution {
    deleteNodes(head: number[], m: number, n: number): number[] {
        const out: number[] = [];
        let i = 0;
        while (i < head.length) {
            for (let j = 0; j < m && i < head.length; j++, i++) out.push(head[i]);
            i += n;
        }
        return out;
    }
}
