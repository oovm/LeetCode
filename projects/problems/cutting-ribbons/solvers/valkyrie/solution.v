namespace leetcode.cutting_ribbons;

using std.collection;

# 临时绕过：`loop <var> in <ArrayList>` 在 OVM 后端因 `Cast` lowering 缺失而编译期失败（fail-closed 前表现为运行期零迭代），这里改用显式索引循环；OVM 后端 `Cast` lowering 落地后还原为 `loop ... in`。
# 二分答案：长度单调可行。
# 给定长度 `size` 时，每条丝带能切出 `ribbons / size` 段。
micro pieces(ribbons: ArrayList<i64>, size: i64) -> i64 {
    let mut total: i64 = 0
    let mut loop_index_9: usize = 0
    while loop_index_9 < ribbons.length() {
        let length: i64 = ribbons⁅loop_index_9⁆
            total = total + length / size
        loop_index_9 = loop_index_9 + 1
    }
    return total
}

[export(case: "camelCase")]
micro maxLength(ribbons: ArrayList<i64>, k: i64) -> i64 {
    let mut total: i64 = 0
    let mut high: i64 = 0
    let mut loop_index_19: usize = 0
    while loop_index_19 < ribbons.length() {
        let length: i64 = ribbons⁅loop_index_19⁆
            total = total + length
            if length > high {
                high = length
            }
        loop_index_19 = loop_index_19 + 1
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
