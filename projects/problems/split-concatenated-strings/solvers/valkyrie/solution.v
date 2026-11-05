namespace leetcode.split_concatenated_strings;

using std.collection;

# 先把每个串统一成「正序 / 逆序中较大者」，再枚举切分点与两种环绕方向。
# 字典序比较在 `utf8` 上没有现成合同（G13），这里只做逐字节比较，O(串长)。
micro compare_text(left: utf8, right: utf8) -> i64 {
    let left_length: usize = left.byte_length()
    let right_length: usize = right.byte_length()
    let mut index: usize = 0
    while index < left_length && index < right_length {
        let a: i64 = left.byte_at(index) as i64
        let b: i64 = right.byte_at(index) as i64
        if a < b {
            return -1
        }
        if a > b {
            return 1
        }
        index = index + 1
    }
    if left_length < right_length {
        return -1
    }
    if left_length > right_length {
        return 1
    }
    return 0
}

micro reverse_text(text: utf8) -> utf8 {
    let length: usize = text.byte_length()
    let mut builder: Utf8Builder = Utf8Builder::new(length)
    let mut index: usize = length
    while index > 0 {
        index = index - 1
        builder.append(char::from(text.byte_at(index) as u32))
    }
    return builder.build()
}

micro slice_from(text: utf8, start: usize) -> utf8 {
    let length: usize = text.byte_length()
    let mut builder: Utf8Builder = Utf8Builder::new(length - start)
    let mut index: usize = start
    while index < length {
        builder.append(char::from(text.byte_at(index) as u32))
        index = index + 1
    }
    return builder.build()
}

micro slice_to(text: utf8, stop: usize) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(stop)
    let mut index: usize = 0
    while index < stop {
        builder.append(char::from(text.byte_at(index) as u32))
        index = index + 1
    }
    return builder.build()
}

micro empty_text() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    return builder.build()
}

[export(case: "camelCase")]
micro split_looped_string(strs: ArrayList<utf8>) -> utf8 {
    let count: usize = strs.length()
    let mut best: utf8 = empty_text()
    let mut index: usize = 0
    while index < count {
        let original: utf8 = strs⁅index⁆
        let reversed: utf8 = reverse_text(original)
        if compare_text(reversed, original) > 0 {
            strs⁅index⁆ = reversed
        }
        index = index + 1
    }

    let mut total_length: usize = 0
    index = 0
    while index < count {
        total_length = total_length + strs⁅index⁆.byte_length()
        index = index + 1
    }
    let mut tail: Utf8Builder = Utf8Builder::new(total_length)
    index = 0
    while index < count {
        tail.append(strs⁅index⁆)
        index = index + 1
    }
    best = tail.build()

    index = 0
    while index < count {
        let current: utf8 = strs⁅index⁆
        let mut around: Utf8Builder = Utf8Builder::new(total_length - current.byte_length())
        let mut part: usize = index + 1
        while part < count {
            around.append(strs⁅part⁆)
            part = part + 1
        }
        part = 0
        while part < index {
            around.append(strs⁅part⁆)
            part = part + 1
        }
        let middle: utf8 = around.build()

        let mut cut: usize = 0
        while cut < current.byte_length() {
            let head: utf8 = slice_from(current, cut)
            let prefix: utf8 = slice_to(current, cut)

            let mut first: Utf8Builder = Utf8Builder::new(current.byte_length() + middle.byte_length())
            first.append(head)
            first.append(middle)
            first.append(prefix)
            let candidate: utf8 = first.build()
            if compare_text(candidate, best) > 0 {
                best = candidate
            }

            let mut second: Utf8Builder = Utf8Builder::new(current.byte_length() + middle.byte_length())
            second.append(reverse_text(prefix))
            second.append(middle)
            second.append(reverse_text(head))
            let other: utf8 = second.build()
            if compare_text(other, best) > 0 {
                best = other
            }
            cut = cut + 1
        }
        index = index + 1
    }
    return best
}

class Solution {
    micro splitLoopedString(self, strs: ArrayList<utf8>): utf8 {
        return split_looped_string(strs)
    }
}
