namespace leetcode.count_and_say;

using std.collection;
using std.text;

# 逐轮游程朗读：统计连续相同数字个数，写入「个数 + 数字」。
# 时间 O(轮数·串长) 空间 O(串长)。
[export(case: "camelCase")]
micro count_and_say(n: i64) -> utf8 {
    let mut current: utf8 = "1"
    let mut round: i64 = 1
    while round < n {
        let mut builder: Utf8Builder = Utf8Builder::new(current.length() * 2)
        let mut i: usize = 0
        while i < current.length() {
            let ch: u32 = current⁅i⁆ as u32
            let mut run: i64 = 1
            let mut cursor: usize = i + 1
            while cursor < current.length() && current⁅cursor⁆ as u32 == ch {
                run = run + 1
                cursor = cursor + 1
            }
            builder.append_i64(run)
            builder.append(char::from(ch))
            i = cursor
        }
        current = builder.build()
        round = round + 1
    }
    return current
}

class Solution {
    micro countAndSay(self, n: i64): utf8 {
        return count_and_say(n)
    }
}
