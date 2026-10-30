namespace leetcode.is_subsequence;

[export(case: "camelCase")]
micro is_subsequence(s: utf8, t: utf8) -> bool {
    let mut i: usize = 0
    let mut j: usize = 0
    let slen: usize = s.length()
    let tlen: usize = t.length()
    while i < slen && j < tlen {
        let sc: char = s.char_at(i).unwrap()
        let tc: char = t.char_at(j).unwrap()
        if (sc as u32) == (tc as u32) {
            i = i + 1
        }
        j = j + 1
    }
    return i == slen
}

class Solution {
    micro isSubsequence(self, s: utf8, t: utf8): bool {
        return is_subsequence(s, t)
    }
}
