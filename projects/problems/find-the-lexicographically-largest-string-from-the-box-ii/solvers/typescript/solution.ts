export class Solution {
    answerString(numFriends: number, word: string): string {
        if (numFriends === 1) {
            return word;
        }
        const n = word.length;
        const maxLen = n - numFriends + 1;
        const suffix = (start: number): string => word.slice(start);
        let best = '';
        for (let i = 0; i < n; i++) {
            const sub = suffix(i).slice(0, maxLen);
            if (sub > best) {
                best = sub;
            }
        }
        return best;
    }
}
