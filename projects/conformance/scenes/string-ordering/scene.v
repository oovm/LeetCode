namespace probe.string_ordering;

using std.collection
using std.text

micro code_at(text: utf8, index: usize) -> i64 {
    return (text.character_at(index) as u32) as i64
}

# 字典序按码位逐位比较：短的公共前缀更小，长度相同且逐位相同才算相等。
micro compare_text(left: utf8, right: utf8) -> i32 {
    let left_length: usize = left.length()
    let right_length: usize = right.length()
    let mut limit: usize = left_length
    if right_length < limit {
        limit = right_length
    }
    let mut index: usize = 0
    while index < limit {
        let left_code: i64 = code_at(left, index)
        let right_code: i64 = code_at(right, index)
        if left_code < right_code {
            return -1
        }
        if right_code < left_code {
            return 1
        }
        index = index + 1
    }
    if left_length < right_length {
        return -1
    }
    if right_length < left_length {
        return 1
    }
    return 0
}

micro five_words() -> ArrayList<utf8> {
    let mut words: ArrayList<utf8> = ArrayList::new(5)
    words.push("中")
    words.push("🙂")
    words.push("a")
    words.push("é")
    words.push("z")
    return words
}

# 前缀包含关系：`"app"` 小于 `"apple"`。
[export(name: "prefixCompare")]
micro prefix_compare() -> i64 {
    return compare_text("app", "apple") as i64
}

# Unicode 码位比较：`'é'`（U+00E9）小于 `'中'`（U+4E2D）。
[export(name: "unicodeCompare")]
micro unicode_compare() -> i64 {
    return compare_text("é", "中") as i64
}

# 排序后 `"é"` 落在第 3 位（0 基 2）：a < z < é < 中 < 🙂。
[export(name: "sortedUnicodePosition")]
micro sorted_unicode_position() -> i64 {
    let mut words: ArrayList<utf8> = five_words()
    quick_sort(words, compare_text)
    let mut position: i64 = -1
    let mut index: usize = 0
    loop word in words {
        if compare_text(word, "é") == 0 {
            position = index as i64
        }
        index = index + 1
    }
    return position
}

# 排序后各词首码位之和：97 + 122 + 233 + 20013 + 128578。
[export(name: "sortedCodePointSum")]
micro sorted_code_point_sum() -> i64 {
    let mut words: ArrayList<utf8> = five_words()
    quick_sort(words, compare_text)
    let mut total: i64 = 0
    loop word in words {
        total = total + code_at(word, 0 as usize)
    }
    return total
}
