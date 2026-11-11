namespace leetcode.reorder_data_in_log_files;

using std.collection;

# `merge_sort` / `sorted_by` 的比较器入口；`utf8` 的字典序由 `Utf8Text` 的
# `Comparable` 合同提供，这里只把 `Ordering` 经 `natural_order` 转成 `i32`。
micro compare_text(left: utf8, right: utf8) -> i32 {
    return natural_order(left, right)
}

# `index_of(utf8)` 内部走 u8 相等合同（本批 addon 未绑定 `__u8_eq` host provider），
# 这里按码位手动扫描；真写法是 `log.index_of(" ")`。
micro separator_of(log: utf8) -> usize {
    let mut i: usize = 0
    while i < log.length() {
        if (log⁅i⁆ as u32) == 32 {
            return i
        }
        i = i + 1
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
micro reorder_log_files(logs: [utf8]) -> [utf8] {
    let mut values: ArrayList<utf8> = ArrayList::new(logs.length())
    loop value in logs {
        values.push(value)
    }
    let ordered: ArrayList<utf8> = sorted_by(values, compare_logs)
    return ordered.to_array()
}

class Solution {
    micro reorderLogFiles(self, logs: [utf8]): [utf8] {
        return reorder_log_files(logs)
    }
}
