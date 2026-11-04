namespace leetcode.reverse_words_in_a_string_ii;

using std.collection;

# 两次反转：先把整段翻面，再逐个单词内部翻面；写侧全程走 `array_view` 全窗视图，
# 每次 `⁅ ⁆=` 都穿透到 `s` 的底层存储，不做任何拷贝。
# 题内触发点: ArrayView 写侧（全窗构造已存在，本轮不依赖 G19 的区间窗口）。
[export(case: "camelCase")]
micro reverse_words(mut s: [utf8]) -> unit {
    let count: usize = s.length()
    let mut window: ArrayView<utf8> = array_view(s)

    let mut left: usize = 0
    let mut right: usize = count
    while left < right {
        right = right - 1
        let head: utf8 = window⁅left⁆
        window⁅left⁆ = window⁅right⁆
        window⁅right⁆ = head
        left = left + 1
    }

    let mut start: usize = 0
    let mut i: usize = 0
    while i <= count {
        if i == count || s⁅i⁆ == " " {
            let mut lo: usize = start
            let mut hi: usize = i
            while lo < hi {
                hi = hi - 1
                let head: utf8 = window⁅lo⁆
                window⁅lo⁆ = window⁅hi⁆
                window⁅hi⁆ = head
                lo = lo + 1
            }
            start = i + 1
        }
        i = i + 1
    }
}

class Solution {
    micro reverseWords(mut self, s: [utf8]): unit {
        reverse_words(s)
    }
}
