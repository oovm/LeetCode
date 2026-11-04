namespace leetcode.solution

using std.collection
using std.text

# 题内触发点: 递归 `expand_run` 对每个花括号分组做笛卡尔展开，结果逐层累加为新列表。
micro concat_text(left: utf8, right: utf8) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(left.byte_length() + right.byte_length())
    builder.append(left)
    builder.append(right)
    return builder.build()
}

# `stop_at_comma` 为真时在逗号前停下（供分组内分支递归使用），停止字符不消耗。
micro expand_run(text: utf8, cursor: ArrayList<i64>, stop_at_comma: bool) -> ArrayList<utf8> {
    let mut results: ArrayList<utf8> = ArrayList::new(4)
    results.push("")
    let limit: i64 = text.byte_length() as i64
    let mut running: bool = true
    while running && cursor⁅0⁆ < limit {
        let code: u8 = text.byte_at(cursor⁅0⁆ as usize)
        if code == 125 {
            running = false
        } else if code == 44 && stop_at_comma {
            running = false
        } else if code == 123 {
            cursor⁅0⁆ = cursor⁅0⁆ + 1
            let options: ArrayList<utf8> = ArrayList::new(4)
            let mut selecting: bool = true
            while selecting {
                let branch: ArrayList<utf8> = expand_run(text, cursor, true)
                let mut branch_index: i64 = 0
                while branch_index < (branch.length() as i64) {
                    options.push(branch⁅branch_index as usize⁆)
                    branch_index = branch_index + 1
                }
                let separator: u8 = text.byte_at(cursor⁅0⁆ as usize)
                if separator == 44 {
                    cursor⁅0⁆ = cursor⁅0⁆ + 1
                } else {
                    cursor⁅0⁆ = cursor⁅0⁆ + 1
                    selecting = false
                }
            }
            let combined: ArrayList<utf8> = ArrayList::new(results.length() * options.length())
            loop prefix in results {
                loop option in options {
                    combined.push(concat_text(prefix, option))
                }
            }
            results = combined
        } else {
            let letter: utf8 = text.slice(cursor⁅0⁆ as usize, 1)
            cursor⁅0⁆ = cursor⁅0⁆ + 1
            let mut item_index: i64 = 0
            while item_index < (results.length() as i64) {
                results⁅item_index as usize⁆ = concat_text(results⁅item_index as usize⁆, letter)
                item_index = item_index + 1
            }
        }
    }
    return results
}

class Solution {
    [export(case: "expand")]
    micro expand(s: utf8) -> ArrayList<utf8> {
        let cursor: ArrayList<i64> = ArrayList::new(1)
        cursor.push(0)
        return expand_run(s, cursor, false)
    }
}
