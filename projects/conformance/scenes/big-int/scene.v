namespace probe.big_int;

using std.collection
using std.text

micro digit_at(value: utf8, index: i64) -> i64 {
    return ((value.character_at(index as usize) as u32) as i64) - 48
}

# 逐位相加，结果按低位在前存储，全程不把整串转成 i64。
micro big_add(left: utf8, right: utf8) -> ArrayList<i64> {
    let mut digits: ArrayList<i64> = ArrayList::new(left.length() + right.length() + 1)
    let mut left_index: i64 = left.length() as i64 - 1
    let mut right_index: i64 = right.length() as i64 - 1
    let mut carry: i64 = 0
    while left_index >= 0 || right_index >= 0 || carry != 0 {
        let mut sum: i64 = carry
        if left_index >= 0 {
            sum = sum + digit_at(left, left_index)
            left_index = left_index - 1
        }
        if right_index >= 0 {
            sum = sum + digit_at(right, right_index)
            right_index = right_index - 1
        }
        digits.push(sum % 10)
        carry = sum / 10
    }
    return digits
}

# 逐位相减（约定 `left >= right`），低位借位，结束后去掉高位前导零。
micro big_sub(left: utf8, right: utf8) -> ArrayList<i64> {
    let mut digits: ArrayList<i64> = ArrayList::new(left.length())
    let mut left_index: i64 = left.length() as i64 - 1
    let mut right_index: i64 = right.length() as i64 - 1
    let mut borrow: i64 = 0
    while left_index >= 0 {
        let mut difference: i64 = digit_at(left, left_index) - borrow
        if right_index >= 0 {
            difference = difference - digit_at(right, right_index)
            right_index = right_index - 1
        }
        if difference < 0 {
            difference = difference + 10
            borrow = 1
        } else {
            borrow = 0
        }
        digits.push(difference)
        left_index = left_index - 1
    }
    while digits.length() > 1 && digits⁅digits.length() - 1⁆ == 0 {
        digits.pop()
    }
    return digits
}

# 结果可能远超 i64，出口用「位数 × 100 + 各位数字之和」做校验和。
micro digit_report(digits: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    loop digit in digits {
        total = total + digit
    }
    return digits.length() as i64 * 100 + total
}

[export(name: "bigAddReport")]
micro big_add_report() -> i64 {
    return digit_report(big_add("98765432109876543210", "12345678901234567890"))
}

[export(name: "bigSubtractReport")]
micro big_subtract_report() -> i64 {
    return digit_report(big_sub("100000000000000000000", "1"))
}
