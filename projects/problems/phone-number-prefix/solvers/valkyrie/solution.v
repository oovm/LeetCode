namespace leetcode.phone_number_prefix;

# 临时绕过（复核于 addon `9d51ad08`，2026-11-05）：真写法是「按字典序排序后检查相邻两串」，
# 与参考实现一致。`Ordering` 布局缺口已由 `9d51ad08` 修复，但 `utf8` 实例化仍停在 ABI：
#   `sorted_by(numbers, compare_text)` / `sort(sorted)` → `WASM ABI carrier mismatch in std::collection::is_less_or_equal: slot=i32 actual=anyref operand=%0 (Utf8)`
# 因此保留 `HashSet<utf8>` 枚举真前缀的等价写法；`utf8: Hash` 与 `Utf8Builder` 已可用。
using std.collection;
using std.text;

# 全部号码放进 `HashSet<utf8>`；再对每个号码枚举它的所有真前缀，
# 任一真前缀命中集合，就说明存在「某号码是另一个号码前缀」的情况。
# 复杂度为 O(总位数 × 单串长度)。
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
