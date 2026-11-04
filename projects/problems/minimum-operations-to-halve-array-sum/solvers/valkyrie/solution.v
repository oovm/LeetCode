namespace leetcode.minimum_operations_to_halve_array_sum;

using std.collection;

# 大顶堆保存浮点元素。`f64` 未实现 `Comparable`，只能走比较器堆。
[export(case: "camelCase")]
micro halveArray(nums: ArrayList<i64>) -> i64 {
    let mut total: f64 = 0.0
    let mut heap: BinaryHeap<f64> = BinaryHeap::new_by(micro(a: f64, b: f64) -> i32 {
        if a > b {
            return -1
        }
        if a < b {
            return 1
        }
        return 0
    })
    loop value in nums {
        let number: f64 = value as f64
        total = total + number
        heap.push(number)
    }

    let target: f64 = total / 2.0
    let mut reduced: f64 = 0.0
    let mut operations: i64 = 0
    while reduced < target {
        let top: f64 = heap.pop().unwrap()
        let half: f64 = top / 2.0
        reduced = reduced + half
        heap.push(half)
        operations = operations + 1
    }
    return operations
}

class Solution {
    micro halveArray(self, nums: ArrayList<i64>): i64 {
        return halveArray(nums)
    }
}
