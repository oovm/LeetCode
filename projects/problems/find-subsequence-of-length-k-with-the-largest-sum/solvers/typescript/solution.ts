export class Solution {
    maxSubsequence(nums: number[], k: number): number[] {
        // 与 Python 参考解一致：按 (值, 原下标) 升序稳定排序，取末尾 k 个再按原序输出，
        // 并列值优先保留下标更大的元素。
        const order = nums.map((_, index) => index);
        order.sort((a, b) => nums[a] - nums[b] || a - b);
        const chosen = order.slice(order.length - k).sort((a, b) => a - b);
        return chosen.map((index) => nums[index]);
    }
}
