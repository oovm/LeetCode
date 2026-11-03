export class Solution {
    possiblyEquals(s1: string, s2: string): boolean {
        const tokens = (s: string): { isNum: boolean; value: string }[] => {
            const out: { isNum: boolean; value: string }[] = [];
            let i = 0;
            while (i < s.length) {
                const isNum = s[i] >= '0' && s[i] <= '9';
                let j = i;
                while (j < s.length && (s[j] >= '0' && s[j] <= '9') === isNum) j += 1;
                out.push({ isNum, value: s.slice(i, j) });
                i = j;
            }
            return out;
        };
        const numOptions = (digits: string): number[] => {
            if (digits.length === 1) return [Number(digits)];
            if (digits.length === 2) return [Number(digits), Number(digits[0]) + Number(digits[1])];
            const a = Number(digits[0]);
            const b = Number(digits[1]);
            const c = Number(digits[2]);
            return [Number(digits), a * 10 + b + c, a + b * 10 + c, a + b + c].filter(
                (v, i, arr) => arr.indexOf(v) === i,
            );
        };
        const t1 = tokens(s1);
        const t2 = tokens(s2);
        const memo = new Map<string, boolean>();
        const dfs = (i: number, j: number, diff: number): boolean => {
            if (i === t1.length && j === t2.length) return diff === 0;
            if (i === t1.length || j === t2.length) return false;
            const key = `${i},${j},${diff}`;
            const hit = memo.get(key);
            if (hit !== undefined) return hit;
            const a = t1[i];
            const b = t2[j];
            let ok = false;
            if (a.isNum) {
                for (const v of numOptions(a.value)) {
                    if (dfs(i + 1, j, diff + v)) {
                        ok = true;
                        break;
                    }
                }
            } else if (b.isNum) {
                for (const v of numOptions(b.value)) {
                    if (dfs(i, j + 1, diff - v)) {
                        ok = true;
                        break;
                    }
                }
            } else if (diff === 0) {
                ok = a.value[0] === b.value[0] && dfs(i + 1, j + 1, 0);
            } else if (diff > 0) {
                ok = a.value[0] === b.value[0] && dfs(i + 1, j, diff - 1);
            } else {
                ok = a.value[0] === b.value[0] && dfs(i, j + 1, diff + 1);
            }
            memo.set(key, ok);
            return ok;
        };
        return dfs(0, 0, 0);
    }
}
