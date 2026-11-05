export class Solution {
    boldWords(words: string[], s: string): string {
        const dictionary = new Set(words);
        const marked = new Array<boolean>(s.length).fill(false);
        for (let start = 0; start < s.length; start++) {
            let prefix = '';
            for (let end = start; end < s.length; end++) {
                prefix += s[end];
                if (dictionary.has(prefix)) {
                    for (let at = start; at <= end; at++) {
                        marked[at] = true;
                    }
                }
            }
        }
        let out = '';
        let at = 0;
        while (at < s.length) {
            if (marked[at]) {
                out += '<b>';
                while (at < s.length && marked[at]) {
                    out += s[at];
                    at++;
                }
                out += '</b>';
            } else {
                out += s[at];
                at++;
            }
        }
        return out;
    }
}
