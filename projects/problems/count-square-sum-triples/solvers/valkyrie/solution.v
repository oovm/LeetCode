namespace leetcode.count_square_sum_triples;

micro integer_square_root(value: i64) -> i64 {
    if value < 2 {
        return value
    }
    let mut guess: i64 = value
    let mut next: i64 = (guess + 1) / 2
    while next < guess {
        guess = next
        next = (guess + value / guess) / 2
    }
    return guess
}

[export(case: "camelCase")]
micro count_triples(n: i64) -> i64 {
    let mut counter: i64 = 0
    let mut a: i64 = 1
    while a <= n {
        let mut b: i64 = 1
        while b <= n {
            let square_sum: i64 = a * a + b * b
            let c: i64 = integer_square_root(square_sum)
            if c <= n && c * c == square_sum {
                counter = counter + 1
            }
            b = b + 1
        }
        a = a + 1
    }
    return counter
}

class Solution {
    micro countTriples(self, n: i64): i64 {
        return count_triples(n)
    }
}
