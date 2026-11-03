namespace leetcode.reverse_degree_of_a_string;

# 各位逆序字母序（z 为 1）乘以 1 基下标后累加。
[export(case: "camelCase")]
micro reverse_degree(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut total: i64 = 0
    let mut i: usize = 0
    while i < n {
        let position: i64 = 26 - (s⁅i⁆ as u32 as i64 - 97)
        total = total + position * (i as i64 + 1)
        i = i + 1
    }
    return total
}

class Solution {
    micro reverseDegree(self, s: utf8): i64 {
        return reverse_degree(s)
    }
}
