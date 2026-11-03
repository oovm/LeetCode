export class Solution {
    digitSum(s: string, k: number): string {
        while (s.length > k) {
            const next: string[] = [];
            for (let i = 0; i < s.length; i += k) {
                let sum = 0;
                for (const ch of s.slice(i, i + k)) {
                    sum += ch.charCodeAt(0) - 48;
                }
                next.push(String(sum));
            }
            s = next.join('');
        }
        return s;
    }
}
