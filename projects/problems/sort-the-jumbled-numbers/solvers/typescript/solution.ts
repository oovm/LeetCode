export class Solution {
    sortJumbled(mapping: number[], nums: number[]): number[] {
        const jumbled = (value: number): number => {
            if (value === 0) return mapping[0];
            let result = 0;
            let factor = 1;
            let rest = value;
            while (rest > 0) {
                result += mapping[rest % 10] * factor;
                factor *= 10;
                rest = Math.floor(rest / 10);
            }
            return result;
        };

        return nums
            .map((value) => ({ value, mapped: jumbled(value) }))
            .sort((left, right) => left.mapped - right.mapped)
            .map((entry) => entry.value);
    }
}
