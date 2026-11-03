export class Solution {
    minimumRecolors(k: number, blocks: string): number {
        let whites = 0;
        for (let i = 0; i < k; i++) {
            if (blocks[i] === 'W') whites += 1;
        }
        let best = whites;
        for (let i = k; i < blocks.length; i++) {
            if (blocks[i] === 'W') whites += 1;
            if (blocks[i - k] === 'W') whites -= 1;
            best = Math.min(best, whites);
        }
        return best;
    }
}
