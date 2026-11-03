namespace leetcode.number_of_steps_to_reduce_a_number_in_binary_representation_to_one;

[export(case: "camelCase")]
micro num_steps(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut bits: ArrayList<i64> = ArrayList::new(n + 8)
    let mut i: usize = n
    while i > 0 {
        i = i - 1
        let code: u32 = s⁅i⁆ as u32
        bits.push(code as i64 - 48)
    }
    let mut start: usize = 0
    let mut len: usize = n
    let mut steps: i64 = 0
    while len > 1 {
        if bits⁅start⁆ == 0 {
            start = start + 1
            len = len - 1
        } else {
            let mut pos: usize = start
            let mut carry: bool = true
            while carry {
                if pos == start + len {
                    bits.push(1)
                    len = len + 1
                    carry = false
                } else if bits⁅pos⁆ == 1 {
                    bits⁅pos⁆ = 0
                    pos = pos + 1
                } else {
                    bits⁅pos⁆ = 1
                    carry = false
                }
            }
        }
        steps = steps + 1
    }
    return steps
}

class Solution {
    micro numSteps(self, s: utf8): i64 {
        return num_steps(s)
    }
}
