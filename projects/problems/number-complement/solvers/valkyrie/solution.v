namespace leetcode.number_complement;

[export(case: "camelCase")]
micro find_complement(num: i64) -> i64 {
    let mut mask: i64 = 1
    let mut n: i64 = num
    while n > 1 {
        mask = mask * 2 + 1
        n = n / 2
    }
    return mask - num
}

class Solution {
    micro findComplement(self, num: i64): i64 {
        return find_complement(num)
    }
}
