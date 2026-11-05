namespace leetcode.cutting_ribbons;

using std.collection;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 二分答案：长度单调可行。
# 给定长度 `size` 时，每条丝带能切出 `ribbons / size` 段。
micro pieces(ribbons: ArrayList<i64>, size: i64) -> i64 {
    let mut total: i64 = 0
    loop length in ribbons {
        total = total + length / size
    }
    return total
}

[export(case: "camelCase")]
micro maxLength(ribbons: ArrayList<i64>, k: i64) -> i64 {
    let mut total: i64 = 0
    let mut high: i64 = 0
    loop length in ribbons {
        total = total + length
        if length > high {
            high = length
        }
    }
    if total < k {
        return 0
    }
    let mut low: i64 = 1
    while low < high {
        let mid: i64 = low + (high - low + 1) / 2
        if pieces(ribbons, mid) >= k {
            low = mid
        } else {
            high = mid - 1
        }
    }
    return low
}

class Solution {
    micro maxLength(self, ribbons: ArrayList<i64>, k: i64): i64 {
        return maxLength(ribbons, k)
    }
}
