export class Solution {
    validWordAbbreviation(word: string, abbr: string): boolean {
        let i = 0;
        let j = 0;
        while (j < abbr.length) {
            if (abbr[j] >= '0' && abbr[j] <= '9') {
                if (abbr[j] === '0') {
                    return false;
                }
                let skip = 0;
                while (j < abbr.length && abbr[j] >= '0' && abbr[j] <= '9') {
                    skip = skip * 10 + (abbr.charCodeAt(j) - 48);
                    j += 1;
                }
                i += skip;
            } else {
                if (word[i] !== abbr[j]) {
                    return false;
                }
                i += 1;
                j += 1;
            }
        }
        return i === word.length;
    }
}
