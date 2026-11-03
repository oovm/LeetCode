namespace leetcode.add_strings;

# 末位对齐逐位相加，低位先写入再反转，O(n)
[export(case: "camelCase")]
micro add_strings(num1: utf8, num2: utf8) -> utf8 {
    let mut i: usize = num1.length()
    let mut j: usize = num2.length()
    let mut carry: i64 = 0
    let mut digits: Utf8Builder = Utf8Builder::new(i + j + 1)
    while i > 0 || j > 0 || carry > 0 {
        let mut sum: i64 = carry
        if i > 0 {
            sum = sum + (num1⁅i - 1⁆ as u32 as i64) - 48
            i = i - 1
        }
        if j > 0 {
            sum = sum + (num2⁅j - 1⁆ as u32 as i64) - 48
            j = j - 1
        }
        digits.append(char::from((sum % 10 + 48) as u32))
        carry = sum / 10
    }
    let reversed: utf8 = digits.build()
    let n: usize = reversed.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut k: usize = n
    while k > 0 {
        builder.append(reversed⁅k - 1⁆)
        k = k - 1
    }
    return builder.build()
}

class Solution {
    micro addStrings(self, num1: utf8, num2: utf8): utf8 {
        return add_strings(num1, num2)
    }
}
