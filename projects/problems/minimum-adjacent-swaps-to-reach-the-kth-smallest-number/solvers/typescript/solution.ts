export class Solution {
    getMinSwaps(num: string, k: number): number {
        let target = num.split('');
        for (let step = 0; step < k; step++) {
            let i = target.length - 2;
            while (target[i] >= target[i + 1]) i -= 1;
            let j = target.length - 1;
            while (target[j] <= target[i]) j -= 1;
            [target[i], target[j]] = [target[j], target[i]];
            target = [...target.slice(0, i + 1), ...target.slice(i + 1).reverse()];
        }
        let swaps = 0;
        const origin = num.split('');
        for (let i = 0; i < origin.length; i++) {
            if (origin[i] !== target[i]) {
                let j = i + 1;
                while (origin[j] !== target[i]) j += 1;
                while (j > i) {
                    [origin[j], origin[j - 1]] = [origin[j - 1], origin[j]];
                    j -= 1;
                    swaps += 1;
                }
            }
        }
        return swaps;
    }
}
