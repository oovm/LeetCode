export class Solution {
    letterCasePermutation(s: string): string[] {
        const out: string[] = [];
        const t = [...s];
        const dfs = (i: number): void => {
            if (i >= t.length) {
                out.push(t.join(''));
                return;
            }
            dfs(i + 1);
            if (/[a-zA-Z]/.test(t[i])) {
                t[i] = String.fromCharCode(t[i].charCodeAt(0) ^ 32);
                dfs(i + 1);
                t[i] = String.fromCharCode(t[i].charCodeAt(0) ^ 32);
            }
        };
        dfs(0);
        return out;
    }
}
