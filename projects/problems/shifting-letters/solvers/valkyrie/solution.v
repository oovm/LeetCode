namespace leetcode.shifting_letters;

using std.collection;

# 从右往左累加位移，每个字符的最终位移是其后所有位移之和（含自己）。
# 先写入等长数组再从前往后拼字符串，避免倒序拼接。
[export(case: "camelCase")]
micro shifting_letters(s: utf8, shifts: ArrayList<i64>) -> utf8 {
    let length: usize = s.byte_length()
    let mut shifted: ArrayList<i64> = ArrayList::new(length)
    let mut fill: usize = 0
    while fill < length {
        shifted.push(0)
        fill = fill + 1
    }
    let mut carry: i64 = 0
    let mut cursor: i64 = length as i64 - 1
    while cursor >= 0 {
        let at: usize = cursor as usize
        if at < shifts.length() {
            carry = (carry + shifts⁅at⁆) % 26
        }
        let base: i64 = s.byte_at(at) as i64 - 97
        shifted⁅at⁆ = (base + carry) % 26
        cursor = cursor - 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(length)
    let mut index: usize = 0
    while index < length {
        builder.append(char::from((shifted⁅index⁆ + 97) as u32))
        index = index + 1
    }
    return builder.build()
}

class Solution {
    micro shiftingLetters(self, s: utf8, shifts: ArrayList<i64>): utf8 {
        return shifting_letters(s, shifts)
    }
}
