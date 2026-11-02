namespace leetcode.mirror_reflection;

micro gcd(a: i64, b: i64) -> i64 {
    let mut x: i64 = a
    let mut y: i64 = b
    while y != 0 {
        let t: i64 = y
        y = x % y
        x = t
    }
    return x
}

[export(case: "camelCase")]
micro mirror_reflection(p: i64, q: i64) -> i64 {
    let g: i64 = gcd(p, q)
    let a: i64 = p / g
    let b: i64 = q / g
    if a % 2 == 0 {
        return 2
    }
    if b % 2 == 0 {
        return 0
    }
    return 1
}

class Solution {
    micro mirrorReflection(self, p: i64, q: i64): i64 {
        return mirror_reflection(p, q)
    }
}
