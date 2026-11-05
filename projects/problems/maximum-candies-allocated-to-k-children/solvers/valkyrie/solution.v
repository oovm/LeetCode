namespace leetcode.maximum_candies_allocated_to_k_children;

using std.collection;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 二分答案：每个孩子分到的糖数单调可行。
# 给定份数 `size` 时，每堆能分出 `candies / size` 份。
micro portions(candies: ArrayList<i64>, size: i64) -> i64 {
    let mut total: i64 = 0
    loop count in candies {
        total = total + count / size
    }
    return total
}

[export(case: "camelCase")]
micro maximumCandies(candies: ArrayList<i64>, k: i64) -> i64 {
    let mut total: i64 = 0
    let mut high: i64 = 0
    loop count in candies {
        total = total + count
        if count > high {
            high = count
        }
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
