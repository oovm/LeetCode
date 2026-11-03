namespace leetcode.largest_odd_number_in_string;

[export(case: "camelCase")]
micro largest_odd_number(num: utf8) -> utf8 {
    let n: usize = num.length()
    let mut last: i64 = -1
    let mut i: usize = 0
    while i < n {
        let digit: i64 = num⁅i⁆ as u32 as i64 - 48
        if digit % 2 == 1 {
            last = i as i64
        }
        i = i + 1
    }
    if last < 0 {
        return Utf8Builder::new(0).build()
    }
    let count: usize = (last + 1) as usize
    let mut builder: Utf8Builder = Utf8Builder::new(count)
    let mut k: usize = 0
    while k < count {
        builder.append(num⁅k⁆)
        k = k + 1
    }
    return builder.build()
}

class Solution {
    micro largestOddNumber(self, num: utf8): utf8 {
        return largest_odd_number(num)
    }
}
