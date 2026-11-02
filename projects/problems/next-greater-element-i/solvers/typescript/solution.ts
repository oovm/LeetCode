export class Solution {
    nextGreaterElement(nums1: number[], nums2: number[]): number[] {
        const stack: number[] = [];
        const map = new Map<number, number>();
        for (let j = nums2.length - 1; j >= 0; j--) {
            const x = nums2[j];
            while (stack.length > 0 && stack[stack.length - 1] < x) {
                stack.pop();
            }
            if (stack.length > 0) {
                map.set(x, stack[stack.length - 1]);
            }
            stack.push(x);
        }
        return nums1.map((x) => map.get(x) ?? -1);
    }
}
