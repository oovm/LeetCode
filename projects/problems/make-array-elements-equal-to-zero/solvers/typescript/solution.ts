export class Solution {
    countValidSelections(nums: number[]): number {
        let count = 0;
        for (let start = 0; start < nums.length; start++) {
            if (nums[start] !== 0) continue;
            for (const dir of [-1, 1]) {
                const arr = [...nums];
                let i = start;
                let d = dir;
                while (i >= 0 && i < arr.length) {
                    if (arr[i] === 0) {
                        i += d;
                    } else {
                        arr[i]--;
                        d = -d;
                        i += d;
                    }
                }
                if (arr.every((x) => x === 0)) count++;
            }
        }
        return count;
    }
}
