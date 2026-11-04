namespace leetcode.magnetic_force_between_two_balls;

using std.collection;

# 先排序，再二分答案：最小磁力 `gap` 单调可行。
# 可行性检查：从第一个位置起贪心放置，间隔不小于 `gap` 就放。
micro placeable(position: ArrayList<i64>, gap: i64, m: i64) -> bool {
    let mut placed: i64 = 1
    let mut last: i64 = position⁅0⁆
    let mut index: usize = 1
    while index < position.length() {
        if position⁅index⁆ - last >= gap {
            placed = placed + 1
            last = position⁅index⁆
            if placed >= m {
                return true
            }
        }
        index = index + 1
    }
    return placed >= m
}

[export(case: "camelCase")]
micro maxDistance(position: ArrayList<i64>, m: i64) -> i64 {
    let mut ordered: ArrayList<i64> = ArrayList::new(position.length())
    loop value in position {
        ordered.push(value)
    }
    sort(ordered)

    let mut low: i64 = 1
    let mut high: i64 = ordered⁅ordered.length() - 1⁆ - ordered⁅0⁆
    if m > 2 {
        high = high / (m - 1)
    }
    while low < high {
        let mid: i64 = low + (high - low + 1) / 2
        if placeable(ordered, mid, m) {
            low = mid
        } else {
            high = mid - 1
        }
    }
    return low
}

class Solution {
    micro maxDistance(self, position: ArrayList<i64>, m: i64): i64 {
        return maxDistance(position, m)
    }
}
