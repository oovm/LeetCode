export class Solution {
    validStrings(n: number): string[] {
        const answer: string[] = [];
        const limit = 2 ** n;
        for (let value = 0; value < limit; value++) {
            let text = '';
            let previousZero = false;
            let valid = true;
            for (let bit = n - 1; bit >= 0; bit--) {
                const digit = (value >> bit) & 1;
                if (digit === 0) {
                    if (previousZero) valid = false;
                    previousZero = true;
                } else {
                    previousZero = false;
                }
                text += digit;
            }
            if (valid) answer.push(text);
        }
        return answer;
    }
}
