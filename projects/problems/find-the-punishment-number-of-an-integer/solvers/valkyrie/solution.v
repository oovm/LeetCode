namespace leetcode.find_the_punishment_number_of_an_integer;

# 十进制切分递归：sq 的某段后缀作为一段，前缀须凑出 target - suffix。
micro punishable(sq: i64, target: i64) -> bool {
    if sq == target {
        return true
    }
    if target < 0 {
        return false
    }
    let mut place: i64 = 10
    while sq / (place / 10) > 0 {
        if punishable(sq / place, target - sq % place) {
            return true
        }
        place = place * 10
    }
    return false
}

[export(case: "camelCase")]
micro punishment_number(n: i64) -> i64 {
    let mut total: i64 = 0
    let mut i: i64 = 1
    while i <= n {
        if punishable(i * i, i) {
            total = total + i * i
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro punishmentNumber(self, n: i64): i64 {
        return punishment_number(n)
    }
}
