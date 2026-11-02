namespace leetcode.add_binary;

micro reverse_of(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut i: usize = n
    while i > 0 {
        builder.append(s⁅i - 1⁆)
        i = i - 1
    }
    return builder.build()
}

[export(case: "camelCase")]
micro add_binary(a: utf8, b: utf8) -> utf8 {
    let mut i: usize = a.length()
    let mut j: usize = b.length()
    let mut carry: i64 = 0
    let mut builder: Utf8Builder = Utf8Builder::new(i + j + 2)
    while i > 0 || j > 0 || carry > 0 {
        let mut sum: i64 = carry
        if i > 0 {
            sum = sum + (a⁅i - 1⁆ as u32 as i64 - 48)
            i = i - 1
        }
        if j > 0 {
            sum = sum + (b⁅j - 1⁆ as u32 as i64 - 48)
            j = j - 1
        }
        builder.append(char::from((sum % 2 + 48) as u32))
        carry = sum / 2
    }
    return reverse_of(builder.build())
}

class Solution {
    micro addBinary(self, a: utf8, b: utf8): utf8 {
        return add_binary(a, b)
    }
}
