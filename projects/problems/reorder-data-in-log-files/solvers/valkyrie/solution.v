namespace leetcode.reorder_data_in_log_files;

using std.collection;

# 字典序比较：std 的 utf8 只有相等判定，没有比较入口，这里按需实现。
micro compare_text(left: utf8, right: utf8) -> i32 {
    let mut i: usize = 0
    while i < left.length() && i < right.length() {
        let a: u32 = left⁅i⁆ as u32
        let b: u32 = right⁅i⁆ as u32
        if a < b {
            return -1
        }
        if a > b {
            return 1
        }
        i = i + 1
    }
    if left.length() < right.length() {
        return -1
    }
    if left.length() > right.length() {
        return 1
    }
    return 0
}

# std 的 split 只能整段切分，取「首个空格前 / 后」需要 index_of + slice 三次组合。
micro separator_of(log: utf8) -> usize {
    let found: Option<usize> = log.index_of(" ")
    if found.is_some() {
        return found.unwrap()
    }
    return 0
}

micro is_letter_log(log: utf8) -> bool {
    let head: usize = separator_of(log) + 1
    if head >= log.length() {
        return false
    }
    let code: u32 = log⁅head⁆ as u32
    return (code >= 97 && code <= 122) || (code >= 65 && code <= 90)
}

micro identifier_of(log: utf8) -> utf8 {
    let space: usize = separator_of(log)
    return log.slice(0, space)
}

micro content_of(log: utf8) -> utf8 {
    let space: usize = separator_of(log)
    return log.slice(space + 1, log.length() - space - 1)
}

micro compare_logs(left: utf8, right: utf8) -> i32 {
    let left_letter: bool = is_letter_log(left)
    let right_letter: bool = is_letter_log(right)
    if left_letter && !right_letter {
        return -1
    }
    if !left_letter && right_letter {
        return 1
    }
    if !left_letter {
        return 0
    }

    let by_content: i32 = compare_text(content_of(left), content_of(right))
    if by_content != 0 {
        return by_content
    }
    return compare_text(identifier_of(left), identifier_of(right))
}

# 字母日志按内容、再按标识符排序；数字日志保持原始相对顺序（merge_sort 稳定）。
[export(case: "camelCase")]
micro reorder_log_files(logs: ArrayList<utf8>) -> ArrayList<utf8> {
    let mut ordered: ArrayList<utf8> = ArrayList::new(logs.length())
    loop log in logs {
        ordered.push(log)
    }
    merge_sort(ordered, compare_logs)
    return ordered
}

class Solution {
    micro reorderLogFiles(self, logs: ArrayList<utf8>): ArrayList<utf8> {
        return reorder_log_files(logs)
    }
}
