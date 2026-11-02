namespace leetcode.number_of_bit_changes_to_make_two_integers_equal;

[export(case: "camelCase")]
micro min_changes(n: i64, k: i64) -> i64 {
    let mut count: i64 = 0
    let mut a: i64 = n
    let mut b: i64 = k
    while a > 0 || b > 0 {
        let bit_n: i64 = a.bit_and(1)
        let bit_k: i64 = b.bit_and(1)
        if bit_k == 1 && bit_n == 0 {
            return -1
        }
        if bit_n == 1 && bit_k == 0 {
            count = count + 1
        }
        a = a.bit_shift_right(1)
        b = b.bit_shift_right(1)
    }
    return count
}

class Solution {
    micro minChanges(self, n: i64, k: i64): i64 {
        return min_changes(n, k)
    }
}
