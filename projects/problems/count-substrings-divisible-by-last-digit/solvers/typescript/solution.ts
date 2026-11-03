export class Solution {
    countSubstrings(s: string): number {
        let total = 0;
        for (let i = 0; i < s.length; i++) {
            const d = s.charCodeAt(i) - 48;
            if (d === 0) continue;
            let value = 0;
            let power = 1;
            for (let j = i; j >= 0; j--) {
                value = ((s.charCodeAt(j) - 48) * power + value) % d;
                power = (power * 10) % d;
                if (value === 0) total += 1;
            }
        }
        return total;
    }
}
