namespace leetcode.hash_divided_string;

using std.text;

# 每 k 个字符一段，段内字母序和 mod 26 还原为结果字符。
[export(case: "camelCase")]
micro string_hash(s: utf8, k: i64) -> utf8 {
    let step: usize = k as usize
    let count: usize = s.length()
    let mut builder: Utf8Builder = Utf8Builder::new(count / step + 1)
    let mut start: usize = 0
    while start < count {
        let mut total: i64 = 0
        let mut offset: usize = 0
        while offset < step {
            total = total + (s⁅start + offset⁆ as u32 as i64 - 97)
            offset = offset + 1
        }
        let hashed: i64 = total % 26
        builder.append(char::from((97 + hashed) as u32))
        start = start + step
    }
    return builder.build()
}

class Solution {
    micro stringHash(self, s: utf8, k: i64): utf8 {
        return string_hash(s, k)
    }
}
