export class Solution {
    replaceWords(dictionary: string[], sentence: string): string {
        const roots = new Set(dictionary);
        return sentence
            .split(' ')
            .map((word) => {
                for (let length = 1; length <= word.length; length++) {
                    if (roots.has(word.slice(0, length))) {
                        return word.slice(0, length);
                    }
                }
                return word;
            })
            .join(' ');
    }
}
