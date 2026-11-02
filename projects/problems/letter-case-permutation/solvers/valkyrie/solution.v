namespace leetcode.letter_case_permutation;

micro is_digit(code: u32) -> bool {
    return code >= 48 && code <= 57
}

micro flip_at(s: utf8, at: usize) -> utf8 {
    let n: usize = s.length()
    let mut flipped: Utf8Builder = Utf8Builder::new(n)
    let mut j: usize = 0
    while j < n {
        if j == at {
            let code: u32 = s⁅j⁆ as u32
            if code >= 97 {
                flipped.append(char::from(code - 32))
            } else {
                flipped.append(char::from(code + 32))
            }
        } else {
            flipped.append(s⁅j⁆)
        }
        j = j + 1
    }
    return flipped.build()
}

micro dfs(s: utf8, i: usize, out: ArrayList<utf8>) {
    let n: usize = s.length()
    if i == n {
        out.push(s)
        return
    }
    let code: u32 = s⁅i⁆ as u32
    if is_digit(code) {
        dfs(s, i + 1, out)
        return
    }
    dfs(s, i + 1, out)
    dfs(flip_at(s, i), i + 1, out)
}

[export(case: "camelCase")]
micro letter_case_permutation(s: utf8) -> ArrayList<utf8> {
    let mut out: ArrayList<utf8> = ArrayList::new(0)
    dfs(s, 0, out)
    return out
}

class Solution {
    micro letterCasePermutation(self, s: utf8): ArrayList<utf8> {
        return letter_case_permutation(s)
    }
}
