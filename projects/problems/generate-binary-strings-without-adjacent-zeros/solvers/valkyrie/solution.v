namespace leetcode.generate_binary_strings_without_adjacent_zeros;

# 按数值升序枚举 0 .. 2^n - 1，过滤掉含相邻 0 的串。
[export(case: "camelCase")]
micro valid_strings(n: i64) -> ArrayList<utf8> {
    let limit: i64 = 1 << n
    let mut answer: ArrayList<utf8> = ArrayList::new(0)
    let mut value: i64 = 0
    while value < limit {
        let mut builder: Utf8Builder = Utf8Builder::new(n as usize)
        let mut previous_zero: bool = false
        let mut valid: bool = true
        let mut bit: i64 = n - 1
        while bit >= 0 {
            let digit: i64 = (value >> bit) & 1
            if digit == 0 {
                if previous_zero {
                    valid = false
                }
                previous_zero = true
            } else {
                previous_zero = false
            }
            builder.append(char::from((48 + digit) as u32))
            bit = bit - 1
        }
        if valid {
            answer.push(builder.build())
        }
        value = value + 1
    }
    return answer
}

class Solution {
    micro validStrings(self, n: i64): ArrayList<utf8> {
        return valid_strings(n)
    }
}
