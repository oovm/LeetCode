namespace leetcode.is_subsequence;

[export(case: "camelCase")]
micro is_subsequence(s: utf8, t: utf8) -> bool {
    let mut i: i32 = 0
    let mut j: i32 = 0
    let slen: i32 = s.length()
    let tlen: i32 = t.length()
    while i < slen && j < tlen {
        let sc: char = s.char_at(i).unwrap()
        let tc: char = t.char_at(j).unwrap()
        if sc == tc {
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
