namespace leetcode.check_balanced_string;

# 偶数位数字和与奇数位数字和相等即平衡。
[export(case: "camelCase")]
micro is_balanced(num: utf8) -> bool {
    let n: usize = num.length()
    let mut even_sum: i64 = 0
    let mut odd_sum: i64 = 0
    let mut i: usize = 0
    while i < n {
        let digit: i64 = num⁅i⁆ as u32 as i64 - 48
        if (i as i64) % 2 == 0 {
            even_sum = even_sum + digit
        } else {
            odd_sum = odd_sum + digit
        }
        i = i + 1
    }
    return even_sum == odd_sum
}

class Solution {
    micro isBalanced(self, num: utf8): bool {
        return is_balanced(num)
    }
}
