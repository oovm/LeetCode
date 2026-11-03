namespace leetcode.license_key_formatting;

# 去掉连字符、转大写并按 k 从右分组，O(n)
[export(case: "camelCase")]
micro license_key_formatting(s: utf8, k: i64) -> utf8 {
    let n: usize = s.length()
    let mut count: usize = 0
    let mut i: usize = 0
    while i < n {
        if (s⁅i⁆ as u32) != 45 {
            count = count + 1
        }
        i = i + 1
    }
    let mut first_group: i64 = (count as i64) % k
    if first_group == 0 && count > 0 {
        first_group = k
    }
    let mut builder: Utf8Builder = Utf8Builder::new(count + 1)
    let mut column: i64 = 0
    let mut j: usize = 0
    while j < n {
        let code: u32 = s⁅j⁆ as u32
        if code != 45 {
            if column == first_group {
                builder.append(char::from(45))
                column = 0
                first_group = k
            }
            let mut out: u32 = code
            if code >= 97 && code <= 122 {
                out = code - 32
            }
            builder.append(char::from(out))
            column = column + 1
        }
        j = j + 1
    }
    return builder.build()
}

class Solution {
    micro licenseKeyFormatting(self, s: utf8, k: i64): utf8 {
        return license_key_formatting(s, k)
    }
}
