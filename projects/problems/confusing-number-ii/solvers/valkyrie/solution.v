namespace leetcode.confusing_number_ii;

micro rotated(x: i64) -> i64 {
    let mut result: i64 = 0
    let mut rest: i64 = x
    while rest > 0 {
        let d: i64 = rest % 10
        let mut mapped: i64 = d
        if d == 6 {
            mapped = 9
        } else if d == 9 {
            mapped = 6
        }
        result = result * 10 + mapped
        rest = rest / 10
    }
    return result
}

# 递归追加 {0,1,6,8,9} 生成 ≤ n 的候选；旋转后不等即混淆数。
micro count_confusing_le(n: i64, current: i64) -> i64 {
    if current > n {
        return 0
    }
    let mut total: i64 = 0
    if current > 0 && rotated(current) != current {
        total = 1
    }
    let mut i: i64 = 0
    while i < 5 {
        let mut d: i64 = 0
        if i == 1 {
            d = 1
        } else if i == 2 {
            d = 6
        } else if i == 3 {
            d = 8
        } else if i == 4 {
            d = 9
        }
        if !(current == 0 && d == 0) {
            total = total + count_confusing_le(n, current * 10 + d)
        }
        i = i + 1
    }
    return total
}

[export(case: "camelCase")]
micro confusing_number_ii(n: i64) -> i64 {
    return count_confusing_le(n, 0)
}

class Solution {
    micro confusingNumberII(self, n: i64): i64 {
        return confusing_number_ii(n)
    }
}
