export class Solution {
    findSubstring(s: string, words: string[]): number[] {
        const result: number[] = [];
        if (words.length === 0) return result;
        const wordLen = words[0].length;
        if (wordLen === 0) return result;
        const totalLen = wordLen * words.length;
        if (totalLen > s.length) return result;

        const need = new Map<string, number>();
        for (const word of words) need.set(word, (need.get(word) ?? 0) + 1);
        const distinct = need.size;

        for (let offset = 0; offset < wordLen; offset++) {
            const window = new Map<string, number>();
            let matched = 0;
            let left = offset;

            for (let right = offset; right + wordLen <= s.length; right += wordLen) {
                const word = s.slice(right, right + wordLen);
                const required = need.get(word);

                if (required === undefined) {
                    window.clear();
                    matched = 0;
                    left = right + wordLen;
                    continue;
                }

                const old = window.get(word) ?? 0;
                if (old === required) matched--;
                window.set(word, old + 1);
                if (old + 1 === required) matched++;

                while (right + wordLen - left > totalLen) {
                    const gone = s.slice(left, left + wordLen);
                    const requiredGone = need.get(gone)!;
                    const oldGone = window.get(gone)!;
                    if (oldGone === requiredGone) matched--;
                    if (oldGone === 1) window.delete(gone);
                    else {
                        window.set(gone, oldGone - 1);
                        if (oldGone - 1 === requiredGone) matched++;
                    }
                    left += wordLen;
                }

                if (matched === distinct) result.push(left);
            }
        }
        return result;
    }
}
