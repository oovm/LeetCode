namespace leetcode.find_n_unique_integers_sum_up_to_zero;

# 成对放 i 与 -i，剩一个名额补 0。
[export(case: "camelCase")]
micro sum_zero(n: i64) -> ArrayList<i64> {
    let mut result: ArrayList<i64> = ArrayList::new(n as usize)
    let mut i: i64 = 1
    while i * 2 <= n {
        result.push(i)
        result.push(0 - i)
        i = i + 1
    }
    if n % 2 == 1 {
        result.push(0)
    }
    return result
}

class Solution {
    micro sumZero(self, n: i64): ArrayList<i64> {
        return sum_zero(n)
    }
}
