namespace leetcode.find_permutation;

using std.collection;

# 先写 1..n+1 的升序排列，再把每一段连续的 D 原地反转；每段只扫一次，整体 O(n)。
[export(case: "camelCase")]
micro find_permutation(s: utf8) -> [i64] {
    let n: usize = s.byte_length()
    let mut ans: ArrayList<i64> = ArrayList::new(n + 1)
    let mut index: usize = 0
    while index <= n {
        ans.push((index + 1) as i64)
        index = index + 1
    }

    index = 0
    while index < n {
        let mut stop: usize = index
        while stop < n && (s.byte_at(stop) as i64) == 68 {
            stop = stop + 1
        }
        let mut left: usize = index
        let mut right: usize = stop
        while left < right {
            let temp: i64 = ans⁅left⁆
            ans⁅left⁆ = ans⁅right⁆
            ans⁅right⁆ = temp
            left = left + 1
            right = right - 1
        }
        if index + 1 > stop {
            index = index + 1
        } else {
            index = stop
        }
    }
    return ans.to_array()
}

class Solution {
    micro findPermutation(self, s: utf8): [i64] {
        return find_permutation(s)
    }
}
