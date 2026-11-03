namespace leetcode.find_the_encrypted_string;

# 第 i 位取原串 (i + k) mod n 处字符。
[export(case: "camelCase")]
micro get_encrypted_string(s: utf8, k: i64) -> utf8 {
    let n: usize = s.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut i: usize = 0
    while i < n {
        let offset: i64 = (i as i64 + k % n as i64) % n as i64
        builder.append(s⁅offset as usize⁆)
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro getEncryptedString(self, s: utf8, k: i64): utf8 {
        return get_encrypted_string(s, k)
    }
}
