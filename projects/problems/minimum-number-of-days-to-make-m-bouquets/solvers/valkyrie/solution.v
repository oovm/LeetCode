namespace leetcode.minimum_number_of_days_to_make_m_bouquets;

using std.collection;

# 临时绕过：`loop <var> in <ArrayList>` 在 OVM 后端因 `Cast` lowering 缺失而编译期失败（fail-closed 前表现为运行期零迭代），这里改用显式索引循环；OVM 后端 `Cast` lowering 落地后还原为 `loop ... in`。
# 二分答案：天数单调可行。检查窗口内连续开花长度，每凑够 k 朵收一束。
micro bouquets(bloom_day: ArrayList<i64>, day: i64, k: i64) -> i64 {
    let mut total: i64 = 0
    let mut run: i64 = 0
    let mut loop_index_9: usize = 0
    while loop_index_9 < bloom_day.length() {
        let value: i64 = bloom_day⁅loop_index_9⁆
            if value <= day {
                run = run + 1
                if run == k {
                    total = total + 1
                    run = 0
                }
            } else {
                run = 0
            }
        loop_index_9 = loop_index_9 + 1
    }
    return total
}

[export(case: "camelCase")]
micro minDays(bloomDay: ArrayList<i64>, m: i64, k: i64) -> i64 {
    if m * k > bloomDay.length() as i64 {
        return -1
    }
    let mut low: i64 = 0
    let mut high: i64 = 0
    let mut loop_index_30: usize = 0
    while loop_index_30 < bloomDay.length() {
        let value: i64 = bloomDay⁅loop_index_30⁆
            if value > high {
                high = value
            }
        loop_index_30 = loop_index_30 + 1
    }
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if bouquets(bloomDay, mid, k) >= m {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return low
}

class Solution {
    micro minDays(self, bloomDay: ArrayList<i64>, m: i64, k: i64): i64 {
        return minDays(bloomDay, m, k)
    }
}
