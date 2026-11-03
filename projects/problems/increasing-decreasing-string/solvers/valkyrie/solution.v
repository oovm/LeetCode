namespace leetcode.increasing_decreasing_string;

[export(case: "camelCase")]
micro sort_string(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut counts: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        counts.push(0)
        i = i + 1
    }
    i = 0
    while i < n {
        let code: u32 = s⁅i⁆ as u32
        counts⁅(code as usize) - 97⁆ = counts⁅(code as usize) - 97⁆.unwrap() + 1
        i = i + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut produced: usize = 0
    while produced < n {
        let mut k: usize = 0
        while k < 26 {
            if counts⁅k⁆.unwrap() > 0 {
                builder.append(char::from((k + 97) as u32))
                counts⁅k⁆ = counts⁅k⁆.unwrap() - 1
                produced = produced + 1
            }
            k = k + 1
        }
        k = 26
        while k > 0 {
            k = k - 1
            if counts⁅k⁆.unwrap() > 0 {
                builder.append(char::from((k + 97) as u32))
                counts⁅k⁆ = counts⁅k⁆.unwrap() - 1
                produced = produced + 1
            }
        }
    }
    return builder.build()
}

class Solution {
    micro sortString(self, s: utf8): utf8 {
        return sort_string(s)
    }
}
