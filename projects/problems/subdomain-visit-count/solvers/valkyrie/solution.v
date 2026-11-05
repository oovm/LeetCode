namespace leetcode.subdomain_visit_count;

using std.collection;

micro same_text(left: utf8, right: utf8) -> bool {
    if left.byte_length() != right.byte_length() {
        return false
    }
    let mut index: usize = 0
    while index < left.byte_length() {
        if left.byte_at(index) != right.byte_at(index) {
            return false
        }
        index = index + 1
    }
    return true
}

micro tail(text: utf8, start: usize) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(text.byte_length() - start)
    let mut index: usize = start
    while index < text.byte_length() {
        builder.append(char::from(text.byte_at(index) as u32))
        index = index + 1
    }
    return builder.build()
}

# 每遇到空格或点就把其后缀作为子域名累加。`HashMap<utf8,_>` 的载体缺口（R30）
# 使聚合退化为按插入序线性比对，条目数受 `cpdomains` 规模约束。
[export(case: "camelCase")]
micro subdomain_visits(cpdomains: ArrayList<utf8>) -> ArrayList<utf8> {
    let mut keys: ArrayList<utf8> = ArrayList::new(cpdomains.length() * 3)
    let mut totals: ArrayList<i64> = ArrayList::new(cpdomains.length() * 3)
    let mut entry: usize = 0
    while entry < cpdomains.length() {
        let text: utf8 = cpdomains⁅entry⁆
        let mut space: usize = 0
        while text.byte_at(space) != 32 {
            space = space + 1
        }
        let mut value: i64 = 0
        let mut cursor: usize = 0
        while cursor < space {
            value = value * 10 + (text.byte_at(cursor) as i64 - 48)
            cursor = cursor + 1
        }
        let mut position: usize = space
        while position < text.byte_length() {
            let byte: i64 = text.byte_at(position) as i64
            if byte == 32 || byte == 46 {
                let piece: utf8 = tail(text, position + 1)
                let mut found: usize = keys.length()
                let mut probe: usize = 0
                while probe < keys.length() {
                    if same_text(keys⁅probe⁆, piece) {
                        found = probe
                        break
                    }
                    probe = probe + 1
                }
                if found == keys.length() {
                    keys.push(piece)
                    totals.push(value)
                } else {
                    totals⁅found⁆ = totals⁅found⁆ + value
                }
            }
            position = position + 1
        }
        entry = entry + 1
    }
    let mut out: ArrayList<utf8> = ArrayList::new(keys.length())
    let mut index: usize = 0
    while index < keys.length() {
        let mut builder: Utf8Builder = Utf8Builder::new(80)
        builder.append_i64(totals⁅index⁆)
        builder.append(char::from(32))
        builder.append(keys⁅index⁆)
        out.push(builder.build())
        index = index + 1
    }
    return out
}

class Solution {
    micro subdomainVisits(self, cpdomains: ArrayList<utf8>): ArrayList<utf8> {
        return subdomain_visits(cpdomains)
    }
}
