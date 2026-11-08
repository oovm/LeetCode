namespace probe.bitmap_bloom;

using std.text

# 位图：单个 i64 承载 0..63 号位。
micro bit_set(mask: i64, position: i64) -> i64 {
    let one: i64 = 1
    return mask.bit_or(one << position)
}

micro bit_clear(mask: i64, position: i64) -> i64 {
    let one: i64 = 1
    return mask.bit_and((one << position).bit_xor(-1))
}

micro bit_has(mask: i64, position: i64) -> bool {
    let one: i64 = 1
    return mask.bit_and(one << position) != 0
}

# 布隆式双哈希：码位和与（码位和 * 31 + 码位长度）各取低 6 位。
micro code_sum(text: utf8) -> i64 {
    let mut total: i64 = 0
    loop character in text {
        total = total + (character as u32) as i64
    }
    return total
}

micro bloom_index_a(text: utf8) -> i64 {
    return code_sum(text).bit_and(63)
}

micro bloom_index_b(text: utf8) -> i64 {
    let length: i64 = text.length() as i64
    return (code_sum(text) * 31 + length).bit_and(63)
}

micro bloom_insert(mask: i64, text: utf8) -> i64 {
    return bit_set(bit_set(mask, bloom_index_a(text)), bloom_index_b(text))
}

micro bloom_contains(mask: i64, text: utf8) -> bool {
    if !bit_has(mask, bloom_index_a(text)) {
        return false
    }
    return bit_has(mask, bloom_index_b(text))
}

# 置位 1/7/15/31，逐位核对命中与未命中，再报位图内 1 的个数。
[export(name: "bitmapSetTest")]
micro bitmap_set_test() -> i64 {
    let mut mask: i64 = 0
    mask = bit_set(mask, 1)
    mask = bit_set(mask, 7)
    mask = bit_set(mask, 15)
    mask = bit_set(mask, 31)
    let mut checksum: i64 = 0
    if bit_has(mask, 1) {
        checksum = checksum + 1
    }
    if bit_has(mask, 7) {
        checksum = checksum + 2
    }
    if bit_has(mask, 15) {
        checksum = checksum + 4
    }
    if bit_has(mask, 31) {
        checksum = checksum + 8
    }
    if !bit_has(mask, 0) {
        checksum = checksum + 16
    }
    if !bit_has(mask, 63) {
        checksum = checksum + 32
    }
    return checksum * 100 + mask.count_ones() as i64
}

# 置位后清零、再置位、再异或翻回，最终只留 62 号位。
[export(name: "bitmapToggle")]
micro bitmap_toggle() -> i64 {
    let one: i64 = 1
    let mut mask: i64 = bit_set(0, 5)
    mask = bit_clear(mask, 5)
    mask = bit_set(mask, 5)
    mask = mask.bit_xor(one << 5)
    mask = bit_set(mask, 62)
    return mask.count_ones() as i64
}

# 插入 apple / banana 后：两个都命中，未插入的 grape 不命中。
[export(name: "bloomMembership")]
micro bloom_membership() -> i64 {
    let mut mask: i64 = 0
    mask = bloom_insert(mask, "apple")
    mask = bloom_insert(mask, "banana")
    let mut code: i64 = 0
    if bloom_contains(mask, "apple") {
        code = code + 4
    }
    if bloom_contains(mask, "banana") {
        code = code + 2
    }
    if bloom_contains(mask, "grape") {
        code = code + 1
    }
    return code
}
