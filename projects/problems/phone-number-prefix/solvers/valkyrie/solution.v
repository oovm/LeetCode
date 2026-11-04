namespace leetcode.phone_number_prefix;

# 临时绕过：std 公共排序入口 `sort` 只接受 `T: Comparable`，`utf8` 未实现该合同且无接收比较器的公共入口，改用 `HashSet<utf8>` 枚举真前缀，结论等价且更贴合 Trie 思路。
using std.collection;
using std.text;

# 全部号码放进 `HashSet<utf8>`；再对每个号码枚举它的所有真前缀，
# 任一真前缀命中集合，就说明存在「某号码是另一个号码前缀」的情况。
# 这样无需给 `utf8` 补排序比较器，复杂度为 O(总位数 × 单串长度)。
[export(case: "camelCase")]
micro phonePrefix(numbers: ArrayList<utf8>) -> bool {
    let mut present: HashSet<utf8> = HashSet::new()
    let count: usize = numbers.length()
    let mut i: usize = 0
    while i < count {
        present.insert(numbers⁅i⁆)
        i = i + 1
    }

    i = 0
    while i < count {
        let number: utf8 = numbers⁅i⁆
        let length: usize = number.length()
        let mut cut: usize = 1
        while cut < length {
            let mut builder: Utf8Builder = Utf8Builder::new(cut)
            let mut offset: usize = 0
            while offset < cut {
                builder.append(char::from(number⁅offset⁆ as u32))
                offset = offset + 1
            }
            if present.contains(builder.build()) {
                return false
            }
            cut = cut + 1
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro phonePrefix(self, numbers: ArrayList<utf8>): bool {
        return phonePrefix(numbers)
    }
}
