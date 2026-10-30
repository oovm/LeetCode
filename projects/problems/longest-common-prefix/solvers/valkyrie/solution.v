namespace leetcode.longest_common_prefix;

micro empty_utf8() -> utf8 {
    let value: utf8 = Utf8Text::from_bytes([])
    return value
}

micro prefix_slice(source: utf8, end: usize) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(end)
    let mut k: usize = 0
    while k < end {
        builder.append(source.char_at(k).unwrap())
        k = k + 1
    }
    let result: utf8 = builder.build()
    return result
}

[export(case: "camelCase")]
micro longest_common_prefix(strs: ArrayList<utf8>) -> utf8 {
    if strs.length() == 0 {
        return empty_utf8()
    }
    let first: utf8 = strs⁅0⁆.unwrap()
    let mut i: usize = 0
    while i < first.length() {
        let mut j: usize = 1
        while j < strs.length() {
            let s: utf8 = strs⁅j⁆.unwrap()
            if s.length() <= i {
                return prefix_slice(first, i)
            }
            if s.char_at(i).unwrap() as u32 != first.char_at(i).unwrap() as u32 {
                return prefix_slice(first, i)
            }
            j = j + 1
        }
        i = i + 1
    }
    return first
}

class Solution {
    micro longestCommonPrefix(self, strs: ArrayList<utf8>): utf8 {
        return longest_common_prefix(strs)
    }
}
