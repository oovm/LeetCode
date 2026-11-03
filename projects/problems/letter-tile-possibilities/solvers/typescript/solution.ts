export class Solution {
    numTilePossibilities(tiles: string): number | string {
        const counts = new Array<number>(26).fill(0);
        for (const ch of tiles) {
            counts[ch.charCodeAt(0) - 65] += 1;
        }
        const dfs = (): number => {
            let total = 0;
            for (let i = 0; i < 26; i++) {
                if (counts[i] === 0) continue;
                counts[i] -= 1;
                total += 1 + dfs();
                counts[i] += 1;
            }
            return total;
        };
        const result = dfs();
        return result <= Number.MAX_SAFE_INTEGER ? result : String(result);
    }
}
