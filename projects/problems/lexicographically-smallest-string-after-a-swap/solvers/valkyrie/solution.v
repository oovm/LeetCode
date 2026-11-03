namespace leetcode.lexicographically_smallest_string_after_a_swap;

# 至多一次交换：找首个同奇偶且前大后小的相邻位对。
[export(case: "camelCase")]
micro get_smallest_string(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut swap_at: usize = n
    let mut found: bool = false
    let mut i: usize = 0
    while i + 1 < n && !found {
        let first: i64 = s⁅i⁆ as u32 as i64 - 48
        let second: i64 = s⁅i + 1⁆ as u32 as i64 - 48
        if first % 2 == second % 2 && first > second {
            swap_at = i
            found = true
        }
        i = i + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut j: usize = 0
    while j < n {
        if found && j == swap_at {
            builder.append(s⁅swap_at + 1⁆)
        } else if found && j == swap_at + 1 {
            builder.append(s⁅swap_at⁆)
        } else {
            builder.append(s⁅j⁆)
        }
        j = j + 1
    }
    return builder.build()
}

class Solution {
    micro getSmallestString(self, s: utf8): utf8 {
        return get_smallest_string(s)
    }
}
