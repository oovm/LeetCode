namespace probe.bit_operations;

# 位与、位或、位异或的组合。
[export(name: "maskCombine")]
micro mask_combine() -> i64 {
    let mask: i64 = 240
    let low: i64 = mask.bit_and(15)
    let set: i64 = low.bit_or(128)
    return set.bit_xor(170)
}

# 计数：正数 255 有 8 个 1，全 1 的 -1 有 64 个 1。
[export(name: "popcount")]
micro popcount() -> i64 {
    let ones: i64 = 255
    let all_ones: i64 = -1
    return ones.count_ones() as i64 + all_ones.count_ones() as i64
}

# 前导零与尾随零。
[export(name: "zeroCounts")]
micro zero_counts() -> i64 {
    let value: i64 = 40
    let one: i64 = 1
    return value.trailing_zeros() as i64 + one.leading_zeros() as i64
}

# 移位往返：左移 40 位再右移 20 位。
[export(name: "shiftRoundTrip")]
micro shift_round_trip() -> i64 {
    let one: i64 = 1
    return (one << 40) >> 20
}

# 用异或交换两个整数。
[export(name: "xorSwap")]
micro xor_swap() -> i64 {
    let mut left: i64 = 3
    let mut right: i64 = 5
    left = left.bit_xor(right)
    right = right.bit_xor(left)
    left = left.bit_xor(right)
    return left * 10 + right
}

# 逐位统计 1 的个数：1..8 的 popcount 之和。
[export(name: "popcountRange")]
micro popcount_range() -> i64 {
    let mut total: i64 = 0
    let mut value: i64 = 1
    while value <= 8 {
        total = total + value.count_ones() as i64
        value = value + 1
    }
    return total
}
