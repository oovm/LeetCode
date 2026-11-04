namespace leetcode.make_the_prefix_sum_non_negative;

using std.collection;

# 最小堆保存前缀中出现过的元素；前缀和为负时弹出最小值并计入操作数。
[export(case: "camelCase")]
micro makePrefSumNonNegative(nums: ArrayList<i64>) -> i64 {
    let mut heap: BinaryHeap<i64> = BinaryHeap::new()
    let mut prefix: i64 = 0
    let mut operations: i64 = 0
    loop value in nums {
        prefix = prefix + value
        heap.push(value)
        if prefix < 0 {
            let smallest: i64 = heap.pop().unwrap()
            prefix = prefix - smallest
            operations = operations + 1
        }
    }
    return operations
}

class Solution {
    micro makePrefSumNonNegative(self, nums: ArrayList<i64>): i64 {
        return makePrefSumNonNegative(nums)
    }
}
