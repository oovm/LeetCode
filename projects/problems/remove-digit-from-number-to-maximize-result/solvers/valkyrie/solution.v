namespace leetcode.remove_digit_from_number_to_maximize_result;

[export(case: "camelCase")]
micro remove_digit(number: utf8, digit: utf8) -> utf8 {
    let n: usize = number.length()
    let d: u32 = digit⁅0⁆ as u32
    let mut target: usize = n
    let mut i: usize = 0
    while i < n {
        if number⁅i⁆ as u32 == d {
            if i + 1 == n {
                target = i
                i = n
            } else {
                let next: u32 = number⁅i + 1⁆ as u32
                if next > d {
                    target = i
                    i = n
                } else {
                    i = i + 1
                }
            }
        } else {
            i = i + 1
        }
    }
    if target == n {
        let mut j: usize = n
        while j > 0 {
            j = j - 1
            if number⁅j⁆ as u32 == d {
                target = j
                j = 0
            }
        }
    }
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    i = 0
    while i < n {
        if i != target {
            builder.append(number⁅i⁆)
        }
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro removeDigit(self, number: utf8, digit: utf8): utf8 {
        return remove_digit(number, digit)
    }
}
