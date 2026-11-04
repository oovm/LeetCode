namespace leetcode.custom_sort_string;

using std.collection;

# 基准期望的排法：order 内字符取 order 中的位置为键，order 外字符键为 0，
# 稳定排序后同键字符保持 s 中的相对次序。
micro rank_of(priority: HashMap<char, i64>, character: char) -> i64 {
    if priority.contains_key(character) {
        return priority.get(character).unwrap()
    }
    return 0
}

micro compare_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro custom_sort_string(order: utf8, s: utf8) -> utf8 {
    # char 作映射键需要 Hash，std 尚未实现（G17）。
    let mut priority: HashMap<char, i64> = HashMap::new(order.length())
    let mut position: i64 = 0
    loop character in order {
        priority.insert(character, position)
        position = position + 1
    }

    # 没有返回新序列的 `sorted_by`（G11）：把「rank · 1000000 + 原下标」编码进 i64 副本，
    # 用命名比较器的就地 `merge_sort` 做稳定排序，避免闭包捕获 `priority`。
    let count: usize = s.length()
    let mut keys: ArrayList<i64> = ArrayList::new(count)
    let mut index: i64 = 0
    loop character in s {
        let rank: i64 = rank_of(priority, character)
        keys.push(rank * 1000000 + index)
        index = index + 1
    }
    merge_sort(keys, compare_i64)

    let mut text: Utf8Builder = Utf8Builder::new(count)
    loop key in keys {
        let at: usize = (key % 1000000) as usize
        text.append(s⁅at⁆)
    }
    return text.build()
}

class Solution {
    micro customSortString(self, order: utf8, s: utf8): utf8 {
        return custom_sort_string(order, s)
    }
}
