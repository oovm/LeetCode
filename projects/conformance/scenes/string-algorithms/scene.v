namespace probe.string_algorithms;

using std.collection
using std.text

# 统一按码位取比较码点，避免字节与码位混用。
micro code_at(text: utf8, index: i64) -> i64 {
    return (text.character_at(index as usize) as u32) as i64
}

# 中心扩展：返回以 (left, right) 为中心的奇数/偶数回文长度。
micro expand(text: utf8, left: i64, right: i64, length: i64) -> i64 {
    let mut low: i64 = left
    let mut high: i64 = right
    while low >= 0 && high < length {
        if code_at(text, low) != code_at(text, high) {
            return high - low - 1
        }
        low = low - 1
        high = high + 1
    }
    return high - low - 1
}

micro longest_palindrome(text: utf8) -> i64 {
    let length: i64 = text.length() as i64
    if length == 0 {
        return 0
    }
    let mut best: i64 = 1
    let mut center: i64 = 0
    while center < length {
        let odd: i64 = expand(text, center, center, length)
        let even: i64 = expand(text, center, center + 1, length)
        if odd > best {
            best = odd
        }
        if even > best {
            best = even
        }
        center = center + 1
    }
    return best
}

micro min_of(a: i64, b: i64) -> i64 {
    if a < b {
        return a
    }
    return b
}

# 编辑距离：二维表压进一维 `ArrayList<i64>`，用基数读写。
micro edit_distance(left: utf8, right: utf8) -> i64 {
    let rows: i64 = left.length() as i64
    let cols: i64 = right.length() as i64
    let stride: i64 = cols + 1
    let size: usize = ((rows + 1) * stride) as usize
    let mut table: ArrayList<i64> = ArrayList::new(size)
    let mut filled: i64 = 0
    while filled < (rows + 1) * stride {
        table.push(0)
        filled = filled + 1
    }
    let mut row: i64 = 0
    while row <= rows {
        table.set_cardinal((row * stride) as usize, row)
        row = row + 1
    }
    let mut column: i64 = 0
    while column <= cols {
        table.set_cardinal(column as usize, column)
        column = column + 1
    }
    row = 1
    while row <= rows {
        column = 1
        while column <= cols {
            let mut cost: i64 = 1
            if code_at(left, row - 1) == code_at(right, column - 1) {
                cost = 0
            }
            let deletion: i64 = table⁅((row - 1) * stride + column) as usize⁆ + 1
            let insertion: i64 = table⁅(row * stride + column - 1) as usize⁆ + 1
            let substitution: i64 = table⁅((row - 1) * stride + column - 1) as usize⁆ + cost
            let best: i64 = min_of(min_of(deletion, insertion), substitution)
            table.set_cardinal((row * stride + column) as usize, best)
            column = column + 1
        }
        row = row + 1
    }
    return table⁅(rows * stride + cols) as usize⁆
}

[export(name: "longestPalindromeAscii")]
micro longest_palindrome_ascii() -> i64 {
    let text: utf8 = "abaxyzzyxf"
    return longest_palindrome(text)
}

[export(name: "longestPalindromeBmp")]
micro longest_palindrome_bmp() -> i64 {
    let text: utf8 = "aé中éa"
    return longest_palindrome(text)
}

[export(name: "editDistanceKitten")]
micro edit_distance_kitten() -> i64 {
    return edit_distance("kitten", "sitting")
}

[export(name: "editDistanceLawn")]
micro edit_distance_lawn() -> i64 {
    return edit_distance("flaw", "lawn")
}
