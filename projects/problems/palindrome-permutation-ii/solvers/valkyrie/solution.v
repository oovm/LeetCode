namespace leetcode.palindrome_permutation_ii;

using std.collection;

# 统计每个字符频次（按首次出现顺序），把奇数频次字符放中间，
# 再从中间字符向两端展开：与参考实现的 DFS 次序一致，O(输出数·长度)。
micro index_of(chars: ArrayList<char>, target: char) -> i64 {
    let mut i: usize = 0
    while i < chars.length() {
        if chars⁅i⁆ == target {
            return i as i64
        }
        i = i + 1
    }
    return -1
}

micro empty_text() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    return builder.build()
}

micro text_of(chars: ArrayList<char>, at: i64) -> utf8 {
    if at < 0 {
        return empty_text()
    }
    let mut builder: Utf8Builder = Utf8Builder::new(1)
    builder.append(chars⁅at as usize⁆)
    return builder.build()
}

micro expand(
    chars: ArrayList<char>,
    counts: ArrayList<i64>,
    total: usize,
    current: utf8,
    out: ArrayList<utf8>,
) -> unit {
    if current.byte_length() == total {
        out.push(current)
        return
    }
    let mut index: usize = 0
    while index < chars.length() {
        if counts⁅index⁆ >= 2 {
            let character: char = chars⁅index⁆
            counts⁅index⁆ = counts⁅index⁆ - 2
            let mut builder: Utf8Builder = Utf8Builder::new(current.byte_length() + 2)
            builder.append(character)
            builder.append(current)
            builder.append(character)
            expand(chars, counts, total, builder.build(), out)
            counts⁅index⁆ = counts⁅index⁆ + 2
        }
        index = index + 1
    }
}

[export(case: "camelCase")]
micro generate_palindromes(s: utf8) -> ArrayList<utf8> {
    let mut out: ArrayList<utf8> = ArrayList::new(0)
    let total: usize = s.byte_length()
    let mut chars: ArrayList<char> = ArrayList::new(total)
    let mut counts: ArrayList<i64> = ArrayList::new(total)
    let mut index: usize = 0
    while index < total {
        let character: char = char::from(s.byte_at(index) as u32)
        let at: i64 = index_of(chars, character)
        if at < 0 {
            chars.push(character)
            counts.push(1)
        } else {
            counts⁅at as usize⁆ = counts⁅at as usize⁆ + 1
        }
        index = index + 1
    }

    let mut middle_at: i64 = -1
    let mut middle_count: i64 = 0
    index = 0
    while index < chars.length() {
        if counts⁅index⁆ % 2 == 1 {
            middle_count = middle_count + 1
            middle_at = index as i64
            counts⁅index⁆ = counts⁅index⁆ - 1
        }
        index = index + 1
    }
    if middle_count > 1 {
        return out
    }
    let middle: utf8 = text_of(chars, middle_at)
    expand(chars, counts, total, middle, out)
    return out
}

class Solution {
    micro generatePalindromes(self, s: utf8): ArrayList<utf8> {
        return generate_palindromes(s)
    }
}
