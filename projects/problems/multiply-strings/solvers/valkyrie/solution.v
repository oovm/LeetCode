namespace leetcode.multiply_strings;

using std.collection;

# 大整数探测：std 没有任何任意精度整数类型，也没有按寄存器宽度切分的 limb 抽象。
# 本题唯一的表达方式是手写 limbs（此处以 10 为基数逐位承载）并自行做进位。
micro digit_at(value: utf8, index: usize) -> i64 {
    return ((value.character_at(index) as u32) as i64) - 48
}

[export(case: "camelCase")]
micro multiply(num1: utf8, num2: utf8) -> utf8 {
    let n: usize = num1.length()
    let m: usize = num2.length()
    let width: usize = n + m
    let mut limbs: ArrayList<i64> = ArrayList::new(width)
    let mut fill: usize = 0
    while fill < width {
        limbs.push(0)
        fill = fill + 1
    }

    let mut i: usize = n
    while i > 0 {
        i = i - 1
        let left: i64 = digit_at(num1, i)
        let mut j: usize = m
        while j > 0 {
            j = j - 1
            let position: usize = i + j + 1
            let total: i64 = limbs⁅position⁆ + left * digit_at(num2, j)
            limbs⁅position⁆ = total % 10
            limbs⁅position - 1⁆ = limbs⁅position - 1⁆ + total / 10
        }
    }

    let mut start: usize = 0
    while start + 1 < width && limbs⁅start⁆ == 0 {
        start = start + 1
    }

    let mut builder: Utf8Builder = Utf8Builder::new(width)
    let mut digit: usize = start
    while digit < width {
        builder.append_i64(limbs⁅digit⁆)
        digit = digit + 1
    }
    let result: utf8 = builder.build()
    return result
}

class Solution {
    micro multiply(self, num1: utf8, num2: utf8): utf8 {
        return multiply(num1, num2)
    }
}
