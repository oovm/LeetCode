namespace leetcode.maximum_candies_allocated_to_k_children;

using std.collection;

# 临时绕过：`loop <var> in <ArrayList>` 当前编译不报错但运行期零迭代，这里改用显式索引循环；`IntoIterator` 合同恢复后还原为 `loop ... in`。
# 二分答案：每个孩子分到的糖数单调可行。
# 给定份数 `size` 时，每堆能分出 `candies / size` 份。
micro portions(candies: ArrayList<i64>, size: i64) -> i64 {
    let mut total: i64 = 0
    let mut loop_index_9: usize = 0
    while loop_index_9 < candies.length() {
        let count: i64 = candies⁅loop_index_9⁆
            total = total + count / size
        loop_index_9 = loop_index_9 + 1
    }
    return total
}

[export(case: "camelCase")]
micro maximumCandies(candies: ArrayList<i64>, k: i64) -> i64 {
    let mut total: i64 = 0
    let mut high: i64 = 0
    let mut loop_index_19: usize = 0
    while loop_index_19 < candies.length() {
        let count: i64 = candies⁅loop_index_19⁆
            total = total + count
            if count > high {
                high = count
            }
        loop_index_19 = loop_index_19 + 1
    }
    if total < k {
        return 0
    }
    let mut low: i64 = 1
    while low < high {
        let mid: i64 = low + (high - low + 1) / 2
        if portions(candies, mid) >= k {
            low = mid
        } else {
            high = mid - 1
        }
    }
    return low
}

class Solution {
    micro maximumCandies(self, candies: ArrayList<i64>, k: i64): i64 {
        return maximumCandies(candies, k)
    }
}
