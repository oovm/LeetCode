namespace leetcode.longest_uncommon_subsequence_i;

# 等长时逐位比较，不同则答案为长度，相同则 -1，O(n)
[export(name: "findLUSlength")]
micro find_l_u_slength(a: utf8, b: utf8) -> i64 {
    let an: usize = a.length()
    let bn: usize = b.length()
    if an == bn {
        let mut same: bool = true
        let mut i: usize = 0
        while i < an {
            if (a⁅i⁆ as u32) != (b⁅i⁆ as u32) {
                same = false
            }
            i = i + 1
        }
        if same {
            return -1
        }
    }
    if an > bn {
        return an as i64
    }
    return bn as i64
}

class Solution {
    micro findLUSlength(self, a: utf8, b: utf8): i64 {
        return find_l_u_slength(a, b)
    }
}
