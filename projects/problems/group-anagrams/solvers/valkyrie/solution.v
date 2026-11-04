namespace leetcode.group_anagrams;

# 规范形 = 字符升序拼接；分组键是规范形字符串，映射到 `groups` 的下标以保留首次出现顺序。
# 题内触发点: G15 —— `char` 没有 `<` / `>`，也没有 `Comparable` 合同，排序键只能退到
# `as u32` 的码位比较；本题是 G15 的又一实例（前有 `find-smallest-letter-greater-than-target`
# 的 `<=`、`check-if-all-...` 的序关系）。
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

micro sorted_key(word: utf8) -> utf8 {
    let count: usize = word.length()
    let mut chars: ArrayList<char> = ArrayList::new(count)
    let mut i: usize = 0
    while i < count {
        chars.push(word⁅i⁆)
        i = i + 1
    }

    # 没有返回新序列的 `sorted_by`（G11），副本就地 `merge_sort`。
    merge_sort(chars, compare_char)
    let ordered: ArrayList<char> = chars

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
