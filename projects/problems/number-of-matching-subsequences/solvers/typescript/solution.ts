export class Solution {
    numMatchingSubseq(s: string, words: string[]): number {
        let matched = 0;
        for (const word of words) {
            let at = 0;
            for (let source = 0; source < s.length && at < word.length; source++) {
                if (s[source] === word[at]) {
                    at++;
                }
            }
            if (at === word.length) {
                matched++;
            }
        }
        return matched;
    }
}
