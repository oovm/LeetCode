namespace leetcode.minimum_operations_to_exceed_threshold_value_ii;

using std.collection;

# 最小堆：每次取两个最小值，压回 `min * 2 + max`。
[export(case: "camelCase")]
micro minOperations(nums: ArrayList<i64>, k: i64) -> i64 {
    let mut heap: BinaryHeap<i64> = BinaryHeap::new()
    loop value in nums {
        heap.push(value)
    }

    let mut operations: i64 = 0
    while heap.length() >= 2 {
        let current: i64 = heap.peek().unwrap()
        if current >= k {
            break
        }
        let first: i64 = heap.pop().unwrap()
        let second: i64 = heap.pop().unwrap()
        let mut smaller: i64 = first
        let mut larger: i64 = second
        if first > second {
            smaller = second
            larger = first
        }
        heap.push(smaller * 2 + larger)
        operations = operations + 1
    }
    return operations
}

class Solution {
    micro minOperations(self, nums: ArrayList<i64>, k: i64): i64 {
        return minOperations(nums, k)
    }
}
