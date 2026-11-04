namespace leetcode.number_of_lines_to_write_string;

using std.collection;

# 逐字符取宽度累加；换行只是把当前行清零，不做任何切分。
# `utf8` 的 Cardinal 视图直接给 `char`，字母序号靠 `as u32` 码位相减——绕开 `char` 无 `<` 的比较面。
# 返回值是「行数 + 末行宽度」二元组，V 侧用 `ArrayList<i64>` 承载（G3：固定数组无返回值入口）。
[export(case: "camelCase")]
micro number_of_lines(widths: [i64], s: utf8) -> ArrayList<i64> {
    let count: usize = s.length()
    let mut lines: i64 = 1
    let mut used: i64 = 0

    let mut i: usize = 0
    while i < count {
        let letter: char = s⁅i⁆
        let slot: usize = ((letter as u32) - 97) as usize
        let width: i64 = widths⁅slot⁆
        if used + width > 100 {
            lines = lines + 1
            used = 0
        }
        used = used + width
        i = i + 1
    }

    let mut answer: ArrayList<i64> = ArrayList::new(2)
    answer.push(lines)
    answer.push(used)
    return answer
}

class Solution {
    micro numberOfLines(self, widths: [i64], s: utf8): ArrayList<i64> {
        return number_of_lines(widths, s)
    }
}
