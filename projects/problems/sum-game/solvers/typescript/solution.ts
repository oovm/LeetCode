export class Solution {
    sumGame(num: string): boolean {
        const n = num.length;
        const half = n / 2;
        let diff = 0;
        let questions = 0;
        for (let i = 0; i < n; i++) {
            const sign = i < half ? 1 : -1;
            if (num[i] === '?') {
                questions += sign;
            } else {
                diff += sign * (num.charCodeAt(i) - 48);
            }
        }
        if (questions % 2 !== 0) {
            return true;
        }
        return diff + (questions / 2) * 9 !== 0;
    }
}
