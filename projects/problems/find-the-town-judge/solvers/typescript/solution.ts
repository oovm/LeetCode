export class Solution {
    findJudge(n: number, trust: number[][]): number {
        const score = new Map<number, number>();
        for (const [a, b] of trust) {
            score.set(a, (score.get(a) ?? 0) - 1);
            score.set(b, (score.get(b) ?? 0) + 1);
        }
        for (let person = 1; person <= n; person += 1) {
            if ((score.get(person) ?? 0) === n - 1) {
                return person;
            }
        }
        return -1;
    }
}
