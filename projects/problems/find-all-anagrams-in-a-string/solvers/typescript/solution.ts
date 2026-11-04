export class Solution {
    findAnagrams(s: string, p: string): number[] {
        const result: number[] = [];
        const windowSize = p.length;
        if (windowSize === 0 || windowSize > s.length) return result;

        const need = new Map<string, number>();
        for (const ch of p) need.set(ch, (need.get(ch) ?? 0) + 1);

        const window = new Map<string, number>();
        let matched = 0;
        let left = 0;

        for (let right = 0; right < s.length; right++) {
            const ch = s[right];
            const required = need.get(ch);
            if (required !== undefined) {
                const old = window.get(ch) ?? 0;
                if (old === required) matched--;
                window.set(ch, old + 1);
                if (old + 1 === required) matched++;
            }

            if (right - left + 1 > windowSize) {
                const out = s[left];
                const requiredOut = need.get(out);
                if (requiredOut !== undefined) {
                    const old = window.get(out)!;
                    if (old === requiredOut) matched--;
                    if (old === 1) window.delete(out);
                    else {
                        window.set(out, old - 1);
                        if (old - 1 === requiredOut) matched++;
                    }
                }
                left++;
            }

            if (matched === need.size) result.push(left);
        }
        return result;
    }
}
