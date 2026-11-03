export class Solution {
    generateString(str1: string, str2: string): string {
        const n = str1.length;
        const m = str2.length;
        const out = new Array<string>(n + m - 1).fill('a');
        const forced = new Array<boolean>(n + m - 1).fill(false);
        for (let i = 0; i < n; i++) {
            if (str1[i] === 'T') {
                for (let j = 0; j < m; j++) {
                    if (forced[i + j] && out[i + j] !== str2[j]) return '';
                    out[i + j] = str2[j];
                    forced[i + j] = true;
                }
            }
        }
        const isMatch = (pos: number): boolean => {
            for (let j = 0; j < m; j++) {
                if (out[pos + j] !== str2[j]) return false;
            }
            return true;
        };
        for (let i = 0; i < n; i++) {
            if (str1[i] === 'F') {
                if (isMatch(i)) {
                    let j = i + m - 1;
                    while (j >= i && forced[j]) j -= 1;
                    if (j < i) return '';
                    out[j] = 'b';
                }
            }
        }
        return out.join('');
    }
}
