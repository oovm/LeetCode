namespace leetcode.minimum_sum_of_four_digit_number_after_splitting_digits;

[export(case: "camelCase")]
micro minimum_sum(num: i64) -> i64 {
    let mut d0: i64 = num % 10
    let mut d1: i64 = (num / 10) % 10
    let mut d2: i64 = (num / 100) % 10
    let mut d3: i64 = (num / 1000) % 10
    let mut t: i64 = 0
    if d0 > d1 {
        t = d0
        d0 = d1
        d1 = t
    }
    if d2 > d3 {
        t = d2
        d2 = d3
        d3 = t
    }
    if d0 > d2 {
        t = d0
        d0 = d2
        d2 = t
    }
    if d1 > d3 {
        t = d1
        d1 = d3
        d3 = t
    }
    if d1 > d2 {
        t = d1
        d1 = d2
        d2 = t
    }
    return 10 * (d0 + d1) + d2 + d3
}

class Solution {
    micro minimumSum(self, num: i64): i64 {
        return minimum_sum(num)
    }
}
