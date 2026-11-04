namespace leetcode.fraction_addition_and_subtraction;

using std.collection;
using std.text;

# 与参考解同合同：固定通分母 6*7*8*9*10，逐项按整除累加后统一约分。
micro greatest_common_divisor(left: i64, right: i64) -> i64 {
    let mut a: i64 = left
    let mut b: i64 = right
    if a < 0 {
        a = 0 - a
    }
    if b < 0 {
        b = 0 - b
    }
    while b != 0 {
        let rest: i64 = a % b
        a = b
        b = rest
    }
    return a
}

# 参考解的 `//` 是向下取整；负数且不能整除时需要比截断除法再减一。
micro floor_divide(product: i64, divisor: i64) -> i64 {
    let mut quotient: i64 = product / divisor
    if product < 0 && product % divisor != 0 {
        quotient = quotient - 1
    }
    return quotient
}

[export(case: "camelCase")]
micro fraction_addition(expression: utf8) -> utf8 {
    let common: i64 = 6 * 7 * 8 * 9 * 10
    let n: usize = expression.length()
    let mut x: i64 = 0
    let mut i: usize = 0
    while i < n {
        let mut sign: i64 = 1
        if expression⁅i⁆ as u32 == 45 {
            sign = -1
            i = i + 1
        } else if expression⁅i⁆ as u32 == 43 {
            i = i + 1
        }

        let mut a: i64 = 0
        while i < n && (expression⁅i⁆ as u32) != 47 && (expression⁅i⁆ as u32) != 43 && (expression⁅i⁆ as u32) != 45 {
            a = a * 10 + (expression⁅i⁆ as u32 as i64 - 48)
            i = i + 1
        }
        i = i + 1

        let mut b: i64 = 0
        while i < n && (expression⁅i⁆ as u32) != 43 && (expression⁅i⁆ as u32) != 45 {
            b = b * 10 + (expression⁅i⁆ as u32 as i64 - 48)
            i = i + 1
        }
        x = x + floor_divide(sign * a * common, b)
    }

    let divisor: i64 = greatest_common_divisor(x, common)
    let mut builder: Utf8Builder = Utf8Builder::new(20)
    builder.append_i64(x / divisor)
    builder.append(char::from(47))
    builder.append_i64(common / divisor)
    return builder.build()
}

class Solution {
    micro fractionAddition(self, expression: utf8): utf8 {
        return fraction_addition(expression)
    }
}
