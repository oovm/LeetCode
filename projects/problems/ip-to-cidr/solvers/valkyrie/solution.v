namespace leetcode.ip_to_cidr;

using std.collection;

# 贪心：每段取「按起始地址对齐且不超过剩余数量」的最大 2 的幂，
# 段数 O(log 2^32)，每段格式化 O(1)。
micro log_two(value: i64) -> i64 {
    let mut power: i64 = 1
    let mut exponent: i64 = 0
    while power * 2 <= value {
        power = power * 2
        exponent = exponent + 1
    }
    return exponent
}

micro format_cidr(address: i64, prefix: i64) -> utf8 {
    let first: i64 = address / 16777216
    let second: i64 = (address / 65536) % 256
    let third: i64 = (address / 256) % 256
    let fourth: i64 = address % 256
    let mut builder: Utf8Builder = Utf8Builder::new(16)
    builder.append_i64(first)
    builder.append(char::from(46))
    builder.append_i64(second)
    builder.append(char::from(46))
    builder.append_i64(third)
    builder.append(char::from(46))
    builder.append_i64(fourth)
    builder.append(char::from(47))
    builder.append_i64(prefix)
    return builder.build()
}

micro parse_ip(ip: utf8) -> i64 {
    let mut value: i64 = 0
    let mut part: i64 = 0
    let mut index: usize = 0
    while index < ip.byte_length() {
        let byte: i64 = ip.byte_at(index) as i64
        if byte == 46 {
            value = value * 256 + part
            part = 0
        } else {
            part = part * 10 + (byte - 48)
        }
        index = index + 1
    }
    return value * 256 + part
}

[export(case: "camelCase")]
micro ip_to_cidr(ip: utf8, n: i64) -> [utf8] {
    let address_limit: i64 = 4294967296
    let mut out: ArrayList<utf8> = ArrayList::new(0)
    let mut start: i64 = parse_ip(ip)
    let mut remaining: i64 = n
    while remaining > 0 {
        let mut block: i64 = 1
        while block * 2 <= remaining && block * 2 <= address_limit && start % (block * 2) == 0 {
            block = block * 2
        }
        let prefix: i64 = 32 - log_two(block)
        out.push(format_cidr(start, prefix))
        start = start + block
        remaining = remaining - block
    }
    return out.to_array()
}

class Solution {
    micro ipToCIDR(self, ip: utf8, n: i64): [utf8] {
        return ip_to_cidr(ip, n)
    }
}
