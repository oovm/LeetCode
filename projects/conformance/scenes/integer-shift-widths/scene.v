namespace probe.integer_shift_widths;

# 有符号右移对负数保持符号：-8 >> 2 = -2。
[export(name: "arithmeticRightShift")]
micro arithmetic_right_shift() -> i64 {
    let value: i64 = 0 - 8
    return value >> 2
}

# 无符号右移把最高位 1 移到最低位，得 1。
[export(name: "unsignedRightShift")]
micro unsigned_right_shift() -> i64 {
    let high: u64 = (1 as u64) << (63 as u64)
    let shift: u64 = 63 as u64
    return (high >> shift) as i64
}

# 8 位有符号右移 7 位由符号位填满，得 -1。
[export(name: "i8ShiftRightSaturation")]
micro i8_shift_right_saturation() -> i64 {
    let value: i8 = (0 - 1) as i8
    let shift: i8 = 7 as i8
    return (value >> shift) as i64
}

# 8 位值左移达到位宽 8 后全部位已移出，得 0。
[export(name: "i8ShiftBeyondWidth")]
micro i8_shift_beyond_width() -> i64 {
    let value: i8 = 1 as i8
    let shift: i8 = 8 as i8
    return (value << shift) as i64
}

# 64 位左移 62 位仍在范围内：2^62。
[export(name: "shiftLeftInRange")]
micro shift_left_in_range() -> i64 {
    let value: i64 = 1
    return value << 62
}

# 探针：i64 左移 64 位（恰好达到位宽）。当前语义未冻结，只记录实测返回值。
[export(name: "shiftAtWidthProbe")]
micro shift_at_width_probe() -> i64 {
    let value: i64 = 1
    return value << 64
}
