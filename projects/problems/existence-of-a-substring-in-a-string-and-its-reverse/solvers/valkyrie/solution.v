namespace leetcode.existence_of_a_substring_in_a_string_and_its_reverse;

micro pair_slot(first: u32, second: u32) -> usize {
    return (first * 128 + second) as usize
}

# 先标记所有相邻双字符，再查其逆序对是否同样出现。
[export(case: "camelCase")]
micro is_substring_present(s: utf8) -> bool {
    let n: usize = s.length()
    let mut seen: ArrayList<i64> = ArrayList::new(16384)
    let mut k: usize = 0
    while k < 16384 {
        seen.push(0)
        k = k + 1
    }
    let mut i: usize = 0
    while i + 1 < n {
        let slot: usize = pair_slot(s⁅i⁆ as u32, s⁅i + 1⁆ as u32)
        seen⁅slot⁆ = 1
        i = i + 1
    }
    i = 0
    while i + 1 < n {
        let slot: usize = pair_slot(s⁅i + 1⁆ as u32, s⁅i⁆ as u32)
        if seen⁅slot⁆ == 1 {
            return true
        }
        i = i + 1
    }
    return false
}

class Solution {
    micro isSubstringPresent(self, s: utf8): bool {
        return is_substring_present(s)
    }
}
