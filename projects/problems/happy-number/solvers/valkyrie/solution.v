namespace leetcode.happy_number;

micro sum_square_digits(mut n: i64) -> i64 {
    let mut sum: i64 = 0
    while n != 0 {
        let d: i64 = n % 10
        sum = sum + d * d
        n = n / 10
    }
    return sum
}

[export(case: "camelCase")]
micro is_happy(n: i64) -> bool {
    let mut seen: HashSet<i64> = HashSet::new()
    let mut cur: i64 = n
    while cur != 1 {
        if seen.contains(cur) {
            return false
        }
        seen.insert(cur)
        cur = sum_square_digits(cur)
    }
    return true
}

class Solution {
    micro isHappy(self, n: i64): bool {
        return is_happy(n)
    }
}
