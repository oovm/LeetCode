namespace leetcode.group_anagrams;

# 规范形 = 字符升序拼接；分组键是规范形字符串，映射到 `groups` 的下标以保留首次出现顺序。
# 题内触发点: G15 —— `sorted_by` 的比较器需要 `char` 参与 `<` / `>`，而 `char` 只有 `==`/`!=`；
# 本题是 G15 的又一实例（前有 `find-smallest-letter-greater-than-target` 的 `<=`、
# `check-if-all-...` 的序关系）。
micro sorted_key(word: utf8) -> utf8 {
    let count: usize = word.length()
    let mut chars: ArrayList<char> = ArrayList::new(count)
    let mut i: usize = 0
    while i < count {
        chars.push(word⁅i⁆)
        i = i + 1
    }

    let ordered: ArrayList<char> = sorted_by(chars, micro(a: char, b: char) -> i32 {
        if a < b {
            return -1
        }
        if a > b {
            return 1
        }
        return 0
    })

    let mut builder: Utf8Builder = Utf8Builder::new(count)
    i = 0
    while i < count {
        builder.append(ordered⁅i⁆)
        i = i + 1
    }
    return builder.build()
}

[export(case: "camelCase")]
micro group_anagrams(strs: ArrayList<utf8>) -> ArrayList<ArrayList<utf8>> {
    let count: usize = strs.length()
    let mut slots: HashMap<utf8, i64> = HashMap::new(count)
    let mut groups: ArrayList<ArrayList<utf8>> = ArrayList::new(count)

    let mut i: usize = 0
    while i < count {
        let word: utf8 = strs⁅i⁆
        let key: utf8 = sorted_key(word)
        if slots.contains_key(key) {
            let at: usize = slots.get(key).unwrap() as usize
            let mut bucket: ArrayList<utf8> = groups⁅at⁆
            bucket.push(word)
            groups.set(at, bucket)
        } else {
            slots.insert(key, groups.length() as i64)
            let mut bucket: ArrayList<utf8> = ArrayList::new(0)
            bucket.push(word)
            groups.push(bucket)
        }
        i = i + 1
    }
    return groups
}

class Solution {
    micro groupAnagrams(self, strs: ArrayList<utf8>): ArrayList<ArrayList<utf8>> {
        return group_anagrams(strs)
    }
}
