namespace leetcode.solution

using std.collection
using std.text

# 题内触发点: 带载荷和类型 `DecodedPart`，`Repeated` 的载荷是「文本 + 次数」聚合体。
unite DecodedPart {
    [constructor]
    Plain { text: utf8 }
    [constructor]
    Repeated { text: utf8, times: i64 }
}

micro is_digit_code(code: u8) -> bool {
    return code >= 48 && code <= 57
}

micro concat_text(left: utf8, right: utf8) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(left.byte_length() + right.byte_length())
    builder.append(left)
    builder.append(right)
    return builder.build()
}

# 对和类型做 `match` 渲染，重复片段按次数展开。
micro render_parts(parts: ArrayList<DecodedPart>) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(16)
    loop part in parts {
        match part {
            case Plain(text): {
                builder.append(text)
            }
            case Repeated(text, times): {
                let mut count: i64 = 0
                while count < times {
                    builder.append(text)
                    count = count + 1
                }
            }
        }
    }
    return builder.build()
}

# 递归解析一层方括号内容，返回该层片段序列。
micro decode_parts(text: utf8, cursor: ArrayList<i64>) -> ArrayList<DecodedPart> {
    let parts: ArrayList<DecodedPart> = ArrayList::new(8)
    let limit: i64 = text.byte_length() as i64
    let mut running: bool = true
    while running && cursor⁅0⁆ < limit {
        let code: u8 = text.byte_at(cursor⁅0⁆ as usize)
        if code == 93 {
            cursor⁅0⁆ = cursor⁅0⁆ + 1
            running = false
        } else if is_digit_code(code) {
            let mut factor: i64 = 0
            let mut reading: bool = true
            while reading {
                let digit: u8 = text.byte_at(cursor⁅0⁆ as usize)
                if is_digit_code(digit) {
                    factor = factor * 10 + ((digit - 48) as i64)
                    cursor⁅0⁆ = cursor⁅0⁆ + 1
                } else {
                    reading = false
                }
            }
            cursor⁅0⁆ = cursor⁅0⁆ + 1
            let inner: ArrayList<DecodedPart> = decode_parts(text, cursor)
            parts.push(Repeated { text: render_parts(inner), times: factor })
        } else {
            let mut builder: Utf8Builder = Utf8Builder::new(4)
            let mut collecting: bool = true
            while collecting && cursor⁅0⁆ < limit {
                let letter: u8 = text.byte_at(cursor⁅0⁆ as usize)
                if is_digit_code(letter) || letter == 91 || letter == 93 {
                    collecting = false
                } else {
                    builder.append(text.slice(cursor⁅0⁆ as usize, 1))
                    cursor⁅0⁆ = cursor⁅0⁆ + 1
                }
            }
            parts.push(Plain { text: builder.build() })
        }
    }
    return parts
}

class Solution {
    [export(case: "decodeString")]
    micro decodeString(s: utf8) -> utf8 {
        let cursor: ArrayList<i64> = ArrayList::new(1)
        cursor.push(0)
        let parts: ArrayList<DecodedPart> = decode_parts(s, cursor)
        return render_parts(parts)
    }
}
