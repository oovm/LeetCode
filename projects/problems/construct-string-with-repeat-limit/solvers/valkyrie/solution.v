namespace leetcode.construct_string_with_repeat_limit;

using std.collection;
using std.text;

# 频次表 + 降序贪心：每轮取当前最大字符，最多连续 `repeatLimit` 个；
# 该字符仍有剩余时插入一个次大字符打断，再回到原字符继续取。
# 字符集固定为 26 个小写字母，频次直接用定长计数数组，不需要映射。
[export(case: "camelCase")]
micro repeatLimitedString(s: utf8, repeatLimit: i64) -> utf8 {
    let mut counts: ArrayList<i64> = ArrayList::new(26)
    let mut slot: usize = 0
    while slot < 26 {
        counts.push(0)
        slot = slot + 1
    }

    let length: usize = s.length()
    let mut i: usize = 0
    while i < length {
        let code: u32 = s⁅i⁆ as u32
        let index: usize = (code - 97) as usize
        counts.set((index + 1) as isize, counts⁅index⁆ + 1)
        i = i + 1
    }

    let mut builder: Utf8Builder = Utf8Builder::new(length)
    let mut cursor: i64 = 25
    while cursor >= 0 {
        let at: usize = cursor as usize
        if counts⁅at⁆ == 0 {
            cursor = cursor - 1
            continue
        }

        let mut take: i64 = counts⁅at⁆
        if take > repeatLimit {
            take = repeatLimit
        }
        counts.set((at + 1) as isize, counts⁅at⁆ - take)

        let current: char = char::from((97 + cursor) as u32)
        let mut copied: i64 = 0
        while copied < take {
            builder.append(current)
            copied = copied + 1
        }

        if counts⁅at⁆ > 0 {
            let mut other: i64 = cursor - 1
            while other >= 0 && counts⁅other as usize⁆ == 0 {
                other = other - 1
            }
            if other < 0 {
                break
            }
            let other_at: usize = other as usize
            counts.set((other_at + 1) as isize, counts⁅other_at⁆ - 1)
            builder.append(char::from((97 + other) as u32))
        }
    }
    return builder.build()
}

class Solution {
    micro repeatLimitedString(self, s: utf8, repeatLimit: i64): utf8 {
        return repeatLimitedString(s, repeatLimit)
    }
}
