export class Solution {
    getPermutation(n: number, k: number): string {
        const factorial = [1];
        for (let i = 1; i <= n; i++) {
            factorial[i] = (factorial[i - 1] as number) * i;
        }
        const available = Array.from({ length: n }, (_, i) => i + 1);
        let rest = k - 1;
        let answer = '';
        for (let i = n; i >= 1; i--) {
            const index = Math.floor(rest / (factorial[i - 1] as number));
            rest %= factorial[i - 1] as number;
            answer += String(available.splice(index, 1)[0]);
        }
        return answer;
    }
}
