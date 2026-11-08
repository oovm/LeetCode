namespace probe.integer_division_signs;

# 7 / -2 = -3，7 % -2 = 1：商向零截断，余数跟随被除数。
[export(name: "truncationTowardZero")]
micro truncation_toward_zero() -> i64 {
    let quotient: i64 = 7 / (0 - 2)
    let remainder: i64 = 7 % (0 - 2)
    return quotient * 10 + remainder
}

# -7 / -2 = 3，-7 % -2 = -1。
[export(name: "negativeBothSigns")]
micro negative_both_signs() -> i64 {
    let quotient: i64 = (0 - 7) / (0 - 2)
    let remainder: i64 = (0 - 7) % (0 - 2)
    return quotient * 10 + remainder
}

# 被除数为负时余数为负：-7 % 3 = -1。
[export(name: "negativeRemainder")]
micro negative_remainder() -> i64 {
    return (0 - 7) % 3
}

# 无符号除法取模：4294967295 / 3 = 1431655765，余 0。
[export(name: "unsignedDivision")]
micro unsigned_division() -> i64 {
    let value: u32 = 4294967295 as u32
    let divisor: u32 = 3 as u32
    return (value / divisor) as i64
}

# 探针：i32 最小值除以 -1。溢出行为尚未冻结，只记录实测是否可观察拒绝。
[export(name: "i32MinDivMinusOneProbe")]
micro i32_min_div_minus_one_probe() -> i64 {
    let minimum: i32 = (0 - 2147483647) - 1
    return (minimum / (0 - 1)) as i64
}
