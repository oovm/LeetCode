export class Solution {
    addBoldTag(s: string, words: string[]): string {
        const covered = new Array<boolean>(s.length).fill(false);
        for (let index = 0; index < s.length; index++) {
            for (const word of words) {
                if (s.startsWith(word, index)) {
                    for (let offset = 0; offset < word.length; offset++) {
                        covered[index + offset] = true;
                    }
                }
            }
        }
        let out = "";
        for (let index = 0; index < s.length; index++) {
            if (covered[index] && (index === 0 || !covered[index - 1])) {
                out += "<b>";
            }
            out += s[index];
            if (covered[index] && (index + 1 === s.length || !covered[index + 1])) {
                out += "</b>";
            }
        }
        return out;
    }
}
