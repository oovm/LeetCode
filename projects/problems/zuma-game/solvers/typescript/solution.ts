export class Solution {
    findMinStep(board: string, hand: string): number {
        const memo = new Map<string, number>();
        const clean = (b: string): string => {
            let changed = true;
            while (changed) {
                changed = false;
                let i = 0;
                while (i < b.length) {
                    let j = i;
                    while (j < b.length && b[j] === b[i]) j += 1;
                    if (j - i >= 3) {
                        b = b.slice(0, i) + b.slice(j);
                        changed = true;
                    } else {
                        i = j;
                    }
                }
            }
            return b;
        };
        const dfs = (b: string, h: string): number => {
            if (b === '') return 0;
            if (h === '') return -1;
            const key = `${b}#${[...h].sort().join('')}`;
            const hit = memo.get(key);
            if (hit !== undefined) return hit;
            let best = -1;
            for (let i = 0; i < b.length; i++) {
                for (let j = 0; j < h.length; j++) {
                    if (j > 0 && h[j] === h[j - 1]) continue;
                    if (b[i] !== h[j] && (i + 1 >= b.length || b[i + 1] !== b[i]) && (i === 0 || b[i - 1] !== b[i])) {
                        continue;
                    }
                    const next = clean(b.slice(0, i) + h[j] + b.slice(i));
                    const rest = h.slice(0, j) + h.slice(j + 1);
                    const sub = dfs(next, rest);
                    if (sub !== -1) {
                        const total = 1 + sub;
                        if (best === -1 || total < best) best = total;
                    }
                }
            }
            memo.set(key, best);
            return best;
        };
        return dfs(board, hand);
    }
}
