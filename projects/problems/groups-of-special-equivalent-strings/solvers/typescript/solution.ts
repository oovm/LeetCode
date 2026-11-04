export class Solution {
    numSpecialEquivGroups(words: string[]): number {
        const groups = new Set<string>();
        for (const word of words) {
            const even: string[] = [];
            const odd: string[] = [];
            for (let i = 0; i < word.length; i++) {
                if (i % 2 === 0) even.push(word[i]);
                else odd.push(word[i]);
            }
            even.sort();
            odd.sort();
            groups.add(even.join("") + odd.join(""));
        }
        return groups.size;
    }
}
