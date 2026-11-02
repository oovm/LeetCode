namespace leetcode.find_the_minimum_number_of_fibonacci_numbers_whose_sum_is_k;

[export(case: "camelCase")]
micro find_min_fibonacci_numbers(k: i64) -> i64 {
    let mut f1: i64 = 1
    let mut f2: i64 = 1
    while f2 <= k {
        let next: i64 = f1 + f2
        f1 = f2
        f2 = next
    }
    let mut count: i64 = 0
    let mut rest: i64 = k
    while rest > 0 {
        if f2 <= rest {
            rest = rest - f2
            count = count + 1
        } else {
            let next: i64 = f1
            f1 = f2 - f1
            f2 = next
        }
    }
    return count
}

class Solution {
    micro findMinFibonacciNumbers(self, k: i64): i64 {
        return find_min_fibonacci_numbers(k)
    }
}
