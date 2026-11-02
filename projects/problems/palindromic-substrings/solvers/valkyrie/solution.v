namespace leetcode.palindromic_substrings;

[export(case: "camelCase")]
micro count_substrings(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut count: i64 = 0
    let mut center: usize = 0
    let last: usize = 2 * n - 1
    while center < last {
        let mut l: usize = center / 2
        let mut r: usize = center / 2 + center % 2
        let mut expanding: bool = true
        while expanding {
            if s⁅l⁆ as u32 != s⁅r⁆ as u32 {
                expanding = false
            } else {
                count = count + 1
                if l == 0 || r + 1 >= n {
                    expanding = false
                } else {
                    l = l - 1
                    r = r + 1
                }
            }
        }
        center = center + 1
    }
    return count
}

class Solution {
    micro countSubstrings(self, s: utf8): i64 {
        return count_substrings(s)
    }
}
