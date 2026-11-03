export class Solution {
    transformArray(arr: number[]): number[] {
        const out = [...arr];
        let changed = true;
        while (changed) {
            changed = false;
            const prev = [...out];
            for (let i = 1; i < out.length - 1; i++) {
                if (prev[i] < prev[i - 1] && prev[i] < prev[i + 1]) {
                    out[i] = prev[i] + 1;
                    changed = true;
                } else if (prev[i] > prev[i - 1] && prev[i] > prev[i + 1]) {
                    out[i] = prev[i] - 1;
                    changed = true;
                }
            }
        }
        return out;
    }
}
