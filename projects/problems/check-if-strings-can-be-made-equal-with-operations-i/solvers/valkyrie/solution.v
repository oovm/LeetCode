namespace leetcode.check_if_strings_can_be_made_equal_with_operations_i;

[export(case: "camelCase")]
micro can_be_equal(s1: utf8, s2: utf8) -> bool {
    let a0: u32 = s1⁅0⁆ as u32
    let a1: u32 = s1⁅1⁆ as u32
    let a2: u32 = s1⁅2⁆ as u32
    let a3: u32 = s1⁅3⁆ as u32
    let b0: u32 = s2⁅0⁆ as u32
    let b1: u32 = s2⁅1⁆ as u32
    let b2: u32 = s2⁅2⁆ as u32
    let b3: u32 = s2⁅3⁆ as u32
    let even_ok: bool = ((a0 == b0) && (a2 == b2)) || ((a0 == b2) && (a2 == b0))
    let odd_ok: bool = ((a1 == b1) && (a3 == b3)) || ((a1 == b3) && (a3 == b1))
    return even_ok && odd_ok
}

class Solution {
    micro canBeEqual(self, s1: utf8, s2: utf8): bool {
        return can_be_equal(s1, s2)
    }
}
