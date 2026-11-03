namespace leetcode.reverse_string_ii;

# 每 2k 段翻转前 k 个字符，O(n)
[export(case: "camelCase")]
micro reverse_str(s: utf8, k: i64) -> utf8 {
    let n: usize = s.length()
    let size: usize = k as usize
    let step: usize = size * 2
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut start: usize = 0
    while start < n {
        let mut end: usize = start + size
        if end > n {
            end = n
        }
        let mut p: usize = end
        while p > start {
            builder.append(s⁅p - 1⁆)
            p = p - 1
        }
        let mut limit: usize = start + step
        if limit > n {
            limit = n
        }
        let mut q: usize = end
        while q < limit {
            builder.append(s⁅q⁆)
            q = q + 1
        }
        start = start + step
    }
    return builder.build()
}

class Solution {
    micro reverseStr(self, s: utf8, k: i64): utf8 {
        return reverse_str(s, k)
    }
}
