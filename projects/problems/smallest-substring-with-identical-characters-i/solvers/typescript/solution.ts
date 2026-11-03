export class Solution {
    minLength(s: string, numOps: number): number {
        const can = (limit: number): boolean => {
            let ops = 0;
            let i = 0;
            while (i < s.length) {
                let j = i;
                while (j < s.length && s[j] === s[i]) j += 1;
                ops += Math.floor((j - i) / (limit + 1));
                if (ops > numOps) return false;
                i = j;
            }
            return true;
        };
        let lo = 1;
        let hi = s.length;
        while (lo < hi) {
            const mid = Math.floor((lo + hi) / 2);
            if (can(mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
}
