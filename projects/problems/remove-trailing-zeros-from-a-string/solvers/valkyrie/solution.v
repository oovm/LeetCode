namespace leetcode.remove_trailing_zeros_from_a_string;

[export(case: "camelCase")]
micro remove_trailing_zeros(num: utf8) -> utf8 {
    let n: usize = num.length()
    let mut end: usize = n
    while (end > 0) && ((num⁅end - 1⁆ as u32) == 48) {
        end = end - 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(end)
    let mut i: usize = 0
    while i < end {
        builder.append(num⁅i⁆)
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro removeTrailingZeros(self, num: utf8): utf8 {
        return remove_trailing_zeros(num)
    }
}
