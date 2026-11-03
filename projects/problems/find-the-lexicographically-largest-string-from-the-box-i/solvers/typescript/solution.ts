export class Solution {
    answerString(numFriends: number, word: string): string {
        if (numFriends === 1) {
            return word;
        }
        const n = word.length;
        const maxLen = n - numFriends + 1;
        let best = '';
        for (let i = 0; i < n; i++) {
            const sub = word.slice(i, i + maxLen);
            if (sub > best) {
                best = sub;
            }
        }
        return best;
    }
}
