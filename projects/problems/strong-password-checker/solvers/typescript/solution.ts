export class Solution {
    strongPasswordChecker(password: string): number {
        const n = password.length;
        let missing = 0;
        if (!/[a-z]/.test(password)) missing += 1;
        if (!/[A-Z]/.test(password)) missing += 1;
        if (!/\d/.test(password)) missing += 1;
        const runs: number[] = [];
        let i = 0;
        while (i < n) {
            let j = i;
            while (j < n && password[j] === password[i]) j += 1;
            if (j - i >= 3) runs.push(j - i);
            i = j;
        }
        const replace = runs.reduce((sum, len) => sum + Math.floor(len / 3), 0);
        if (n < 6) {
            return Math.max(missing, 6 - n);
        }
        if (n <= 20) {
            return Math.max(missing, replace);
        }
        const overflow = n - 20;
        let rest = overflow;
        for (const mod of [0, 1, 2]) {
            let budget = rest;
            for (let idx = 0; idx < runs.length && budget > 0; idx++) {
                if (runs[idx] % 3 === mod) {
                    const cut = Math.min(budget, mod + 1);
                    runs[idx] -= cut;
                    budget -= cut;
                    rest -= cut;
                }
            }
        }
        const deletions = runs.reduce((sum, len) => sum + Math.floor(len / 3), 0);
        return overflow + Math.max(missing, deletions);
    }
}
