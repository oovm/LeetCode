namespace leetcode.longest_mountain_in_array;

using std.collection;

# 两侧各做一次线性 DP：`up` 记以 i 结尾的上升段长，`down` 记以 i 开头的下降段长。
# 枚举山顶 i（要求两侧都严格下降/上升），取 `up + down - 1` 最大。
[export(case: "camelCase")]
micro longest_mountain(arr: ArrayList<i64>) -> i64 {
    let n: usize = arr.length()
    if n < 3 {
        return 0
    }
    let mut up: ArrayList<i64> = ArrayList::new(n)
    let mut fill: usize = 0
    while fill < n {
        up.push(1)
        fill = fill + 1
    }
    let mut index: usize = 1
    while index < n {
        if arr⁅index⁆ > arr⁅index - 1⁆ {
            up⁅index⁆ = up⁅index - 1⁆ + 1
        }
        index = index + 1
    }
    let mut down: ArrayList<i64> = ArrayList::new(n)
    let mut slot: usize = 0
    while slot < n {
        down.push(1)
        slot = slot + 1
    }
    let mut cursor: i64 = n as i64 - 2
    while cursor >= 0 {
        let at: usize = cursor as usize
        if arr⁅at⁆ > arr⁅at + 1⁆ {
            down⁅at⁆ = down⁅at + 1⁆ + 1
        }
        cursor = cursor - 1
    }
    let mut best: i64 = 0
    let mut peak: usize = 1
    while peak + 1 < n {
        if up⁅peak⁆ > 1 && down⁅peak⁆ > 1 {
            let span: i64 = up⁅peak⁆ + down⁅peak⁆ - 1
            if span > best {
                best = span
            }
        }
        peak = peak + 1
    }
    return best
}

class Solution {
    micro longestMountain(self, arr: ArrayList<i64>): i64 {
        return longest_mountain(arr)
    }
}
