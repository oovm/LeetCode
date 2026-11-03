export class Solution {
    highFive(items: number[][]): number[][] {
        const scores = new Map<number, number[]>();
        for (const [id, score] of items) {
            if (!scores.has(id)) scores.set(id, []);
            scores.get(id)!.push(score);
        }
        const out: number[][] = [];
        for (const id of [...scores.keys()].sort((a, b) => a - b)) {
            const top = scores.get(id)!.sort((a, b) => b - a).slice(0, 5);
            out.push([id, Math.floor(top.reduce((a, b) => a + b, 0) / 5)]);
        }
        return out;
    }
}
