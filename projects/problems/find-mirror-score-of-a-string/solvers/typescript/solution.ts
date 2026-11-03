export class Solution {
    calculateScore(s: string): number {
        const mirror = (ch: string): number => 219 - ch.charCodeAt(0);
        const stacks: number[][] = Array.from({ length: 26 }, () => []);
        let score = 0;
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i) - 97;
            const m = mirror(s[i]) - 97;
            if (stacks[m].length > 0) {
                score += i - stacks[m].pop()!;
            } else {
                stacks[c].push(i);
            }
        }
        return score;
    }
}
