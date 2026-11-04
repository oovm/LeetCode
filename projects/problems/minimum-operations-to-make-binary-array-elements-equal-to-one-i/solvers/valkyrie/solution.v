namespace leetcode.minimum_operations_to_make_binary_array_elements_equal_to_one_i;

using std.collection;

# 从左往右贪心：遇到 0 就在此处翻三位。`Deque` 记录仍在生效的翻转起点，
# 起点 s 覆盖 s..s+2，滑到 i 时把 s + 2 < i 的起点移出队首。
# 剩余元素不足三位时返回 -1。
[export(case: "camelCase")]
micro minOperations(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let mut pending: Deque<i64> = Deque::new()
    let mut flips: i64 = 0
    let mut operations: i64 = 0

    let mut index: usize = 0
    while index < count {
        while pending.is_empty() == false {
            let front: usize = pending.peek_front().unwrap() as usize
            if front + 2 >= index {
                break
            }
            pending.pop_front()
            flips = flips - 1
        }

        let effective: i64 = (nums⁅index⁆ + flips) % 2
        if effective == 0 {
            if index + 2 >= count {
                return -1
            }
            pending.push_back(index as i64)
            flips = flips + 1
            operations = operations + 1
        }
        index = index + 1
    }
    return operations
}

class Solution {
    micro minOperations(self, nums: ArrayList<i64>): i64 {
        return minOperations(nums)
    }
}
