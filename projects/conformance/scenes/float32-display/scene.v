namespace probe.float32_display;

using std.text

# f32 `Display` 单独成场景：`1.5` 的位模式按 `from_bits` 构造。
[export(name: "float32DisplayChecksum")]
micro float32_display_checksum() -> i64 {
    let value: f32 = f32::from_bits(0x3fc00000 as u32)
    let rendered: utf8 = value.display()
    let mut total: i64 = 0
    loop current in rendered {
        total = total + ((current as u32) as i64)
    }
    return total
}
