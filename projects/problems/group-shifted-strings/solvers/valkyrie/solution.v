namespace leetcode.group_shifted_strings;

using std.collection;
using std.text;

# 题内触发点: 分组键用 `HashMap<utf8, i64>`，命中 std::hash#445（`utf8` 哈希合同未落地）。
# 规范键：把首字符平移到 'a'，其余按同一位移量平移（模 26）。
micro shift_key(word: utf8) -> utf8 {
    let first: u32 = word⁅0⁆ as u32
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    let mut i: usize = 0
    while i < word.length() {
        let shifted: u32 = ((word⁅i⁆ as u32 + 26 - first) % 26) + 97
        builder.append(shifted as char)
        i = i + 1
    }
    return builder.build()
}

[export(case: "camelCase")]
micro groupStrings(strings: ArrayList<utf8>) -> ArrayList<ArrayList<utf8>> {
    let mut group_of: HashMap<utf8, i64> = HashMap::new(0)
    let mut out: ArrayList<ArrayList<utf8>> = ArrayList::new(0)
    loop word in strings {
        let key: utf8 = shift_key(word)
        if group_of.contains_key(key) {
            let idx: usize = group_of.get(key).unwrap() as usize
            out⁅idx⁆.push(word)
        } else {
            let mut row: ArrayList<utf8> = ArrayList::new(0)
            row.push(word)
            group_of.insert(key, out.length() as i64)
            out.push(row)
        }
    }
    return out
}

class Solution {
    micro groupStrings(self, strings: ArrayList<utf8>): ArrayList<ArrayList<utf8>> {
        return groupStrings(strings)
    }
}
