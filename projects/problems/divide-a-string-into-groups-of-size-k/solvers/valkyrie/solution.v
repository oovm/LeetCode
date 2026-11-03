namespace leetcode.divide_a_string_into_groups_of_size_k;

# 每 k 个字符一组，末组不足用 fill 补齐。
[export(case: "camelCase")]
micro divide_string(s: utf8, k: i64, fill: utf8) -> ArrayList<utf8> {
    let n: usize = s.length()
    let size: usize = k as usize
    let mut result: ArrayList<utf8> = ArrayList::new(0)
    let mut start: usize = 0
    while start < n {
        let mut builder: Utf8Builder = Utf8Builder::new(size)
        let mut offset: usize = 0
        while offset < size {
            if start + offset < n {
                builder.append(char::from(s⁅start + offset⁆ as u32))
            } else {
                builder.append(char::from(fill⁅0⁆ as u32))
            }
            offset = offset + 1
        }
        result.push(builder.build())
        start = start + size
    }
    return result
}

class Solution {
    micro divideString(self, s: utf8, k: i64, fill: utf8): ArrayList<utf8> {
        return divide_string(s, k, fill)
    }
}
