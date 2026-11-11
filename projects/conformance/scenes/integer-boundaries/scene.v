namespace probe.integer_boundaries;

# i64 最大值的最低位是 1。
[export(name: "i64MaxLowBit")]
micro i64_max_low_bit() -> i64 {
    let max: i64 = 9223372036854775807
    return max.bit_and(1)
}

# i64 最小值在二进制里只有一个 1。
[export(name: "i64MinPopcount")]
micro i64_min_popcount() -> i64 {
    let min: i64 = (-9223372036854775807) - 1
    return min.count_ones() as i64
}

# i64 转 i32 发生截断，超出 32 位的部分被丢弃。
[export(name: "i32Truncation")]
micro i32_truncation() -> i64 {
    let wide: i64 = 4294967296
    let narrow: i32 = wide as i32
    return narrow as i64
}

# 有符号除法向零截断，余数与被除数同号。
[export(name: "divisionTruncation")]
micro division_truncation() -> i64 {
    let dividend: i64 = -7
    let quotient: i64 = dividend / 2
    let remainder: i64 = dividend % 2
    return quotient * 10 + remainder
}

# 跨类型比较：i32 边界值提升到 i64 后数值不变。
[export(name: "i32Bounds")]
micro i32_bounds() -> i64 {
    let max: i32 = 2147483647
    let min: i32 = -2147483647 - 1
    let total: i64 = (max as i64) + (min as i64)
    return total
}

# i64 加法按二进制补码回绕：MAX + 1 得到 MIN。
# 溢出检查不是隐式语义；需要可观察失败时由作者显式 `raise`/边界检查表达。
[export(name: "overflowTrap")]
micro overflow_trap() -> i64 {
    let max: i64 = 9223372036854775807
    return max + 1
}
