namespace probe.numeric_roundtrip;

using std.text

# 解析结果用普通结构体承载，避免把失败路径塞进 `Result` 自定义联合。
structure ParsedNumber {
    ok: bool
    value: i64
    code: i64
}

# 负数方向累加，避免 MIN 在正数侧溢出。
micro parse_integer(text: utf8) -> ParsedNumber {
    let length: i64 = text.length() as i64
    if length == 0 {
        return ParsedNumber { ok: false, value: 0, code: -1 }
    }
    let mut index: i64 = 0
    let mut negative: bool = false
    if (((text.character_at(0) as u32) as i64) == 45) {
        negative = true
        index = 1
    }
    if index >= length {
        return ParsedNumber { ok: false, value: 0, code: -2 }
    }
    let mut total: i64 = 0
    let mut running: bool = true
    while running && index < length {
        let code: i64 = (text.character_at(index as usize) as u32) as i64
        if code >= 48 && code <= 57 {
            total = total * 10 - (code - 48)
            index = index + 1
        } else {
            return ParsedNumber { ok: false, value: 0, code: -2 }
        }
    }
    if negative {
        return ParsedNumber { ok: true, value: total, code: 0 }
    }
    return ParsedNumber { ok: true, value: 0 - total, code: 0 }
}

micro text_checksum(text: utf8) -> i64 {
    let mut total: i64 = 0
    loop current in text {
        total = total + ((current as u32) as i64)
    }
    return total
}

micro round_trip_checksum(text: utf8) -> i64 {
    let parsed: ParsedNumber = parse_integer(text)
    if !parsed.ok {
        return parsed.code
    }
    return text_checksum(parsed.value.display())
}

# 123456789 解析再显示，校验和 477。
[export(name: "integerRoundTripChecksum")]
micro integer_round_trip_checksum() -> i64 {
    return round_trip_checksum("123456789")
}

# -9223372036854775808 解析再显示，校验和 1046。
[export(name: "integerMinRoundTripChecksum")]
micro integer_min_round_trip_checksum() -> i64 {
    return round_trip_checksum("-9223372036854775808")
}

# i64 最大值直接显示，校验和 1000。
[export(name: "integerMaxFormatChecksum")]
micro integer_max_format_checksum() -> i64 {
    let maximum: i64 = 9223372036854775807
    return text_checksum(maximum.display())
}

# 非法数字：`12x` 在位置 2 报错，返回 -2。
[export(name: "integerBadDigitCode")]
micro integer_bad_digit_code() -> i64 {
    let parsed: ParsedNumber = parse_integer("12x")
    if !parsed.ok {
        return parsed.code
    }
    return 0
}

# 溢出实测：最大 i64 加一。当前结果见期望值，只记录不判定。
[export(name: "integerOverflowProbe")]
micro integer_overflow_probe() -> i64 {
    let maximum: i64 = 9223372036854775807
    return maximum + 1
}

# 位重解释：1.0 的 f64 位模式往返仍为 0x3ff0000000000000。
[export(name: "float64BitsRoundTrip")]
micro float64_bits_round_trip() -> i64 {
    let value: f64 = f64::from_bits(0x3ff0000000000000)
    return value.to_bits() as i64
}

# 负零位模式往返保留符号位（由一元负号构造，避开超出 i64 范围的十六进制字面量）。
[export(name: "negativeZeroBits")]
micro negative_zero_bits() -> i64 {
    let zero: f64 = 0.0f64
    let value: f64 = -zero
    return value.to_bits() as i64
}
