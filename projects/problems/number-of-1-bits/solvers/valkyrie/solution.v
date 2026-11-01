namespace leetcode.number_of_1_bits;

[export(case: "camelCase")]
micro hamming_weight(n: i64) -> i64 {
    let mut count: i64 = 0
    let mut num: i64 = n
    while num > 0 {
        if num % 2 == 1 {
            count = count + 1
        }
        num = num / 2
    }
    return count
}

class Solution {
    micro hammingWeight(self, n: i64): i64 {
        return hamming_weight(n)
    }
}
