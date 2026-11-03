namespace leetcode.thousand_separator;

[export(case: "camelCase")]
micro thousand_separator(n: i64) -> utf8 {
    let mut digits: ArrayList<i64> = ArrayList::new(12)
    let mut x: i64 = n
    if x == 0 {
        digits.push(0)
    }
    while x > 0 {
        digits.push(x % 10)
        x = x / 10
    }
    let len: usize = digits.length()
    let mut builder: Utf8Builder = Utf8Builder::new(len + len / 3)
    let mut i: usize = len
    while i > 0 {
        i = i - 1
        if i > 0 && (len - i) % 3 == 0 {
            builder.append(char::from(46))
        }
        builder.append(char::from((digits⁅i⁆.unwrap() + 48) as u32))
    }
    return builder.build()
}

class Solution {
    micro thousandSeparator(self, n: i64): utf8 {
        return thousand_separator(n)
    }
}
