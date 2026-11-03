export class Solution {
    mostVisited(n: number, rounds: number[]): number[] {
        const start = rounds[0];
        const end = rounds[rounds.length - 1];
        const out: number[] = [];
        if (start <= end) {
            for (let i = start; i <= end; i++) out.push(i);
        } else {
            for (let i = 1; i <= end; i++) out.push(i);
            for (let i = start; i <= n; i++) out.push(i);
        }
        return out;
    }
}
