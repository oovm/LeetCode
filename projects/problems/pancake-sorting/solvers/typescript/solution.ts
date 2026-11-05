export class Solution {
    pancakeSort(arr: number[]): number[] {
        const flip = (last: number) => {
            let left = 0;
            let right = last;
            while (left < right) {
                const tmp = arr[left];
                arr[left] = arr[right];
                arr[right] = tmp;
                left++;
                right--;
            }
        };
        const flips: number[] = [];
        for (let targetIndex = arr.length - 1; targetIndex > 0; targetIndex--) {
            const target = targetIndex + 1;
            let at = targetIndex;
            while (at > 0 && arr[at] !== target) {
                at--;
            }
            if (at < targetIndex) {
                if (at > 0) {
                    flips.push(at + 1);
                    flip(at);
                }
                flips.push(targetIndex + 1);
                flip(targetIndex);
            }
        }
        return flips;
    }
}
