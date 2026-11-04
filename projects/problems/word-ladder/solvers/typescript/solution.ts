export class Solution {
    ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
        const dictionary = new Set(wordList);
        if (!dictionary.has(endWord)) {
            return 0;
        }
        const seen = new Set<string>([beginWord]);
        let frontier: string[] = [beginWord];
        let steps = 1;
        while (frontier.length > 0) {
            const next: string[] = [];
            for (const word of frontier) {
                if (word === endWord) {
                    return steps;
                }
                for (let position = 0; position < word.length; position++) {
                    for (let code = 97; code <= 122; code++) {
                        const candidate =
                            word.slice(0, position) +
                            String.fromCharCode(code) +
                            word.slice(position + 1);
                        if (dictionary.has(candidate) && !seen.has(candidate)) {
                            seen.add(candidate);
                            next.push(candidate);
                        }
                    }
                }
            }
            frontier = next;
            steps++;
        }
        return 0;
    }
}
