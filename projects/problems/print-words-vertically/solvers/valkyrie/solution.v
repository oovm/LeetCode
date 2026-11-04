namespace leetcode.solution

using std.collection
using std.text

# 题内触发点: G18 —— std 的 `utf8` 只有精确分隔符 `split`，没有 `split_whitespace`；
# 题面保证单词由单个空格分隔，故用 `split(" ")` 等价展开。
class Solution {
    [export(case: "printVertically")]
    micro printVertically(s: utf8) -> ArrayList<utf8> {
        let words: [utf8] = s.split(" ")
        let word_count: usize = words.length()
        let mut longest: usize = 0
        let mut index: usize = 0
        while index < word_count {
            if words⁅index⁆.length() > longest {
                longest = words⁅index⁆.length()
            }
            index = index + 1
        }
        let mut lines: ArrayList<utf8> = ArrayList::new(longest)
        let mut column: usize = 0
        while column < longest {
            let mut last: usize = 0
            let mut scan: usize = 0
            while scan < word_count {
                if words⁅scan⁆.length() > column {
                    last = scan + 1
                }
                scan = scan + 1
            }
            let mut builder: Utf8Builder = Utf8Builder::new(last)
            let mut draw: usize = 0
            while draw < last {
                if words⁅draw⁆.length() > column {
                    builder.append(words⁅draw⁆.character_at(column))
                } else {
                    builder.append(" ")
                }
                draw = draw + 1
            }
            lines.push(builder.build())
            column = column + 1
        }
        return lines
    }
}
