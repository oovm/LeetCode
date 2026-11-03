namespace leetcode.permutation_difference_between_two_strings;

# 记录 s 中每个字母的位置，再按 t 逐位累加位置差。
[export(case: "camelCase")]
micro find_permutation_difference(s: utf8, t: utf8) -> i64 {
    let mut position: ArrayList<i64> = ArrayList::new(26)
    let mut k: usize = 0
    while k < 26 {
        position.push(-1)
        k = k + 1
    }
    let mut i: usize = 0
    while i < s.length() {
        let slot: usize = (s⁅i⁆ as u32 - 97) as usize
        position⁅slot⁆ = i as i64
        i = i + 1
    }
    let mut total: i64 = 0
    i = 0
    while i < t.length() {
        let slot: usize = (t⁅i⁆ as u32 - 97) as usize
        let diff: i64 = position⁅slot⁆ - i as i64
        if diff < 0 {
            total = total - diff
        } else {
            total = total + diff
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro findPermutationDifference(self, s: utf8, t: utf8): i64 {
        return find_permutation_difference(s, t)
    }
}
