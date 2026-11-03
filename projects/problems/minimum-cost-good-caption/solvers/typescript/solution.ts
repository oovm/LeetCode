export class Solution {
    minCostGoodCaption(caption: string): string {
        const n = caption.length;
        if (n < 3) return '';
        type Cell = { cost: number; text: string } | null;
        const better = (a: Cell, cost: number, text: string): boolean =>
            a === null || cost < a.cost || (cost === a.cost && text < a.text);
        let dp: Cell[][] = Array.from({ length: 26 }, () => [null, null, null]);
        for (let c = 0; c < 26; c++) {
            dp[c][0] = { cost: 0, text: '' };
        }
        for (let i = 0; i < n; i++) {
            const cur = caption.charCodeAt(i) - 97;
            const next: Cell[][] = Array.from({ length: 26 }, () => [null, null, null]);
            for (let c = 0; c < 26; c++) {
                const add = Math.abs(cur - c);
                const ch = String.fromCharCode(97 + c);
                for (let p = 0; p < 26; p++) {
                    for (let r = 0; r < 3; r++) {
                        const cell = dp[p][r];
                        if (cell === null) continue;
                        if (p === c) {
                            const nr = Math.min(2, r + 1);
                            const nc = cell.cost + add;
                            if (better(next[c][nr], nc, cell.text + ch)) {
                                next[c][nr] = { cost: nc, text: cell.text + ch };
                            }
                        } else if (r === 2) {
                            const nc = cell.cost + add;
                            if (better(next[c][0], nc, cell.text + ch)) {
                                next[c][0] = { cost: nc, text: cell.text + ch };
                            }
                        }
                    }
                }
            }
            dp = next;
        }
        let best: Cell = null;
        for (let c = 0; c < 26; c++) {
            const cell = dp[c][2];
            if (cell !== null && better(best, cell.cost, cell.text)) {
                best = cell;
            }
        }
        return best === null ? '' : best.text;
    }
}
