export class Solution {
    getMaxGridHappiness(m: number, n: number, introvertsCount: number, extrovertsCount: number): number {
        const cols = n;
        const states: { mask: number[]; intro: number; extro: number; gain: number }[] = [];
        const walk = (pos: number, mask: number[], intro: number, extro: number, gain: number): void => {
            if (pos === cols) {
                states.push({ mask: [...mask], intro, extro, gain });
                return;
            }
            walk(pos + 1, mask, intro, extro, gain);
            if (intro < introvertsCount) {
                let delta = 120;
                if (pos > 0 && mask[pos - 1] === 1) delta -= 30;
                if (pos > 0 && mask[pos - 1] === 2) delta += 20;
                mask[pos] = 1;
                walk(pos + 1, mask, intro + 1, extro, gain + delta);
                mask[pos] = 0;
            }
            if (extro < extrovertsCount) {
                let delta = 40;
                if (pos > 0 && mask[pos - 1] === 1) delta -= 30;
                if (pos > 0 && mask[pos - 1] === 2) delta += 20;
                mask[pos] = 2;
                walk(pos + 1, mask, intro, extro + 1, gain + delta);
                mask[pos] = 0;
            }
        };
        walk(0, new Array<number>(cols).fill(0), 0, 0, 0);
        const cross = (a: number[], b: number[]): number => {
            let delta = 0;
            for (let c = 0; c < cols; c++) {
                if (a[c] === 1 && b[c] === 1) delta -= 60;
                else if (a[c] === 2 && b[c] === 2) delta += 40;
                else if (a[c] !== 0 && b[c] !== 0) delta -= 10;
            }
            return delta;
        };
        const S = states.length;
        const stride = (extrovertsCount + 1) * S;
        let dp = new Map<number, number>();
        for (let s = 0; s < S; s++) {
            const st = states[s];
            dp.set(st.intro * stride + st.extro * S + s, st.gain);
        }
        for (let row = 1; row < m; row++) {
            const next = new Map<number, number>();
            for (const [k, v] of dp) {
                const pi = Math.floor(k / stride);
                const pe = Math.floor((k % stride) / S);
                const ps = k % S;
                for (let s = 0; s < S; s++) {
                    const cur = states[s];
                    const ni = pi + cur.intro;
                    const ne = pe + cur.extro;
                    if (ni > introvertsCount || ne > extrovertsCount) continue;
                    const nk = ni * stride + ne * S + s;
                    const val = v + cur.gain + cross(cur.mask, states[ps].mask);
                    if ((next.get(nk) ?? -Infinity) < val) next.set(nk, val);
                }
            }
            dp = next;
        }
        return Math.max(0, ...dp.values());
    }
}
