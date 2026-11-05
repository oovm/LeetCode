namespace leetcode.previous_permutation_with_one_swap;

using std.collection;

# 从右往左找第一个下降点 `i`，再在右侧找小于它的最大值换上来；
# 相同值时取最左一个，保证结果字典序尽量大。一趟 O(n)。
[export(case: "camelCase")]
micro prevPermOpt1(arr: ArrayList<i64>) -> ArrayList<i64> {
    let count: i64 = arr.length() as i64
    let mut result: ArrayList<i64> = ArrayList::new(count as usize)
    let mut copy: i64 = 0
    while copy < count {
        result.push(arr⁅copy as usize⁆)
        copy = copy + 1
    }

    let mut i: i64 = count - 2
    while i >= 0 && result⁅i as usize⁆ <= result⁅(i + 1) as usize⁆ {
        i = i - 1
    }
    if i < 0 {
        return result
    }

    let target: i64 = result⁅i as usize⁆
    let mut best: i64 = i + 1
    let mut j: i64 = i + 2
    while j < count {
        let value: i64 = result⁅j as usize⁆
        if value < target && value > result⁅best as usize⁆ {
            best = j
        }
        j = j + 1
    }
    while best > i + 1 && result⁅(best - 1) as usize⁆ == result⁅best as usize⁆ {
        best = best - 1
    }

    let held: i64 = result⁅i as usize⁆
    result⁅i as usize⁆ = result⁅best as usize⁆
    result⁅best as usize⁆ = held
    return result
}

class Solution {
    micro prevPermOpt1(self, arr: ArrayList<i64>): ArrayList<i64> {
        return prevPermOpt1(arr)
    }
}
