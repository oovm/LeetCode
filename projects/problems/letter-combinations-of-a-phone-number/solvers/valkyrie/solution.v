namespace leetcode.letter_combinations_of_a_phone_number;

using std.collection;

micro letter_start(digit: i64) -> i64 {
    if digit == 2 {
        return 97
    }
    if digit == 3 {
        return 100
    }
    if digit == 4 {
        return 103
    }
    if digit == 5 {
        return 106
    }
    if digit == 6 {
        return 109
    }
    if digit == 7 {
        return 112
    }
    if digit == 8 {
        return 116
    }
    return 122
}

micro letter_count(digit: i64) -> i64 {
    if digit == 7 {
        return 4
    }
    if digit == 9 {
        return 4
    }
    return 3
}

# 逐位做笛卡尔积：每一层把上层的码点序列复制并追加一个新字母码点，
# 形成更深一层的 `ArrayList<ArrayList<i64>>`；最后统一交给 `Utf8Builder` 逐字符产出。
# 题内触发点: 嵌套容器构造 —— `ArrayList<ArrayList<i64>>` 逐层重建 + 精确预分配。
# 题内触发点: `Utf8Builder` —— 每串 1–4 次 `append(char)` 后 `build()`。
[export(case: "camelCase")]
micro letter_combinations(digits: utf8) -> ArrayList<utf8> {
    let total: usize = digits.byte_length()
    let mut result: ArrayList<utf8> = ArrayList::new(0)
    if total == 0 {
        return result
    }

    let mut combos: ArrayList<ArrayList<i64>> = ArrayList::new(1)
    let mut seed: ArrayList<i64> = ArrayList::new(0)
    combos.push(seed)

    let mut index: usize = 0
    while index < total {
        let digit: i64 = (digits.byte_at(index) as i64) - 48
        let start: i64 = letter_start(digit)
        let count: i64 = letter_count(digit)
        let mut next: ArrayList<ArrayList<i64>> = ArrayList::new(combos.length() * (count as usize))
        loop prefix in combos {
            let mut offset: i64 = 0
            while offset < count {
                let mut codes: ArrayList<i64> = ArrayList::new(prefix.length() + 1)
                loop code in prefix {
                    codes.push(code)
                }
                codes.push(start + offset)
                next.push(codes)
                offset = offset + 1
            }
        }
        combos = next
        index = index + 1
    }

    loop codes in combos {
        let mut builder: Utf8Builder = Utf8Builder::new(codes.length())
        loop code in codes {
            builder.append(char::from(code as u32))
        }
        result.push(builder.build())
    }
    return result
}

class Solution {
    micro letterCombinations(self, digits: utf8): ArrayList<utf8> {
        return letter_combinations(digits)
    }
}
