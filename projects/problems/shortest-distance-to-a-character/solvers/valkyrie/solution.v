namespace leetcode.shortest_distance_to_a_character;

# 左右各扫一遍取最近目标字符距离的较小值。
[export(case: "camelCase")]
micro shortest_to_char(s: utf8, c: utf8) -> [i64] {
    let n: usize = s.length()
    let target: char = c⁅0⁆
    let mut result: ArrayList<i64> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        result.push(n as i64)
        i = i + 1
    }
    let mut previous: i64 = -1000000
    i = 0
    while i < n {
        if s⁅i⁆ == target {
            previous = i as i64
        }
        let distance: i64 = i as i64 - previous
        if distance < result⁅i⁆ {
            result⁅i⁆ = distance
        }
        i = i + 1
    }
    let mut next: i64 = 1000000
    i = n
    while i > 0 {
        i = i - 1
        if s⁅i⁆ == target {
            next = i as i64
        }
        let distance: i64 = next - i as i64
        if distance < result⁅i⁆ {
            result⁅i⁆ = distance
        }
    }
    return result.to_array()
}

class Solution {
    micro shortestToChar(self, s: utf8, c: utf8): [i64] {
        return shortest_to_char(s, c)
    }
}
