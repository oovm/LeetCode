namespace leetcode.divisible_and_non_divisible_sums_difference;

[export(case: "camelCase")]
micro difference_of_sums(n: i64, m: i64) -> i64 {
    let mut divisible: i64 = 0
    let mut non_divisible: i64 = 0
    let mut value: i64 = 1
    while value <= n {
        if value % m == 0 {
            divisible = divisible + value
        } else {
            non_divisible = non_divisible + value
        }
        value = value + 1
    }
    return non_divisible - divisible
}

class Solution {
    micro differenceOfSums(self, n: i64, m: i64): i64 {
        return difference_of_sums(n, m)
    }
}
