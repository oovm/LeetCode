namespace leetcode.shuffle_string;

using std.collection;
using std.text;

# 按索引落位：先占位 n 个字符，再按 `indices` 把 `s⁅i⁆` 写入对应槽；最后按序拼接。
[export(case: "camelCase")]
micro restoreString(s: utf8, indices: ArrayList<i64>) -> utf8 {
    let n: usize = s.length()
    let mut placed: ArrayList<char> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        placed.push(s⁅0⁆)
        i = i + 1
    }
    i = 0
    while i < n {
        placed⁅indices⁅i⁆ as usize⁆ = s⁅i⁆
        i = i + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    i = 0
    while i < n {
        builder.append(placed⁅i⁆)
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro restoreString(self, s: utf8, indices: ArrayList<i64>): utf8 {
        return restoreString(s, indices)
    }
}
