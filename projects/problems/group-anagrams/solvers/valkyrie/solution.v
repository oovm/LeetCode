namespace leetcode.group_anagrams;

using std.collection;

# `char` 有 `Comparable`，但 `utf8` 的码位读取返回 `u8`（G15），
# 因此先把字节转回 `char` 再比较，不直接依赖 `utf8` 的序。
micro compare_char(left: char, right: char) -> i32 {
    let left_code: u32 = left as u32
    let right_code: u32 = right as u32
    if left_code < right_code {
        return -1
    }
    if left_code > right_code {
        return 1
    }
    return 0
}

# 规范形 = 字符升序拼接；分组键是规范形字符串，映射到 `groups` 的下标以保留首次出现顺序。
micro sorted_key(word: utf8) -> utf8 {
    let count: usize = word.length()
    let mut chars: ArrayList<char> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        chars.push(char::from(word⁅index⁆ as u32))
        index = index + 1
    }

    let ordered: ArrayList<char> = sorted_by(chars, compare_char)

    let mut builder: Utf8Builder = Utf8Builder::new(count)
    index = 0
    while index < count {
        builder.append(ordered⁅index⁆)
        index = index + 1
    }
    return builder.build()
}

# 临时绕过（复核于 addon `25132ccf`，2026-11-05）：真写法是 `HashMap<utf8, i64>` 按规范形分组，
# 但 `HashMap<utf8, _>.insert` 在 wasm ABI 上仍阻断：
# `WASM ABI carrier mismatch in std::insert: slot=i32 actual=anyref operand=%1 (Utf8)`。
# 因此以「规范形表 + 线性查表」代替映射。

micro equal_text(left: utf8, right: utf8) -> bool {
    if left.length() != right.length() {
        return false
    }
    let mut index: usize = 0
    while index < left.length() {
        if left⁅index⁆ != right⁅index⁆ {
            return false
        }
        index = index + 1
    }
    return true
}

[export(case: "camelCase")]
micro group_anagrams(strs: ArrayList<utf8>) -> ArrayList<ArrayList<utf8>> {
    let count: usize = strs.length()
    let mut keys: ArrayList<utf8> = ArrayList::new(count)
    let mut groups: ArrayList<ArrayList<utf8>> = ArrayList::new(count)

    let mut index: usize = 0
    while index < count {
        let word: utf8 = strs⁅index⁆
        let key: utf8 = sorted_key(word)
        let mut at: i64 = -1
        let mut scan: usize = 0
        while scan < keys.length() {
            if equal_text(keys⁅scan⁆, key) {
                at = scan as i64
            }
            scan = scan + 1
        }
        if at >= 0 {
            let slot: usize = at as usize
            let mut bucket: ArrayList<utf8> = groups⁅slot⁆
            bucket.push(word)
            groups.set((slot + 1) as isize, bucket)
        } else {
            keys.push(key)
            let mut bucket: ArrayList<utf8> = ArrayList::new(0)
            bucket.push(word)
            groups.push(bucket)
        }
        index = index + 1
    }
    return groups
}

class Solution {
    micro groupAnagrams(self, strs: ArrayList<utf8>): ArrayList<ArrayList<utf8>> {
        return group_anagrams(strs)
    }
}
