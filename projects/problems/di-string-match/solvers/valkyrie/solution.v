namespace leetcode.di_string_match;

# I 取当前最小值，D 取当前最大值，末尾补剩下的中间值。
[export(case: "camelCase")]
micro di_string_match(s: utf8) -> [i64] {
    let n: usize = s.length()
    let mut low: i64 = 0
    let mut high: i64 = n as i64
    let mut result: ArrayList<i64> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        if s⁅i⁆ as u32 == 73 {
            result.push(low)
            low = low + 1
        } else {
            result.push(high)
            high = high - 1
        }
        i = i + 1
    }
    result.push(low)
    return result.to_array()
}

class Solution {
    micro diStringMatch(self, s: utf8): [i64] {
        return di_string_match(s)
    }
}
