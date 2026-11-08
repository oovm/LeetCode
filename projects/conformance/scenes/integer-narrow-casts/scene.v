namespace probe.integer_narrow_casts;

# 300 的低 8 位是 44，有符号窄化后回 i64 仍为 44。
[export(name: "i8WrappingTruncation")]
micro i8_wrapping_truncation() -> i64 {
    let wide: i64 = 300
    let narrow: i8 = wide as i8
    return narrow as i64
}

# -1 截断到 8 位后符号扩展回 i64，仍是 -1。
[export(name: "i8SignExtension")]
micro i8_sign_extension() -> i64 {
    let wide: i64 = 0 - 1
    let narrow: i8 = wide as i8
    return narrow as i64
}

# -1 转无符号字节按模 256 取低 8 位，得 255。
[export(name: "u8UnsignedWrap")]
micro u8_unsigned_wrap() -> i64 {
    let wide: i64 = 0 - 1
    let narrow: u8 = wide as u8
    return narrow as i64
}

# 70000 截断到 16 位无符号：70000 - 65536 = 4464。
[export(name: "u16WrappingTruncation")]
micro u16_wrapping_truncation() -> i64 {
    let wide: i64 = 70000
    let narrow: u16 = wide as u16
    return narrow as i64
}

# -32769 截断到 16 位有符号后回绕为正的 32767。
[export(name: "i16WrappingTruncation")]
micro i16_wrapping_truncation() -> i64 {
    let wide: i64 = 0 - 32769
    let narrow: i16 = wide as i16
    return narrow as i64
}

# 32 位无符号最大值加宽到 i64 不改变数值。
[export(name: "u32WidenToI64")]
micro u32_widen_to_i64() -> i64 {
    let wide: u32 = 4294967295 as u32
    return wide as i64
}
