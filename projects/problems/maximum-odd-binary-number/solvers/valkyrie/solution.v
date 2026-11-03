namespace leetcode.maximum_odd_binary_number;

[export(case: "camelCase")]
micro maximum_odd_binary_number(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut ones: i64 = 0
    let mut i: usize = 0
    while i < n {
        if s⁅i⁆ as u32 == 49 {
            ones = ones + 1
        }
        i = i + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut k: i64 = ones - 1
    while k > 0 {
        builder.append(char::from(49))
        k = k - 1
    }
    let mut zeros: i64 = n as i64 - ones
    while zeros > 0 {
        builder.append(char::from(48))
        zeros = zeros - 1
    }
    builder.append(char::from(49))
    return builder.build()
}

class Solution {
    micro maximumOddBinaryNumber(self, s: utf8): utf8 {
        return maximum_odd_binary_number(s)
    }
}
