export class Solution {
    maximumLength(s: string): number {
        const runs = new Map<string, number[]>();
        let i = 0;
        while (i < s.length) {
            let j = i;
            while (j < s.length && s[j] === s[i]) j += 1;
            const key = s[i];
            const list = runs.get(key) ?? [];
            list.push(j - i);
            runs.set(key, list);
            i = j;
        }
        let best = -1;
        for (const list of runs.values()) {
            list.sort((a, b) => b - a);
            const [a = 0, b = 0, c = 0] = list;
            best = Math.max(best, a - 2, Math.min(a - 1, b), Math.min(a, Math.min(b, c)));
        }
        return best > 0 ? best : -1;
    }
}
