namespace leetcode.latest_time_by_replacing_hidden_digits;

[export(case: "camelCase")]
micro maximum_time(time: utf8) -> utf8 {
    let mut chars: ArrayList<char> = ArrayList::new(5)
    let mut i: usize = 0
    while i < 5 {
        chars.push(time⁅i⁆)
        i = i + 1
    }
    if (chars⁅0⁆ as u32) == 63 {
        if (chars⁅1⁆ as u32) == 63 || (chars⁅1⁆ as u32) <= 51 {
            chars⁅0⁆ = char::from(50)
        } else {
            chars⁅0⁆ = char::from(49)
        }
    }
    if (chars⁅1⁆ as u32) == 63 {
        if (chars⁅0⁆ as u32) == 50 {
            chars⁅1⁆ = char::from(51)
        } else {
            chars⁅1⁆ = char::from(57)
        }
    }
    if (chars⁅3⁆ as u32) == 63 {
        chars⁅3⁆ = char::from(53)
    }
    if (chars⁅4⁆ as u32) == 63 {
        chars⁅4⁆ = char::from(57)
    }
    let mut builder: Utf8Builder = Utf8Builder::new(5)
    i = 0
    while i < 5 {
        builder.append(chars⁅i⁆)
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro maximumTime(self, time: utf8): utf8 {
        return maximum_time(time)
    }
}
