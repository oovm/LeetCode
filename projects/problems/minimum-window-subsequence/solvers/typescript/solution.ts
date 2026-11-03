export class Solution {
    minWindow(s1: string, s2: string): string {
        let best = '';
        for (let i = 0; i < s1.length; i++) {
            if (s1[i] !== s2[0]) continue;
            let j = 0;
            let end = i;
            while (end < s1.length && j < s2.length) {
                if (s1[end] === s2[j]) j += 1;
                end += 1;
            }
            if (j < s2.length) break;
            let start = end - 1;
            j = s2.length - 1;
            while (j >= 0) {
                if (s1[start] === s2[j]) j -= 1;
                start -= 1;
            }
            start += 1;
            const len = end - start;
            if (best === '' || len < best.length) {
                best = s1.slice(start, end);
            }
        }
        return best;
    }
}
