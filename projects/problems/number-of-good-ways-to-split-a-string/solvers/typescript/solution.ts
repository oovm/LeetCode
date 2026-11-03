export class Solution {
    numSplits(s: string): number {
        const right = new Array<number>(26).fill(0);
        let rightDistinct = 0;
        for (const ch of s) {
            const i = ch.charCodeAt(0) - 97;
            if (right[i] === 0) rightDistinct += 1;
            right[i] += 1;
        }
        const left = new Array<number>(26).fill(0);
        let leftDistinct = 0;
        let good = 0;
        for (const ch of s) {
            const i = ch.charCodeAt(0) - 97;
            if (left[i] === 0) leftDistinct += 1;
            left[i] += 1;
            right[i] -= 1;
            if (right[i] === 0) rightDistinct -= 1;
            if (leftDistinct === rightDistinct) good += 1;
        }
        return good;
    }
}
