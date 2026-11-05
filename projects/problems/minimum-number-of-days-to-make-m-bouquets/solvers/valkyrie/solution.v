namespace leetcode.minimum_number_of_days_to_make_m_bouquets;

using std.collection;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 二分答案：天数单调可行。检查窗口内连续开花长度，每凑够 k 朵收一束。
micro bouquets(bloom_day: ArrayList<i64>, day: i64, k: i64) -> i64 {
    let mut total: i64 = 0
    let mut run: i64 = 0
    loop value in bloom_day {
        if value <= day {
            run = run + 1
            if run == k {
                total = total + 1
                run = 0
            }
        } else {
            run = 0
        }
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
    loop value in bloomDay {
        if value > high {
            high = value
        }
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
