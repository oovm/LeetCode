namespace leetcode.fibonacci_number;

[export(case: "camelCase")]
micro fib(n: i64) -> i64 {
    if n <= 1 {
        return n
    }
    let mut a: i64 = 0
    let mut b: i64 = 1
    let mut i: i64 = 2
    while i <= n {
        let next: i64 = a + b
        a = b
        b = next
        i = i + 1
    }
    return b
}

class Solution {
    micro fib(self, n: i64): i64 {
        return fib(n)
    }
}
