namespace leetcode.can_make_arithmetic_progression_from_sequence;

[export(case: "camelCase")]
micro can_make_arithmetic_progression(arr: ArrayList<i64>) -> bool {
    let n: usize = arr.length()
    let mut values: ArrayList<i64> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        values.push(arr⁅i⁆.unwrap())
        i = i + 1
    }
    i = 0
    while i < n {
        let mut best: usize = i
        let mut j: usize = i + 1
        while j < n {
            if values⁅j⁆.unwrap() < values⁅best⁆.unwrap() {
                best = j
            }
            j = j + 1
        }
        if best != i {
            let tmp: i64 = values⁅i⁆.unwrap()
            values⁅i⁆ = values⁅best⁆.unwrap()
            values⁅best⁆ = tmp
        }
        i = i + 1
    }
    let step: i64 = values⁅1⁆.unwrap() - values⁅0⁆.unwrap()
    i = 1
    while i + 1 < n {
        if values⁅i + 1⁆.unwrap() - values⁅i⁆.unwrap() != step {
            return false
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro canMakeArithmeticProgression(self, arr: ArrayList<i64>): bool {
        return can_make_arithmetic_progression(arr)
    }
}
