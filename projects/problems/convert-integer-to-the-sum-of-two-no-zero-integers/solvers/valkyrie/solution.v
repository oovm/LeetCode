namespace leetcode.convert_integer_to_the_sum_of_two_no_zero_integers;

micro has_zero(x: i64) -> bool {
    let mut value: i64 = x
    while value > 0 {
        if value % 10 == 0 {
            return true
        }
        value = value / 10
    }
    return false
}

# 从小到大找首个 a，使 a 与 n - a 都不含数字 0。
[export(case: "camelCase")]
micro get_no_zero_integers(n: i64) -> ArrayList<i64> {
    let mut a: i64 = 1
    while a < n {
        if !has_zero(a) && !has_zero(n - a) {
            let mut result: ArrayList<i64> = ArrayList::new(2)
            result.push(a)
            result.push(n - a)
            return result
        }
        a = a + 1
    }
    let mut fallback: ArrayList<i64> = ArrayList::new(2)
    fallback.push(0)
    fallback.push(n)
    return fallback
}

class Solution {
    micro getNoZeroIntegers(self, n: i64): ArrayList<i64> {
        return get_no_zero_integers(n)
    }
}
