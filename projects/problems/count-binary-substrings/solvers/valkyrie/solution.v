namespace leetcode.count_binary_substrings;

# 统计相邻同值游程，每对游程贡献 min(prev, cur)，O(n)
[export(case: "camelCase")]
micro count_binary_substrings(s: utf8) -> i64 {
    let n: usize = s.length()
    if n == 0 {
        return 0
    }
    let mut total: i64 = 0
    let mut prev: i64 = 0
    let mut cur: i64 = 1
    let mut i: usize = 1
    while i < n {
        if (s⁅i⁆ as u32) == (s⁅i - 1⁆ as u32) {
            cur = cur + 1
        } else {
            if prev < cur {
                total = total + prev
            } else {
                total = total + cur
            }
            prev = cur
            cur = 1
        }
        i = i + 1
    }
    if prev < cur {
        total = total + prev
    } else {
        total = total + cur
    }
    return total
}

class Solution {
    micro countBinarySubstrings(self, s: utf8): i64 {
        return count_binary_substrings(s)
    }
}
