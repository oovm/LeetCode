namespace leetcode.sum_of_k_mirror_numbers;

micro make_palindrome(half: i64, odd: bool) -> i64 {
    let mut p: i64 = half
    let mut x: i64 = half
    if odd {
        x = x / 10
    }
    while x > 0 {
        p = p * 10 + x % 10
        x = x / 10
    }
    return p
}

micro is_base_k_palindrome(v: i64, k: i64) -> bool {
    let mut rev: i64 = 0
    let mut x: i64 = v
    while x > 0 {
        rev = rev * k + x % k
        x = x / k
    }
    return rev == v
}

# 按十进制位数从小到大枚举回文（半段镜像构造天然有序），筛 k 进制同为回文者。
[export(case: "camelCase")]
micro k_mirror(k: i64, n: i64) -> i64 {
    let mut found: i64 = 0
    let mut sum: i64 = 0
    let mut len: i64 = 1
    while found < n {
        let mut base: i64 = 1
        let mut i: i64 = 1
        while i < (len + 1) / 2 {
            base = base * 10
            i = i + 1
        }
        let mut half: i64 = base
        while half < base * 10 && found < n {
            let p: i64 = make_palindrome(half, len % 2 == 1)
            if is_base_k_palindrome(p, k) {
                sum = sum + p
                found = found + 1
            }
            half = half + 1
        }
        len = len + 1
    }
    return sum
}

class Solution {
    micro kMirror(self, k: i64, n: i64): i64 {
        return k_mirror(k, n)
    }
}
