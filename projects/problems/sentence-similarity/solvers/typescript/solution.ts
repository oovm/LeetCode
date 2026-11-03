export class Solution {
    areSentencesSimilar(
        sentence1: string[],
        sentence2: string[],
        similarPairs: string[][]
    ): boolean {
        if (sentence1.length !== sentence2.length) return false;
        const similar = new Set<string>();
        for (const [a, b] of similarPairs) {
            similar.add(`${a} ${b}`);
            similar.add(`${b} ${a}`);
        }
        for (let i = 0; i < sentence1.length; i++) {
            if (
                sentence1[i] !== sentence2[i] &&
                !similar.has(`${sentence1[i]} ${sentence2[i]}`)
            ) {
                return false;
            }
        }
        return true;
    }
}
