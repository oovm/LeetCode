export class Solution {
    countOfSubstrings(k: number, word: string): number {
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const atLeast = (target: number): number => {
            const counts = new Array<number>(5).fill(0);
            let consonants = 0;
            let covered = 0;
            let total = 0;
            let left = 0;
            for (let right = 0; right < word.length; right++) {
                const v = vowels.indexOf(word[right]);
                if (v !== -1) {
                    if (counts[v] === 0) covered += 1;
                    counts[v] += 1;
                } else {
                    consonants += 1;
                }
                while (covered === 5 && consonants >= target) {
                    total += word.length - right;
                    const lv = vowels.indexOf(word[left]);
                    if (lv !== -1) {
                        counts[lv] -= 1;
                        if (counts[lv] === 0) covered -= 1;
                    } else {
                        consonants -= 1;
                    }
                    left += 1;
                }
            }
            return total;
        };
        return atLeast(k) - atLeast(k + 1);
    }
}
