namespace leetcode.find_the_difference;

# 字符码和之差即多出的字符，O(n)
[export(case: "camelCase")]
micro find_the_difference(s: utf8, t: utf8) -> utf8 {
    let mut sum: i64 = 0
    let mut i: usize = 0
    while i < t.length() {
        sum = sum + (t⁅i⁆ as u32 as i64)
        i = i + 1
    }
    i = 0
    while i < s.length() {
        sum = sum - (s⁅i⁆ as u32 as i64)
        i = i + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(2)
    builder.append(char::from(sum as u32))
    return builder.build()
}

class Solution {
    micro findTheDifference(self, s: utf8, t: utf8): utf8 {
        return find_the_difference(s, t)
    }
}
