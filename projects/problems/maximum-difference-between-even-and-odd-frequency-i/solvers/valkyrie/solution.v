namespace leetcode.maximum_difference_between_even_and_odd_frequency_i;

# 取最大奇频与最小偶频之差，题目保证两者均存在。
[export(case: "camelCase")]
micro max_difference(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut counts: ArrayList<i64> = ArrayList::new(26)
    let mut k: usize = 0
    while k < 26 {
        counts.push(0)
        k = k + 1
    }
    let mut i: usize = 0
    while i < n {
        let slot: usize = (s⁅i⁆ as u32 - 97) as usize
        counts⁅slot⁆ = counts⁅slot⁆ + 1
        i = i + 1
    }
    let mut max_odd: i64 = 0
    let mut min_even: i64 = n as i64
    k = 0
    while k < 26 {
        let frequency: i64 = counts⁅k⁆
        if frequency > 0 {
            if frequency % 2 == 1 {
                if frequency > max_odd {
                    max_odd = frequency
                }
            } else if frequency < min_even {
                min_even = frequency
            }
        }
        k = k + 1
    }
    return max_odd - min_even
}

class Solution {
    micro maxDifference(self, s: utf8): i64 {
        return max_difference(s)
    }
}
