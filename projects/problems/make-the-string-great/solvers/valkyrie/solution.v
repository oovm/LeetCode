namespace leetcode.make_the_string_great;

micro abss(x: i64) -> i64 {
    if x < 0 {
        return 0 - x
    }
    return x
}

[export(case: "camelCase")]
micro make_good(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut stack: ArrayList<char> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        let c: char = s⁅i⁆
        if stack.length() > 0 && abss(stack⁅stack.length() - 1⁆.unwrap() as u32 as i64 - c as u32 as i64) == 32 {
            stack.pop()
        } else {
            stack.push(c)
        }
        i = i + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut k: usize = 0
    while k < stack.length() {
        builder.append(stack⁅k⁆.unwrap())
        k = k + 1
    }
    return builder.build()
}

class Solution {
    micro makeGood(self, s: utf8): utf8 {
        return make_good(s)
    }
}
