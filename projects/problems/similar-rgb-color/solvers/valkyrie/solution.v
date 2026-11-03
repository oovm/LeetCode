namespace leetcode.similar_rgb_color;

micro hex_digit_value(code: u32) -> i64 {
    if code >= 48 && code <= 57 {
        return code as i64 - 48
    }
    if code >= 97 && code <= 102 {
        return code as i64 - 87
    }
    return code as i64 - 55
}

# 每个通道取 17 的最近倍数，O(1)
[export(case: "camelCase")]
micro similar_r_g_b(color: utf8) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(8)
    builder.append(char::from(35))
    let mut channel: usize = 0
    while channel < 3 {
        let high: i64 = hex_digit_value(color⁅1 + channel * 2⁆ as u32)
        let low: i64 = hex_digit_value(color⁅2 + channel * 2⁆ as u32)
        let value: i64 = high * 16 + low
        let mut best: i64 = 0
        let mut best_cost: i64 = -1
        let mut d: i64 = 0
        while d < 16 {
            let diff: i64 = 17 * d - value
            let cost: i64 = diff * diff
            if best_cost < 0 || cost < best_cost {
                best_cost = cost
                best = d
            }
            d = d + 1
        }
        let mut out: u32 = 48 + best as u32
        if best >= 10 {
            out = 87 + best as u32
        }
        builder.append(char::from(out))
        builder.append(char::from(out))
        channel = channel + 1
    }
    return builder.build()
}

class Solution {
    micro similarRGB(self, color: utf8): utf8 {
        return similar_r_g_b(color)
    }
}
